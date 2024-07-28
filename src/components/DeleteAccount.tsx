import { Button, Loader, Modal, PasswordInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Trash } from "react-feather";

export function DeleteAccount({id, role}: any) {
    const [opened, { open, close }] = useDisclosure(false);
    const [lbuttonState, setButtonState] = useState(false)

    const deleteAccount = async (event: any) => {
        event.preventDefault();
        let password = event.target.confirm_password.value;
        setButtonState(true)
        let res = await fetch('/api/account', {
            'method': 'DELETE',
            'body': JSON.stringify({
                'password': password,
                'confirmation': true
            })
        })
        if ((await res.json()).coreStatus == 'CONFIRMED_DELETED') {
            window.location.href = '/logout'
        } else {
            window.location.reload()
        }
    }
    return (
        <>
            <Modal onClose={close} opened={opened} centered title="Delete Account">
                {
                    (role == 'owner' && id == 1) ? (
                        <Modal.Body>
                            <h1>You cannot delete your account.</h1>
                            <p>Since you are the registered owner, you cannot delete your account. However, you can delete everything. If you click &quot;delete everything,&quot; you will acknowledge that the database contents and everything will be deleted.</p>
                            <form style={{
                                display: 'flex',
                                gap: 10,
                                flexDirection: 'column'
                            }} onSubmit={deleteAccount}>
                                <PasswordInput label="Please enter your password to continue deletion" name="confirm_password" required/>
                                {(lbuttonState) ? <Button color="red"><Loader color="white" style={{transform: 'scale(0.7)'}} /></Button> : <Button color="red" type="submit">I acknowledge and would like to delete everything.</Button>}
                                </form>
                        </Modal.Body>
                    ) : (
                        <Modal.Body>
                            <h1>Would you like to delete your account?</h1>
                            <p>This decision is not reversible and will revoke your access to everything, including access to the software.</p>
                            <form style={{
                                display: 'flex',
                                gap: 10,
                                flexDirection: 'column'
                            }} onSubmit={deleteAccount}>
                                <PasswordInput label="Please enter your password to continue deletion" name="confirm_password" required/>
                                {(lbuttonState) ? <Button color="red"><Loader color="white" style={{transform: 'scale(0.7)'}} /></Button> : <Button color="red" type="submit">I acknowledge and would like to delete my account.</Button>}
                            </form>
                        </Modal.Body>
                    )
                }
            </Modal>
            <a style={{backgroundColor: '#ff4d3d', color: 'white'}} onClick={open}>
                <Trash />
            </a>
        </>
    )
}