import { signOut, useSession } from "next-auth/react";

export type Api = {
  apiUrl?: string;
  accessToken?: string;
  isLoadingApi: boolean;
};

export default function useApi(): Api {
  const session: any = useSession();

  if (session.status === "loading") return { isLoadingApi: true };
  if (session?.data?.error === "RefreshAccessTokenError")
    signOut({ redirect: false });

  const accessToken = session.data?.accessToken;

  // If the session is expired, auto-signout
  if (new Date(session.expires).getTime() < Date.now()) {
    signOut({ redirect: false });
  }

  return {
    accessToken,
    apiUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    isLoadingApi: session.status === "loading",
  };
}
