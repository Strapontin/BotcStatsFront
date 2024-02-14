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

export function useGetGameDraftById(gameDraftId: number): {
  data: GameDraft;
  error: any;
  isLoading: boolean;
} {
  const { apiUrl, isLoadingApi } = useApi();

  const { data, error, isLoading } = useSWR(
    !isLoadingApi && !isNaN(gameDraftId)
      ? `${apiUrl}/GamesDraft/${gameDraftId}`
      : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading: isLoading || isLoadingApi || isNaN(gameDraftId),
  };
}

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

  if (!response.ok) {
    throw await response.text();
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

  if (!response.ok) {
    throw await response.text();
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

  if (!response.ok) {
    throw await response.text();
  }

  return true;
}
