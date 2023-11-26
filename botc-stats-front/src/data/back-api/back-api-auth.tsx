import useSWR from "swr";
import useApi from "./useApi";

export function useUserHasStoryTellerRights(): {
  data: boolean;
  error: string;
  isLoading: boolean;
  isConnected: boolean;
} {
  const { accessToken, apiUrl, isLoadingApi } = useApi();

  const { data, error, isLoading } = useSWR(
    accessToken && !isLoadingApi ? `${apiUrl}/Auth` : null,
    (args) =>
      fetch(args, {
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
      }).then((res) => res.json())
  );

  return {
    data,
    error,
    isLoading: isLoading || isLoadingApi,
    isConnected: accessToken ? true : false,
  };
}
