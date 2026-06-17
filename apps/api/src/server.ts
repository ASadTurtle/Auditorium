import './env.js';
import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { prisma } from '@auditorium/db';
import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js';

const port = Number(process.env.PORT ?? 4000);
const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: clientUrl,
  },
});

app.use(cors({ origin: clientUrl }));
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);

app.get('/health', async (_request, response) => {
  await prisma.$queryRaw`SELECT 1`;
  response.json({ status: 'ok' });
});

io.on('connection', (socket) => {
  console.log(`Client ${socket.id}: connected`);

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id}: disconnected`)
  });
  
  socket.on("START_LOBBY", (roomId) => {
    const lobbyAddress = `${roomId}_l`;
    socket.join(lobbyAddress);
    console.log(`CLIENT STARTED LOBBY ${roomId}`)
  })
  
  socket.on("JOIN_LOBBY", (roomId) => {
    const lobbyAddress = `${roomId}_l`;
    socket.join(lobbyAddress);
    console.log(`CLIENT JOINED LOBBY ${roomId}`)
    io.to(lobbyAddress).emit(`CLIENT JOINED LOBBY ${roomId}`)
  });
  
  socket.on("LEAVE_LOBBY", (roomId) => {
    const lobbyAddress = `${roomId}_l`;
    socket.leave(lobbyAddress)
    console.log(`CLIENT LEFT LOBBY ${roomId}`)
    io.to(lobbyAddress).emit(`CLIENT LEFT LOBBY ${roomId}`)
  });

  socket.on("JOIN_ROOM", (roomId) => {
    const roomAddress = `${roomId}_r`;
    socket.join(roomAddress)
    console.log(`CLIENT JOINED ROOM ${roomId}`)
    socket.to(roomAddress).emit(`CLIENT JOINED ROOM ${roomId}`)
  });

  socket.on("CREATE_CHARACTER", () => {
    console.log(`CLIENT CREATED NEW CHARACTER`);
  });

  socket.on("SELECT_CHARACTER", (character) => {
    console.log(`CHARACTER SELECTED: ${character}`)
  });

  socket.on("DESELECT_CHARACTER", (character) => {
    console.log(`CHARACTER DESELECTED ${character}`)
  });

  socket.on("SEND_MESSAGE", (sender, roomId, message) => {
    const roomAddress = `${roomId}_r`;
    socket.to(roomAddress).emit(`${sender}: ${message}`)
    console.log(`${sender}: ${message}`);
  })
});

httpServer.listen(port, () => {
  console.log(`Auditorium API listening on http://localhost:${port}`);
});
