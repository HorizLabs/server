import { Button, Loader, Modal, PasswordInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Key } from "react-feather";

export function PasswordChange({id}: any) {
    const [buttonState, setButtonState] = useState(false)
    const [opened, { open, close }] = useDisclosure(false);
    const [error, setError] = useState('')
    const changePassword = async (event: any) => {
        event.preventDefault();
        let [old_password, new_password, confirm_new_password] = [event.target.old_password.value, event.target.new_password.value, event.target.confirm_new_password.value]
        if (new_password == confirm_new_password) {
            setButtonState(true)
            let res = await fetch('/api/account', {
                method: 'PUT',
                body: JSON.stringify({
                    'old_password': old_password,
                    'new_password': new_password,
                    'confirm_new_password': confirm_new_password,
                    'feature': 'CHANGE_PASSWORD'
                })
            })
            let info = await res.json()
            if (info.coreStatus == "CHANGED_PASSWORD") {
                window.location.replace('/logout')
            } else {
                setError(info.message)
            }
        }
    }
    return (
        <>
            <Modal opened={opened} onClose={close} centered title="Change Password">
                <Modal.Body>
                    <form style={{
                        display: 'flex',
                        gap: 15,
                        flexDirection: 'column'
                    }} onSubmit={changePassword}>
                        {(error != '') ? <p style={{color: 'red'}}>{error}</p> : null}
                        <PasswordInput label={'Old Password'} type="password" name="old_password"  required/>
                        <PasswordInput label={'New Password'} type="password" name="new_password" required/>
                        <PasswordInput label={'Confirm New Password'} type="password" name="confirm_new_password" required/>
                        {buttonState ? <Button><Loader color="white" style={{transform: 'scale(0.65)'}} /></Button> : <Button type="submit">Change Email</Button>}
                    </form>
                </Modal.Body>
            </Modal>
            <a onClick={open}>
                <Key />
            </a>
        </>
    )
}