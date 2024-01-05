import { Edition } from "@/entities/Edition";
import useSWR from "swr";
import useApi, { Api } from "./useApi";

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export function useGetEditions() {
  const { apiUrl, isLoadingApi } = useApi();
  const { data, error, isLoading } = useSWR(
    !isLoadingApi ? `${apiUrl}/Editions` : null,
    fetcher
  );

  return { data, error, isLoading: isLoading || isLoadingApi };
}

export function useGetEditionById(editionId: number) {
  const { apiUrl, isLoadingApi } = useApi();
  const url =
    !isLoadingApi && !isNaN(editionId) && editionId > -1
      ? `${apiUrl}/Editions/${editionId}`
      : null;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data,
    error,
    isLoading: isLoading || isLoadingApi || isNaN(editionId),
  };
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
    const error = response.text();
    console.log("ERROR :", await error);
    throw await error;
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
      rolesId: edition.roles.map((r) => r.id),
    }),
  });

  console.log("updateEdition");

  if (!response.ok) {
    const error = response.text();
    console.log("ERROR :", await error);
    throw await error;
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
