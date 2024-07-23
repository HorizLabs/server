import Head from "next/head";
import { db } from "@/db/db";
import { account, tests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Navbar from "@/components/Navbar";
import styles from '@/styles/Users.module.css'
import { FilePlus, Paperclip, UserPlus, Users } from "react-feather";
import { Button,Loader,Modal, PasswordInput, TextInput } from "@mantine/core";
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
            // Get account info
            // @ts-ignore
            const accountInfo = await db.select([account.name, account.email, account.role]).from(account)

            return {
                // Ternary operator for that determination
                props: {sessionStatus: true, account: account_info[0], accounts_info: accountInfo}
            }
        }
    } catch {
        // Catch and attempt to logout 
        return {
            props: {sessionStatus: false}
        }
    }
})

export default function UsersPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // Create states and modal
    const [accounts, setAccounts] = useState<any>(props?.accounts_info)
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

    console.log(props.accounts_info)
    let account_info = props.account
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
            <Modal opened={opened} onClose={close} title="Create a User" centered>
                <h2>Create a User Account</h2>
                <form className={styles.accountCreationForm}>
                    <TextInput type="text" name="name" placeholder="Name" label="Name" required />
                    <TextInput type="text" name="email" placeholder="Email" label="Email" required />
                    <PasswordInput type="text" name="password" placeholder="Password" label="Password" required />
                </form>
            </Modal>
            <main className={styles.content}>
                <div className={styles.header}>
                    <h1><Users /> Users</h1>
                    <hr />
                </div>
                <div className={styles.userContainer}>
                    <div className={styles.createUser}>
                        {(account_info?.role == 'owner' || account_info?.role == 'admin') ? (<Button className={styles.createButton} onClick={open}><span className={styles.textContent}><UserPlus />  Create a User</span></Button>) : null}
                    </div>
                    <div className={styles.userSearch}>
                        <TextInput
                            placeholder="Dylan Freedman"
                            label="Search by name, role, or email"
                            id="search_user"
                            onChange={() => {
                                // Begin search through account_info from props
                                let searchArray = []
                                let query = (document.getElementById('search_user') as HTMLFormElement).value
                                for (let index in props.accounts_info) {
                                    // @ts-ignore
                                    let account = props?.accounts_info[index]
                                    // // Check in username or email
                                    if (account[0].toLowerCase().includes(query.toLowerCase()) || account[1].toLowerCase().includes(query.toLowerCase()) || account[2].toLowerCase().includes(query.toLowerCase())) {
                                        searchArray.push(account)
                                    }
                                }
                                // Set state to our results
                                setAccounts(searchArray)
                                if (query == '' ) {
                                    // Update state if query empty
                                    setAccounts(props.accounts_info)
                                } else if (searchArray.length == 0) {
                                    // Update state if no results
                                    setAccounts([])
                                }
                            }}
                        />
                    </div>
                    <table className={styles.userTable}>
                        <tbody>
                            <tr>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                            {accounts?.map((account: any, id: any) => {
                                return (
                                    <tr key={id}>
                                        <td>{account[0]}</td>
                                        <td>{account[1]}</td>
                                        <td>{account[2]}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    )
}