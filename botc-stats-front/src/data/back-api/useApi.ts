import { useSession } from "next-auth/react";

export type Api = { apiUrl: string; accessToken: string };

export default function useApi() {
  const session: any = useSession();
  const accessToken = session.data?.accessToken;
  const apiUrl = session.data?.BACKEND_URL;

  return { accessToken, apiUrl };
}
