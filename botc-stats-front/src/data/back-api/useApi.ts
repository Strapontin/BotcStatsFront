import { useSession } from "next-auth/react";

export type Api = { apiUrl: string; accessToken: string };

export default function useApi() {
  const session: any = useSession();
  const accessToken = session.data?.accessToken;
  const apiUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL! ??
    "https://botcstatsback-recette-zdgyxyd7kq-od.a.run.app";

  console.log(
    process.env.NEXT_PUBLIC_TEST,
    process.env.NEXT_PUBLIC_BACKEND_URL == null
  );

  return { accessToken, apiUrl };
}
