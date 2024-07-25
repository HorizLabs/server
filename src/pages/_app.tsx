import '@mantine/core/styles.css';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
  return <MantineProvider>
    <Notifications />
    <Component {...pageProps} />
  </MantineProvider>;
}
