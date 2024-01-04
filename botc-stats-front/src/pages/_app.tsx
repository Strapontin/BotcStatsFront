import Layout from "@/components/layout/Layout";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <NextUIProvider>
        <NextThemesProvider defaultTheme="dark">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
