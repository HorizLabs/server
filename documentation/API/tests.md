``/api/tests```

### Basic Description and Overview

The endpoint is used to create tests. It requires the user token as a cookie called "token" for authentication. Only individuals who have roles "owner" and "admin" as of right now (7/22/2024) can create and update tests.

### Methods and Actions

- `POST` /api/tests
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
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*

- `PUT` /api/tests
    - **Description**: Update base test information in the database, normally utilizes the updation wizard.
    - **Parameters**:
        - `name`: Name of the Test.
        - `description`: Description of the test
        - `start_time`: Start time of the test, in Unix time as seconds.
        - `end_time`: End time of the test, in Unix time as milliseconds.
        - `id`: ID of the test that is being updated
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'UPDATED_TEST', message: 'Updated test information successfully'
            - coreStatus: 'NOT_ALLOWED_ROLE', message: 'You are not allowed to update a test.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*

\* Note that the "ERROR" coreStatus is generic and should be evaluated further for issues.