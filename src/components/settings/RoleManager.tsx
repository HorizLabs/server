import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CreateRole } from "./CreateRole";

export function RoleManager(props: any) {
    let rolePermissions = props.rolePermissions;
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal opened={opened} onClose={close} title="Role Manager" size="md" centered>
                <Modal.Body>
                    <h1>Available Roles</h1>
                    <ul>
                        <li>Owner</li>
                        <li>Admin</li>
                        <li>Staff</li>
                        {rolePermissions.map((role: any, id: any) => {
                            return <li key={id}>{role.name}</li>
                        })}
                    </ul>
                    <CreateRole />
                </Modal.Body>
            </Modal>
            <Button onClick={open}>Role Manager</Button>
        </>
    )
}