package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type LevelComplete struct {
	LevelId string `json:"level"`
	Millis  int    `json:"time"`
	UserId  string `json:"user"`
}

func parseLevelComplete(r *http.Request) (*LevelComplete, error) {
	var l LevelComplete
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&l)
	if err != nil {
		return &l, err
	}

	if l.LevelId == "" || l.Millis == 0 || l.UserId == "" {
		return &l, fmt.Errorf("LevelComplete encoded incorrectly: %+v", l)
	}

	return &l, nil
}

func levelComplete(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	fmt.Printf("Origin: %s\n", origin)
	if origin != "" {
		w.Header().Set("Access-Control-Allow-Origin", origin)
	}
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	fmt.Printf("r method: %s\n", r.Method)
	if r.Method != "POST" && r.Method != "OPTIONS" {
		w.Header().Set("Allow", "POST, OPTIONS")
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	l, err := parseLevelComplete(r)
	if err != nil {
		fmt.Printf("Error marshalling player score JSON: %s\n", err)
		http.Error(w, "Bad JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	MessageQueue <- &WorkRequest{Type: LevelCompleteEvent, Object: l}

	fmt.Fprint(w, Response{"data": Response{}, "error": ""})
}

type LevelStats struct {
	LevelId      string `json:"level"`
	AvgMillis    int    `json:"avg"`
	NumCompletes int    `json:"num"`
}

func getLevelStats(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	if origin != "" {
		w.Header().Set("Access-Control-Allow-Origin", origin)
	}
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method != "POST" && r.Method != "OPTIONS" {
		w.Header().Set("Allow", "POST, OPTIONS")
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	decoder := json.NewDecoder(r.Body)
	var f interface{}
	err := decoder.Decode(&f)
	if err != nil {
		fmt.Printf("Error unmarshalling generic JSON: %s\n", err)
		http.Error(w, "Bad JSON: "+err.Error(), http.StatusBadRequest)
		return
	}
	m := f.(map[string]interface{})

	id := m["id"].(string)
	if id == "" {
		fmt.Printf("ID is empty in level stats call\n")
		http.Error(w, "ID for level stat call is empty string", http.StatusBadRequest)
	}

	var avg, num int
	err = db.QueryRow("SELECT avg_time, completions FROM level_stats WHERE id = ?", id).Scan(&avg, &num)
	if err != nil {
		if err == sql.ErrNoRows {
			num = -1
			avg = 0.0
		} else {
			fmt.Fprint(w, Response{"data": Response{}, "error": "Problem getting level stats"})
			fmt.Printf("Error getting level stats: %s\n", err)
			return
		}
	}

	fmt.Fprint(w, Response{"data": Response{"avg": avg, "num": num}, "error": ""})
}

func levelCompleteUpdateStats(l *LevelComplete) (bool, error) {
	var num, avg int
	err := db.QueryRow("SELECT avg_time, completions FROM level_stats WHERE id = ?", l.LevelId).Scan(&avg, &num)
	if err == sql.ErrNoRows {
		_, err := db.Exec("INSERT INTO level_stats (id, avg_time, completions) VALUES (?,?,?)", l.LevelId, l.Millis, 1)
		if err != nil {
			return true, fmt.Errorf("Error inserting new level_stats for level %s: %s\n", l.LevelId, err)
		}
	} else {
		total := num * avg
		total += l.Millis
		num++
		avg = total / num
		_, err := db.Exec("UPDATE level_stats SET `completions`=?, `avg_time`=?  WHERE `id` = ?", l.LevelId, num, avg)
		if err != nil {
			return true, fmt.Errorf("Error updating level_stats completions for level %s: %s\n", l.LevelId, err)
		}
	}

	return false, nil
}

func levelCompleteUpdateUser(l *LevelComplete) (bool, error) {
	_, err := db.Exec("UPDATE atd_users SET `levels_solved` = `levels_solved` + 1 WHERE `id` = ?", l.UserId)
	if err != nil {
		return true, fmt.Errorf("Error updating user totals for user %s: %s\n", l.UserId, err)
	}

	return false, nil
}

func handleLevelComplete(l *LevelComplete) (bool, error) {
	// Check if user has old time
	userLevelId := l.UserId + l.LevelId
	var millis int
	err := db.QueryRow("SELECT time FROM atd_scores WHERE id=?", userLevelId).Scan(&millis)
	if err != nil && err != sql.ErrNoRows {
		return true, fmt.Errorf("Error querying user score stmt exec: %s\n", err)
	}
	// If new time is better, save, and update top scores if needed
	if err == sql.ErrNoRows {
		_, err = db.Exec("INSERT INTO atd_scores (id, time) VALUES (?,?)",
			userLevelId,
			l.Millis,
		)
		if err != nil {
			return true, fmt.Errorf("Error making level complete insert stmt exec: %s\n", err)
		}
		// Call level stats update
		WorkQueue <- NewWorkRequest(UpdateLevelStats, l)
		WorkQueue <- NewWorkRequest(UpdateUserTotals, l)
	} else if l.Millis < millis {
		_, err = db.Exec("UPDATE atd_scores SET `time`=? WHERE `id` = ?", l.Millis, userLevelId)
		if err != nil {
			return true, fmt.Errorf("Error making level complete update stmt exec: %s\n", err)
		}
	}

	return false, nil
}
