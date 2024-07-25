// Styles
import styles from '@/styles/tests/Settings.module.css'

// Other imports
import Head from "next/head";
import { db } from "@/db/db";
import { account, tests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FormEvent, useEffect, useState } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Navbar from "@/components/Navbar";
import { ArrowLeft, FilePlus } from "react-feather";
import { Button,Loader,Modal, NativeSelect, NumberInput, PillsInput, Switch, Table, Textarea, TextInput } from "@mantine/core";
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
                // Get further test info and send it off
                let testInfo = await db.select().from(tests).where(eq(tests.id, parseInt(args.query.test)))
                return {
                    props: {sessionStatus: true, account: account_info[0], test_info: testInfo, test_id: parseInt(args.query.test)}
                }
            }
            return {
                props: {sessionStatus: true, account: account_info[0], test_info: testInfo}
            }
        }
    } catch (e) {
        // Catch and attempt to logout 
        return {
            props: {sessionStatus: false}
        }
    }
})

export default function QBank(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
    // @ts-ignore
    if (props.test_id != undefined && props.test_info[props.test_id-1] != undefined && account_info.role == 'owner' || account_info.role == 'admin') {
        // Button status
        const [buttonCreateStatus, setButtonCreateStatus] = useState(false)
        let id = props.test_id
        // @ts-ignore
        let test_info = props.test_info[props.test_id-1]
        // Create test Modal
        const [opened, {open, close}] = useDisclosure(false);
        const editTest = async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            setButtonCreateStatus(true)
        }
        console.log(new Date(parseInt(test_info.starts_on)).toDateString())
        return (
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
                {/* Modal */}
                <Modal opened={opened} onClose={close} title="Wizard" size={'md'} centered>
                    <Modal.Body>
                        <h2>Welcome to the Test Wizard</h2>
                        <p>Use the wizard to edit the test with ease.</p>
                        <form onSubmit={editTest} className={styles.editTest}>
                            <br />
                            <TextInput type="text" name="name" placeholder="Name" defaultValue={test_info.name} required/>
                            <TextInput type="text" name="description" defaultValue={test_info.description} placeholder="Description" required/>
                            <div className={styles.row_head}>
                                <label htmlFor="start_date">Start Date</label>
                                <TextInput type="date" defaultValue={'2024-07-25'} name="start_date" required/>
                            </div>
                            <div className={styles.row_head}>
                                <label htmlFor="start_time">Start Time</label>
                                <TextInput type="time" name="start_time" required/>
                            </div>
                            <div className={styles.row_head}>
                                <label htmlFor="end_date">End Date</label>
                                <TextInput type="date" name="end_date" required/>
                            </div>
                            <div className={styles.row_head}>
                                <label htmlFor="end_time">End Time</label>
                                <TextInput type="time" name="end_time" required/>
                            </div>
                            {buttonCreateStatus ? <Button><Loader style={{transform: 'scale(0.6)'}} color="white" /></Button> : <Button type="submit">Create</Button>}
                        </form>
                    </Modal.Body>
                </Modal>
                {/* Rest content */}
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
                        <div>
                            <h1>Settings</h1>
                            <p>Customize the test with these settings.</p>
                        </div>
                        <h2>General</h2>
                        <div className={styles.testContainer}>
                            <div className={styles.testSettings}>
                                <Switch onChange={(core: any) => {
                                    console.log(core.target.checked)
                                }}  label="Allow retakes" />
                            </div>
                            <Button onClick={open}>Open Test Wizard</Button>
                        </div>
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