const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

var mongodb = require('./mongodb');
//import { addEventToBDD } from 'mongodb.js';

const PORT = 5000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
    request('http://localhost:8000/video_feed', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        res.send(body);
})
});

app.get('/api', (req, res) => {
    res.json({"users": ["user1", "user2", "user3"]})
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('message', (msg) => {
        console.log('Button clicked :', msg);
        // Send a response back to the client
        socket.emit('message received', 'Button clicked! Server received your message.');
      });



    /* SOCKET BDD */

    socket.on('addEventToBDD', (id, end_time, anomaly_type, camera_id, path) => {
        console.log('Event received :', id, end_time, anomaly_type, camera_id, path);
        // How to execute a command export from the file mongodb.js?
        mongodb.addEventToBDD(id, end_time, anomaly_type, camera_id, path);
    });

    socket.on('deleteEventFromBDD', (id) => {
        console.log('Event deleted :', id);
        mongodb.deleteEventFromBDD(id);
    });

    socket.on('getAllEvents', async () => {
        console.log('Get all events');
        let table_event = await mongodb.getEventsFromBDD();
        socket.emit('allEvents', table_event);
    });

});

server.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});