import Head from "next/head";
import { db } from "@/db/db";
import { account, question_bank, tests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Navbar from "@/components/Navbar";
import styles from '@/styles/tests/QuestionBank.module.css'
import { ArrowLeft, BarChart2, FilePlus, FileText, Key, Lock, Paperclip } from "react-feather";
import { Button,Loader,Modal, Table, TextInput } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

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
            // Get test info
            const testInfo = await db.select().from(tests)

            if (args.query.test != undefined) {
                let testInfo = await db.select().from(tests).where(eq(tests.id, parseInt(args.query.test)))
                let questionBank = await db.select().from(question_bank).where(eq(question_bank.test_id, parseInt(args.query.test)))
                return {
                    props: {sessionStatus: true, account: account_info[0], test_info: testInfo, test_id: parseInt(args.query.test), questionBank: questionBank}
                }
            }
            return {
                props: {sessionStatus: true, account: account_info[0], test_info: testInfo}
            }
        }
    } catch (e) {
        console.log(e)
        // Catch and attempt to logout 
        return {
            props: {sessionStatus: false}
        }
    }
})

export default function QBank(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // Create test Modal
    const [opened, {open, close}] = useDisclosure(false);
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
    if (props.test_id != undefined && props.test_info[props.test_id-1] != undefined) {
        let id = props.test_id
        let questionBank = props.questionBank
        let test_info = props.test_info[props.test_id-1]
        console.log(questionBank)
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
                            <p>{test_info.name} | Question Bank</p>
                        </div>
                        <div className={styles.testmore_header_actions}>
                           
                            <Button component="a" href={`/tests?test=${id}`}><span><ArrowLeft /> Back</span></Button>
                        </div>
                    </nav>
                    <div className={styles.testDescription}>
                        <h1 className={styles.big_head}>{test_info.name}</h1>
                        <div className={styles.testDescription_dates}>
                            {/* @ts-ignore */}
                            <p>Starts on {new Date(parseInt(test_info.starts_on)).toLocaleDateString()} at {new Date(parseInt(test_info.starts_on)).toLocaleTimeString()}</p>
                            {/* @ts-ignore */}
                            <p>Ends on {new Date(parseInt(test_info.ends_on)).toLocaleDateString()} at {new Date(parseInt(test_info.ends_on)).toLocaleTimeString()}</p>
                        </div>
                        <h1>Question Bank</h1>  
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Question ID</Table.Th>
                                    <Table.Th>Question</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                               {questionBank.map((question: any, id: any) => {
                                    return (
                                        <Table.Tr key={id}>
                                            <Table.Td>{question.id}</Table.Td>
                                            <Table.Td>{question.question}</Table.Td>
                                        </Table.Tr>
                                    )
                                })}                    
                            </Table.Tbody>
                        </Table>
                    </div>
                </main>
            </>
        )
    }
    // Normal redirect
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