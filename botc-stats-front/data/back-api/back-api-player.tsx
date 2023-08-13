import { Player } from "@/entities/Player";

export async function getAllPlayers(apiUrl: string) {
  const response = await fetch(`${apiUrl}/Players`, {
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  const data = await response.json();
  const players: Player[] = [];

  for (const key in data) {
    players.push(data[key]);
  }

  console.log("getAllPlayers");
  return players;
}

export async function getPlayerById(apiUrl: string, playerId: number) {
  if (playerId === undefined || playerId === null || isNaN(playerId)) return;

  const response = await fetch(`${apiUrl}/Players/${playerId}`);
  const player = await response.json();

  console.log("getPlayerById");
  return player;
}

export async function createNewPlayer(
  apiUrl: string,
  player: Player,
  accessToken: string
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
  console.log(response);

  if (!response.ok) {
    const res = await response.json();
    console.log(res.error);
    return false;
  }

  return true;
}

export async function updatePlayer(
  apiUrl: string,
  player: Player
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Players`, {
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
      playerId: player.id,
      playerName: player.name,
      pseudo: player.pseudo,
    }),
  });

  console.log("updatePlayer");

  if (!response.ok) {
    console.log(response);
    return false;
  }

  return true;
}

export async function deletePlayer(
  apiUrl: string,
  playerId: number
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Players/${playerId}`, {
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

  console.log("deletePlayer");

  if (!response.ok) {
    console.log(response);
    return false;
  }

  return true;
}
