import { Router } from 'express';
import * as roomController from '../controllers/room.controller.js';

const router = Router();

// Create a new room
router.post('/', async (request, response) => {
  const { roomName } = request.body;
  // Implementation for creating a new room
});

// Delete an existing room
router.delete('/:roomId', async (request, response) => {
  const { roomId } = request.params;
  // Implementation for deleting a room
});

// Get all rooms, with optional filters for member or owner
router.get('/', async (request, response) => {
  const {member, owner} = request.query;
  // Implementation for listing all rooms
});

// Get details of a specific room
router.get('/:roomId', async (request, response) => {
  const { roomId } = request.params;
  // Implementation for getting details of a specific room
});

// Become a player in a room using an invite code
router.post('/join', async (request, response) => {
  const { inviteCode } = request.body;
  // Implementation for joining a room
});

// Get all messages in a room
router.get('/:roomId/messages', async (request, response) => {
  const { roomId } = request.params;
  // Implementation for getting messages in a room
});

// Delete a character from a room
router.delete('/:roomId/characters/:characterId', async (request, response) => {
  const { roomId, characterId } = request.params;
  // Implementation for deleting a character from a room
});

// Create a character and add them to a room
router.post('/:roomId/characters', async (request, response) => {
  const { roomId } = request.params;
  const { characterName } = request.body;
  // Implementation for adding a character to a room
});

export default router;