const express = require('express');
const http = require('http');
const socket = require('socket.io');


const app = express();

const server = http.createServer(app);
const io = socket(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log("User connected");

  socket.on('locationUpdate', (data) => {
    console.log("Location update recieved : ", data);
  });

  socket.on('disconnect', () => {
    console.log("User is disconnected")
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});