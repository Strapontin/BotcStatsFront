import { Role } from "./Role";

export type Edition = {
  id: number;
  name: string;
  roles: Role[];
  timesPlayed: number;
  timesGoodWon: number;
  timesEvilWon: number;
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
