package socket

import (
	"fmt"
	"log"

	socketio "github.com/googollee/go-socket.io"
)

var socket *socketio.Server = nil

// Initiate Socket.io service for our server
func Initiate(_socket *socketio.Server) *socketio.Server {
	log.Println("Socket Server Starting!")
	socket = _socket
	// socket, err := socketio.NewServer(nil)
	// if err != nil {
	// 	log.Fatal(err)
	// 	panic(err)
	// }

	socket.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("connected:", s.ID())
		s.Join("MonitoringServer") // TODO: We can handle rooms based on different types on monitoring in future
		s.Emit("_cWelcome", "Thanks to connected to socket, your sid:"+s.ID())
		return nil
	})

	socket.OnEvent("/", "welcome", func(s socketio.Conn, msg string) {
		fmt.Println("welcome:", msg)
		s.Emit("_cWelcome", "yo "+msg)
	})
	socket.OnEvent("/", "notice", func(s socketio.Conn, msg string) {
		fmt.Println("notice:", msg)
		s.Emit("reply", "got: "+msg)
	})
	socket.OnEvent("/chat", "msg", func(s socketio.Conn, msg string) string {
		s.SetContext(msg)
		return "recv " + msg
	})
	socket.OnEvent("/", "bye", func(s socketio.Conn) string {
		last := s.Context().(string)
		s.Emit("bye", last)
		s.Close()
		return last
	})
	socket.OnError("/", func(s socketio.Conn, e error) {
		fmt.Println("meet error:", e)
	})
	socket.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Println("closed", reason)
	})

	return socket
}

// EmitEntry will emits the Socket Entry
func EmitEntry(data []byte) {
	if socket != nil {
		socket.BroadcastToRoom("", "MonitoringServer", "entry", string(data))
	}
}

// EmitStatus will emits the Socket Entry
func EmitStatus(event string, data []byte) {
	/*
		TODO: We can create one cron handler
		TODO: Which will take care of emitting the socket events
		TODO: And notifying the user thorugh sms/email for server errors
	*/
	if socket != nil {
		log.Println("Socket:EmitStatus", event, string(data))
		socket.BroadcastToRoom("", "MonitoringServer", event, string(data))
	} else {
		log.Println("Socket:EmitStatus, Socket is null", socket)
	}
}
