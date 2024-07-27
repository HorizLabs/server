``/api/tests/access```

### Basic Description and Overview

The endpoint is used to create and delete credentials for users to be able to utilize for testtaking.

### Methods and Actions

- `POST` /api/tests/access
    - **Description**: Create credentials for user based on name
    - **Parameters**:
        - `test_id`: ID of the test the user is associated with
        - `participant_name`: Name of the participant
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'CANNOT_ALLOW', message: 'Your account does not exist.'
            - coreStatus: 'CREATED_CREDENTIALS', message: 'Successfully created requested credentials.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*

\* Note that the "ERROR" coreStatus is generic and should be evaluated further for issues.