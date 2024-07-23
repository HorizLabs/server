``/api/account```

### Basic Description and Overview

The endpoint is used to create and login to accounts. Accounts are creatable by determination of the amount of users currently in the database, and if there are none, the first user is created and given the "owner" role. For both creating and logging in, the endpoint requires the following parameters:

**Creation:**
- `name` the name of the user
- `email` the email of the user
- `password` the password of the user

**Login**
- `email` the email of the user
- `password` the password of the user

After the user is created, a JWT token will be set in headers. The token is utilized to authenticate the user and is required for the other endpoints. The token is normally valid for 5 days.

### Methods and Actions

- `POST` /api/account
    - **Description**: Make and Login to an Account
    - **Parameters**:
        - `name`: Name of the user, preferably full name
        - `email`: Email of the user
        - `password`: Password of the user
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'RESPONSE_SUCCESS', message: 'Account created.'
            - coreStatus: 'RESPONSE_ERROR', message: 'Incorrect password or email.'
            - coreStatus: 'RESPONSE_SUCCESS', message: 'Account logged in.'