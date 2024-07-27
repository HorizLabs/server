import { Button, Modal, PasswordInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Trash } from "react-feather";

export function DeleteAccount({id, role}: any) {
    const [opened, { open, close }] = useDisclosure(false);
    const deleteAccount = async (event: any) => {
        event.preventDefault();
        if (id == 1 && role == 'owner') {
            let password = event.target.confirm_password.value
            await fetch('/api/accounts', {
                'method': 'DELETE',
                'body': JSON.stringify({
                    'password': password,
                    'confirmation': true
                })
            })
        }
    }
    return (
        <>
            <Modal onClose={close} opened={opened} centered title="Delete Account">
                {
                    role == 'owner' && id == 1 ? (
                        <Modal.Body>
                            <h1>You cannot delete your account.</h1>
                            <p>Since you are the registered owner, you cannot delete your account. However, you can delete everything. If you click &quot;delete everything,&quot; you will acknowledge that the database contents and everything will be deleted.</p>
                            <form style={{
                                display: 'flex',
                                gap: 10,
                                flexDirection: 'column'
                            }} onSubmit={deleteAccount}>
                                <PasswordInput label="Please enter your password to continue deletion" name="confirm_password" required/>
                                <Button color="red" type="submit">I acknowledge and would like to delete everything.</Button>
                            </form>
                        </Modal.Body>
                    ) : (null)
                }
            </Modal>
            <a style={{backgroundColor: '#ff4d3d', color: 'white'}} onClick={open}>
                <Trash />
            </a>
        </>
    )
}