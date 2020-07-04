package observer

import (
	"api-server/models"
	"log"
)

// Header Type for Header from task table
type Header struct {
	Name  string //`string:"name"`
	Value string // `string:"value"`
}

// Executor function will help us to execute the url based monitoring, methods, params
func Executor(entry *models.Entry, _type *Monitoring) {
	switch entry.Method {
	case "get", "GET", "Get":
		Get("GET", entry)
	case "post", "POST", "Post":
		Post("POST", entry)
	default:
		log.Println("Entry:", entry)
	}
}

// Monitoring Type help us to structure the different types of monitoring
type Monitoring struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

// Initiate function will help us to check the status of task using specific type of monitoring
func Initiate(entry *models.Entry) {
	// Do the basic setup and validation for building the request

	_type := &Monitoring{}
	_type.Name = "Web/Server API"
	_type.Description = "This types are reqquest is to perform thorugh web apis or rest apis"
	Executor(entry, _type)
}
