import { Server, Socket } from "socket.io";
import { roomManager } from "../runtime/RoomManager.js";
import { prisma } from "@auditorium/db";

export function registerLobbySocketHandlers(io: Server, socket: Socket) {
  socket.on("START_LOBBY", async (roomId, socketId) => {
    try {
      await requireRoomOwner(roomId, socket.data.userId);
      await roomManager.openRoom(socket.data.userId, roomId, socketId)
      console.log(`CLIENT OPENED ACTIVEROOM`);
      
      const lobbyAddress = `${roomId}_l`;
      socket.join(lobbyAddress);
      console.log(`CLIENT STARTED LOBBY ${roomId}`);
    } catch (error) {
      console.error(error);
      socket.emit(error as string);
    }
  });
  
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
}

async function requireRoomOwner(roomId: string, userId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId }
  });

  if (!room) {
    throw new Error("ROOM_NOT_FOUND");
  }

  if (room.ownerId !== userId) {
    throw new Error("NOT_OWNER");
  }
}