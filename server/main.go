package main

import (
	"database/sql"
	"fmt"
	"net"
	"net/http"
	"strconv"

	conf "github.com/sbinet/go-config/config"
)

type Config struct {
	Port       string
	DBURL      string
	DBPort     string
	DBName     string
	DBUser     string
	DBPass     string
	NumWorkers int
}

var config Config
var MessageQueue = make(chan *WorkRequest, 100)
var WorkQueue = make(chan *WorkRequest, 100)

func scoreReport(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Content-Type", "application/json")
	fmt.Fprint(resp, Response{"result": "success", "error": "none"})
}

func getConfigData(c *conf.Config, key string) string {
	foo, err := c.String("default", key)
	if err != nil {
		panic(err)
	}
	return foo
}

func getConfigDataInt(c *conf.Config, key string) int {
	var str = getConfigData(c, key)
	i, err := strconv.ParseInt(str, 10, 32)
	if err != nil {
		panic(err)
	}
	return int(i)
}

var db *sql.DB

func main() {
	configFile, err := conf.ReadDefault("config.cfg")
	if err != nil {
		fmt.Printf("Problems reading the config file.\n")
		return
	}

	config.Port = getConfigData(configFile, "port")
	config.DBURL = getConfigData(configFile, "db_url")
	config.DBName = getConfigData(configFile, "db_name")
	config.DBPort = getConfigData(configFile, "db_port")
	config.DBUser = getConfigData(configFile, "db_user")
	config.DBPass = getConfigData(configFile, "db_password")
	config.NumWorkers = getConfigDataInt(configFile, "num_workers")

	// Make sure DB is actually there
	db, err = sql.Open("mysql", config.DBUser+":"+config.DBPass+"@/"+config.DBName)
	if err != nil {
		fmt.Sprintf("Error with sql.Open on DB: %s\n", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(fmt.Sprintf("Error with db.Ping: %s\n", err))
	}

	// Check if port is available
	addr, err := net.ResolveTCPAddr("tcp", "0.0.0.0:"+config.Port)
	if err != nil {
		return
	}
	l, err := net.ListenTCP("tcp", addr)
	if err != nil {
		return
	}
	l.Close()

	StartDispatcher(config.NumWorkers)

	http.HandleFunc("/level/complete", levelComplete)
	http.HandleFunc("/level/stats", getLevelStats)
	http.HandleFunc("/report/user", userReport)
	http.HandleFunc("/register/user", userRegister)
	if err := http.ListenAndServe(net.JoinHostPort("", config.Port), nil); err != nil {
		fmt.Printf("%s\n", err.Error())
	}
}
