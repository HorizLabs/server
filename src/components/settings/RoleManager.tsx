import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CreateRole } from "./CreateRole";
import { ManageRole } from "./ManageRole";

export function RoleManager(props: any) {
    let rolePermissions = props.rolePermissions;
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal opened={opened} onClose={close} title="Role Manager" size="md" centered>
                <Modal.Body style={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
                    <h1>Available Roles</h1>
                    <ul style={{display: 'flex', flexDirection: 'column', gap: '0.5em'}}>
                        <li>Owner</li>
                        <li>Admin</li>
                        <li>Staff</li>
                        {rolePermissions.map((role: any, id: any) => {
                            return <li key={id}>{role.name} <ManageRole role={role} key={id}/></li>
                        })}
                    </ul>
                    <CreateRole />
                </Modal.Body>
            </Modal>
            <Button onClick={open}>Role Manager</Button>
        </>
    )
}