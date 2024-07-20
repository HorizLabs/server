import styles from "@/styles/components/Navbar.module.css";
import { Box, Lock, LogOut, Paperclip, Settings, Users } from "react-feather";

export default function Navbar() {
    return (
        <nav className={styles.sidebar}>
            <div className={styles.sidebar__logo}>
                <img src="/logo.png" alt="Horizon Labs Logo" width={40} height={40} />
                <h1>Horizon Labs</h1>
            </div>
            <div className={styles.sidebar__menu}>
                <a className={styles.sidebar__content} href="/dashboard">
                    <Box /> Dashboard
                </a>
                <a className={styles.sidebar__content} href="/tests">
                    <Paperclip /> Tests
                </a>
                <a className={styles.sidebar__content} href="/security">
                    <Lock /> Security
                </a>
                <a className={styles.sidebar__content} href="/users">
                    <Users /> Users
                </a>
            </div>
            <div className={styles.sidebar__footer}>
                <div>
                    <a href="/settings" className={styles.outline}><Settings /></a>                    
                </div>
                <a href="/logout" className={styles.outline}><LogOut /></a>
            </div>
        </nav>
    )
}