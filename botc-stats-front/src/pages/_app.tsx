import Layout from "@/components/layout/Layout";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <SessionProvider>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider defaultTheme="dark">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
