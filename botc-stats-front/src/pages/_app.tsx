import Layout from "@/components/layout/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider, createTheme, useSSR } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { AuthContextProvider } from "@/stores/authContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { isBrowser } = useSSR();

  const darkTheme = createTheme({
    type: "dark",
    theme: {},
  });

  return (
    isBrowser && (
      <SessionProvider session={session}>
        <AuthContextProvider>
          <NextThemesProvider
            defaultTheme="system"
            attribute="class"
            value={{
              dark: darkTheme.className,
            }}
          >
            <NextUIProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </NextUIProvider>
          </NextThemesProvider>
        </AuthContextProvider>
      </SessionProvider>
    )
  );
}
