``/api/tests/question_bank```

### Basic Description and Overview

The endpoint is used to submit questions to the question bank. It requires the user token as a cookie called "token" for authentication with any role being able to create and delete questions in the question bank.

### Methods and Actions

- `POST` /api/tests/question_bank
    - **Description**: Create test questions in the question bank
    - **Parameters**:
        - `test_id`: ID of the test the question is being submitted to.
        - `question`: Question Content
        - `question_answer`: Answer for the test, can be one answer but preferably with spaces/commas.
        - `question_options`: Options for the multiple choice type, seperated by commas or by spaces.
        - `question_type`: Type of question, such as multiple choice or short and long answer. Required entry needs to be `Multiple Choice`, `Short Answer`, or `Long Answer`.
        - `points`: Total Points for the question
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'SUCCESS', message: 'Question has been added to Question Bank.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*

- `DELETE` /api/tests/question_bank
    - **Description**: Delete test questions in the question bank
    - **Parameters**:
        - `question_id`: ID of the question in the question bank
        - `confirmation`: Confirmation being a boolean value acknowledging that all content and submissions with the test ID will be deleted.
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'DENIED', message: 'Deletion has been denied due to you being unauthenticated.'
            - coreStatus: 'DELETION_DENIED_CONFIRMATION', message: 'Deletion has been denied due to no confirmation being provided.'
            - coreStatus: 'DELETED', message: 'Question has been deleted from the Question Bank.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*


\* Note that the "ERROR" coreStatus is generic and should be evaluated further for issues.