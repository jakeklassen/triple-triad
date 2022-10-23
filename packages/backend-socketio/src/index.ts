import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const port = parseInt(process.env.PORT ?? '3000', 10);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.json({
    message: 'Are you supposed to be here?',
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`[GameServer] Listening on Port: ${port}`);
});
