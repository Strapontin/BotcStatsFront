import { Role } from "./Role";

export type Edition = {
  id: number;
  name: string;
  roles: Role[];
  timesPlayed: number;
  timesGoodWon: number;
};

export function getNewEmptyEdition() {
  const edition: Edition = {
    id: -1,
    name: "",
    roles: [],
    timesPlayed: 0,
    timesGoodWon: 0,
  };
  return edition;
}
