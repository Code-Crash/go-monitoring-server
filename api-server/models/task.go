package models

import (
	"encoding/json"
	"log"
)

// Add the Task in SQLITE3 database
func (t *Task) Add(task *Task) (*Task, error) {

	// Perform Validation
	if _error := task.Validate(); _error != nil {
		return nil, _error
	}

	statement, _error := DBHelper.Prepare("INSERT INTO task (name, description, host, port, path, headers, method, protocol, body) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
	ErrorHandler(_error)
	if _error != nil {
		return nil, _error
	}
	result, _eExe := statement.Exec(task.Name, task.Description, task.Host, task.Port, task.Path, task.Headers, task.Method, task.Protocol, task.Body)
	ErrorHandler(_eExe)
	if _eExe != nil {
		return nil, _eExe
	}
	id, _eInsertID := result.LastInsertId()
	ErrorHandler(_eInsertID)
	if _eInsertID != nil {
		return nil, _eInsertID
	}
	task.ID = id
	json, _eMarshal := json.Marshal(task)
	ErrorHandler(_eMarshal)
	if _eMarshal != nil {
		return nil, _eMarshal
	}
	log.Println(json)
	return task, nil
}
