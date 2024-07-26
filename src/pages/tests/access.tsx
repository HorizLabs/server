// Style
import styles from '@/styles/tests/Access.module.css'

// Imports
import Head from "next/head";
import { db } from "@/db/db";
import { account, question_bank, test_access, tests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Navbar from "@/components/Navbar";
import { Activity, ArrowLeft, Eye, EyeOff } from "react-feather";
import { Button, Loader, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

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
                let accessInfo = await db.select().from(test_access).where(eq(test_access.test_id, parseInt(args.query.test)))
                return {
                    props: {sessionStatus: true, account: account_info[0], test_info: testInfo, test_id: parseInt(args.query.test), access_info: accessInfo}
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

export default function UserAccess(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
        // States
        let [buttonLoading, setButtonLoading] = useState(false)
        let [sError, setError] = useState('')
        // data info and flags
        let id = props.test_id
        let test_info = props.test_info[0]
        const [opened, {open, close}] = useDisclosure(false);
        // @ts-ignore
        const createAccessCredentials = async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            let data = event.target
            let participant_name = data.participant_name?.value
            setButtonLoading(true)
            const res = await fetch('/api/tests/access', {
                'method': 'POST',
                'body': JSON.stringify({
                    'participant_name': participant_name,
                    'test_id': id
                })
            })
            data = await res.json()
            if (data.coreStatus == 'CREATED_CREDENTIALS') {
                window.location.reload()
            } else {
                setButtonLoading(false)
                setError(data.message)
            }
        }
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
                <Modal opened={opened} onClose={close} centered title="Create Credentials">
                    <Modal.Body>
                        <form onSubmit={createAccessCredentials} className={styles.createCredentials}>
                            <h1>Create user credentials</h1>
                            {sError == '' ? null : <p style={{color: 'red'}}>{sError}</p>}
                            <TextInput type='text' name='participant_name' placeholder='name' label="Participant Name" required/>
                            {buttonLoading ? <Button><Loader color='white' style={{transform: 'scale(0.7)'}} /></Button>: <Button type='submit'>Create</Button>}
                        </form>
                    </Modal.Body>
                </Modal>
                <main className={styles.content}>
                    <nav className={styles.testmore_header}>
                        <div className={styles.testmore_header_header}>
                            <p>{test_info.name} | Access</p>
                        </div>
                        <div className={styles.testmore_header_actions}>
                            <Button component="a" color='black' href={`/tests/scoring?test=${id}`}><span><Activity /> Grading & Analytics</span></Button>
                            <Button component="a" color='black' href={`/tests?test=${id}`}><span><ArrowLeft /> Back</span></Button>
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
                        <Button onClick={open} style={{width: 'fit-content'}}>Create Credentials</Button>
                        <h1>Access</h1>
                    </div>
                    <table className={styles.userTable}>
                        <tbody>
                            <tr>
                                <th>Participant ID</th>
                                <th>Participant Name</th>
                                <th>Username</th>
                                <th>Password</th>
                            </tr>
                            {props.access_info != undefined ? props.access_info.map((user, id) => {
                                let [passwordState, setPasswordState] = useState(false)
                                return (
                                    <tr key={id}>
                                        <td>{user.id}</td>
                                        <td>{user.participant_name}</td>
                                        <td>{user.username}</td>
                                        <td className={styles.password_credentials}><span id='password_hidden' style={{filter: 'blur(3px)', userSelect: 'none'}}>{'*'.repeat(30)}</span> {passwordState ? <a onClick={(event: any) => {
                                            // @ts-ignore
                                            let element = (document.getElementById('password_hidden') as HTMLSpanElement)
                                            element.innerHTML = `${'*'.repeat(30)}`
                                            element.style.filter = 'blur(3px)'
                                            element.style.userSelect = 'none'
                                            setPasswordState(false)
                                        }}><EyeOff /></a> : <a onClick={(event: any) => {
                                            // @ts-ignore
                                            let element = (document.getElementById('password_hidden') as HTMLSpanElement)
                                            // @ts-ignore
                                            element.innerHTML = user.password
                                            element.style.filter = 'blur(0px)'
                                            element.style.userSelect = 'text'
                                            setPasswordState(true)
                                        }}><Eye /></a>}
                                        </td>
                                    </tr>
                                )
                            }) : null}
                        </tbody>
                    </table>
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