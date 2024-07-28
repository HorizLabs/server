``/api/account```

### Basic Description and Overview

The endpoint is used to create, login, delete, and change email and passwords of accounts. Accounts are creatable by determination of the amount of users currently in the database, and if there are none, the first user is created and given the "owner" role. For both creating and logging in, the endpoint requires the following parameters:

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

- `DELETE` /api/account
    - **Description**: Delete an account or wipe the entire database (if account is owner).
    - **Parameters**:
        - `password`: Password of the user
        - `confirmation`: Confirmation agreeing that an account or all of the database contents will be deleted.
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'CONFIRMED_DELETED', message: 'Everything has been deleted. Have a good day!', or message: 'Account has been deleted. Have a good day!'
            - coreStatus: 'ERROR', message: 'Could not delete account'\*

- `PUT` /api/account
    - **Description**: Change account settings based on feature, such as "CHANGE_EMAIL" or "CHANGE_PASSWORD"
    - **Parameters**:
        - `feature`: Specific thing to change, based on a feature, such as changing email or password
            - for changing email
                - `old_email`: Initial email provided on signup
                - `new_email`: New email to change
                - `confirm_new_email`: Confirm the new email
            - for changing password
                - `old_password`: Initial password
                - `new_password`: New password to change to
                - `confirm_new_password`: Confirmation of new password
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'CANNOT_CHANGE', message: 'You are not authenticated.'
            - coreStatus: 'CONFLICTING_EMAIL', message: 'Current email conflicts with annother account.'
            - coreStatus: 'CHANGED_EMAIL', message: 'Successfully changed your account.'
            - coreStatus: 'FAILED_TO_CHANGE_EMAIL', message: 'Failed to change email due to new email not being confirmed.'
            - coreStatus: 'CHANGED_PASSWORD', message: 'Changed password successfully.'
            - coreStatus: 'ERROR', message: 'Could not delete account'\*

\* The error status is a generic message which should be investigated in development to find out, it is mainly particularly associated with JWT issues, but it could be different.