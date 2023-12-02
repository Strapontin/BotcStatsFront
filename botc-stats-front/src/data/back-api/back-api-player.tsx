import { Player } from "@/entities/Player";
import useSWR from "swr";
import useApi, { Api } from "./useApi";

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export function useGetPlayers() {
  const { apiUrl } = useApi();
  const { data, error, isLoading } = useSWR(`${apiUrl}/Players`, fetcher);

  return { data, error, isLoading };
}

export function useGetPlayerById(playerId: number) {
  const { apiUrl } = useApi();

  const { data, error, isLoading } = useSWR(
    playerId && !isNaN(playerId) ? `${apiUrl}/Players/${playerId}` : null,
    fetcher
  );

  return { data, error, isLoading };
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
    console.log("ERROR :", await response.text());
    return false;
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
    console.log("ERROR :", await response.text());
    return false;
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
