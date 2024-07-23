``/api/tests```

### Basic Description and Overview

The endpoint is used to create tests. It requires the user token as a cookie called "token" for authentication. Only individuals who have roles "owner" and "admin" as of right now (7/22/2024) can create tests.

### Methods and Actions

- `POST` /api/account
    - **Description**: Create Tests
    - **Parameters**:
        - `name`: Name of the Test.
        - `description`: Description of the test
        - `start_time`: Start time of the test, in Unix time as seconds.
        - `end_time`: End time of the test, in Unix time as milliseconds.
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'CREATED_TEST', message: 'Created Successfully'
            - coreStatus: 'NOT_ALLOWED_ROLE', message: 'You are not allowed to make a test.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'