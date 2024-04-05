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

export function useGetGamesByRoleId(roleId: number): {
  data?: Game[];
  isLoading: boolean;
} {
  const { apiUrl, isLoadingApi } = useApi();

  const { data, isLoading } = useSWR(
    !isLoadingApi && !isNaN(roleId)
      ? `${apiUrl}/Games/ByRoleId/${roleId}`
      : null,
    fetcher
  );

  return {
    data: data?.status === 404 ? null : data,
    isLoading: isLoading || isLoadingApi || isNaN(roleId),
  };
}

export function useGetGamesByEditionId(editionId: number): {
  data?: Game[];
  isLoading: boolean;
} {
  const { apiUrl, isLoadingApi } = useApi();

  const { data, isLoading } = useSWR(
    !isLoadingApi && !isNaN(editionId)
      ? `${apiUrl}/Games/ByEditionId/${editionId}`
      : null,
    fetcher
  );

  return {
    data: data?.status === 404 ? null : data,
    isLoading: isLoading || isLoadingApi || isNaN(editionId),
  };
}

export function useGetGamesByStorytellerId(storytellerId: number): {
  data?: Game[];
  isLoading: boolean;
} {
  const { apiUrl, isLoadingApi } = useApi();

  const { data, isLoading } = useSWR(
    !isLoadingApi && !isNaN(storytellerId)
      ? `${apiUrl}/Games/ByStorytellerId/${storytellerId}`
      : null,
    fetcher
  );

  return {
    data: data?.status === 404 ? null : data,
    isLoading: isLoading || isLoadingApi || isNaN(storytellerId),
  };
}

export async function createNewGame(
  game: Game,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const playersIdRolesId = game.playerRoles.map((pr) => ({
    playerId: pr?.player?.id,
    roleId: pr?.role?.id,
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
      storytellerId: game.storyteller.id,
      datePlayed: game.datePlayed,
      notes: game.notes,
      winningAlignment: game.winningAlignment,
      playersIdRolesId,
      demonBluffsId,
    }),
  });

  if (!response.ok) {
    throw await response.text();
  }

  return true;
}

export async function updateGame(
  game: Game,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const playersIdRolesId = game.playerRoles.map((pr) => ({
    playerId: pr?.player?.id,
    roleId: pr?.role?.id,
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
      storytellerId: game?.storyteller?.id,
      datePlayed: game.datePlayed,
      notes: game.notes,
      winningAlignment: game.winningAlignment,
      playersIdRolesId,
      demonBluffsId,
    }),
  });

  if (!response.ok) {
    throw await response.text();
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

  if (!response.ok) {
    throw await response.text();
  }

  return true;
}
