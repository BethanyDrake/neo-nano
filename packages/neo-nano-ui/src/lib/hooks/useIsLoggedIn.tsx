'use client'
import { SessionData } from "@auth0/nextjs-auth0/types";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";

export const AuthContext = createContext<{isLoggedIn: boolean}>({isLoggedIn: false})

export const useIsLoggedIn = () => useContext(AuthContext).isLoggedIn

export const AuthContextProvider = ({
  session,
  children,
}: PropsWithChildren & {session: SessionData | null}) => {
 
  const value = useMemo(() => ({isLoggedIn: !!session}), [session])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}