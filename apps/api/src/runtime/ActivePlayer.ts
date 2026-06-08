export interface ActivePlayer {
  playerId: string;
  userId: string;
  socketId: string;
  connectedAt: Date;
  state: PlayerState;
  selectedCharacterId?: string;
  lastReceivedMessage: number;
}

export enum PlayerState {
  LOBBY = 'LOBBY',
  LIVE = 'LIVE',
}