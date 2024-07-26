import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Loader } from "react-feather";

export default function DeleteTest(props: any) {
    const [opened, {open, close}] = useDisclosure(false);
    const [buttonStatus, setButtonStatus] = useState(false)

    const deleteTest = async () => {
        let s = await fetch('/api/tests', {
            'method': 'DELETE',
            'body': JSON.stringify({
                'confirmation': true,
                'test_id': props.test_id
            })
        })
        let data = await s.json()
        if (data.coreStatus == 'DELETED_TEST') {
            window.location.href = '/tests'
        } else {
            window.location.reload()
        }
    }
    return (
        <>
            <Modal opened={opened} onClose={close} title="Confirmation" size={'md'} centered>
                <Modal.Body style={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                    <h1>Are you sure you would like to delete the test?</h1>
                    <p>This will lead to the entire test getting deleted and all of its content! You cannot undo this.</p>
                    {buttonStatus ? <Button color="red"><Loader color="white" style={{transform: 'scale(0.7)'}} /></Button> : <Button color="red" onClick={deleteTest}>I confirm, delete</Button>}
                </Modal.Body>
            </Modal>
            <Button color="red" onClick={open}>Delete Test</Button>
        </>
    )
}