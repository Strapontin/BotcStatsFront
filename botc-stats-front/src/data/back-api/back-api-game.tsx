import { Game } from "@/entities/Game";
import useSWR from "swr";
import useApi, { Api } from "./useApi";

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export function useGetGames() {
  const { apiUrl, isLoadingApi } = useApi();
  const { data, error, isLoading } = useSWR(
    !isLoadingApi ? `${apiUrl}/Games` : null,
    fetcher
  );

  return { data, error, isLoading: isLoading || isLoadingApi };
}

export function useGetGameById(gameId: number) {
  const { apiUrl, isLoadingApi } = useApi();

  const { data, error, isLoading } = useSWR(
    !isLoadingApi && !isNaN(gameId) ? `${apiUrl}/Games/${gameId}` : null,
    fetcher
  );

  return { data, error, isLoading: isLoading || isLoadingApi || isNaN(gameId) };
}

export function useGetGamesByPlayerId(playerId: number): {
  data?: Game[];
  isLoading: boolean;
} {
  const { apiUrl, isLoadingApi } = useApi();

  const { data, isLoading } = useSWR(
    !isLoadingApi && !isNaN(playerId)
      ? `${apiUrl}/Games/ByPlayerId/${playerId}`
      : null,
    fetcher
  );

  return {
    data: data?.status === 404 ? null : data,
    isLoading: isLoading || isLoadingApi || isNaN(playerId),
  };
}

export function useGetGamesByStorytellerId(storyTellerId: number): {
  data?: Game[];
  isLoading: boolean;
} {
  const { apiUrl, isLoadingApi } = useApi();

  const { data, isLoading } = useSWR(
    !isLoadingApi && !isNaN(storyTellerId)
      ? `${apiUrl}/Games/ByStorytellerId/${storyTellerId}`
      : null,
    fetcher
  );

  return {
    data: data?.status === 404 ? null : data,
    isLoading: isLoading || isLoadingApi || isNaN(storyTellerId),
  };
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
    const error = response.text();
    console.log("ERROR :", await error);
    throw await error;
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
      editionId: game?.edition?.id,
      storyTellerId: game?.storyTeller?.id,
      datePlayed: game.datePlayed,
      notes: game.notes,
      winningAlignment: game.winningAlignment,
      playersIdRolesId,
      demonBluffsId,
    }),
  });

  console.log("updateGame");

  if (!response.ok) {
    const error = response.text();
    console.log("ERROR :", await error);
    throw await error;
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
