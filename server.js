const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');  // To work with file paths

const app = express();
const server = http.createServer(app);
const io = socketIo(server);  // Attach socket.io to the HTTP server

const PORT = 8000;
const users = {};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new-user-joined', (name) => {
        console.log('New user:', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

// Start the server on port 8000
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
