import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import { getUserHasStoryTellerRights } from "../../data/back-api/back-api";

const AuthContext = createContext({
  accessToken: null,
  isStoryTeller: false,
});

export const AuthContextProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState({
    accessToken: null,
    isStoryTeller: false,
  });
  const sessionReact: any = useSession();

  useEffect(() => {
    async function getUserData() {
      if (!sessionReact.data || user.accessToken) return;

      const accessToken = sessionReact.data.accessToken;

      const response = await getUserHasStoryTellerRights(accessToken);

      const s: any = {
        isStoryTeller: response,
        accessToken,
      };
      setUser(s);
    }
    if (!user.accessToken && sessionReact.data) {
      getUserData();
    }
  }, [sessionReact.data, user]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export default AuthContext;
