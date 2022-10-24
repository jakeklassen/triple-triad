import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';

const port = parseInt(process.env.PORT ?? '3000', 10);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.get('/', (req, res) => {
  res.json({
    message: 'Are you supposed to be here?',
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (...args) => {
    console.log(...args);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`[GameServer] Listening on Port: ${port}`);
});
