package models

import (
	"log"

	"github.com/pkg/errors"
)

// Add the Job in SQLITE3 database
func (j *Job) Add() (*Job, error) {

	// Perform Validation
	if _error := j.Validate(); _error != nil {
		return nil, _error
	}

	// Prepare statement for the Job
	statement, _error := DBHelper.Prepare("INSERT INTO job (taskId, cronId, time, status) VALUES (?, ?, ?, ?)")
	ErrorHandler(_error)
	if _error != nil {
		return nil, _error
	}

	result, _eExe := statement.Exec(j.TaskID, j.CronID, j.Time, j.Status)
	ErrorHandler(_eExe)
	if _eExe != nil {
		return nil, _eExe
	}

	id, _eInsertID := result.LastInsertId()
	ErrorHandler(_eInsertID)
	if _eInsertID != nil {
		return nil, _eInsertID
	}

	j.ID = id
	return j, nil
}

// UpdateCronID the Job in SQLITE3 database
func (j *Job) UpdateCronID() (*Job, error) {
	// Perform Validation
	if _error := j.Validate(); _error != nil {
		return nil, _error
	}

	// Prepare statement for the Job to update
	statement, _error := DBHelper.Prepare("UPDATE job set cronId=? where id=?")
	ErrorHandler(_error)
	if _error != nil {
		return nil, _error
	}

	_, _eExe := statement.Exec(j.CronID, j.ID)
	ErrorHandler(_eExe)
	if _eExe != nil {
		return nil, _eExe
	}
	return j, nil
}

// GetJobWithoutCronIDWithTasks will returns the cron which are newly added
func GetJobWithoutCronIDWithTasks() ([]Entry, error) {

	query := `SELECT job.id as ID, job.cronId as CronID, job.status as Status, job.time as Time, task.id as TaskID, task.name as Name, task.description as Description, task.host as Host, task.port as Port, task.path as Path, task.headers as Headers, task.method as Method, task.protocol as Protocol, task.body as Body FROM job INNER JOIN task on task.id = job.taskId and job.cronId = 0`

	// Prepare statement for the Job
	rows, _error := DBHelper.Query(query)
	ErrorHandler(_error)
	if _error != nil {
		return nil, _error
	}

	entry := &Entry{}
	var entries []Entry
	for rows.Next() {
		_eScan := rows.Scan(&entry.ID, &entry.CronID, &entry.Status, &entry.Time, &entry.TaskID, &entry.Name, &entry.Description, &entry.Host, &entry.Port, &entry.Path, &entry.Headers, &entry.Method, &entry.Protocol, &entry.Body)
		if _eScan != nil {
			log.Println("_eScan:", _eScan)
			panic(_eScan)
		}
		entries = append(entries, *entry)
	}

	// TODO: After Added in CronFunc, Add cronId in Jobs and Update the global variable in crons
	// j.ID = id
	return entries, nil
}

// GetAllJobWithTasks will returns the cron which are newly added
func GetAllJobWithTasks() ([]*Entry, error) {

	query := `SELECT job.id as ID, job.cronId as CronID, job.status as Status, job.time as Time, task.id as TaskID, task.name as Name, task.description as Description, task.host as Host, task.port as Port, task.path as Path, task.headers as Headers, task.method as Method, task.protocol as Protocol, task.body as Body FROM job INNER JOIN task on task.id = job.taskId`

	// Prepare statement for the Job
	rows, _error := DBHelper.Query(query)
	ErrorHandler(_error)
	if _error != nil {
		return nil, _error
	}

	var entries []*Entry
	for rows.Next() {
		entry := &Entry{}
		_eScan := rows.Scan(&entry.ID, &entry.CronID, &entry.Status, &entry.Time, &entry.TaskID, &entry.Name, &entry.Description, &entry.Host, &entry.Port, &entry.Path, &entry.Headers, &entry.Method, &entry.Protocol, &entry.Body)
		if _eScan != nil {
			log.Println("_eScan:", _eScan)
			panic(_eScan)
		}
		entries = append(entries, entry)
	}

	// TODO: After Added in CronFunc, Add cronId in Jobs and Update the global variable in crons
	// j.ID = id
	return entries, nil
}

// GetJobWithTaskByJobID function will return the job by id
func GetJobWithTaskByJobID(id int64) (*Entry, error) {

	if id == 0 {
		panic(errors.New("GetJobWithTaskByJobID: ID is Required"))
	}

	query := `SELECT job.id as ID, job.cronId as CronID, job.status as Status, job.time as Time, task.id as TaskID, task.name as Name, task.description as Description, task.host as Host, task.port as Port, task.path as Path, task.headers as Headers, task.method as Method, task.protocol as Protocol, task.body as Body FROM job INNER JOIN task on task.id = job.taskId and job.id = ?`

	entry := &Entry{}
	// Prepare statement for the Job
	_eQueryRowError := DBHelper.QueryRow(query, id).Scan(&entry.ID, &entry.CronID, &entry.Status, &entry.Time, &entry.TaskID, &entry.Name, &entry.Description, &entry.Host, &entry.Port, &entry.Path, &entry.Headers, &entry.Method, &entry.Protocol, &entry.Body)
	if _eQueryRowError != nil {
		log.Println("_eQueryRowError:", _eQueryRowError)
		panic(_eQueryRowError)
	}

	// TODO: After Added in CronFunc, Add cronId in Jobs and Update the global variable in crons
	return entry, nil
}
