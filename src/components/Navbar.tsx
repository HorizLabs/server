import styles from "@/styles/components/Navbar.module.css";
import { Box, Lock, Paperclip, Settings } from "react-feather";

export default function Navbar() {
    return (
        <nav className={styles.sidebar}>
            <div className={styles.sidebar__logo}>
                <img src="/logo.png" alt="Horizon Labs Logo" width={40} height={40} />
                <h1>Horizon Labs</h1>
            </div>
            <div className={styles.sidebar__menu}>
                <a className={styles.sidebar__content}>
                    <Box /> Dashboard
                </a>
                <a className={styles.sidebar__content}>
                    <Paperclip /> Tests
                </a>
                <a className={styles.sidebar__content}>
                    <Lock /> Security
                </a>
            </div>
            <div className={styles.sidebar__footer}>
                <div className="left">
                    <a href="/settings"><Settings /></a>                    
                </div>
                <a href="/logout">Logout</a>
            </div>
        </nav>
    )
}