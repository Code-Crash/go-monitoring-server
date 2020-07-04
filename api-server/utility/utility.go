package utility

import (
	"api-server/models"
	"api-server/socket"
	"encoding/json"
	"log"
)

// EventHolder will format the cron event to emit on end user
type EventHolder struct {
	Type    string      `json:"type"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// EventHolderMarshal will convert the Go interface type to json
func EventHolderMarshal(data *EventHolder) ([]byte, error) {
	json, _error := json.Marshal(data)
	if _error != nil {
		return nil, _error
	} else {
		return json, nil
	}
}

// EmitStatus will emits the Socket Entry
func EmitStatus(data *models.Entry, err error) {
	// log.Println("Utility:EmitStatus ", data, err, reflect.TypeOf(err), err == nil, err != nil)
	if err != nil {
		event := &EventHolder{}
		event.Type = "error"
		event.Message = "Error in Cron Task, Please have a look. (urgently)"
		event.Data = err.Error()
		_event, _EventMarshalerError := EventHolderMarshal(event)
		if _EventMarshalerError != nil {
			log.Println("Utility:EmitStatus:Error, Error while parseing the data")
		}
		// log.Println("Utility:EmitStatus:Error ", string(_event))
		socket.EmitStatus("entry", _event)
	} else {
		event := &EventHolder{}
		event.Type = "success"
		event.Message = "Task Response is Valid!"
		event.Data = data
		_event, _EventMarshalerError := EventHolderMarshal(event)
		if _EventMarshalerError != nil {
			log.Println("Utility:EmitStatus:Data, Error while parseing the data")
		}
		// log.Println("Utility:EmitStatus:Data ", string(_event))
		socket.EmitStatus("entry", _event)
	}
}
