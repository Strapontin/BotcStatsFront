import { Alignment } from "./enums/alignment";
import { CharacterType } from "./enums/characterType";

export type Role = {
  id: number;
  name: string;
  characterType: CharacterType;
  alignment: Alignment;

  timesPlayedByPlayer: number;
  timesWonByPlayer: number;
  timesLostByPlayer: number;

  timesPlayedTotal: number;
  timesWonTotal: number;
};

export function getNewEmptyRole() {
  const role: Role = {
    id: -1,
    name: "",
    characterType: CharacterType.None,
    alignment: Alignment.None,
    timesPlayedByPlayer: 0,
    timesWonByPlayer: 0,
    timesLostByPlayer: 0,
    timesPlayedTotal: 0,
    timesWonTotal: 0,
  };
  return role;
}

// export enum RoleOrderBy {
//   None = 0,
//   Name = 1 << 0,
//   CharacterType = 1 << 1,
// }
