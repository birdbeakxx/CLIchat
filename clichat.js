const express = require('express');
const app = express();
const http = require("http");
const readline = require('readLine');

const { disconnect } = require('process');
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = new socketIO.Server(server);

const users = [];

function broadcastMessage(sender, message) {
    users.forEach(user => {
        if (user !== sender) {
            user.socket.emit('response', message);
        }
    })
}

// app.get('/',(req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });

io.on('connection', (socket) => {
    console.log('A user connected');
    users.push({socket});
    socket.on('message', (data) => {
        broadcastMessage(socket, data)
    })
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        const index = users.findIndex(user => u => u.socket === socket);
        if (index !== -1) {
            users.splice(index, 1);
        }
    })
})
 const r1 = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
 })

 r1.on('line', (input) => {
    broadcastMessage(null, `Server: ${input}`);
 })
server.listen(3000, () => {
    console.log('listening on *:3000');
});