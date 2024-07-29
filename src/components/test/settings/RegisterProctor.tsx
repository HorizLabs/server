import { Button, Loader, Modal, PasswordInput, PinInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Info } from "react-feather";

export function RegisterProctor() {
    const [opened, {open, close}] = useDisclosure(false);
    const [buttonState, setButtonState] = useState(false);

    return (
        <>
            <Modal opened={opened} onClose={close} title="Proctor Settings" centered>
                <Modal.Body>
                    <h2>Register a proctor</h2>
                    <p style={{justifyContent: 'center', display: 'flex', gap: 10, color: '#0c7feb'}}><Info /> This will create a new role or to try to find a role called "Proctor."</p>
                    <form style={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
                        <TextInput label="Proctor Name" name="proctor_name" placeholder="Dylan Freedman" required />
                        <TextInput label="Proctor Email" name="proctor_email" placeholder="df@example.com" required />
                        <PasswordInput label="Proctor Password" name="proctor_password" placeholder="Set proctor password" required />
                        <label htmlFor="proctor_code">Proctor Code</label>
                        <PinInput inputType="num" name="proctor_code" aria-required/>
                        {buttonState ? <Button><Loader color="white" style={{transform: 'scale(0.65)'}} /></Button> : <Button color="grape" type="submit" onClick={open}>Create Proctor Account</Button>}
                    </form>
                </Modal.Body>
            </Modal>
            <Button color="grape" onClick={open}>Register a Proctor</Button>
        </>
    )
}