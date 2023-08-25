export async function getUserHasStoryTellerRights(
  apiUrl: string,
  accessToken: string
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/Auth`, {
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
  });

  return response.ok;
}
