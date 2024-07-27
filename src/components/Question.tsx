import { Button, Modal, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DeleteQuestionBankQuestion } from "./DeleteQuestionBankQuestion";

export function Question(props: any) {
    const { question, id } = props;
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Table.Tr key={id}>
                <Modal opened={opened} onClose={close} title="Question Information" centered>
                    <Modal.Body>
                        <p>Question ID: {question.id}</p>
                        <p>Question: {question.question}</p>
                        <p>Answer: {question.answer}</p>
                        <p>Points: {question.points}</p>
                        {question.options != null && question.options != '' ? <p>Options: {question.options}</p> : null}
                        <p>Question Type: {question.multiple_choice ? 'Multiple Choice' : question.long_answer ? 'Long Answer' : question.short_answer ? 'Short Answer' : 'None'}</p>
                        <DeleteQuestionBankQuestion id={question.id} />
                    </Modal.Body>
                </Modal>
                    <Table.Td>{question.id}</Table.Td>
                    <Table.Td><Button onClick={open}>View</Button></Table.Td>
        </Table.Tr>
        </>
    )
}

