// Style
import styles from '@/styles/tests/Access.module.css'

// Imports
import Head from "next/head";
import { db } from "@/db/db";
import { account, proctorID, question_bank, role, test_access, tests, testSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Navbar from "@/components/Navbar";
import { Activity, ArrowLeft, Eye, EyeOff } from "react-feather";
import { Button, Loader, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { RenderDownload } from '@/components/RenderDownload';
import Link from 'next/link';

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
                let testConfig = await db.select().from(testSettings).where(eq(testSettings.test_id, parseInt(args.query.test)))
                let proctor_check = await db.select().from(proctorID).where(eq(proctorID.test_id, parseInt(args.query.test)))
                // @ts-ignore
                let roler = await db.select().from(role).where(eq(role.name, account_info[0].role))
                return {
                    props: {sessionStatus: true, account: account_info[0], test_info: testInfo,
                    test_id: parseInt(args.query.test), access_info: accessInfo, role: roler, test_config: testConfig,
                    proctor_check: proctor_check}
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
        let [query, setQuery] = useState(props.access_info)

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
                    'test_id': id,
                    'proctor_email': props.test_config[0].enable_proctoring && props.proctor_check.length != 0 ? data.proctor_email?.value : null

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
        if ((props.role.length != 0 && (props.role[0].createTestCredentials == false || props.role[0].gradeTestResponses == false)) || account_info?.role == 'staff') {
            window.location.replace('/tests')
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
                        <form onSubmit={createAccessCredentials} style={{gap: 10, display: 'flex', flexDirection: 'column'}} >
                            <h1>Create user credentials</h1>
                            {sError == '' ? null : <p style={{color: 'red'}}>{sError}</p>}
                            <TextInput type='text' name='participant_name' placeholder='Participant Name' label="Participant Name" required/>
                            {(props.test_config[0].enable_proctoring && props.proctor_check.length != 0) ? <TextInput type='email' name='proctor_email' placeholder='Proctor Email' label="Proctor Email" required/> : null}
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
                            <Button component={Link} color='black' href={`/tests/scoring?test=${id}`}><span><Activity /> Grading & Analytics</span></Button>
                            <Button component={Link} color='black' href={`/tests?test=${id}`}><span><ArrowLeft /> Back</span></Button>
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
                        {/* @ts-ignore */}
                        {(((props.role.length != 0 && (props.role[0].createTestCredentials == true))) || account_info.role != 'staff') ? <Button onClick={open}>Create Access Credentials</Button> : null}
                        <h1>Access</h1>
                    </div>
                    <TextInput label="Search" id='search_access' className={styles.searchAccess} placeholder='Participant ID, Participant Name, or by Username' onChange={(event: any) => {
                        // @ts-ignore
                        let query = (document.getElementById('search_access') as HTMLElement)?.value
                        // @ts-ignore
                        let sa = []
                        if (query == '') {
                            setQuery(props.access_info)
                        } else {
                            props.access_info.filter((ex: any) => {
                                if (ex.id === parseInt(query) || ex.participant_name.includes(query)) {
                                    sa.push(ex)
                                }
                            })
                            if (sa.length == 0) {
                                setQuery([])
                            }
                            // @ts-ignore
                            setQuery(sa)
                        }
                    }} />
                    <table className={styles.userTable}>
                        <tbody>
                            <tr>
                                <th>Participant ID</th>
                                <th>Participant Name</th>
                                <th>Username</th>
                                <th>Access Cards</th>
                                <th>Manage</th>
                            </tr>
                            {query.length != 0 ? query.map((user, id) => {
                                const [opened, {open, close}] = useDisclosure(false);
                                return (
                                    <>
                                        <Modal opened={opened} onClose={close} centered title="Revoke Access">
                                            <Modal.Body style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                                                <h1>Are you sure that you would like to delete this user, thereby removing access?</h1>
                                                <p>Please note that this would delete {user.participant_name}&apos;s submissions and information. This is not recoverable.</p>
                                                <Button color='red' onClick={async (event: any) => {
                                                    const res = await fetch('/api/tests/access', {
                                                        method: 'DELETE',
                                                        body: JSON.stringify({
                                                            'participant_id': user.id
                                                        })
                                                    })

                                                    const data = await res.json()
                                                    if (data.coreStatus == 'REVOKED_ACCESS') {
                                                        window.location.reload()
                                                    }
                                                }}>I confirm that I would like to revoke access.</Button>
                                            </Modal.Body>
                                        </Modal>
                                        <tr key={id}>
                                            <td>{user.id}</td>
                                            <td>{user.participant_name}</td>
                                            <td>{user.username}</td>
                                            <RenderDownload user={user} />
                                            <td><Button color='red' onClick={open}>Revoke</Button></td>
                                        </tr>
                                    </>
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