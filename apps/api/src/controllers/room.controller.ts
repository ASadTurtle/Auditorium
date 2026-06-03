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

export async function deleteRoom(request: Request, response: Response) {
  const { roomId } = request.params;
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
  // Implementation for getting details of a specific room
}

export async function joinRoom(request: Request, response: Response) {
  const { inviteCode } = request.body;
  // Implementation for joining a room
}

export async function getRoomMessages(request: Request, response: Response) {
  const { roomId } = request.params;
  // Implementation for getting messages in a room
}

export async function deleteCharacterFromRoom(request: Request, response: Response) {
  const { roomId, characterId } = request.params;
  // Implementation for deleting a character from a room
}

export async function addCharacterToRoom(request: Request, response: Response) {
  const { roomId } = request.params;
  const { characterName } = request.body;
  // Implementation for adding a character to a room
}
