import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({
  accessToken: null,
  isStoryTeller: false,
});

export const AuthContextProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState({
    accessToken: null,
    isStoryTeller: false,
  });
  const session: any = useSession();

  useEffect(() => {
    async function getUserData() {
      if (!session.data) return;
      const tbaServerId = "765137571608920074";
      const storyTellerRoleId = "797739056406069279";

      const accessToken = session.data.accessToken;

      const response = await fetch(
        `https://discord.com/api/users/@me/guilds/${tbaServerId}/member`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const res = await response.json();
      const s: any = {
        isStoryTeller: res.roles?.includes(storyTellerRoleId),
        accessToken,
      };
      setUser(s);
    }
    getUserData();
  }, [session.data]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export default AuthContext;
