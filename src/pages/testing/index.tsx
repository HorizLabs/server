import Head from "next/head";
import { InferGetServerSidePropsType } from "next";
import styles from '@/styles/testing/Testing.module.css'
import { experimental } from "@/lib/experimental";
import Image from "next/image";
import { db } from "@/db/db";
import { testSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button, PasswordInput, TextInput } from "@mantine/core";

export const getServerSideProps = (async (args: any) => {  
    let feature_enabled = await db.select().from(testSettings).where(eq(testSettings.use_web_platform, true))
    return {
        props: {
            experimental: experimental,
            featureEnabled: feature_enabled
        }
    }
})

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // @ts-ignore
    if (props.experimental == false || props.featureEnabled.length == 0) {
        return (
            <div style={{height: '100vh',display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                
            }}>
                <Image src={'/logo.png'} width={100} height={100} alt="Logo" />
                <h1>Not activated.</h1>
                <p>This feature is not activated as it is experimental and no tests are using the feature.</p>
            </div>
        )
    }

    return(
        <>
            <Head>
                <title>Horizon Testing</title>
                <meta name="description" content="Introducing Horizon." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <h2>Hello, {account_info.name}!</h2>
            <h3>Email: {account_info.email}</h3>
            <h3>User ID: {account_info.id}</h3>
            <h3>User role: {account_info.role}</h3> */}
            <main className={styles.content}>
                <div className={styles.logInContainer}>
                    <div className={styles.logoWidth}>
                        <Image src={'/logo.png'} width={100} height={100} alt="Logo" />
                        <h2 style={{width: '50%', fontSize: '125%'}}>Horizon Testing Platform</h2>
                    </div>
                    <form style={{width: '90%', margin: 'auto', gap: 10, display: 'flex', flexDirection: 'column'}}>
                        <TextInput label="User ID" placeholder="User-ID" required/>
                        <PasswordInput label="Password" placeholder="Password" required/>
                        <Button>Log In</Button>
                    </form>
                </div>
            </main>
        </>
    )
}