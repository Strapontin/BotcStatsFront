import { toLowerRemoveDiacritics } from "@/helper/string";
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

interface GroupedRoles {
  [key: string]: Role[];
}

export function groupRolesByCharacterType(roles: Role[]): GroupedRoles {
  return roles.reduce((acc: GroupedRoles, current: Role) => {
    const key = current.characterType;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(current);
    return acc;
  }, {});
}

export function sortRoles(roles: Role[]) {
  return roles.sort((a, b) => {
    if (a.characterType === b.characterType) {
      return toLowerRemoveDiacritics(a.name) < toLowerRemoveDiacritics(b.name)
        ? -1
        : 1;
    }
    return a.characterType < b.characterType ? -1 : 1;
  });
}
