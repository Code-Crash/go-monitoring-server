

// // Socket Code Examples for Reference
// <script>
//     var socket = io("/");
//     // socket.emit('msg', 'hello');
//         var s2 = io("/chat", {transports: ['websocket'] });
//         socket.on('reply', function (msg) {
//         $('#messages').append($('<li>').text(msg));
//         });
//         $('form').submit(function () {
//         s2.emit('msg', $('#m').val(), function (data) {
//             $('#messages').append($('<li>').text('ACK CALLBACK: ' + data));
//         });
//             socket.emit('notice', $('#m').val());
//             $('#m').val('');
//             return false;
//         });
//         socket.emit("welcome", "Hello World Dear", function (data) {
//         console.log(data);
//         })
//         socket.on('_cWelcome', function (data) {
//         console.log(data);
//         });
// </script>

import emitter from '../utility/emitter';

export class Socket {
    constructor() {
        if (window && window.io) {
            this.socket = window.io("/");
            // this.onResponseEmitter = window.io("/events");
            this.registries();
        } else {
            console.log('Socket not found on window object!');
        }

    }

    // Creating 
    registries() {
        this.socket.on('_cWelcome', function (data) {
            console.log('_cWelcome:', data);
        });
        this.socket.on('entry', function (data) {
            if (data) {
                emitter.emit("onEntry", JSON.parse(data)) // TODO: Add Proper Data Handler (ex: string to json, bytes to string etc..)
            }
        });
        this.socket.on('entries', function (data) {
            console.log('entries:', data);
        });
    }
}

let instance = null; // Global Instance for singleton task service
function SocketInstance() {
    try {
        if (instance) {
            return instance;
        } else {
            instance = new Socket();
            return instance;
        }
    } catch (error) {
        console.log(error);
    }
}

export default SocketInstance;