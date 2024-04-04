import { toLowerRemoveDiacritics } from "@/helper/string";
import { Player } from "./Player";
import { Alignment } from "./enums/alignment";
import { CharacterType } from "./enums/characterType";

export type Role = {
  id: number;
  name: string;
  characterType: CharacterType;

  timesPlayedByPlayer: number;
  timesWonByPlayer: number;
  timesLostByPlayer: number;

  timesPlayedTotal: number;
  timesWonTotal: number;
  timesLostTotal: number;

  playersWhoPlayedRole?: PlayersWhoPlayedRole[];
};

export type PlayersWhoPlayedRole = {
  player: Player;
  timesPlayedRole: number;
  timesWon: number;
  timesLost: number;
};

export function getNewEmptyRole() {
  const role: Role = {
    id: -1,
    name: "",
    characterType: CharacterType.None,

    timesPlayedByPlayer: -1,
    timesWonByPlayer: -1,
    timesLostByPlayer: -1,

    timesPlayedTotal: -1,
    timesWonTotal: -1,
    timesLostTotal: -1,
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

export function getDefaultAlignmentFromRole(role?: Role): Alignment {
  if (!role) return Alignment.None;

  return [
    CharacterType.Townsfolk,
    CharacterType.Outsider,
    CharacterType.Traveller,
  ].includes(role.characterType)
    ? Alignment.Good
    : [CharacterType.Minion, CharacterType.Demon].includes(role.characterType)
    ? Alignment.Evil
    : Alignment.None;
}
