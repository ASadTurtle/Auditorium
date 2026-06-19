import './env.js';
import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { prisma } from '@auditorium/db';
import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js';
import { registerSocketHandlers } from './sockets/socket.js';

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

registerSocketHandlers(io);

httpServer.listen(port, () => {
  console.log(`Auditorium API listening on http://localhost:${port}`);
});
