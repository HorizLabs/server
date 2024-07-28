import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export function RoleManager(props: any) {
    let rolePermissions = props.rolePermissions;
    console.log(rolePermissions)
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal opened={opened} onClose={close} title="Role Manager" size="md" centered>
                <Modal.Body>
                    <p>System Roles that you cannot change:</p>
                    <ul>
                        <li>Owner</li>
                        <li>Admin</li>
                    </ul>
                    <p>Roles</p>

                </Modal.Body>
            </Modal>
            <Button onClick={open}>Role Manager</Button>
        </>
    )
}