package main

import (
	"encoding/json"
	"log"
	"net/http"

	"api-server/models"
	"api-server/scheduler"
	"api-server/utility"
)

// GetTask Function to Get Task // TODO: Incomplete API
func GetTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "get called"}`))
}

// AddTask Function to New Add Task
func AddTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json") // Set here to avoid duplication
	// Body, err := ioutil.ReadAll(r.Body)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// BodyString := string(Body)
	// log.Println("Test:", BodyString)
	// Create Task instance to get the task data
	task := &models.Task{}
	defer r.Body.Close() // To make sure the body will be closed after the function execution
	if err := json.NewDecoder(r.Body).Decode(task); err != nil {
		log.Println("Error:", err, err.Error())
		response := &ErrorResponse{}
		response.Errors = err.Error()
		response.Status = http.StatusOK
		response.Message = "Error While Saving the New Task"
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
		// panic(err)
	}
	// log.Println("Task", task)

	// Perform Validation
	if _errors := RequestTaskValidator(task); len(_errors) > 0 {
		err := map[string]interface{}{"errors": _errors}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(err)
		return
	}

	// Add the task in database
	task, _error := task.Add(task)
	if _error != nil {
		err := map[string]interface{}{"errors": _error.Error()}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(err)
		return
	}

	// Add the task in database
	job := &models.Job{}
	job.TaskID = task.ID
	job, _eJAdd := job.Add()
	if _eJAdd != nil {
		err := map[string]interface{}{"errors": _error.Error()}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(err)
		// TODO: Error handling remaining for roll back for added task on add job failed
		return
	}

	// Add Job in Cron
	entry, _eGetJobError := models.GetJobWithTaskByJobID(job.ID)
	if _eGetJobError != nil {
		err := map[string]interface{}{"errors": _eGetJobError.Error()}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(err)
		// TODO: Error handling remaining for roll back for added task on add job failed
		return
	}

	entry, _eCronAddError := scheduler.Add(entry)
	if _eCronAddError != nil {
		err := map[string]interface{}{"errors": _eCronAddError.Error()}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(err)
		// TODO: Error handling remaining for roll back for added task on add job failed
		return
	}

	scheduler.Crons = append(scheduler.Crons, entry) // Append the new crons on Crons Storage
	utility.EmitStatus(entry, nil)
	// Prepare the Data in Data Holder
	holder := &DataHolder{}
	holder.Data = entry
	holder.Total = 1 // If everything is okay, it will add a 1 task and create 1 entry (Cron.Entry)

	response := &SuccessResponse{}
	response.Result = holder
	response.Status = http.StatusOK
	response.Message = "Task added successfully, it will automatically start on next scheduler run with default time"
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
	return
}

// UpsertTask Function to New Add or Update Task // TODO: Incomplete API
func UpsertTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "upsert called"}`))
}

// GetAllCronEntries function will return all the entries which is in cron.
func GetAllCronEntries(w http.ResponseWriter, r *http.Request) {
	entries, total := scheduler.GetAllList()
	w.Header().Set("Content-Type", "application/json")
	// w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)

	// Prepare the Data in Data Holder
	holder := &DataHolder{}
	holder.Data = entries
	holder.Total = total

	// Append the Prepared Data to Response Holder
	response := &SuccessResponse{}
	response.Result = holder
	response.Status = http.StatusOK
	response.Message = "Task added successfully, it will automatically start on next scheduler run with default time"
	json.NewEncoder(w).Encode(response)
}
