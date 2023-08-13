import { Player } from "./Player";
import { Role } from "./Role";

export type PlayerRoleGame = {
  finalAlignment: number;
  gameId: number;
  playerId: number;
  player: Player;
  playerRoleGameId: number;
  roleId: number;
  role: Role;
};
