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

func parseLevelComplete(r *http.Request) (l *LevelComplete, err error) {
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(l)
	if err != nil {
		return l, err
	}

	if l.LevelId == "" || l.Millis == 0 || l.UserId == "" {
		return l, fmt.Errorf("LevelComplete encoded incorrectly: %+v", l)
	}

	return l, nil
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

/*func levelStats(w http.ResponseWriter, r *http.Request) {

}*/

func handleLevelComplete(l *LevelComplete) (bool, error) {
	// Check if user has old time
	userLevelId := l.UserId + l.LevelId
	var millis int
	err := db.QueryRow("SELECT time FROM atd_scores WHERE id=?", userLevelId).Scan(&millis)
	if err != nil && err != sql.ErrNoRows {
		return true, fmt.Errorf("Error querying user score stmt exec: %s\n", err)
	}
	// If new time is better, save, and update top scores if needed
	if err == sql.ErrNoRows || l.Millis < millis {
		if err == sql.ErrNoRows {
			_, err = db.Exec("INSERT INTO atd_scores (id, level, time, user) VALUES (?,?,?,?)\n",
				userLevelId,
				l.LevelId,
				l.Millis,
				l.UserId,
				l.Millis,
			)
			if err != nil {
				return true, fmt.Errorf("Error making level complete insert stmt exec: %s\n", err)
			}
		} else {
			_, err = db.Exec("UPDATE `time`=? WHERE `id` = ?", l.Millis, userLevelId)
			if err != nil {
				return true, fmt.Errorf("Error making level complete update stmt exec: %s\n", err)
			}
		}

		// update top scores, or something
		// TODO: do this
	}

	return false, nil
}
