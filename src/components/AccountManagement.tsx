import { Button, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import styles from '@/styles/Settings.module.css'
import { PasswordChange } from "./PasswordChange";
import { EmailChange } from "./EmailChange";
import { DeleteAccount } from "./DeleteAccount";

export function AccountManagement({id, role}: any) {
    const [opened, { open, close }] = useDisclosure(false);
    let account_id = id
    return (
        <>
            <Modal onClose={close} opened={opened} centered title='Account Management'>
                <Modal.Body>
                    <h2>Actions</h2>
                    <div className={styles.management_column}>
                        <PasswordChange id={id} />
                        <EmailChange id={id} />
                        <DeleteAccount id={id} role={role} />
                    </div>
                </Modal.Body>
            </Modal>
            <Button onClick={open}>Manage Account</Button>
        </>
    )
}