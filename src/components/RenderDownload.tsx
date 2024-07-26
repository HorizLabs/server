// Password Rendering Solution
import styles from '@/styles/tests/Access.module.css'
import { Button } from '@mantine/core'
import { Download } from 'react-feather'

export function RenderDownload(props: any) {
    let user = props.user
    return (
        <td>
            <a href={`/tests/access?test=${user.test_id}&downloadID=${user.id}`} className={styles.downloadInformation}  >
                <Download color='black' />
            </a>
        </td>
    )
}
