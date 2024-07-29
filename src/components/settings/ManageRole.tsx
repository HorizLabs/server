import { Button, Loader, Modal, Switch, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export function ManageRole(props: any) {
    const [opened, { open, close }] = useDisclosure(false);
    const [LoadButton, setButtonState] = useState(false);
    const [DeleteButton, setDeleteButtonState] = useState(false);
    const [error, setError] = useState('')

    const modifyRole = async (e: any) => {
        e.preventDefault();
        setButtonState(true)
        const res = await fetch('/api/role/', {
            method: 'PUT',
            body: JSON.stringify({
                role_name: e.target.role_name.value,
                role_id: props.role.id,
                initial_role_name: props.role.name,
                manage_roles: e.target.manage_roles.checked,
                create_tests: e.target.create_tests.checked,
                create_test_questions: e.target.create_test_questions.checked,
                manage_test_settings: e.target.manage_test_settings.checked,
                create_test_credentials: e.target.create_test_credentials.checked,
                proctor_tests: e.target.proctor_tests.checked,
                grade_responses: e.target.grade_responses.checked
            })
        })
        const data = await res.json()
        if (data.coreStatus == 'UPDATED_ROLE') {
            window.location.reload()
        }  else {
            setButtonState(false)
            setError(data.message)
        }
    }

    const deleteRole = async () => {
        setDeleteButtonState(true)
        await fetch('/api/role/', {
            method: 'DELETE',
            body: JSON.stringify({
                role_name: props.role.name,
                role_id: props.role.id
            })
        })
        window.location.reload()
    }
    return (
        <>
            <Modal onClose={close} opened={opened} size={'lg'} centered title={`Manage ${props.role.name}`}>
                <Modal.Body>
                    <h2>Manage</h2>
                    <form style={{display: 'flex', flexDirection: 'column', gap: '1em'}} onSubmit={modifyRole}>
                        {(error != '') ? <p style={{color: 'red'}}>{error}</p> : null}
                        <TextInput label="Role Name" name="role_name" placeholder="Role Name" defaultValue={props.role.name} required />
                        <p>Permissions</p>
                        <div style={{display: 'flex', gap: 15}}>
                            <Switch label="Manage Roles" name="manage_roles" defaultChecked={props.role.manageRoles} />
                        </div>
                        <div style={{display: 'flex', gap: 15}}>
                            <Switch label="Create Tests" name="create_tests" defaultChecked={props.role.createTests} />
                            <Switch label="Create Test Questions" name="create_test_questions" defaultChecked={props.role.createTestQuestions} />
                            <Switch label="Manage Test Settings" name="manage_test_settings" defaultChecked={props.role.modifyTestSettings} />
                        </div>
                        <div style={{display: 'flex', gap: 15}}>
                            <Switch label="Create Test Credentials" name="create_test_credentials" defaultChecked={props.role.createTestCredentials}  />
                            <Switch label="Proctor Tests" name="proctor_tests" defaultChecked={props.role.proctorTests} />
                            <Switch label="Grade Responses" name="grade_responses" defaultChecked={props.role.gradeTestResponses} />
                        </div>
                        <div style={{display: 'flex', gap: '1em'}}>
                            {LoadButton ? <Button color="blue"><Loader color="white" style={{transform: 'scale(0.65)'}} /></Button> : <Button color="blue" type="submit">Modify Role</Button>}
                            {DeleteButton ? <Button color="red"><Loader color="white" style={{transform: 'scale(0.65)'}} /></Button> : <Button color="red" onClick={deleteRole}>Delete Role</Button>}
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Button color="purple" onClick={open}>Manage Role</Button>
        </>
    )
}