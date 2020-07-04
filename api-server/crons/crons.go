package crons

import (
	"fmt"
	"log"
	"reflect"

	"github.com/robfig/cron/v3"
)

func Setup() {

}

// Add new Cron Job
func Add(task interface{}) (cron.EntryID, error) {
	c := cron.New(cron.WithSeconds())
	id, _error := c.AddFunc("@every 00h00m05s", func() {
		// models.Query
		fmt.Println("Every 5 seconds")
		// log.Println(c.Entries())
	})
	if _error != nil {
		return 0, _error
	}

	defer RegisterCron(task, id, _error)
	c.Start()
	// c.Stop()
	return id, _error
}

// RegisterCron will be used to register cron in job table
func RegisterCron(task interface{}, id cron.EntryID, _error error) (cron.EntryID, error) {
	if _error != nil {
		return id, _error
	}
	log.Println("Type:", reflect.TypeOf(id), reflect.ValueOf(id).Kind())

	if id >= 0 {
		log.Println("Done", id, task)
	}

	return id, _error
}
