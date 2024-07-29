import { Button, Loader, Modal, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RegisterProctor } from "./RegisterProctor";
import { useState } from "react";



export function Proctor(props: any) {
    const [opened, {open, close}] = useDisclosure(false);
    const [buttonState, setButtonState] = useState(false);
    const [error, setError] = useState('')
    const updateInstructions = async (event: any) => {
        event.preventDefault();
        setButtonState(true);
        let instructions = await fetch('/api/proctor', {
            method: 'PUT',
            body: JSON.stringify({
                instructions: event.target.instructions.value,
                test_id: props.proctorID
            })
        })
        let data = await instructions.json();
        if (data.coreStatus == 'UPDATED_INSTRUCTIONS') {
            setButtonState(false);
            close();
            // window.location.reload()
        } else {
            setError(data.message)
            setButtonState(false)
        }
    }
    return (
        <>
            <Modal opened={opened} onClose={close} title="Proctor Settings" centered>
                <Modal.Body>
                    <h2>Proctor Instructions</h2>
                    <form style={{display: 'flex', flexDirection: 'column', gap: '1em'}} onSubmit={updateInstructions}>
                            {error != '' ? <p style={{color: 'red'}}>{error}</p> : null}
                            <Textarea label="Instructions" name="instructions" placeholder="Set instructions for the proctors/test-takers." defaultValue={props.proctorSettings.length != 0 ? props.proctorSettings[0].instructions : null} required />
                            <div style={{display: 'flex', flexDirection: 'row', gap: '1em'}}>
                                {buttonState ? <Button color="gray"><Loader color="white" style={{transform: 'scale(0.65)'}}/></Button> : <Button color="gray" type="submit">Update</Button>}
                                <RegisterProctor proctor_id={props.proctorID} />
                            </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Button color="#2845b8" onClick={open}>Proctor Settings</Button>
        </>
    )
}