import { Server } from 'socket.io'
import { registerLobbySocketHandlers } from './lobby.socket.js';
import { registerCharacterSocketHandlers } from './character.socket.js';
import { hashToken } from '../services/auth.service.js';
import { prisma } from '@auditorium/db';

export function registerSocketHandlers(io: Server) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("UNAUTHENTICATED"));
    }

    const session = await prisma.session.findUnique({
      where: {
        tokenHash: hashToken(token),
      },
      include: {
        authUser: true,
      },
    });

    if (!session) {
      return next(new Error("INVALID_SESSION"));
    }

    socket.data.userId = session.authUserId;
    socket.data.userName = session.authUser.userName;

    next();
  });

  io.on('connection', (socket) => {
    console.log(`Client ${socket.id}: connected`);

    socket.on('disconnect', () => {
      console.log(`Client ${socket.id}: disconnected`);
    });
    
    registerLobbySocketHandlers(io, socket);
    registerCharacterSocketHandlers(io, socket);

    socket.on("JOIN_ROOM", (roomId) => {
      const roomAddress = `${roomId}_r`;
      socket.join(roomAddress);
      console.log(`CLIENT JOINED ROOM ${roomId}`);
      socket.to(roomAddress).emit(`CLIENT JOINED ROOM ${roomId}`);
    });

    socket.on("SEND_MESSAGE", (sender, roomId, message) => {
      const roomAddress = `${roomId}_r`;
      socket.to(roomAddress).emit(`${sender}: ${message}`);
      console.log(`${sender}: ${message}`);
    })
  });
}