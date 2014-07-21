package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"net/http"
)

type PlayerScore struct {
	LevelId int    `json:"level"`
	Millis  int    `json:"time"`
	UserId  string `json:"user"`
}

func parsePlayerScore(r *http.Request) (p *PlayerScore, err error) {
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(p)
	if err != nil {
		return p, err
	}

	if p.LevelId == 0 || p.Millis == 0 || p.UserId == "" {
		return p, errors.New(fmt.Sprintf("PlayerScore encoded incorrectly: %+v", p))
	}

	return p, nil
}

func playerScore(w http.ResponseWriter, r *http.Request) {
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

	p, err := parsePlayerScore(r)
	if err != nil {
		fmt.Printf("Error marshalling player score JSON: %s\n", err)
		http.Error(w, "Bad JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	MessageQueue <- &WorkRequest{Type: PlayerScoreEvent, Object: &p}

	fmt.Fprint(w, Response{"data": Response{}, "error": ""})
}

func handlePlayerScore(p *PlayerScore) (error, bool) {
	db, err := sql.Open("mysql", config.DBUser+":"+config.DBPass+"@/"+config.DBName)
	if err != nil {
		return errors.New(fmt.Sprintf("Error with sql.Open on DB: %s\n", err)), false
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		return errors.New(fmt.Sprintf("Error with db.Ping: %s\n", err)), false
	}

	if err != nil {
		return errors.New(fmt.Sprintf("Error making user report stmt exec: %s\n", err)), true
	}
	return nil, false
}
