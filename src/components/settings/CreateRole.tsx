import { Button, Modal, Switch, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import style from '@/styles/components/Column.module.css';
import { useState } from "react";
import { Loader } from "react-feather";

export function CreateRole() {
    const [opened, { open, close }] = useDisclosure(false);
    const [error, setError] = useState('')
    const [buttonState, setButtonState] = useState(false)

    const create_role = async (event: any) => {
        event.preventDefault();
        setButtonState(true)
        let info = new FormData(event.target);
        const response = await fetch('/api/role/create', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(info))
        })
        const data = await response.json();
        if (data.coreStatus == 'CREATED_ROLE') {
            window.location.replace('/settings')
        } else {
            setButtonState(false)
            setError(data.message)
        }
    }
    return (
        <>
            <Modal opened={opened} onClose={close} title="Create a Role" size="lg" centered>
                <Modal.Body>
                    <form className={style.roleCreateForm} onSubmit={create_role}>
                        {(error != '') ? <p style={{color: 'red'}}>{error}</p> : null}
                        <TextInput label="Role Name" name="role_name" placeholder="Role Name" required />
                        <p>Permissions</p>
                        <div style={{display: 'flex', gap: 15}}>
                            <Switch label="Create Tests" name="create_tests" />
                        </div>
                        <div style={{display: 'flex', gap: 15}}>
                            <Switch label="Create Test Questions" name="create_test_questions" />
                            <Switch label="Manage Test Settings" name="manage_test_settings" />
                        </div>
                        <div style={{display: 'flex', gap: 15}}>
                            <Switch label="Create Test Credentials" name="create_test_credentials" />
                            <Switch label="Proctor Tests" name="proctor_tests" />
                            <Switch label="Grade Responses" name="grade_responses" />
                        </div>
                        {buttonState ? <Button><Loader color="white" style={{transform: 'scale(0.65)'}} /></Button> : <Button type="submit">Create Role</Button>}
                    </form>
                </Modal.Body>
            </Modal>
            <Button onClick={open}>Create Role</Button>
        </>
    )
}