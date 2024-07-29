import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RegisterProctor } from "./RegisterProctor";

export function Proctor() {
    const [opened, {open, close}] = useDisclosure(false);
    return (
        <>
            <Modal opened={opened} onClose={close} title="Proctor Settings" centered>
                <Modal.Body>
                    <h2>Proctor</h2>
                    <RegisterProctor />
                </Modal.Body>
            </Modal>
            <Button color="#2845b8" onClick={open}>Proctor Settings</Button>
        </>
    )
}