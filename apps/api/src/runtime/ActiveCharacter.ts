export interface ActiveCharacter {
  characterId: string;
  controllingPlayerId: string;
  // avatarUrl: string;   (v0.2+)
  activatedAt: Date;
}