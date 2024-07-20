import Head from "next/head";
import { db } from "@/db/db";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Navbar from "@/components/Navbar";
import styles from '@/styles/Dashboard.module.css'

export const getServerSideProps = (async (args: any) => {  
    // Check to ensure that there is a cookie when the page is loaded.
    if (typeof args.req.cookies['token'] == 'undefined') {
        return {
          props: {accountLoginStatus: true}
        }
      }    
    let cookie = args.req.cookies['token']
    // Get account information to determine if there is an owner account.
    if (!cookie) {
        return {
            // Ternary operator for that determination
            props: {sessionStatus: false}
        }
    } else {
        // @ts-ignore
        let token_info = await (await jwt.jwtVerify(cookie, crypto.createSecretKey(process.env.JWT_SECRET, 'utf-8')));
        let email = token_info.payload?.email;
        // @ts-ignore
        let account_info = await db.select().from(account).where(eq(account.email, email))
        if (account_info.length == 0) {
            return {
                // Ternary operator for that determination
                props: {sessionStatus: false}
            }
        }
        return {
            // Ternary operator for that determination
            props: {sessionStatus: true, account: account_info[0]}
        }
    }
})

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // Set account info
    useEffect(() => {
        if (!props.sessionStatus)  {
            window.location.href = '/'
        }
    })
    if (props.accountLoginStatus) {
        return (
            <Head>
                <meta httpEquiv="refresh" content="0;url=/" />
            </Head>
        )    
    }

    let account_info = props.account
    console.log(account_info)
    return(
        <>
            <Head>
                <title>Horizon Labs</title>
                <meta name="description" content="Introducing Horizon." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <h2>Hello, {account_info.name}!</h2>
            <h3>Email: {account_info.email}</h3>
            <h3>User ID: {account_info.id}</h3>
            <h3>User role: {account_info.role}</h3> */}
            <Navbar />
            <main className={styles.content}>
                <h1>My dashboard</h1>

            </main>
        </>
    )
}