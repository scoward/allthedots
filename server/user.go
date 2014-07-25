package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type UserReport struct {
	Id             string `json:"id"`
	Browser        string `json:"browser"`
	BrowserVersion string `json:"bversion"`
	OS             string `json:"os"`
	Mobile         string `json:"mobile"`
	Version        string `json:"version"`
}

func parseUserReport(r *http.Request) (u *UserReport, err error) {
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(u)
	if err != nil {
		return u, err
	}

	if u.Id == "" || u.Browser == "" || u.BrowserVersion == "" ||
		u.OS == "" || u.Mobile == "" || u.Version == "" {
		return u, fmt.Errorf("UserReport encoded incorrectly: %+v", u)
	}

	return u, nil
}

func userReport(w http.ResponseWriter, r *http.Request) {
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

	decoder := json.NewDecoder(r.Body)
	var u UserReport
	err := decoder.Decode(&u)
	if err != nil {
		fmt.Printf("Error marshalling user report JSON: %s\n", err)
		http.Error(w, "Bad JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	MessageQueue <- &WorkRequest{Type: UserReportEvent, Object: &u}

	fmt.Fprint(w, Response{"data": Response{}, "error": ""})
}

func handleUserReport(u *UserReport) (bool, error) {
	_, err := db.Exec("UPDATE `atd_users` SET "+
		"`current_version`=?, "+
		"`os`=?, "+
		"`browser`=?, "+
		"`bversion`=?, "+
		"`mobile`=?, "+
		"`update_count`=`update_count` + 1 "+
		"WHERE `id` = ?",
		u.Version, u.OS, u.Browser, u.BrowserVersion, u.Mobile, u.Id)
	if err != nil {
		return true, fmt.Errorf("Error making user report stmt exec: %s\n", err)
	}
	return false, nil
}

type UserRegister struct {
	Id   string
	Date time.Time
}

func userRegister(w http.ResponseWriter, r *http.Request) {
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
		fmt.Printf("ID is empty in user register\n")
		http.Error(w, "ID is empty string", http.StatusBadRequest)
	}

	millisRaw := m["time"]
	if millisRaw == nil {
		fmt.Printf("Millis is nil\n")
		http.Error(w, "Millis is nil in user register", http.StatusBadRequest)
	}
	millis := int64(millisRaw.(float64))
	date := time.Unix(0, millis*1000000).UTC()
	fmt.Printf("Date passed in: %+v\n", date)

	version := m["version"].(string)
	if version == "" {
		fmt.Printf("Version not present in user register\n")
		http.Error(w, "Version not present in user register", http.StatusBadRequest)
	}

	_, err = db.Exec("INSERT INTO atd_users (id, installed_at, installed_version) VALUES (?, ?, ?)",
		id, stringifyTime(date), version)
	if err != nil {
		fmt.Fprint(w, Response{"data": Response{}, "error": "ID Already exists"})
		fmt.Printf("Error making user register stmt exec: %s\n", err)
		return
	}

	fmt.Fprint(w, Response{"data": Response{}, "error": ""})
}
