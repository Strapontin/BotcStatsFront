import Layout from "@/components/layout/Layout";
import { AuthContextProvider } from "@/stores/authContext";
import "@/styles/globals.scss";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  // const { isBrowser } = useSSR();

  // const darkTheme = createTheme({
  //   type: "dark",
  //   theme: {},
  // });

  return (
    <SessionProvider>
      <AuthContextProvider>
        <NextThemesProvider
          defaultTheme="dark"
          attribute="class"
          value={
            {
              // dark: darkTheme.className,
            }
          }
        >
          <NextUIProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NextUIProvider>
        </NextThemesProvider>
      </AuthContextProvider>
    </SessionProvider>
  );
}
