import '@mantine/core/styles.css';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 770) {
        return (
            <>
                <Head>
                    <title>Horizon Labs</title>
                    <meta name="description" content="Introducing Horizon." />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className='mobile'>
                  <div className='mobile-header'>
                    <img src='/logo.png' width={50} height={50} alt='Horizon Labs' />
                    <h1>Horizon Labs</h1>
                  </div>
                  <h1>Error.</h1>
                  <p>The platform is not supported on mobile devices.</p>
                </div>
            </>
        )
    }
  }

  return <MantineProvider>
    <Notifications />
    <Component {...pageProps} />
  </MantineProvider>;
}
