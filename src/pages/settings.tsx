// General Imports
import styles from '@/styles/Settings.module.css'

// Other Imports
import Head from "next/head";
import { db } from "@/db/db";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Hexagon } from 'react-feather';
import { SettingsSidebar } from '@/components/SettingsSidebar';

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
            let account_info = await db.select({
                id: account.id,
                name: account.name,
                email: account.email,
                role: account.role
            // @ts-ignore
            }).from(account).where(eq(account.email, email))
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
    } catch {
        // Catch and attempt to logout 
        return {
            props: {sessionStatus: false}
        }
    }
})

export default function Settings(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
            <nav className={styles.navbarSettings}>
                <div style={{
                    marginLeft: '1em',
                    marginTop: '0.5em'
                }}>
                    <Image src={'/logo.png'} alt='Logo' width={50} height={50} />
                </div>
                <div style={{
                    marginRight: '1em',
                    marginTop: '0.5em'
                }}>
                    <Link href={'/dashboard'} style={{
                        justifyContent: 'center',
                        display: 'flex',
                        gap: 10
                    }}><ArrowLeft /> Return Home</Link>
                </div>
            </nav>
            <main className={styles.content}>
               <SettingsSidebar />
                <section id='name' className={styles.content_column}>
                    <div className={styles.header}>
                        <h2 style={{display: 'flex', alignItems: 'center', gap: 5}}><Hexagon /> Identity</h2>
                    </div>
                    <div>
                        <p>Name: {account_info?.name}</p>
                    </div>
                </section>
            </main>
        </>
    )
}