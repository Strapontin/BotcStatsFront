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
  nbGamesGoodWon: number;
  nbGamesEvilWon: number;
  timesPlayedRole: Role[];
}

export function getNewEmptyPlayer(): Player {
  const edition: Player = {
    id: -1,
    name: "",
    pseudo: "",
    nbGamesPlayed: -1,
    nbGamesWon: -1,
    nbGamesLost: -1,
    nbGamesGood: -1,
    nbGamesEvil: -1,
    nbGamesGoodWon: -1,
    nbGamesEvilWon: -1,
    timesPlayedRole: [],
  };
  return edition;
}

function getPlayerPseudoString(pseudo?: string): string {
  const pseudoFormatted = pseudo && pseudo.length > 0 ? ` (${pseudo})` : "";

  return pseudoFormatted;
}

export function getPlayerFullName(player?: {
  name: string;
  pseudo: string;
}): string {
  if (!player) return "";
  return `${player.name}${getPlayerPseudoString(player.pseudo)}`;
}
