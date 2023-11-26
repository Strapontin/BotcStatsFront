import { Role } from "@/entities/Role";
import useSWR from "swr";
import useApi, { Api } from "./useApi";

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export function useGetRoles() {
  const { apiUrl, isLoadingApi } = useApi();
  const { data, error, isLoading } = useSWR(
    !isLoadingApi ? `${apiUrl}/Roles` : null,
    fetcher
  );

  return { data, error, isLoading: isLoading || isLoadingApi };
}

export function useGetRoleById(roleId: number) {
  const { apiUrl, isLoadingApi } = useApi();

  const { data, error, isLoading } = useSWR(
    !isLoadingApi && !isNaN(roleId) ? `${apiUrl}/Roles/${roleId}` : null,
    fetcher
  );

  return { data, error, isLoading: isLoading || isLoadingApi || isNaN(roleId) };
}

export async function createNewRole(
  role: Role,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Roles`, {
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
      roleName: role.name,
      characterType: role.characterType,
      alignment: role.alignment,
    }),
  });

  console.log("createPlayer");

  if (!response.ok) {
    console.log("ERROR :", await response.text());
    return false;
  }

  return true;
}

export async function updateRole(
  role: Role,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Roles`, {
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
      roleId: role.id,
      roleName: role.name,
      characterType: role.characterType,
      alignment: role.alignment,
    }),
  });

  console.log("updateRole");

  if (!response.ok) {
    console.log("ERROR :", await response.text());
    return false;
  }

  return true;
}

export async function deleteRole(
  roleId: number,
  { apiUrl, accessToken }: Api
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Roles/${roleId}`, {
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

  console.log("deleteRole");

  if (!response.ok) {
    console.log("ERROR :", await response.text());
    return false;
  }

  return true;
}
