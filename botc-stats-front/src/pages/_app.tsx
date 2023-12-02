import Layout from "@/components/layout/Layout";
import { AuthContextProvider } from "@/stores/authContext";
import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <AuthContextProvider>
        <NextUIProvider>
          <NextThemesProvider defaultTheme="dark">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NextThemesProvider>
        </NextUIProvider>
      </AuthContextProvider>
    </SessionProvider>
  );
}
