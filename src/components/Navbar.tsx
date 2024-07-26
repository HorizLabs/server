import styles from "@/styles/components/Navbar.module.css";
import Link from "next/link";
import { Box, Lock, LogOut, Paperclip, Settings, Users } from "react-feather";

export default function Navbar() {
    return (
        <nav className={styles.sidebar}>
            <div className={styles.sidebar__logo}>
                <img src="/logo.png" alt="Horizon Labs Logo" width={40} height={40} />
                <h1>Horizon Labs</h1>
            </div>
            <div className={styles.sidebar__menu}>
                <Link className={styles.sidebar__content} href="/dashboard">
                    <Box /> Dashboard
                </Link>
                <Link className={styles.sidebar__content} href="/tests">
                    <Paperclip /> Tests
                </Link>
                <Link className={styles.sidebar__content} href="/users">
                    <Users /> Users
                </Link>
            </div>
            <div className={styles.sidebar__footer}>
                <div>
                    <Link href="/settings" className={styles.outline}><Settings /></Link>                    
                </div>
                <Link href="/logout" className={styles.outline}><LogOut /></Link>
            </div>
        </nav>
    )
}