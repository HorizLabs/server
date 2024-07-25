``/api/tests/settings```

### Basic Description and Overview

The endpoint is used to edit features available within the settings for the test, with a cookie called "token" being required and it needing to store the JWT Secret. Only users with the roles of "admin" or "owner" are able to change features in here.

### Methods and Actions

- `PUT` /api/tests/settings
    - **Description**: Create test questions in the question bank
    - **Parameters**:
        - `test_id`: ID of the test being edit.
        - `status`: Status as a boolean value
        - `name`: Name of the feature that is being enabled or disabled, this is mainly for switch features but it is. Needs to be either "allow_retakes," "randomize_questions," or "publish_test" as of July 25th of 2024.
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'UPDATED_TEST', message: 'Updated test information successfully'
            - coreStatus: 'NOT_ALLOWED_ROLE', message: 'You are not allowed to update a test.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*

\* Note that the "ERROR" coreStatus is generic and should be evaluated further for issues.