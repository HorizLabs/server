import { Button, Modal, Switch, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import style from '@/styles/components/Column.module.css';

export function CreateRole() {
    const [opened, { open, close }] = useDisclosure(false);
    const create_role = async (event: any) => {
        event.preventDefault();
        let info = new FormData(event.target);
        const response = await fetch('/api/role/create', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(info))
        })
    }
    return (
        <>
            <Modal opened={opened} onClose={close} title="Create a Role" size="lg" centered>
                <Modal.Body>
                    <form className={style.roleCreateForm} onSubmit={create_role}>
                        <TextInput label="Role Name" name="role_name" placeholder="Role Name" required />
                        <p>Permissions</p>
                        <div style={{display: 'flex', gap: 15}}>
                            <Switch label="Manage Roles" name="manage_roles" />
                            <Switch label="Manage Users" name="manage_users" />
                            <Switch label="Create Users" name="create_users" />
                        </div>
                        <div style={{display: 'flex', gap: 15}}>
                            <Switch label="Create Tests" name="create_tests" />
                            <Switch label="Create Test Questions" name="create_test_questions" />
                            <Switch label="Manage Test Settings" name="manage_test_questions" />
                        </div>
                        <div style={{display: 'flex', gap: 15}}>
                            <Switch label="Create Test Credentials" name="create_test_credentials" />
                            <Switch label="Proctor Tests" name="proctor_tests" />
                            <Switch label="Grade Responses" name="grade_responses" />
                        </div>
                        <Button type="submit">Create Role</Button>
                    </form>
                </Modal.Body>
            </Modal>
            <Button onClick={open}>Create Role</Button>
        </>
    )
}