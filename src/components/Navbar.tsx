import styles from "@/styles/components/Navbar.module.css";
import { Box } from "react-feather";

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
            </div>
            <div className={styles.sidebar__footer}>
                <a href="/logout">Logout</a>
            </div>
        </nav>
    )
}