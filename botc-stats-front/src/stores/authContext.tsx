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
      isConnected: userData.isConnected,
      isStoryTeller: userData.data,
      isLoading: userData.isLoading,
    });
  }, [userData.data, userData.isLoading, userData.isConnected]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export default AuthContext;
