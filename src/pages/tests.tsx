import Head from "next/head";
import { db } from "@/db/db";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Navbar from "@/components/Navbar";
import styles from '@/styles/Tests.module.css'
import { FilePlus, Paperclip } from "react-feather";
import { Button } from "@mantine/core";

export const getServerSideProps = (async (args: any) => {  
    try {
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
            // Time to provide supplementary information
            if (account_info[0].role == 'owner') {
                // Provide recommendations and recommended actions
                let recommended_actions = []
                if ((await db.select().from(account)).length == 1) {
                    recommended_actions.push({
                        action: 'Add users',
                        description: 'Add users to the platform to be able to help manage and create tests.',
                        link: '/users',
                        icon: 'Users',
                        color_gradient: 'linear-gradient(43deg, rgba(2,0,36,1) 0%, rgba(61,93,168,1) 26%, rgba(112,139,215,1) 48%, rgba(132,92,229,1) 72%, rgba(79,0,255,1) 100%)'
                    })
                }
                
                // Limit to 5 actions
                if (recommended_actions.length > 5) {
                    recommended_actions = recommended_actions.slice(0,5)
                }
                return {
                    // Ternary operator for that determination
                    props: {sessionStatus: true, account: account_info[0], recommended_actions: recommended_actions}
                }
            }
            
            return {
                // Ternary operator for that determination
                props: {sessionStatus: true, account: account_info[0]}
            }
        }
    } catch {
        // Catch and attempt to logout 
        return {
            props: {sessionStatus: false}
        }
    }
})

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // Set account info
    useEffect(() => {
        if (!props.sessionStatus)  {
            window.location.href = '/logout'
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
                <div className={styles.header}>
                    <h1><Paperclip /> Tests</h1>
                    <hr />
                </div>
                <div className={styles.testContainer}>
                    <div className={styles.createTest}>
                        {(account_info?.role == 'owner' || account_info?.role == 'admin') ? (<Button className={styles.createButton}><span className={styles.textContent}><FilePlus />  Create a test</span></Button>) : null}
                    </div>
                    <div className={styles.tests}>
                        {/* Do this later */}
                    </div>
                </div>
            </main>
        </>
    )
}