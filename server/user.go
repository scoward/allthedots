package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"net/http"
	"time"
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
		return u, errors.New(fmt.Sprintf("UserReport encoded incorrectly: %+v", u))
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

func handleUserReport(u *UserReport) (error, bool) {
	db, err := sql.Open("mysql", config.DBUser+":"+config.DBPass+"@/"+config.DBName)
	if err != nil {
		return errors.New(fmt.Sprintf("Error with sql.Open on DB: %s\n", err)), false
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		return errors.New(fmt.Sprintf("Error with db.Ping: %s\n", err)), false
	}

	_, err = db.Exec("UPDATE `atd_users` SET "+
		"`current_version`=?, "+
		"`os`=?, "+
		"`browser`=?, "+
		"`bversion`=?, "+
		"`mobile`=?, "+
		"`update_count`=`update_count` + 1 "+
		"WHERE `id` = ?",
		u.Version, u.OS, u.Browser, u.BrowserVersion, u.Mobile, u.Id)
	if err != nil {
		return errors.New(fmt.Sprintf("Error making user report stmt exec: %s\n", err)), true
	}
	return nil, false
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

	db, err := sql.Open("mysql", config.DBUser+":"+config.DBPass+"@/"+config.DBName)
	if err != nil {
		fmt.Printf("Error with sql.Open on DB: %s\n", err)
		fmt.Fprint(w, Response{"data": Response{}, "error": "DB sql.Open failed"})
		return
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		fmt.Printf("Error with db.Ping: %s\n", err)
		fmt.Fprint(w, Response{"data": Response{}, "error": "DB not reachable"})
		return
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
