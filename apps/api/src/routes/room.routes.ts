import { Router } from 'express';
import * as roomController from '../controllers/room.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Create a new room
router.post('/', authenticate, roomController.createRoom);

// Delete an existing room
router.delete('/:roomId', authenticate, roomController.deleteRoom);

// Get all rooms, with optional filters for member or owner
router.get('/', authenticate, roomController.listRooms);

// Get details of a specific room
router.get('/:roomId', authenticate, async (_request, _response) => {
  const { _roomId } = _request.params;
  // Implementation for getting details of a specific room
});

// Become a player in a room using an invite code
router.post('/join', authenticate, roomController.joinRoom);

// Get all messages in a room
router.get('/:roomId/messages', authenticate, async (_request, _response) => {
  const { _roomId } = _request.params;
  // Implementation for getting messages in a room
});

// Delete a character from a room
router.delete('/:roomId/characters/:characterId', authenticate, async (_request, _response) => {
  const { _roomId, _characterId } = _request.params;
  // Implementation for deleting a character from a room
});

// Create a character and add them to a room
router.post('/:roomId/characters', authenticate, async (_request, _response) => {
  const { _roomId } = _request.params;
  const { _characterName } = _request.body;
  // Implementation for adding a character to a room
});

export default router;