import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export type Api = {
  apiUrl?: string;
  accessToken?: string;
  isLoadingApi: boolean;
};

export default function useApi(): Api {
  const session: any = useSession();

  if (session.status === "loading") return { isLoadingApi: true };

  const accessToken = session.data?.accessToken;

  return {
    accessToken,
    apiUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    isLoadingApi: session.status === "loading",
  };
}
