import { Alignment } from "@/entities/enums/alignment";
import {
  getAllGames as queryAllGames,
  getGameById as queryGameById,
  createNewGame as queryCreateNewGame,
  updateGame as queryUpdateGame,
  deleteGame as queryDeleteGame,
} from "./back-api-game";
import {
  getAllPlayers as queryAllPlayers,
  getPlayerById as queryPlayerById,
  createNewPlayer as queryCreateNewPlayer,
  updatePlayer as queryUpdatePlayer,
  deletePlayer as queryDeletePlayer,
} from "./back-api-player";
import {
  getAllRoles as queryAllRoles,
  getRoleById as queryRoleById,
  createNewRole as queryCreateNewRole,
  updateRole as queryUpdateRole,
  deleteRole as queryDeleteRole,
} from "./back-api-role";
import {
  getAllEditions as queryAllEditions,
  getEditionById as queryEditionById,
  createNewEdition as queryCreateNewEdition,
  updateEdition as queryUpdateEdition,
  deleteEdition as queryDeleteEdition,
} from "./back-api-edition";
import { CharacterType } from "@/entities/enums/characterType";
import { Role } from "@/entities/Role";
import { Player } from "@/entities/Player";
import { Game } from "@/entities/Game";

const apiUrl = "http://192.168.1.48:7099";

/* Login/Logout */

export function getLoginUrl() {
  return `${apiUrl}/login`;
}

export function getLogoutUrl() {
  return `${apiUrl}/logout`;
}

/* Games */

export async function getAllGames() {
  return queryAllGames(apiUrl);
}

export async function getGameById(id: number) {
  return queryGameById(apiUrl, id);
}

export async function createNewGame(game: Game) {
  return queryCreateNewGame(apiUrl, game);
}

export async function updateGame(game: Game) {
  return queryUpdateGame(apiUrl, game);
}

export async function deleteGame(gameId: number) {
  return queryDeleteGame(apiUrl, gameId);
}

/* Players */

export async function getAllPlayers() {
  return queryAllPlayers(apiUrl);
}

export async function getPlayerById(playerId: number) {
  return queryPlayerById(apiUrl, playerId);
}

export async function createNewPlayer(
  player: Player,
  accessToken: string
): Promise<boolean> {
  return queryCreateNewPlayer(apiUrl, player, accessToken);
}

export async function updatePlayer(player: Player) {
  return queryUpdatePlayer(apiUrl, player);
}

export async function deletePlayer(playerId: number) {
  return queryDeletePlayer(apiUrl, playerId);
}

/* Roles */

export async function getAllRoles() {
  var result = await queryAllRoles(apiUrl);

  // switch (orderBy) {
  //   case RoleOrderBy.Name | RoleOrderBy.CharacterType:
  //     return result.sort((a, b) => {
  //       if (a.characterType === b.characterType) {
  //         return toLowerRemoveDiacritics(a.name) <
  //           toLowerRemoveDiacritics(b.name)
  //           ? -1
  //           : 1;
  //       }
  //       return a.characterType < b.characterType ? -1 : 1;
  //     });

  //   default:
  //   case RoleOrderBy.None:
  //     return result;
  //   }
  return result;
}

export async function getRoleById(roleId: number) {
  return queryRoleById(apiUrl, roleId);
}

export async function createNewRole(
  roleName: string,
  characterType: CharacterType,
  alignment: Alignment
) {
  return queryCreateNewRole(apiUrl, roleName, characterType, alignment);
}

export async function updateRole(role: Role) {
  return queryUpdateRole(apiUrl, role);
}

export async function deleteRole(roleId: number) {
  return queryDeleteRole(apiUrl, roleId);
}

/* Edition */

export async function getAllEditions() {
  return queryAllEditions(apiUrl);
}

export async function getEditionById(editionId: number) {
  return queryEditionById(apiUrl, editionId);
}

export async function createNewEdition(editionName: string, rolesId: number[]) {
  return queryCreateNewEdition(apiUrl, editionName, rolesId);
}

export async function updateEdition(
  editionId: number,
  name: string,
  roles: Role[]
) {
  const rolesId = roles.map((r) => r.id);

  return queryUpdateEdition(apiUrl, editionId, name, rolesId);
}

export async function deleteEdition(editionId: number) {
  return queryDeleteEdition(apiUrl, editionId);
}
