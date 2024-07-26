import Head from "next/head";
import { db } from "@/db/db";
import { account, tests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Navbar from "@/components/Navbar";
import styles from '@/styles/Tests.module.css'
import { ArrowLeft, BarChart2, FilePlus, FileText, Key, Lock, Paperclip, Settings } from "react-feather";
import { Button,Loader,Modal, NumberInput, TextInput } from "@mantine/core";
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
                let testInfo = await db.select().from(tests).where(eq(tests.id, parseInt(args.query.test)))
                return {
                    props: {sessionStatus: true, account: account_info[0], test_info: testInfo, test_id: parseInt(args.query.test)}
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
    const createTest = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setButtonCreateStatus(true)
        let [name,
            description,
            start_date,
            start_time,
            end_date,
            end_time,
            questions
        ] = [event.target.name.value, 
            event.target.description.value,
            event.target.start_date.value,
            event.target.start_time.value,
            event.target.end_date.value,
            event.target.end_time.value,
            event.target.questions.value
        ]
        let start_period = new Date(`${start_date} ${start_time}`).getTime()
        let end_period = new Date(`${end_date} ${end_time}`).getTime()
        // setButtonCreateStatus(false)
        const response = await fetch('/api/tests', {
            method: 'POST',
            body: JSON.stringify({
                'name': name,
                'description': description,
                'start_time': start_period,
                'end_time': end_period,
                'questions': questions
            })
        })
        let data = await response.json()
        if (data.coreStatus === 'CREATED_TEST') {
            window.location.reload()
        } else {
            setErrorInfo(data.message)
            setButtonCreateStatus(false)
        }      
    }
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
    if (props.test_id != undefined && props.test_info[0] != undefined) {
        let id = props.test_id
        let test_info = props.test_info[0]
        let status_colors = {
            'draft': {
                'color': 'white',
                'background': '#376dc4'
            },
            'active': {
                'color': 'white',
                'background': '#1aa13e'
            },
            'suspended': {
                'color': 'white',
                'background': '##383838'
            },
            'archived': {
                'color': 'white',
                'background': '##c72442'
            }
        }
        // @ts-ignore
        let tagColorScheme = status_colors[test_info.test_status]
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
                            <Button color='black' component="a" href={`/tests/question_bank?test=${id}`}><span><FileText /> Question Bank</span></Button>
                            <Button color='black' component="a" href={`/tests/access?test=${id}`}><span><Key /> Access</span></Button>
                            <Button color='black' component="a" href={`/tests/settings?test=${id}`}><span><Settings/> Settings</span></Button>
                            <Button color='black' component="a" href={`/tests`}><span><ArrowLeft /> Back</span></Button>
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
                        <p>Visibility Status: </p>
                        <div className={styles.testDescription_tag} style={{color: tagColorScheme.color, backgroundColor: tagColorScheme.background}}>
                            {/* @ts-ignore */}
                            <p>{test_info.test_status?.charAt(0).toLocaleUpperCase() + test_info.test_status?.slice(1)}</p>
                        </div>
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
            </Head>
            {/* <h2>Hello, {account_info.name}!</h2>
            <h3>Email: {account_info.email}</h3>
            <h3>User ID: {account_info.id}</h3>
            <h3>User role: {account_info.role}</h3> */}
            <Navbar />
            <Modal opened={opened} onClose={close} title="Test Creation" centered>
                <h2>Create a Test</h2>
                {errorInfo != '' ? <p className={styles.information_error}>{errorInfo}</p>: null}
                <form className={styles.createTestForm} onSubmit={createTest}>
                    <TextInput type="text" name="name" placeholder="Name" required/>
                    <TextInput type="text" name="description" placeholder="Description" required/>
                    <NumberInput name="questions" min={1} placeholder="Number of Questions" required/>
                    <div className={styles.row_head}>
                        <label htmlFor="start_date">Start Date</label>
                        <TextInput type="date" name="start_date" required/>
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
            </Modal>
            <main className={styles.content}>
                <div className={styles.header}>
                    <h1><Paperclip /> Tests</h1>
                    <hr />
                </div>
                <div className={styles.testContainer}>
                    <div className={styles.createTest}>
                        {(account_info?.role == 'owner' || account_info?.role == 'admin') ? (<Button className={styles.createButton} onClick={open}><span className={styles.textContent}><FilePlus />  Create a test</span></Button>) : null}
                    </div>
                    {/* <div className={styles.header}>
                        <h2>Active Tests</h2>
                        <hr />
                    </div> */}
                    <div className={styles.tests}>
                        {(props?.test_info?.length != 0) ? (
                            props?.test_info?.map((test, id) => {
                                return (
                                    <a className={styles.test} key={id} href={`/tests?test=${test.id}`}>
                                        <h3>{test.name}</h3>
                                        <p>Tag: {test.test_status?.toLocaleUpperCase()}</p>
                                        {/* @ts-ignore */}
                                        <h4>Starts on {new Date(parseInt(test.starts_on)).toLocaleDateString()} at {new Date(parseInt(test.starts_on)).toLocaleTimeString()}</h4>
                                        {/* @ts-ignore */}
                                        <h4>Ends on {new Date(parseInt(test.ends_on)).toLocaleDateString()} at {new Date(parseInt(test.ends_on)).toLocaleTimeString()}</h4>
                                    </a>
                                )
                            })
                        ): null}
                    </div>
                </div>
            </main>
        </>
    )
}