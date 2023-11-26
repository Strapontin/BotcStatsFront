import { Game } from "@/entities/Game";
import useSWR from "swr";
import useApi, { Api } from "./useApi";

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export function useGetGames() {
  const { apiUrl } = useApi();
  const { data, error, isLoading } = useSWR(`${apiUrl}/Games`, fetcher);

  return { data, error, isLoading };
}

export function useGetGameById(gameId: number) {
  const { apiUrl } = useApi();

  const { data, error, isLoading } = useSWR(
    gameId && !isNaN(gameId) ? `${apiUrl}/Games/${gameId}` : null,
    fetcher
  );

  return { data, error, isLoading };
}

export async function createNewGame(
  game: Game,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const playersIdRolesId = game.playerRoles.map((pr) => ({
    playerId: pr.player.id,
    roleId: pr.role.id,
    finalAlignment: pr.finalAlignment,
  }));

  const demonBluffsId = game.demonBluffs.map((db) => db.id);

  const response = await fetch(`${apiUrl}/Games`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
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
    console.log("ERROR :", await response.text());
    return false;
  }

  return true;
}

export async function updateGame(
  game: Game,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const playersIdRolesId = game.playerRoles.map((pr) => ({
    playerId: pr.player.id,
    roleId: pr.role.id,
    finalAlignment: pr.finalAlignment,
  }));

  const demonBluffsId = game.demonBluffs.map((db) => db.id);

  const response = await fetch(`${apiUrl}/Games`, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
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
    console.log("ERROR :", await response.text());
    return false;
  }

  return true;
}

export async function deleteGame(
  gameId: number,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Games/${gameId}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

  console.log("deleteGame");

  if (!response.ok) {
    console.log("ERROR :", await response.text());
    return false;
  }

  return true;
}
