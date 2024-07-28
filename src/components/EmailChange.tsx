import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Mail } from "react-feather";

export function EmailChange({id}: any) {
    const [opened, { open, close }] = useDisclosure(false);
    const changeEmail = async (event: any) => {
        event.preventDefault();
        let [old_email, new_email, confirm_new_email] = [event.target.old_email.value, event.target.new_email.value, event.target.confirm_new_email.value]
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
                        <TextInput label={'Old Email'} type="text" name="old_email" placeholder="example@example.com" required/>
                        <TextInput label={'New Email'} type="text" name="new_email" placeholder="horizon@example.com" required/>
                        <TextInput label={'Confirm New Email'} type="text" name="confirm_new_email" placeholder="horizon@example.com" required/>
                        <Button type="submit">Change Email</Button>
                    </form>
                </Modal.Body>
            </Modal>
            <a onClick={open}>
                <Mail />
            </a>
        </>
    )
}