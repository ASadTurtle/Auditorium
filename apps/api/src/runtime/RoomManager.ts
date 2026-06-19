import { ActiveCharacter } from './ActiveCharacter.js';
import { ActivePlayer, PlayerState } from './ActivePlayer.js';
import { ActiveRoom, RoomState } from './ActiveRoom.js';
import { prisma } from '@auditorium/db';

/**
 * The RoomManager class is responsible for managing the runtime entities in memory
 * when rooms are active. Any operations which require either information from an
 * active session, or to update the state of an active session, are run by the
 * RoomManager. 
 * 
 * Note that the RoomManager does not handle authorization, such as in the case
 * where a user attempts to host a room they must be an owner of, and instead
 * assumes the service provider who has called it has made the required checks
 * beforehand.
 */
export class RoomManager {
  private activeRooms = new Map<string, ActiveRoom>();

  // Generate a random 6-character invite code for a new room.
  private generateInviteCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let inviteCode = '';
    for (let i = 0; i < 6; i++) {
      inviteCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return inviteCode;
  }

  // Get an active room by its ID.
  getActiveRoom(roomId: string): ActiveRoom | undefined {
    const activeRoom = this.activeRooms.get(roomId);
    if (!activeRoom) {
      throw new Error(`Room with ID ${roomId} does not exist or is not active.`);
    }

    return activeRoom;
  }

  // Find a room by its Invite Code.
  getActiveRoomByInviteCode(inviteCode: string) {
    const activeRoom = [...this.activeRooms.entries()].filter(([_, room]) => {
      room.inviteCode === inviteCode
    }).at(0)?.[1];

    if (!activeRoom) {
      throw new Error(`Invite code ${inviteCode} was invalid.`)
    }

    return activeRoom.roomId;
  }

  // Open a room by adding a new active room to the room manager. Automatically
  // adds the host player to the room as well.
  async openRoom(hostUserId: string, roomId: string, socketId: string) {
    if (this.activeRooms.has(roomId)) {
      throw new Error(`Room with ID ${roomId} is already active.`);
    }

    const player = await prisma.player.findUnique({ where: { userId_roomId: { userId: hostUserId, roomId } } });
    if (!player) {
      throw new Error(`User with ID ${hostUserId} is not a player in room ${roomId}.`);
    }

    const newRoom = {
      roomId,
      inviteCode: this.generateInviteCode(),
      activePlayers: new Map<string, ActivePlayer>(),
      activeCharacters: new Map<string, ActiveCharacter>(),
      state: RoomState.LOBBY,
      messages: [],
    };
    this.activeRooms.set(roomId, newRoom);
    this.addPlayer(hostUserId, player.id, roomId, socketId);
  }

  // End a room by removing it from the room manager.
  endRoom(roomId: string) {
    if (!this.activeRooms.has(roomId)) {
      throw new Error(`Room with ID ${roomId} does not exist or is not active.`);
    }
    this.activeRooms.delete(roomId);
  }

  // Add a client to the list of active players in this room.
  // Note: player specified by the playerId is assumed to have entered the correct
  // invite code for the room, which is checked before this function is called.
  addPlayer(userId: string, playerId: string, roomId: string, socketId: string) {
    const activeRoom = this.activeRooms.get(roomId);
    if (!activeRoom) {
      throw new Error(`Room with ID ${roomId} does not exist or is not active.`);
    }

    if (activeRoom.activePlayers.has(playerId)) {
      throw new Error(`Player with ID ${playerId} is already active in room ${roomId}.`);
    }

    activeRoom.activePlayers.set(playerId, {
      playerId,
      userId,
      socketId,
      connectedAt: new Date(Date.now()),
      lastReceivedMessage: activeRoom.messages.length-1,
      state: PlayerState.LOBBY,
    });
  }

  // Remove a client from the active players list of a room.
  removePlayer(playerId: string, roomId: string) {
    const activeRoom = this.activeRooms.get(roomId);
    if (!activeRoom) {
      throw new Error(`Room with ID ${roomId} does not exist or is not active.`);
    }
    activeRoom.activePlayers.delete(playerId);
  }

  // Assign a character to an active player in a room.
  // Assumes if character is NPC then the player is a GM.
  assignCharacterToPlayer(characterId: string, playerId: string, roomId: string) {
    const activeRoom = this.activeRooms.get(roomId);
    if (!activeRoom) {
      throw new Error(`Room with ID ${roomId} does not exist or is not active.`);
    }
    
    const activePlayer = activeRoom.activePlayers.get(playerId);
    if (!activePlayer) {
      throw new Error(`Player with ID ${playerId} is not active in room ${roomId}.`);
    }

    activePlayer.selectedCharacterId = characterId;
    activeRoom.activeCharacters.set(characterId, {
      characterId,
      controllingPlayerId: playerId,
      activatedAt: new Date(Date.now()),
    });
  }

  // Deassign a character from an active player in a room.
  deassignCharacterFromPlayer(characterId: string, playerId: string, roomId: string) {
    const activeRoom = this.activeRooms.get(roomId);
    if (!activeRoom) {
      throw new Error(`Room with ID ${roomId} does not exist or is not active.`);
    }
    
    const activePlayer = activeRoom.activePlayers.get(playerId);
    if (!activePlayer) {
      throw new Error(`Player with ID ${playerId} is not active in room ${roomId}.`);
    }

    if (!activeRoom.activeCharacters.has(characterId)) {
      throw new Error(`Character with ID ${characterId} is not assigned to any player in room ${roomId}.`);
    }

    activePlayer.selectedCharacterId = undefined;
    activeRoom.activeCharacters.delete(characterId);
  }

  // Set the rooms state from LOBBY to LIVE, which will allow players to start 
  // sending messages and interacting in the session.
  startRoom(roomId: string) {
    const activeRoom = this.activeRooms.get(roomId);
    if (!activeRoom) {
      throw new Error(`Room with ID ${roomId} does not exist or is not active.`);
    }

    activeRoom.state = RoomState.LIVE;
  }

  // Set the active player's state from LOBBY to LIVE, which will allow them 
  // to start sending messages and interacting in the session.
  startPlayer(playerId: string, roomId: string) {
    const activeRoom = this.activeRooms.get(roomId);
    if (!activeRoom) {
      throw new Error(`Room with ID ${roomId} does not exist or is not active.`);
    }

    const activePlayer = activeRoom.activePlayers.get(playerId);
    if (!activePlayer) {
      throw new Error(`Player with ID ${playerId} is not active in room ${roomId}.`);
    }

    activePlayer.state = PlayerState.LIVE;
  }

  // Add message to messages array of the active room. Messages are stored in the
  // order they are received, and each message has a timestamp of when it was received.
  // Also handles updating the database with the new message.
  playerSendMessage(message: string, playerId: string, characterId: string | undefined, roomId: string) {
    const activeRoom = this.activeRooms.get(roomId);
    if (!activeRoom) {
      throw new Error(`Room with ID ${roomId} does not exist or is not active.`);
    }

    const activePlayer = activeRoom.activePlayers.get(playerId);
    if (!activePlayer) {
      throw new Error(`Player with ID ${playerId} is not active in room ${roomId}.`);
    }

    activeRoom.messages.push({
      id: crypto.randomUUID(),
      content: message,
      senderId: playerId,
      characterId: characterId || null,
      roomId,
      createdAt: new Date(Date.now()),
    });
  }
  
  // Increments lastReceivedMessage index for active player.
  playerReceiveMessage(roomId: string, playerId: string) {
    const activeRoom = this.activeRooms.get(roomId);
    if (!activeRoom) {
      throw new Error(`Room with ID ${roomId} does not exist or is not active.`);
    }

    const activePlayer = activeRoom.activePlayers.get(playerId);
    if (!activePlayer) {
      throw new Error(`Player with ID ${playerId} is not active in room ${roomId}.`);
    }

    activePlayer.lastReceivedMessage++;
  }

  // Retreives all messages the player has missed. Does not increment the 
  // lastReceivedMessage index on the activePlayer.
  playerRetrieveMissedMessages(roomId: string, playerId: string) {
    const activeRoom = this.activeRooms.get(roomId);
    if (!activeRoom) {
      throw new Error(`Room with ID ${roomId} does not exist or is not active.`);
    }

    const activePlayer = activeRoom.activePlayers.get(playerId);
    if (!activePlayer) {
      throw new Error(`Player with ID ${playerId} is not active in room ${roomId}.`);
    }

    return activeRoom.messages.slice(activePlayer.lastReceivedMessage);
  }
}

// Provide RoomManager as a singleton to the server.
export const roomManager = new RoomManager();