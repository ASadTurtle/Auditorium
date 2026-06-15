import { prisma } from '@auditorium/db';
import { roomManager } from '../runtime/RoomManager.js';

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

  await prisma.player.create({
    data: {
      userId: authUserId,
      roomId: newRoom.id,
      role: "GAMEMASTER",
    }
  });

  return newRoom.id;
}

export async function deleteRoom(_roomId: string) {
  // Implementation for deleting a room
}

export async function listRooms(authUserId: string, filter: { member?: string; owner?: string }) {
  const conditions = [];

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
  const room = await prisma.room.findUnique({ where: { id: roomId },
    include: {
      characters: {
        select: {
          id: true,
          name: true,
          isNPC: true,
        }
      },
      players: {
        select: {
          id: true,
          userId: true,
          role: true,
          user: {
            select: {
              userName: true
            }
          }
        }
      },
    }
  });

  if (!room) {
    throw new Error('ROOM_NOT_FOUND');
  }

  return {
    roomId: room.id,
    owner: room.ownerId,
    name: room.roomName,
    characters: room.characters,
    players: room.players.map(
      ({user, ...rest}) => ({
        ...rest,
        name: user.userName
      })
    )
  }
}

export async function joinRoom(authUserId: string, inviteCode: string) {
  const roomId = roomManager.getActiveRoomByInviteCode(inviteCode);
  const playerExists = await prisma.player.findFirst({where: {userId: authUserId}});
  if (playerExists) {
    throw new Error('PLAYER_ALREADY_MEMBER');
  }

  await prisma.player.create({
    data: {
      userId: authUserId,
      roomId: roomId
    }
  });
}

export async function getRoomMessages(_roomId: string) {
  // Implementation for getting messages in a room
}

export async function deleteCharacterFromRoom(_roomId: string, _characterId: string) {
  // Implementation for deleting a character from a room
}

export async function addCharacterToRoom(authUserId:string, roomId: string, characterName: string, isNPC: boolean) {
  const room = await prisma.room.findUnique({ where: {id: roomId } });
  const player = await prisma.player.findFirst({ where: { userId: authUserId } })
  const character = await prisma.character.findUnique({ where: { name_roomId: {name: characterName, roomId: roomId} } })

  if (!room) {
    throw new Error("ROOM_NOT_FOUND")
  } 
  if (!player) {
    throw new Error("PLAYER_NOT_MEMBER")
  } 
  if (player.role !== "GAMEMASTER" && isNPC) {
    throw new Error("CANNOT_CREATE_NPC")
  } 
  if (character) {
    throw new Error("CHARACTER_ALREADY_EXISTS")
  }
  
  await prisma.character.create({
    data: {
      name: characterName,
      isNPC: isNPC,
      roomId: roomId
    }
  })
}
