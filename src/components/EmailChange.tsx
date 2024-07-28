import { Button, Loader, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Mail } from "react-feather";

export function EmailChange({id}: any) {
    const [buttonState, setButtonState] = useState(false)
    const [opened, { open, close }] = useDisclosure(false);
    const [error, setError] = useState('')
    const changeEmail = async (event: any) => {
        event.preventDefault();
        let [old_email, new_email, confirm_new_email] = [event.target.old_email.value, event.target.new_email.value, event.target.confirm_new_email.value]
        if (new_email == confirm_new_email) {
            setButtonState(true)
            let res = await fetch('/api/account', {
                method: 'PUT',
                body: JSON.stringify({
                    'old_email': old_email,
                    'new_email': new_email,
                    'confirm_new_email': confirm_new_email,
                    'feature': 'CHANGE_EMAIL'
                })
            })
            let info = await res.json()
            if (info.coreStatus == "CHANGED_EMAIL") {
                window.location.replace('/logout')
            } else {
                setError(info.message)
            }
        }
    }
    return (
        <>
            <Modal opened={opened} onClose={close} centered title="Change Email">
                <Modal.Body>
                    <form style={{
                        display: 'flex',
                        gap: 15,
                        flexDirection: 'column'
                    }} onSubmit={changeEmail}>
                        {(error != '') ? <p style={{color: 'red'}}>{error}</p> : null}
                        <TextInput label={'Old Email'} type="text" name="old_email" placeholder="example@example.com" required/>
                        <TextInput label={'New Email'} type="text" name="new_email" placeholder="horizon@example.com" required/>
                        <TextInput label={'Confirm New Email'} type="text" name="confirm_new_email" placeholder="horizon@example.com" required/>
                        {buttonState ? <Button><Loader color="white" style={{transform: 'scale(0.65)'}} /></Button> : <Button type="submit">Change Email</Button>}
                    </form>
                </Modal.Body>
            </Modal>
            <a onClick={open}>
                <Mail />
            </a>
        </>
    )
}