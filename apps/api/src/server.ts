import './env.js';
import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { prisma } from '@auditorium/db';

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

app.get('/health', async (_request, response) => {
  await prisma.$queryRaw`SELECT 1`;
  response.json({ status: 'ok' });
});

io.on('connection', (socket) => {
  socket.emit(`Client ${socket.id}: connected`, { socketId: socket.id });
});

io.on('disconnect', (socket) => {
  socket.emit(`Client ${socket.id}: disconnected`, { socketId: socket.id });
});

httpServer.listen(port, () => {
  console.log(`Auditorium API listening on http://localhost:${port}`);
});
