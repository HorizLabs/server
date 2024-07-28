// General Imports
import styles from '@/styles/Settings.module.css'

// Other Imports
import Head from "next/head";
import { db } from "@/db/db";
import { account, role } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import * as jwt from "jose";
import * as crypto from "crypto";
import { InferGetServerSidePropsType } from "next";
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Box, Hexagon } from 'react-feather';
import { SettingsSidebar } from '@/components/SettingsSidebar';
import { AccountManagement } from '@/components/AccountManagement';
import { RoleManager } from '@/components/settings/RoleManager';

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
            let rolePermissions = await db.select({
                role: role.name,
                manage_roles: role.manageRoles
                // @ts-ignore
            }).from(role).where(eq(role.name, account_info[0].role))
            return {
                // Ternary operator for that determination
                props: {sessionStatus: true, account: account_info[0], rolePermissions: rolePermissions}
            }
        }
    } catch (e) {
        // Catch and attempt to logout 
        return {
            props: {sessionStatus: false}
        }
    }
})

export default function Settings(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
    let rolePermissions = props.rolePermissions
    return(
        <>
            <Head>
                <title>Horizon Labs</title>
                <meta name="description" content="Introducing Horizon." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <nav className={styles.navbarSettings}>
                <div style={{
                    marginLeft: '1em',
                    marginTop: '0.5em'
                }}>
                    <Image src={'/logo.png'} alt='Logo' width={50} height={50} />
                </div>
                <div style={{
                    marginRight: '1em',
                    marginTop: '0.5em'
                }}>
                    <Link href={'/dashboard'} style={{
                        justifyContent: 'center',
                        display: 'flex',
                        gap: 10
                    }}><ArrowLeft /> Return Home</Link>
                </div>
            </nav>
            <main className={styles.content}>
                <h1 style={{display: 'flex', justifyContent: 'center'}}>Settings</h1>
                <section id='identity' className={styles.content_column} style={{marginTop: '2em'}}>
                    <div className={styles.header}>
                        <h2 style={{display: 'flex', alignItems: 'center', gap: 5}}><Hexagon /> Identity</h2>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '3em'
                    }}>
                        <div style={{
                            gap: '1em',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <p>Name: {account_info?.name}</p>
                            <p>Email: {account_info?.email}</p>
                            <AccountManagement id={account_info?.id} role={account_info?.role} />
                        </div>
                        <Image className={styles.pfp_image} src={`/api/profile_icon?name=${account_info?.name}`} width={150} height={150} alt='profile_always_changes' />
                    </div>
                </section>
                {/* @ts-ignore */}
                {((rolePermissions.length != 0 && rolePermissions[0].manage_roles) || account_info?.role) == 'owner' ?
                <section id="roles" className={styles.content_column} style={{
                    gap: '0.5em'
                }}>
                    <div className={styles.header}>
                        <h2 style={{display: 'flex', alignItems: 'center', gap: 5}}><Box /> Roles</h2>
                    </div>
                    <p>Roles are for assigning individuals specific permissions by creating a name.</p>
                    <div style={{
                        display: 'flex',
                        gap: '1em'
                    }}>
                        <RoleManager rolePermissions={rolePermissions} />
                    </div>
                </section>
                : null}
            </main>
        </>
    )
}