import useSWR from "swr";
import useApi from "./useApi";

export function useGetUpdateHistory() {
  const { apiUrl, isLoadingApi, accessToken } = useApi();

  const fetcher = (url: string) =>
    fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    }).then((d) => d.json());

  const { data, error, isLoading } = useSWR(
    !isLoadingApi ? `${apiUrl}/UpdateHistory` : null,
    fetcher
  );

  return { data, error, isLoading: isLoading || isLoadingApi };
}
