``/api/experiments```

### Basic Description and Overview

The endpoint is used to enable or to disable experimental features, which are unstable features that are in development and before being released to production.

### Methods and Actions

- `POST` /api/account
    - **Description**: Make and Login to an Account
    - **Parameters**:
        - `enable`: Boolean value to enable or disable experimental features.
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'DENIED', message: 'Changing experiment status has been denied.'
            - coreStatus: 'FINALIZED_STATUS', message: 'Experiment status has been updated.'
            - coreStatus: 'NOT_ALLOWED', message: 'You are not allowed to set experimental features.'
            - coreStatus: 'ERROR', message: 'An error has occurred.' \*


\* The error status is a generic message which should be investigated in development to find out, it is mainly particularly associated with JWT issues, but it could be different.