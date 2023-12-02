import { Role } from "@/entities/Role";
import useSWR from "swr";
import useApi, { Api } from "./useApi";

const fetcher = (url: string) => fetch(url).then((d) => d.json());

export function useGetRoles() {
  const { apiUrl } = useApi();
  const { data, error, isLoading } = useSWR(`${apiUrl}/Roles`, fetcher);

  return { data, error, isLoading };
}

export function useGetRoleById(roleId: number) {
  const { apiUrl } = useApi();

  const { data, error, isLoading } = useSWR(
    roleId && !isNaN(roleId) ? `${apiUrl}/Roles/${roleId}` : null,
    fetcher
  );

  return { data, error, isLoading };
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
    const error = response.text();
    console.log("ERROR :", await error);
    throw await error;
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
    const error = response.text();
    console.log("ERROR :", await error);
    throw await error;
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
