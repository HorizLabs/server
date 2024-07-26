// Password Rendering Solution
import styles from '@/styles/tests/Access.module.css'
import { Button } from '@mantine/core'
import { Download } from 'react-feather'

export function RenderDownload(props: any) {
    let user = props.user
    return (
        <td>
            <a href={`/api/access_card?name=${user.participant_name}&username=${user.username}&password=${user.password}`} className={styles.downloadInformation}  >
                <Download color='black' />
            </a>
        </td>
    )
}
