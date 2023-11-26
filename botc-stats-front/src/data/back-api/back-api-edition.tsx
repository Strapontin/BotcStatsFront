import { Edition } from "@/entities/Edition";
import useSWR from "swr";
import useApi, { Api } from "./useApi";

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export function useGetEditions() {
  const { apiUrl } = useApi();
  const { data, error, isLoading } = useSWR(`${apiUrl}/Editions`, fetcher);

  return { data, error, isLoading };
}

export function useGetEditionById(editionId: number) {
  const { apiUrl } = useApi();

  const { data, error, isLoading } = useSWR(
    editionId && !isNaN(editionId) ? `${apiUrl}/Editions/${editionId}` : null,
    fetcher
  );

  return { data, error, isLoading };
}

export async function createNewEdition(
  edition: Edition,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Editions`, {
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
      editionName: edition.name,
      rolesId: edition.roles.map((r) => r.id),
    }),
  });

  console.log("createNewEdition");

  if (!response.ok) {
    console.log("ERROR :", await response.text());
    return false;
  }

  return true;
}

export async function updateEdition(
  edition: Edition,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Editions`, {
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
      editionId: edition.id,
      editionName: edition.name,
      rolesId: edition.roles,
    }),
  });

  console.log("updateEdition");

  if (!response.ok) {
    console.log("ERROR :", await response.text());
    return false;
  }

  return true;
}

export async function deleteEdition(
  editionId: number,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Editions/${editionId}`, {
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

  console.log("deleteEdition");

  if (!response.ok) {
    console.log("ERROR :", await response.text());
    return false;
  }

  return true;
}
