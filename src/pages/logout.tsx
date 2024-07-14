import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styles from "@/styles/Logout.module.css";
import { Loader } from "@mantine/core";

export const getServerSideProps = (async (args: any) => {
    // terminate cookie
    args.res.setHeader('Set-Cookie', 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;')
    return {
        props: {
            'status': 'loggedOut'
        }
    }
})

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    if (props.status == 'loggedOut') {
        return (
            <>
                <Head>
                    <title>Horizon Labs</title>
                    <meta httpEquiv="refresh" content="0; url=/" />
                </Head>
                <div className={styles.logout}>
                    <h1>Logging out.</h1>
                    <Loader color="blue"/>
                </div>
            </>
        )
    }
    return (
        <>
            <Head>
                <title>Horizon Labs</title>
                <meta httpEquiv="refresh" content="0; url=/" />
            </Head>
            <div className={styles.logout}>
                <h1>Logging out.</h1>
                <Loader color="blue"/>
            </div>
        </>
    )
}