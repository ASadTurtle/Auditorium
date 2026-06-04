import { Message } from '@prisma/client';
import { ActivePlayer } from './ActivePlayer.js';
import { ActiveCharacter } from './ActiveCharacter.js';

export interface ActiveRoom {
  roomId: string;
  activePlayers: Map<string, ActivePlayer>;
  activeCharacters: Map<string, ActiveCharacter>
  state: RoomState;
  messages: Message[];
  inviteCode: string;
}

export enum RoomState {
  LOBBY = 'LOBBY',
  LIVE = 'LIVE',
}