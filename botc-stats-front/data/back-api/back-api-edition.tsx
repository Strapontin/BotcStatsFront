import { Edition } from "@/entities/Edition";

export async function getAllEditions(apiUrl: string) {
  const response = await fetch(`${apiUrl}/Editions`);
  const data = await response.json();
  const editions: Edition[] = [];

  for (const key in data) {
    editions.push(data[key]);
  }

  console.log("getAllEditions");
  return editions;
}

export async function getEditionById(apiUrl: string, id: number) {
  if (isNaN(id)) return;

  const response = await fetch(`${apiUrl}/Editions/${id}`);
  const edition = await response.json();

  console.log("getEditionById");
  return edition;
}

export async function createNewEdition(
  apiUrl: string,
  editionName: string,
  rolesId: number[]
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Editions`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({ editionName, rolesId }),
  });

  console.log("createNewEdition");

  if (!response.ok) {
    const res = await response.json();
    console.log(res);
    return false;
  }

  return true;
}

export async function updateEdition(
  apiUrl: string,
  editionId: number,
  editionName: string,
  rolesId: number[]
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Editions`, {
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
      editionId,
      editionName,
      rolesId,
    }),
  });

  console.log("updateEdition");

  if (!response.ok) {
    console.log(response);
    return false;
  }

  return true;
}

export async function deleteEdition(
  apiUrl: string,
  editionId: number
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Editions/${editionId}`, {
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

  console.log("deleteEdition");

  if (!response.ok) {
    console.log(response);
    return false;
  }

  return true;
}
