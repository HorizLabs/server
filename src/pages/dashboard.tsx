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
            
            // @ts-ignore
            let permissions = await db.select().from(role).where(eq(role.name, account_info[0].role))
            if (permissions.length != 0) {
                let permission = permissions[0]
                let proctoring_tests = await db.select().from(proctorID).where(eq(proctorID.proctor_id, account_info[0].id))
                let testInformation = await db.select().from(tests).where(eq(tests.id, proctoring_tests[0].test_id))

                return {
                    // Ternary operator for that determination
                    props: {sessionStatus: true, account: account_info[0], role: permission, testsProctoring: proctoring_tests, testInformation: testInformation}
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
            {/* <h2>Hello, {account_info.name}!</h2>
            <h3>Email: {account_info.email}</h3>
            <h3>User ID: {account_info.id}</h3>
            <h3>User role: {account_info.role}</h3> */}
            <Navbar />
            <main className={styles.content}>
                <h1>My dashboard</h1>
                {/* @ts-ignore */}
                {((props.recommended_actions != undefined && props.recommended_actions.length > 0)) ? (<>
                    <div className={styles.actions}>
                        <h1>To do</h1>
                        <div className={styles.actionrow}>
                            {
                                props.recommended_actions?.map((action, index) => {
                                    return (
                                        <Link key={index} href={action.link} className={styles.action}>
                                            <div style={{'background': action.color_gradient, 'height': '75px', 'borderRadius': '10px'}}>
                                            </div>
                                            <div className={styles.action_header}>
                                                <h3>{action.action}</h3>
                                            </div>                      
                                            <hr className={styles.header_action} />                    
                                            <div className={styles.action_body}>
                                                <p>{action.description}</p>
                                            </div>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                </>) : null}
                {
                            (proctoringRoleDetermination == true) ? (
                                <>
                                    <h2>Tests Proctoring</h2>
                                    {
                                        // @ts-ignore
                                        props.testInformation.map((test, id) => {
                                            return (
                                                <Card withBorder shadow="sm" padding="lg" radius="md" key={id}  style={{width: 'fit-content', display: 'flex', flexDirection: 'column', gap: '0.5em'}}>
                                                    <Group justify="space-between" mt={'md'} mb={'xs'}>
                                                        <Text size="lg">{test.name}</Text>
                                                        <Badge color="teal" variant="filled">Proctoring</Badge>
                                                    </Group>
                                                    <Text size="md" mt={'xs'} c="dimmed">{test.description}</Text>
                                                    <Group mt={'md'}>
                                                        {/* @ts-ignore */}
                                                        <Text size="sm" c="dimmed">Start date: {new Date(parseInt(test.starts_on)).toLocaleDateString()} at {new Date(parseInt(test.starts_on)).toLocaleTimeString()}</Text>
                                                        {/* @ts-ignore */}
                                                        <Text size="sm" c="dimmed">End date: {new Date(parseInt(test.ends_on)).toLocaleDateString()} at {new Date(parseInt(test.ends_on)).toLocaleTimeString()}</Text>
                                                    </Group>
                                                    <Button fullWidth component={Link} href={`/proctoring?test_id=${test.id}`}>
                                                        View test
                                                    </Button>
                                                </Card>
                                            )
                                        })
                                    }
                                </>
                            ) : null
                }
            </main>
        </>
    )
}