const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

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
});

server.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});