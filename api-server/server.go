package main

import (
	"fmt"
	"log"
	"net/http"

	"api-server/models"
	"api-server/scheduler"
	"api-server/socket"

	"github.com/gobuffalo/packr"
	socketio "github.com/googollee/go-socket.io"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// Get Function called
func Get(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	// w.Write([]byte(`{"message": "get called"}`))
	fmt.Fprintln(w, "api v1 get")
}

// Post Function called
func Post(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	// w.Write([]byte(`{"message": "get called"}`))
	fmt.Fprintln(w, "api v1 post")
}

// _Middleware function will add the required headers in response header
func _Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		allowHeaders := "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization"

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", allowHeaders)
		next.ServeHTTP(w, r)
	})
}

func main() {
	box := packr.NewBox("./public")
	// Database Setup
	log.Println("Setup Initialized!")
	_, _error := models.Open() // Ready the database
	scheduler.Initiate()       // Ready the Automated Scheduler
	scheduler.Startup()
	log.Println("Setup Done!")
	if _error != nil { // Error handling for database setup
		panic(_error)
	}

	// Socket Setup
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
		panic(err)
	}
	socket.Initiate(server)
	go server.Serve()
	defer server.Close()

	// API Router Setup
	r := mux.NewRouter()
	r.Handle("/socket.io/", server)
	// r.Handle("/ws", r)

	log.Println("Monitoring Server API")
	api := r.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/", Get).Methods(http.MethodGet)
	api.HandleFunc("/", Post).Methods(http.MethodPost)
	api.HandleFunc("/entries", GetAllCronEntries).Methods(http.MethodGet)
	api.HandleFunc("/task", GetTask).Methods(http.MethodGet)
	api.HandleFunc("/task", AddTask).Methods(http.MethodPost)
	api.HandleFunc("/task/upsert", UpsertTask).Methods(http.MethodPost)
	log.Println("Serving at localhost:8080...")

	r.Handle("/api/v1", api)                        // Register API's First
	r.PathPrefix("/").Handler(http.FileServer(box)) // Register static content

	// Allowed cors to hit api from any origin/domain // TODO: Need to look into it, it's not working
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(headersOk, originsOk, methodsOk)(r)))
}
