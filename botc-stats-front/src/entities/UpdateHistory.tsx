export interface UpdateHistory {
  id: number;

  playerId: number;
  roleId: number;
  editionId: number;
  gameId: number;

  date: Date;
  text: string;
}
