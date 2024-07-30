import Head from "next/head";
import { db } from "@/db/db";
import { accessProctorMap, account, proctorID, role, test_access, tests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Navbar from "@/components/Navbar";
import styles from '@/styles/Proctoring.module.css'
import { Button, Table } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { Download } from "react-feather";

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
                let test_takers = await db.select().from(accessProctorMap).where(eq(accessProctorMap.test_id, parseInt(test_id)))
                // @ts-ignore
                let test_mapping = []
                await Promise.all(test_takers.map(async (test_taker) => {
                    let testInfo = await db.select().from(test_access).where(eq(test_access.id, test_taker.participant_id))
                    if (testInfo.length != 0) {
                        test_mapping.push(testInfo[0])
                    }
                }))
                if (test_mapping.length > 0) {
                    return {
                        // Ternary operator for that determination
                        props: {sessionStatus: true, account: account_info[0], role: permission,
                            testInformation: testInformation,
                            // @ts-ignore
                            test_id:parseInt(test_id), test_takers: test_mapping}
                    }
                }
                return {
                    // Ternary operator for that determination
                    props: {sessionStatus: true, account: account_info[0], role: permission,
                        testInformation: testInformation,
                        // @ts-ignore
                        test_id:parseInt(test_id)}
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
    // // @ts-ignore
    // if (props.testInformation[0].enable_proctoring == false || props.testInformation[0].test_status != 'active') {
    //     return (
    //         <div style={{
    //             display: 'flex',
    //             justifyContent: 'center',
    //             flexDirection: 'column',
    //             alignItems: 'center',
    //             height: '100vh',
    //             gap: 10
    //         }}>
    //             <Image src={'/logo.png'} alt="Logo" width={75} height={75} />
    //             <h3>Proctoring is either disabled or not currently available for this test.</h3>
    //             <Button component={Link} href={'/dashboard'}>Return to Dashboard</Button>
    //         </div>
    //     )
    // }

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
            <main className={styles.content}>
                <h1>Test Information</h1>
                <h2>Test-takers registered to you</h2>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Testtaker Name</Table.Th>
                            <Table.Th>Testtaker ID</Table.Th>
                            <Table.Th>Access Card</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {/* @ts-ignore */}
                        {props.test_takers.map((test_taker, id) => {
                            return (
                                <Table.Tr key={id}>
                                    <Table.Td>{test_taker.participant_name}</Table.Td>
                                    <Table.Td>{test_taker.username}</Table.Td>
                                    <Table.Td className={styles.download}>
                                        <a href={`/api/access_card?name=${test_taker.participant_name}&username=${test_taker.username}&password=${test_taker.password}`} className={styles.downloadInformation}>
                                            <Download color='black' />
                                        </a>
                                    </Table.Td>
                                </Table.Tr>
                            )
                        })}
                    </Table.Tbody>
                </Table>
            </main>
        </>
    )
}