const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

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

// Parse JSON bodies
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());


/*app.get('/', (req, res) => {
    request('http://localhost:8000/video_feed', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        res.send(body);
})
});

app.use('/resources', express.static('resources'))*/


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

    socket.on('login', (id, email) => {
        mongodb.login(id, email);
    });

    /* SOCKET BDD */

    socket.on('attemptingCloseConnection', () => {
        console.log('Attempting to close connection');
        mongodb.attemptingCloseConnection();
    });

    socket.on('addEventToBDD', (id, end_time, anomaly_type, camera_id, path) => {
        console.log('Event received :', id, end_time, anomaly_type, camera_id, path);
        // How to execute a command export from the file mongodb.js?
        mongodb.addEventToBDD(id, end_time, anomaly_type, camera_id, path);
    });

    socket.on('deleteEventFromBDD', (id) => {
        console.log('Event deleted :', id);
        mongodb.deleteEventFromBDD(id);
    });

    socket.on('getVideoFromFilepath', (path) => {
        console.log('Get video from filepath :', path);
        socket.emit('videoFromPath', path);
    });

    socket.on('getAllEvents', async () => {
        console.log('Get all events');
        let table_event = await mongodb.getEventsFromBDD();
        socket.emit('allEvents', table_event);
    });

    socket.on('getTableOfAnomalyDegree', async () => {
        console.log('Socket : Get table of anomaly degree');
        let table_anomaly_degree = await mongodb.getAnomalyDegreeFromBDD();
        //console.log("Socket : ", table_anomaly_degree);
        socket.emit('allDegree', table_anomaly_degree);
    });

    socket.on('getIsAdmin', async (id) => {
        console.log('Get is admin');
        let isAdmin = await mongodb.getIsAdminFromBDD(id);
        socket.emit('isAdmin', isAdmin);
    });

    socket.on('getAllUsers', async () => {
        console.log('Get all users');
        let table_user = await mongodb.getUsersFromBDD();
        socket.emit('allUsers', table_user);
    });

    socket.on('toggleAdmin', async (id) => {
        console.log('Toggle admin :', id);
        await mongodb.toggleAdmin(id);
        let table_user = await mongodb.getUsersFromBDD();
        socket.emit('allUsers', table_user);
    });

});

server.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});