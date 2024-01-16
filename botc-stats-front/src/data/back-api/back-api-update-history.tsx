import useSWR from "swr";
import useApi from "./useApi";

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export function useGetUpdateHistory() {
  const { apiUrl, isLoadingApi } = useApi();
  const { data, error, isLoading } = useSWR(
    !isLoadingApi ? `${apiUrl}/UpdateHistory` : null,
    fetcher
  );

  return { data, error, isLoading: isLoading || isLoadingApi };
}
