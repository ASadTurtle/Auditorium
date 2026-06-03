import { prisma } from '@auditorium/db';

export async function createRoom(authUserId: string, roomName: string) {
  const roomWithSameName = await prisma.room.findFirst({ where: { roomName: roomName } });
  if (roomWithSameName) {
    throw new Error('ROOM_ALREADY_EXISTS');
  }

  const newRoom = await prisma.room.create({
    data: {
      roomName: roomName,
      ownerId: authUserId,
    }
  });

  const ownerPlayer = await prisma.player.create({
    data: {
      userId: authUserId,
      roomId: newRoom.id,
      role: "GAMEMASTER",
    }
  });

  return newRoom.id;
}

export async function deleteRoom(roomId: string) {
  // Implementation for deleting a room
}

export async function listRooms(authUserId: string, filter: { member?: string; owner?: string }) {
  const conditions: any[] = [];

  // If the filter value is "self", replace it with the authenticated user's ID
  const memberId = filter.member === "self" ? authUserId : filter.member;
  const ownerId = filter.owner === "self" ? authUserId : filter.owner;
  
  if (filter.member) {
    conditions.push({ players: { some: { userId: memberId } } });
  }
  
  if (filter.owner) {
    conditions.push({ ownerId: ownerId });
  }
  
  return await prisma.room.findMany({
    where: conditions.length > 0 ? { AND: conditions } : {}
  });
}

export async function getRoomDetails(roomId: string) {
  // Implementation for getting details of a specific room
}

export async function joinRoom(authUserId: string, inviteCode: string) {
  // Implementation for joining a room
}

export async function getRoomMessages(roomId: string) {
  // Implementation for getting messages in a room
}

export async function deleteCharacterFromRoom(roomId: string, characterId: string) {
  // Implementation for deleting a character from a room
}

export async function addCharacterToRoom(roomId: string, characterName: string) {
  // Implementation for adding a character to a room
}
