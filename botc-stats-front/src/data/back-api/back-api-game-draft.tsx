import useSWR from "swr";
import useApi, { Api } from "./useApi";
import { GameDraft } from "@/entities/GameDraft";

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export function useGetGamesDraft() {
  const { apiUrl, isLoadingApi } = useApi();
  const { data, error, isLoading } = useSWR(
    !isLoadingApi ? `${apiUrl}/GamesDraft` : null,
    fetcher
  );

  return { data, error, isLoading: isLoading || isLoadingApi };
}

export function useGetGameDraftById(gameDraftId: number) {
  const { apiUrl, isLoadingApi } = useApi();

  const { data, error, isLoading } = useSWR(
    !isLoadingApi && !isNaN(gameDraftId) ? `${apiUrl}/GamesDraft/${gameDraftId}` : null,
    fetcher
  );

  return { data, error, isLoading: isLoading || isLoadingApi || isNaN(gameDraftId) };
}

// export function useGetGamesDraftByStorytellerId(storytellerId: number): {
//   data?: GameDraft[];
//   isLoading: boolean;
// } {
//   const { apiUrl, isLoadingApi } = useApi();

//   const { data, isLoading } = useSWR(
//     !isLoadingApi && !isNaN(storytellerId)
//       ? `${apiUrl}/GamesDraft/ByStorytellerId/${storytellerId}`
//       : null,
//     fetcher
//   );

//   return {
//     data: data?.status === 404 ? null : data,
//     isLoading: isLoading || isLoadingApi || isNaN(storytellerId),
//   };
// }

export async function createNewGameDraft(
  gameDraft: GameDraft,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/GamesDraft`, {
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
      editionId: gameDraft.edition.id,
      storytellerId: gameDraft.storyteller.id,
      datePlayed: gameDraft.datePlayed,
      notes: gameDraft.notes,
    }),
  });

  console.log("createNewGameDraft");

  if (!response.ok) {
    const error = response.text();
    console.log("ERROR :", await error);
    throw await error;
  }

  return true;
}

export async function updateGameDraft(
  gameDraft: GameDraft,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/GamesDraft`, {
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
      gameDraftId: gameDraft.id,
      editionId: gameDraft?.edition?.id,
      storytellerId: gameDraft?.storyteller?.id,
      datePlayed: gameDraft.datePlayed,
      notes: gameDraft.notes,
    }),
  });

  console.log("updateGameDraft");

  if (!response.ok) {
    const error = response.text();
    console.log("ERROR :", await error);
    throw await error;
  }

  return true;
}

export async function deleteGameDraft(
  gameDraftId: number,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/GamesDraft/${gameDraftId}`, {
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

  console.log("deleteGameDraft");

  if (!response.ok) {
    console.log("ERROR :", await response.text());
    return false;
  }

  return true;
}
