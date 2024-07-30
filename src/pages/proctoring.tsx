import Head from "next/head";
import { db } from "@/db/db";
import { account, proctorID, role, tests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Navbar from "@/components/Navbar";
import styles from '@/styles/Dashboard.module.css'
import Link from "next/link";
import { Badge, Button, Card, Group, Text } from "@mantine/core";

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
            // Time to provide supplementary information
            let test_id = args.query.test_id           
            // @ts-ignore
            let permissions = await db.select().from(role).where(eq(role.name, account_info[0].role))
            if (permissions.length != 0) {
                let permission = permissions[0]
                let proctoring_tests = await db.select().from(proctorID).where(eq(proctorID.proctor_id, account_info[0].id))
                let testInformation = await db.select().from(tests).where(eq(tests.id, proctoring_tests[0].test_id))
                let testCheck = await db.select().from(tests).where(eq(tests.id, parseInt(test_id)))
                if (testCheck.length != 0 && proctoring_tests[0].test_id == parseInt(test_id)) {
                    testInformation = testCheck
                } else {
                    testInformation = []
                }

                return {
                    // Ternary operator for that determination
                    props: {sessionStatus: true, account: account_info[0], role: permission, testInformation: testInformation,test_id:parseInt(test_id)}
                }
            }
            return {
                // Ternary operator for that determination
                props: {sessionStatus: true, account: account_info[0], role: permissions}
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
    // @ts-ignore
    if (props.testInformation.length == 0) {
        return (
            <Head>
                <meta httpEquiv="refresh" content="0;url=/dashboard" />
            </Head>
        )
    }
    let account_info = props.account
    // @ts-ignore
    let proctoringRoleDetermination = (props.role).proctorTests
    // Continue with flow
    return(
        <>
            <Head>
                <title>Horizon Labs</title>
                <meta name="description" content="Introducing Horizon." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />
        </>
    )
}