import { Role } from "./Role";

export interface Player {
  id: number;
  name: string;
  pseudo: string;
  nbGamesPlayed: number;
  nbGamesWon: number;
  nbGamesLost: number;
  nbGamesGood: number;
  nbGamesEvil: number;
  timesPlayedRole: Role[];
}

export function getNewEmptyPlayer() {
  const edition: Player = {
    id: -1,
    name: "",
    pseudo: "",
    nbGamesPlayed: 0,
    nbGamesWon: 0,
    nbGamesLost: 0,
    nbGamesGood: 0,
    nbGamesEvil: 0,
    timesPlayedRole: [],
  };
  return edition;
}

export function getPlayerPseudoString(pseudo: string) {
  const pseudoFormatted =
    pseudo !== undefined && pseudo.length > 0 ? ` (${pseudo})` : "";

  return pseudoFormatted;
}
