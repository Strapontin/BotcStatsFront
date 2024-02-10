export interface UpdateHistory {
  id: number;

  playerId: number;
  roleId: number;
  editionId: number;
  gameId: number;
  gameDraftId: number;

  date: Date;
  text: string;
}
