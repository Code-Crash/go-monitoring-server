package scheduler

import (
	"api-server/models"
	observer "api-server/observers"
	"encoding/json"
	"log"
	"time"

	"github.com/robfig/cron/v3"
)

// Cron Hold the Cron Service
var Cron *cron.Cron

// Crons Hold the All the Entries in cron
var Crons []*models.Entry = nil

// Startup function will us to start all the jobs
func Startup() {
	var _eGetListError error = nil
	Crons, _eGetListError = models.GetAllJobWithTasks()
	if _eGetListError != nil {
		log.Println("Initiate: GetJobWithoutCronID", _eGetListError)
	} else {
		log.Println("Total Startup Crons:", len(Crons))
	}

	for _, entry := range Crons {
		_r, _eAddError := Add(entry)
		if _eAddError != nil {
			log.Println("_eAddError:", _eAddError)
			panic(_eAddError)
		} else {
			// log.Println("Cron Job Started with ID:", _r.ID)
			log.Println("Updated CronId, [JobID|CronID]>", _r.ID, "|", _r.CronID)
		}
	}
	// TODO: We need add recover to handle the panic
}

// Add new Cron Job and Update the CronId
func Add(entry *models.Entry) (*models.Entry, error) {
	id, _eAddCronError := Cron.AddFunc("@every 00h01m00s", func() {
		observer.Initiate(entry)
	})

	if _eAddCronError != nil {
		log.Println("_eAddCronError:", _eAddCronError)
		panic(_eAddCronError)
	} else {
		entry.CronID = int64(id) // Cast the type from cron.EntryID type to int64
		_entry, _eMarshalError := json.Marshal(entry)
		if _eMarshalError != nil {
			log.Println("_eMarshalError:", _eMarshalError)
			panic(_eMarshalError)
		}

		job := &models.Job{}
		_eUnMarshalError := json.Unmarshal([]byte(_entry), &job)
		if _eUnMarshalError != nil {
			log.Println("_eUnMarshalError:", _eUnMarshalError)
			panic(_eUnMarshalError)
		}

		job, _eUpdateJobError := job.UpdateCronID()
		if _eUpdateJobError != nil {
			log.Println("_eUpdateJobError:", _eUpdateJobError)
			panic(_eUpdateJobError)
		}
		// log.Println("Updated CronId, [JobID|CronID]>", job.ID, "|", job.CronID)
	}

	return entry, nil
}

// Initiate function will start the cron service
func Initiate() (bool, error) {
	Cron = cron.New(cron.WithSeconds())
	// startup()
	// Check for any existing jobs in every 10 minutes
	id, _error := Cron.AddFunc("@every 00h10m00s", func() {
		// models.Query
		// TODO: Register Cron Runner More Helpers Here
		log.Println("Every 10 minutes")
	})
	if _error != nil {
		return false, _error
	}
	log.Println("Started: Cron Schedular, id:", id)
	Cron.Start()
	return true, _error
}

// GetAllList function will return all tne entry from already scheduled crons
func GetAllList() ([]*Detail, int) {
	entries := Cron.Entries()
	log.Println("GetAllList: entries len", len(entries))

	var records []*Detail
	for _, entry := range entries {
		detail := &Detail{}
		for _, v := range Crons {
			if v.CronID == int64(entry.ID) {
				detail.Entry = v
				detail.ID = int64(entry.ID)
				detail.Next = entry.Next
				detail.Prev = entry.Prev
				records = append(records, detail)
				// var Schedule interface{}
				// Schedule = entry.
				// Schedule, _eScheduleError := fmt.Println()
				// time.ParseDuration(entry.Schedule)
				// detail.Schedule = json.Marshal([]byte(entry.Schedule))
				// if _eScheduleError != nil {
				// 	log.Println("_eScheduleError:", _eScheduleError)
				// 	panic(_eScheduleError)
				// }
				break
			}
		}

		// log.Println("entry valid:", entry.Valid(), entry.ID)
		// log.Println("entry ID:", entry.ID)
		// log.Println("entry Next:", entry.Next)
		// log.Println("entry Prev:", entry.Prev)
		// log.Println("entry Schedule:", entry.Schedule) // TODO: Parse Schedule is remaining.
	}

	return records, len(records)
}

// StopCronByID function will terminate the cron scheduler
func StopCronByID(id int64) {
	Cron.Remove(cron.EntryID(id))
	log.Println("Cron Job Terminated, id:", id)
}

// Terminate function will terminate the cron scheduler
func Terminate() {
	context := Cron.Stop()
	log.Println("Cron Scheduler Terminated, context:", context)
}

// Detail Typw will help us to encapsulate All details for cron at one place
type Detail struct {
	ID       int64         `json:"id"`
	Entry    *models.Entry `json:"entry"`
	Next     time.Time     `json:"next"`
	Prev     time.Time     `json:"prev"`
	Schedule string        `json:"schedule"`
}
