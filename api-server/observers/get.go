package observer

import (
	"api-server/models"
	"api-server/utility"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
)

// Get Function Execute Operation on Any Entry
func Get(method string, entry *models.Entry) {
	url := ""

	if entry.Protocol != "" {
		url += entry.Protocol + "://"
	} else {
		url += "http://"
	}

	if entry.Host != "" {
		url += entry.Host
	}

	if entry.Port != "" {
		url += ":" + entry.Port
	}

	if entry.Path != "" {
		url += entry.Path
	}

	// TODO: Add support for params
	log.Println("URL:>", url, method, entry.Name)
	var params = []byte("")
	req, err := http.NewRequest(method, url, bytes.NewBuffer(params))
	if err != nil {
		log.Println("Server Respond is not valid:", string(err.Error()))
		// panic(err)
	}

	if entry.Headers != "" {
		var headers []Header
		json.Unmarshal([]byte(entry.Headers), &headers)
		fmt.Printf("entry.Headers : %+v", headers)
		for i, header := range headers {
			log.Println("Header:", i, header)
			req.Header.Set(header.Name, header.Value)
			// req.Header.Set("Content-Type", "application/json")/
		}
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("GET:Server Respond is not valid:", string(err.Error()), method)
		utility.EmitStatus(nil, err)
		// panic(err)
		return
	}
	defer resp.Body.Close()
	// fmt.Println("response Headers:", resp.Header)
	if resp.StatusCode == http.StatusOK {
		// _json, _ := json.Marshal(entry)
		// log.Println("Server Respond is valid:", string(_json), reflect.TypeOf(_json))
		utility.EmitStatus(entry, nil)
		return
	} else {
		// _json, _ := json.Marshal(entry)
		// TODO: Implement Proper Error Handler
		// Trigger Alerts
		utility.EmitStatus(entry, errors.New("Server Respond is not valid"))
		return
	}
	// body, _ := ioutil.ReadAll(resp.Body)
	// fmt.Println("response Body:", string(body))
}
