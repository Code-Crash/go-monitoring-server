package observer

import (
	"api-server/models"
	"api-server/utility"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

// Post Function Execute Operation on Any Entry
func Post(method string, entry *models.Entry) {
	log.Println("Observer:entry", entry.Name+"#", entry.Description+": ", entry.CronID)
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
	log.Println("URL:>", url)
	var params = []byte(entry.Body)
	req, err := http.NewRequest(method, url, bytes.NewBuffer(params))
	if err != nil {
		log.Println("POST:Server Respond is not valid:", string(err.Error()))
		utility.EmitStatus(nil, err)
		// panic(err)
	}

	if entry.Headers != "" {
		var headers []Header
		json.Unmarshal([]byte(entry.Headers), &headers)
		for i, header := range headers {
			log.Println("Header:", i, header)
			req.Header.Set(header.Name, header.Value)
			// req.Header.Set("Content-Type", "application/json")/
		}
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("POST:Server Respond is not valid:", string(err.Error()))
		// panic(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusOK {
		_json, _ := json.Marshal(entry)
		log.Println("Server Respond is valid:", string(_json))
		utility.EmitStatus(entry, nil)
	} else {
		_json, _ := json.Marshal(entry)
		// Trigger Alerts
		log.Println("Server Respond is not valid:", string(_json), method)
		utility.EmitStatus(entry, nil)
	}
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("response Body:", string(body))
}
