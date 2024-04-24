const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Client } = require('ssh2');

var mongodb = require('./mongodb');

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
});*/

app.post('/add_event', (req, res) => {
    // Handle incoming event data here
    const eventData = req.body; // Assuming event data is sent in the request body
    console.log("Received event data:", eventData);

    // Send to the client the event
    io.emit('newEvent', eventData);

    // Respond with appropriate status code
    res.sendStatus(200); // Sending back a success status
});


app.get('/api', (req, res) => {
    res.json({"users": ["user1", "user2", "user3"]})
});

app.use('/resources', express.static('resources'))

var videoPath;

io.on('connection', (socket) => {
    //console.log('New client connected');
    /*socket.on('disconnect', () => {
        console.log('Client disconnected');
    });*/

    socket.on('showClip', (id) => {
        // Connect to SSH server
        const conn = new Client();
        conn.on('ready', () => {
            conn.sftp((err, sftp) => {
                if (err) throw err;
                const path = '/home/user/videos/' + id + '.mp4';
                const dest = '../client/public/videos/' + id + '.mp4';
            
                //console.log('Transfert de fichier:', path, 'vers', dest);
                sftp.fastGet(path, dest, (err) => {
                    if (err) {
                        console.error('Erreur lors du transfert de fichier', err);
                        socket.emit('clip', null);
                    } else {
                        console.log('Transfert de fichier réussi:', dest);
                        videoPath = dest;
                        socket.emit('clip', dest);
                    }
                    conn.end();
                });
            });
        }).connect({
            hostname : '192.168.255.118',
            port : 22,
            username : 'user',
            password : 'user'
    });
    });

    socket.on('closeClip', () => {
        console.log('Suppression du fichier:', videoPath);
        const fs = require('fs');
        fs.unlink(videoPath, (err) => {
            if (err) {
                console.error('Erreur lors de la suppression du fichier:', err);
            } else {
                console.log('Fichier supprimé:', videoPath);
            }
        });
    });

    socket.on('getAllThumbnails', () => {
        const conn = new Client();
        conn.on('ready', () => {
            conn.sftp(async (err, sftp) => {
                if (err) throw err;
                sftp.readdir('/home/user/videos/thumbnails', async (err, list) => {
                    if (err) throw err;
                    const thumbnails = [];
                    for (const file of list) {
                        const localPath = `../client/public/videos/thumbnails/${file.filename}`;
                        const serverPath = `/home/user/videos/thumbnails/${file.filename}`;
                        
                        try {
                            await new Promise((resolve, reject) => {
                                sftp.fastGet(serverPath, localPath, (err) => {
                                    if (err) {
                                        console.error('Erreur lors du transfert de fichier', err);
                                        reject(err);
                                    }
                                    else {
                                        //console.log('Transfert de fichier réussi:', localPath);
                                        thumbnails.push(file.filename);
                                        resolve();
                                    }
                                });
                            });
                        } catch (err) {
                            console.error('Error downloading file:', err);
                        }
                    }
                    socket.emit('allThumbnails', thumbnails);
                    conn.end();
                });
            });
        }).connect({
            hostname : '192.168.255.118',
            port : 22,
            username : 'user',
            password : 'user'
        });
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

    socket.on('deleteEventFromBDD', async (id) => {
        console.log('Event deleted :', id);
        mongodb.deleteEventFromBDD(id);
        let table_event = await mongodb.getEventsFromBDD();
    
        const conn = new Client();
        conn.on('ready', () => {
            conn.sftp(async (err, sftp) => {
                if (err) throw err;
                const path = '/home/user/videos/' + id + '.mp4';
                const dest = '../client/public/videos/' + id + '.mp4';
                const thumbnailPath = '/home/user/videos/thumbnails/' + id + '_thumbnail.jpg';
                const thumbnailDest = '../client/public/videos/thumbnails/' + id + '_thumbnail.jpg';
    
                console.log('Suppression du fichier:', path);
                try {
                    await new Promise((resolve, reject) => {
                        sftp.unlink(path, (err) => {
                            if (err) {
                                console.error('Erreur lors de la suppression du fichier:', err);
                                reject(err);
                            } else {
                                console.log('Fichier supprimé:', path);
                                resolve();
                            }
                        });
                    });
                } catch (err) {
                    console.error('Error deleting file:', err);
                }
    
                console.log('Suppression du fichier:', thumbnailPath);
                try {
                    await new Promise((resolve, reject) => {
                        sftp.unlink(thumbnailPath, (err) => {
                            if (err) {
                                console.error('Erreur lors de la suppression du fichier:', err);
                                reject(err);
                            } else {
                                console.log('Fichier supprimé:', thumbnailPath);
                                resolve();
                            }
                        });
                    });
                } catch (err) {
                    console.error('Error deleting file:', err);
                }
    
                conn.end();
            });
        }).connect({
            hostname : '192.168.255.118',
            port : 22,
            username : 'user',
            password : 'user'
        });
    
        socket.emit('allEvents', table_event);
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

    socket.on('getAllAnomalies', async () => {
        console.log('Get anomalies');
        let table_anomalies = await mongodb.getAnomalyDegreeFromBDD();
        socket.emit('allAnomalies', table_anomalies);
    });

    socket.on('changeAnomalyDegree', async (name, degree) => {
        console.log('Change anomaly degree :', name, degree);
        await mongodb.changeAnomalyDegree(name, degree);
        let table_anomalies = await mongodb.getAnomalyDegreeFromBDD();
        socket.emit('allAnomalies', table_anomalies);
    });

});

server.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});