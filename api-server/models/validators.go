// Package models is to intereact with the database.
package models

import (
	"errors"
)

// Validate function will validate the Job before inserting in db
func (t *Task) Validate() error {
	if t.Name == "" {
		return errors.New("The name field is required")
	}
	if t.Host == "" {
		return errors.New("The host field is required")
	}
	if t.Port == "" {
		return errors.New("The port field is required")
	}
	if t.Method == "" {
		return errors.New("The method field is required")
	}
	return nil
}

// Validate function will validate the Task before inserting in db
func (j *Job) Validate() error {
	if j.TaskID == 0 {
		return errors.New("Task ID Required")
	}

	return nil
}
