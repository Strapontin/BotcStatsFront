import { useSession } from "next-auth/react";

export type Api = { apiUrl?: string; accessToken?: string; isLoadingApi: boolean };

export default function useApi(): Api {
  const session: any = useSession();

  if (session.status === "loading") return { isLoadingApi: true };

  const accessToken = session.data?.accessToken;
  const apiUrl = session.data?.BACKEND_URL;

  return { accessToken, apiUrl, isLoadingApi: false };
}
