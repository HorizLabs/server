import { Button, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";

export function DeleteQuestionBankQuestion(props: any) {
    let id = props.id
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal opened={opened} onClose={close} title="Delete Question" centered>
                <Modal.Body style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                    <h2>Are you sure you want to delete this question?</h2>
                    <p>Deleting this question would lead to the removal of all associated question data and submission by individuals in the database.</p>
                    <Button color="red" onClick={async (eq: any) => {
                        await fetch('/api/tests/question_bank', {
                            'method': 'DELETE',
                            'body': JSON.stringify({
                                'question_id': id,
                                'confirmation': true
                            })
                        })
                        window.location.reload()
                    }}>Delete</Button>
                </Modal.Body>
            </Modal>
            <Button color="red" onClick={open}>Delete</Button>
        </>
    )
}