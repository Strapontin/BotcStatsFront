import { Player } from "./Player";
import { Role } from "./Role";
import { Alignment } from "./enums/alignment";

export type PlayerRole = {
  player?: Player;
  role?: Role;
  finalAlignment: Alignment;
};

export function getNewEmptyPlayerRole() {
  const playerRole: PlayerRole = {
    finalAlignment: Alignment.None,
  };
  return playerRole;
}
