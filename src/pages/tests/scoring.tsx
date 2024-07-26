import Head from "next/head";
import { db } from "@/db/db";
import { account, questionSubmission, tests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Navbar from "@/components/Navbar";
import styles from '@/styles/Tests/Scoring.module.css'
import { ArrowLeft, BarChart2, FilePlus, FileText, Key, Lock, Paperclip, Settings } from "react-feather";
import { Button,Loader,Modal, TextInput } from "@mantine/core";

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
            // Get test info
            const testInfo = await db.select().from(tests)
            if (args.query.test != undefined) {
                let testInfo = await db.select().from(tests).where(eq(tests.id, parseInt(args.query.test)))
                let scoring_scores = await db.select().from(questionSubmission)
                return {
                    props: {sessionStatus: true, account: account_info[0], test_info: testInfo, test_id: parseInt(args.query.test), scoring_scores: scoring_scores}
                }
            }
            return {
                props: {sessionStatus: true, account: account_info[0], test_info: testInfo}
            }
        }
    } catch {
        // Catch and attempt to logout 
        return {
            props: {sessionStatus: false}
        }
    }
})

export default function Tests(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // Submit test creation
    let [buttonCreateStatus, setButtonCreateStatus] = useState<boolean>(false)
    let [errorInfo, setErrorInfo] = useState<String>("")
    // @ts-ignore
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
    // Diverge based on test ID
    if (props.test_id != undefined && props.test_info[0] != undefined) {
        // const [submission, setSubmission] = useState(props.scoring_scores)
        let id = props.test_id
        let test_info = props.test_info[0]
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
                    <nav className={styles.testmore_header}>
                        <div className={styles.testmore_header_header}>
                            <p>{test_info.name}</p>
                        </div>
                        <div className={styles.testmore_header_actions}>
                            <Button color='black' component="a" href={`/tests?test=${id}`}><span><ArrowLeft /> Back</span></Button>
                        </div>
                    </nav>
                    <div className={styles.testDescription}>
                        <h1>{test_info.name}</h1>
                        <h2>{test_info.description}</h2>
                        <div className={styles.testDescription_dates}>
                            {/* @ts-ignore */}
                            <p>Starts on {new Date(parseInt(test_info.starts_on)).toLocaleDateString()} at {new Date(parseInt(test_info.starts_on)).toLocaleTimeString()}</p>
                            {/* @ts-ignore */}
                            <p>Ends on {new Date(parseInt(test_info.ends_on)).toLocaleDateString()} at {new Date(parseInt(test_info.ends_on)).toLocaleTimeString()}</p>
                        </div>
                        <h2>Scoring</h2>
                    </div>                 
                </main>
            </>
        )
    }
    // Normal test list
    return(
        <>
            <Head>
                <title>Horizon Labs</title>
                <meta name="description" content="Introducing Horizon." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <meta httpEquiv="refresh" content="0;url=/tests" />
            </Head>
        </>
    )
}