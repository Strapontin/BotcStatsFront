import { Game } from "@/entities/Game";

export async function getAllGames(apiUrl: string) {
  const response = await fetch(`${apiUrl}/Games`);
  const data = await response.json();
  const games: Game[] = [];

  for (const key in data) {
    games.push(data[key]);
  }

  console.log("getAllGames");
  return games;
}

export async function getGameById(apiUrl: string, id: number) {
  if (isNaN(id)) return;

  const response = await fetch(`${apiUrl}/Games/${id}`);
  const game = await response.json();

  console.log("getGameById");
  return game;
}

export async function createNewGame(
  apiUrl: string,
  game: Game
): Promise<boolean> {
  const playersIdRolesId = game.playerRoles.map((pr) => ({
    playerId: pr.player.id,
    roleId: pr.role.id,
  }));

  const demonBluffsId = game.demonBluffs.map((db) => db.id);

  const response = await fetch(`${apiUrl}/Games`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      editionId: game.edition.id,
      storyTellerId: game.storyTeller.id,
      datePlayed: game.datePlayed,
      notes: game.notes,
      winningAlignment: game.winningAlignment,
      playersIdRolesId,
      demonBluffsId,
    }),
  });

  console.log("createNewGame");

  if (!response.ok) {
    console.log(response);
    return false;
  }

  return true;
}

export async function updateGame(apiUrl: string, game: Game): Promise<boolean> {
  const playersIdRolesId = game.playerRoles.map((pr) => ({
    playerId: pr.player.id,
    roleId: pr.role.id,
  }));

  const demonBluffsId = game.demonBluffs.map((db) => db.id);

  const response = await fetch(`${apiUrl}/Games`, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      gameId: game.id,
      editionId: game.edition.id,
      storyTellerId: game.storyTeller.id,
      datePlayed: game.datePlayed,
      notes: game.notes,
      winningAlignment: game.winningAlignment,
      playersIdRolesId,
      demonBluffsId,
    }),
  });

  console.log("updateGame");

  if (!response.ok) {
    console.log(response);
    return false;
  }

  return true;
}

export async function deleteGame(
  apiUrl: string,
  gameId: number
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Games/${gameId}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

  console.log("deleteGame");

  if (!response.ok) {
    console.log(response);
    return false;
  }

  return true;
}
