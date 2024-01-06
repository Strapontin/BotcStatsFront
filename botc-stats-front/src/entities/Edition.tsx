import { Player } from "./Player";
import { Role } from "./Role";

export type Edition = {
  id: number;
  name: string;
  roles: Role[];
  timesPlayed: number;
  timesGoodWon: number;
  timesEvilWon: number;

  playersWhoPlayedEdition?: PlayersWhoPlayedEdition[];
};

export type PlayersWhoPlayedEdition = {
  player: Player;
  timesPlayedEdition: number;
  timesWon: number;
  timesLost: number;
};

export function getNewEmptyEdition() {
  const edition: Edition = {
    id: -1,
    name: "",
    roles: [],
    timesPlayed: -1,
    timesGoodWon: -1,
    timesEvilWon: -1,
  };
  return edition;
}
