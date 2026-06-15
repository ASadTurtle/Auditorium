import { Request, Response } from 'express';
import * as roomService from '../services/room.service.js';

export async function createRoom(request: Request, response: Response) {
  const { roomName } = request.body;

  if (!roomName) {
    return response.status(400).json({ error: 'Room name is required' });
  }
  
  try {
    const newRoomId = await roomService.createRoom(request.user!.id, roomName);
    response.status(201).json({ id: newRoomId });
  } catch (error) {
    if (error instanceof Error && error.message === 'ROOM_ALREADY_EXISTS') {
      response.status(409).json({ error: 'A room with that name already exists' });
    } else {
      response.status(500).json({ error: 'An error occurred while creating the room' });
    }
  }
}

export async function deleteRoom(_request: Request, _response: Response) {
  const { _roomId } = _request.params;
  // Implementation for deleting a room
}

export async function listRooms(request: Request, response: Response) {
  const { member, owner } = request.query;
  
  try {
    const rooms = await roomService.listRooms(request.user!.id, { 
      member: member as string | undefined,
      owner: owner as string | undefined 
    });
    response.json(rooms);
  } catch (error) {
    response.status(500).json({ error: 'An error occurred while listing the rooms' });
  }
}

export async function getRoomDetails(request: Request, response: Response) {
  const { roomId } = request.params;
  
  try {
    const roomDTO = await roomService.getRoomDetails(roomId)
    response.status(200).json({ roomDTO: roomDTO });
  } catch (error) {
    if (error instanceof Error && error.message === 'ROOM_NOT_FOUND') {
      response.status(404).json({ error: `Could not find room with ID ${roomId}`});
    } else {
      response.status(500).json({ error: 'An error occurred while retrieving the room' });
    }
  }
}

export async function joinRoom(request: Request, response: Response) {
  const { inviteCode } = request.body;

  if (!(inviteCode as string).match(`[A-Z0-9]{6}`)) {
    return response.status(400).json({ error: "Invalid invite code"});
  }
    
  try {
    await roomService.joinRoom(request.user!.id, inviteCode);
    response.status(200);
  } catch (error) {
    if (error instanceof Error && error.message === 'PLAYER_ALREADY_MEMBER') {
      response.status(400).json({ error: 'This user is already a member of this room' });
    } else {
      response.status(500).json({ error: 'An error occurred while joining the room' });
    }
  }
}

export async function getRoomMessages(_request: Request, _response: Response) {
  const { _roomId } = _request.params;
  // Implementation for getting messages in a room
}

export async function deleteCharacterFromRoom(_request: Request, _response: Response) {
  const { _roomId, _characterId } = _request.params;
  // Implementation for deleting a character from a room
}

export async function addCharacterToRoom(request: Request, response: Response) {
  const { roomId } = request.params;
  const { characterName, isNPC } = request.body;

  if (characterName.length === 0) {
    response.status(400).json({ error: 'Name must not be empty' })
  }

  try {
    await roomService.addCharacterToRoom(request.user!.id, roomId, characterName, isNPC)
    response.status(201).end();
  } catch (error) {
    if (error instanceof Error && error.message === "ROOM_NOT_FOUND") {
      response.status(404).json({ error: `Could not find room with ID ${roomId}` });
    } else if (error instanceof Error && error.message === "PLAYER_NOT_MEMBER") {
      response.status(403).json({ error: "User is not a player in this room" })
    } else if (error instanceof Error && error.message === "CANNOT_CREATE_NPC") {
      response.status(403).json({ error: "Only a GM can create an NPC" })
    } else if (error instanceof Error && error.message === "CHARACTER_ALREADY_EXISTS") {
      response.status(400).json({ error: `${characterName} already exists in this room` })
    } else {
      response.status(500).json({ error: 'An error occurred while joining the room' });
    }
  }
}
