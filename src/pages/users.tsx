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
import { FilePlus, Paperclip, UserPlus, Users, X } from "react-feather";
import { Button,Loader,Modal, NativeSelect, PasswordInput, PinInput, TextInput } from "@mantine/core";
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
            // Get account info
            // @ts-ignore
            const accountInfo = await db.select([account.name, account.email, account.role, account.id]).from(account)
            if (args.query.length != 0 && args.query.account) {
                let acc_id = args.query.account
                let account_id_info = await db.select({
                    name: account.name,
                    email: account.email,
                    role: account.role,
                    id: account.id
                }).from(account).where(eq(account.id, acc_id))
                return {
                    props: {sessionStatus: true, accountLoginStatus: false, account: account_info[0], account_id_info: account_id_info}
                }
            }
            return {
                // Ternary operator for that determination
                props: {sessionStatus: true, account: account_info[0], accounts_info: accountInfo}
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

export default function UsersPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // Create states and modal
    const [accounts, setAccounts] = useState<any>(props?.accounts_info)
    const [loadingButton, setLoadingButton] = useState<Boolean>(false)
    const [errorInfo, setErrorInfo] = useState<String>('')
    const [opened, {open, close}] = useDisclosure(false);

    // Create
    const createAccount = async (event: any) => {
        event.preventDefault();
        setLoadingButton(true)
        let [name, email, password, role] = [event.target.name.value, event.target.email.value, event.target.password.value, event.target.role.value]
        let loweredRole = role.toLowerCase()
        const response = await fetch('/api/users', {
            'method': 'POST',
            'body': JSON.stringify({
                'name': name, 
                'email': email,
                'password': password,
                'role': loweredRole
            })
        })
        console.log(response)
        let data = await response.json()
        if (data.coreStatus === 'CREATED_ACCOUNT') {
            window.location.reload()
        } else {
            setErrorInfo(data.message)
            setLoadingButton(false)
        }
    }

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
    // Check role
    const roleModify = (roleA: string, roleB: string) => {
        let roles = ['staff', 'admin', 'owner']
        let roleAIndex = roles.indexOf(roleA)
        let roleBIndex = roles.indexOf(roleB)
        return roleAIndex > roleBIndex
    }
    let account_info = props.account

    // Quick check
    if (props.account_id_info?.length != 0 && props.account_id_info != undefined) {
            let account = props.account_id_info[0]
            let user_role = account.role
            // @ts-ignore
            user_role = user_role?.charAt(0).toUpperCase() + user_role?.slice(1)
            const deleteAccount = async (event: any) => {
                event.preventDefault();
                setLoadingButton(true)
                const response = await fetch('/api/users', {
                    'method': 'DELETE',
                    'body': JSON.stringify({
                        'id': account.id
                    })
                })
                let data = await response.json()
                if (data.coreStatus === 'DELETED_ACCOUNT') {
                    window.location.href = '/users'
                } else {
                    window.location.href = '/users'
                }
            }
            // @ts-ignore
            if (roleModify(account_info.role, account.role) == false) {
                return (
                    <Head>
                        <meta httpEquiv="refresh" content="0;url=/users" />
                    </Head>
                )
            }
            // @ts-ignore
            if (account_info.role == 'owner' || account_info.role == 'admin') {
                const updateAccount = async (event: any) => {
                    event.preventDefault();
                    setLoadingButton(true)
                    let [name, email, role] = [event.target.name.value, event.target.email.value, event.target.role.value]
                    let loweredRole = role.toLowerCase()
                    const response = await fetch('/api/users', {
                        'method': 'PUT',
                        'body': JSON.stringify({
                            'name': name, 
                            'email': email,
                            'role': loweredRole,
                            'id': account.id
                        })
                    })
                    let data = await response.json()
                    if (data.coreStatus === 'UPDATED_ACCOUNT') {
                        window.location.href = '/users'
                    } else {
                        window.location.href = '/users'
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
                    <Modal opened={opened} onClose={close} title="Confirmation" centered>
                    <h2>Are you sure that you would like to delete this user account?</h2>
                    <p>Please view this option carefully as you will be deleting a user account. Please confirm this before proceeding.</p>
                    <br />
                    <form className={styles.accountCreationForm} onSubmit={deleteAccount}>
                        {loadingButton ? <Button  color="darkred"><Loader color="white"  style={{transform: 'scale(0.7)'}} /></Button>: <Button type="submit" color="red">I confirm, delete this account.</Button>}
                        </form>
                    </Modal>

                    <dialog id="modal" className={styles.modalCore}>
                        <div className={styles.modal} id="modalContent">
                        <h2>Modify User</h2>
                        </div>
                    </dialog>
                    <main className={styles.content}>
                        <div className={styles.header}>
                            <h1><Users /> Users</h1>
                            <hr />
                        </div>
                        <div className="userManagementContainer">
                            <h1>Modify User</h1>
                            <form className={styles.accountModificationForm} onSubmit={updateAccount}>
                                {/* @ts-ignore */}
                                <TextInput type="text" id="name" name="name" placeholder="Name" defaultValue={props.account_id_info[0].name} label="Name" required />
                                {/* @ts-ignore */}
                                <TextInput type="text" id="email" name="email" placeholder="Email" label="Email" defaultValue={props.account_id_info[0].email} required />
                                <NativeSelect id="role" label="Role" data={(account_info?.role == 'owner') ? ['Admin', 'Staff'] : ['Staff']} defaultValue={user_role} name="role" required/>
                                <div className={styles.accountModificationRow}>
                                    <Button type="submit">Modify Account</Button>
                                    <Button onClick={open} color="red">Delete Account</Button>
                                </div>
                            </form>
                        </div>
                    </main>
                </>
                )
            } else {
                return (
                    <Head>
                        <meta httpEquiv="refresh" content="0;url=/users" />
                    </Head>
                )
            }
    }

    // Normal rendering
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
                {(errorInfo != '') ? <p style={{color: 'red'}}>{errorInfo}</p>: null}
                <form className={styles.accountCreationForm} onSubmit={createAccount}>
                    <TextInput type="text" name="name" placeholder="Name" label="Name" required />
                    <TextInput type="text" name="email" placeholder="Email" label="Email" required />
                    <PasswordInput type="text" name="password" placeholder="Password" label="Password" required />
                    <NativeSelect label="Role" data={(account_info?.role == 'owner') ? ['Admin', 'Staff'] : ['Staff']} name="role" required/>
                    {loadingButton ? <Button><Loader color="white" style={{transform: 'scale(0.7)'}} /></Button>: <Button type="submit">Create Account</Button>}
                </form>
            </Modal>
            <dialog id="modal" className={styles.modalCore}>
                <div className={styles.modal} id="modalContent">
                   <h2>Modify User</h2>
                </div>
            </dialog>
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
                                {(account_info?.role == 'owner' || account_info?.role == 'admin') ? <th>Actions</th> : null}
                            </tr>
                            {accounts?.map((account: any, id: any) => {
                                return (
                                    <tr key={id}>
                                        <td>{account[0]}</td>
                                        <td>{account[1]}</td>
                                        <td>{account[2]}</td>
                                        {(account_info?.role == 'owner' || account_info?.role == 'admin') ? (
                                            <>
                                                {
                                                    roleModify(account_info.role, account[2]) ? <td><Button component="a" href={`/users?account=${account[3]}`}>Modify</Button></td> : <td><X /></td>
                                                }
                                            </>
                                        ) : null}
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
