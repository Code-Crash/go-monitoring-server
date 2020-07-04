package models

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3" // Underscore
)

// ErrorHandler to handle the Error
func ErrorHandler(_error error) error {
	if _error != nil {
		// panic(_error)
		return _error
	}

	return nil
}

// DBHelper to perform a database related things
var DBHelper *sql.DB = nil

// Task Schema Model
type Task struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"` // Required
	Description string `json:"description"`
	Host        string `json:"host"` // Required
	Port        string `json:"port"` // Required
	Path        string `json:"path"`
	Headers     string `json:"headers"`
	Method      string `json:"method"` // Required
	Protocol    string `json:"protocol"`
	Body        string `json:"body"`
	// SuccessCode string `json:"successCode"` We can add bunch of features letter.
}

// Job Schema Model
type Job struct {
	ID     int64  `json:"id"`
	TaskID int64  `json:"taskId"`
	CronID int64  `json:"cronId"`
	Time   string `json:"time"`
	Status string `json:"status"`
}

// Entry Type will help us to parse the job with type inner join
type Entry struct {
	ID          int64  `json:"id"`
	CronID      int64  `json:"cronId"`
	TaskID      int64  `json:"taskId"`
	Status      string `json:"status"`
	Time        string `json:"time"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Headers     string `json:"headers"`
	Host        string `json:"host"`
	Port        string `json:"port"`
	Path        string `json:"path"`
	Method      string `json:"method"`
	Protocol    string `json:"protocol"`
	Body        string `json:"body"`
}

// Open the sqlite database to perform the db related operations
func Open() (bool, error) {
	db, _error := sql.Open("sqlite3", "./monitoring.db")
	ErrorHandler(_error)
	DBHelper = db
	log.Println("SQLITE3 Database is opened!")
	okay, _error := Setup()
	if _error != nil {
		log.Println("Error Open:", _error)
		return okay, _error
	}

	return true, nil
}
