import { CharacterType } from "@/entities/enums/characterType";
import useSWR from "swr";
import useApi from "./back-api/useApi";

export type WikiType = {
  name: string;
  originalName: string;
  characterType: CharacterType;
};

function getRolesWiki(
  roles: { name: string; originalName: string }[],
  characterType: CharacterType
): WikiType[] {
  const result: WikiType[] = [...Object.values(roles)].map((role: any) => {
    const res: WikiType = {
      name: role.name,
      originalName: role.originalName,
      characterType,
    };
    return res;
  });

  return result;
}

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export function useGetWikiTbaRoles(): {
  data?: WikiType[];
  isLoading: boolean;
} {
  const url = "https://brain-academy.github.io/botc-wiki/api/roles.json";

  const { data, isLoading } = useSWR(url, fetcher);

  if (data) {
    const result = [
      ...getRolesWiki(data.VILLAGEOIS, CharacterType.Townsfolk),
      ...getRolesWiki(data.ETRANGER, CharacterType.Outsider),
      ...getRolesWiki(data.SBIRE, CharacterType.Minion),
      ...getRolesWiki(data.DEMON, CharacterType.Demon),
      ...getRolesWiki(data.VOYAGEUR, CharacterType.Traveller),
    ];

    return { data: result, isLoading };
  }

  return { isLoading };
}

export function useGetOfficialNightSheet(): {
  data: { firstNight: string[]; otherNight: string[] };
  isLoading: boolean;
} {
  const { apiUrl, isLoadingApi } = useApi();

  const { data, isLoading } = useSWR(
    !isLoadingApi ? `${apiUrl}/NightSheet` : null,
    fetcher
  );

  return { data, isLoading: isLoading || isLoadingApi };
}
