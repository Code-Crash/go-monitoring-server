package main

import (
	"api-server/models"
	"net/url"
)

// SuccessResponse Success Response Format
type SuccessResponse struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Result  *DataHolder `json:"result"`
}

// DataHolder will hold the results and length of the results
type DataHolder struct {
	Data  interface{} `json:"data"`
	Total interface{} `json:"total"`
}

// ErrorResponse Error Response Format
type ErrorResponse struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Errors  interface{} `json:"errors"`
}

// RequestTaskValidator Task ValidateTask Function
func RequestTaskValidator(t *models.Task) url.Values {
	errs := url.Values{}
	if t.Name == "" {
		errs.Add("name", "The name field is required!")
	}
	if t.Host == "" {
		errs.Add("host", "The name field is required!")
	}
	if t.Port == "" {
		errs.Add("port", "The name field is required!")
	}
	if t.Method == "" {
		errs.Add("method", "The method field is required!")
	}
	return errs
}
