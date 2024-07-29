import { Button, Loader, Modal, PasswordInput, PinInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Info } from "react-feather";

export function RegisterProctor(props: any) {
    const [opened, {open, close}] = useDisclosure(false);
    const [buttonState, setButtonState] = useState(false);
    const [error, setError] = useState(false);

    let test_id = props.proctor_id
    const registerProctor = async (event: any) => {
        event.preventDefault();
        setButtonState(true);

        let response = await fetch('/api/proctor/', {
            method: 'POST',
            body: JSON.stringify({
                proctor_name: event.target.proctor_name.value,
                proctor_email: event.target.proctor_email.value,
                proctor_password: event.target.proctor_password.value,
                test_id: test_id
            })
        })

        if ((await response.json()).coreStatus == 'CREATED_ACCOUNT') {
            setButtonState(false);
            window.location.replace('/users')
        } else {
            setButtonState(false);
            setError((await response.json()).message)
        }
    }

    return (
        <>
            <Modal opened={opened} onClose={close} title="Proctor Settings" centered>
                <Modal.Body>
                    <h2>Register a proctor</h2>
                    <p style={{justifyContent: 'center', display: 'flex', gap: 10, color: '#0c7feb'}}><Info /> This will create a new role or to try to find a role called "Proctor."</p>
                    {error ? <p style={{justifyContent: 'center', display: 'flex', gap: 10, color: 'red'}}><Info /> {error}</p> : null}
                    <form style={{display: 'flex', flexDirection: 'column', gap: '1em'}} onSubmit={registerProctor}>
                        <TextInput label="Proctor Name" name="proctor_name" placeholder="Dylan Freedman" required />
                        <TextInput label="Proctor Email" name="proctor_email" placeholder="df@example.com" required />
                        <PasswordInput label="Proctor Password" name="proctor_password" placeholder="Set proctor password" required />
                        {buttonState ? <Button color="grape"><Loader color="white" style={{transform: 'scale(0.65)'}} /></Button> : <Button color="grape" type="submit" onClick={open}>Create Proctor Account</Button>}
                    </form>
                </Modal.Body>
            </Modal>
            <Button color="grape" onClick={open}>Register a Proctor</Button>
        </>
    )
}