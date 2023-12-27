import { Player } from "@/entities/Player";
import useSWR from "swr";
import useApi, { Api } from "./useApi";

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export function useGetPlayers(): {
  data: Player[];
  error: any;
  isLoading: boolean;
} {
  const { apiUrl, isLoadingApi } = useApi();
  const { data, error, isLoading } = useSWR(
    !isLoadingApi ? `${apiUrl}/Players` : null,
    fetcher
  );

  return { data, error, isLoading: isLoading || isLoadingApi };
}

export function useGetPlayerById(playerId: number): {
  data: Player;
  isLoading: boolean;
} {
  const { apiUrl, isLoadingApi } = useApi();

  const { data, isLoading } = useSWR(
    !isLoadingApi && !isNaN(playerId) ? `${apiUrl}/Players/${playerId}` : null,
    fetcher
  );

  return {
    data: data?.status === 404 ? null : data,
    isLoading: isLoading || isLoadingApi || isNaN(playerId),
  };
}

export async function createNewPlayer(
  player: Player,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Players`, {
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
    body: JSON.stringify({ playerName: player.name, pseudo: player.pseudo }),
  });

  console.log("createPlayer");

  if (!response.ok) {
    const error = response.text();
    console.log("ERROR :", await error);
    throw await error;
  }

  return true;
}

export async function updatePlayer(
  player: Player,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Players`, {
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
      playerId: player.id,
      playerName: player.name,
      pseudo: player.pseudo,
    }),
  });

  console.log("updatePlayer");

  if (!response.ok) {
    const error = response.text();
    console.log("ERROR :", await error);
    throw await error;
  }

  return true;
}

export async function deletePlayer(
  playerId: number,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Players/${playerId}`, {
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

  console.log("deletePlayer");

  if (!response.ok) {
    console.log("ERROR :", await response.text());
    return false;
  }

  return true;
}
