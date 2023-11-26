import { useUserHasStoryTellerRights } from "@/data/back-api/back-api-auth";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({
  isConnected: false,
  isStoryTeller: false,
  isLoading: true,
});

export const AuthContextProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState({
    isConnected: false,
    isStoryTeller: false,
    isLoading: true,
  });
  const userData = useUserHasStoryTellerRights();

  useEffect(() => {
    setUser({
      isStoryTeller: userData.data,
      isLoading: userData.isLoading,
      isConnected: userData.isConnected,
    });
  }, [userData.data, userData.isLoading, userData.isConnected]);

  // useEffect(() => {
  //   async function getUserData() {
  //     if (!sessionReact.data || user.accessToken) return;

  //     const accessToken = sessionReact.data.accessToken;

  //     const response = await getUserHasStoryTellerRights(accessToken);

  //     const s: any = {
  //       isStoryTeller: response,
  //       accessToken,
  //     };
  //     setUser(s);
  //   }
  //   if (!user.accessToken && sessionReact.data) {
  //     getUserData();
  //   }
  // }, [sessionReact.data, user]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export default AuthContext;
