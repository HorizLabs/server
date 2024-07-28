import styles from '@/styles/components/SettingsNV.module.css'
import Link from 'next/link'

export function SettingsSidebar() {
    return (
        <div className={styles.sidebar}>
            <Link href={'#identity'}>Identity</Link>
        </div>
    )
}