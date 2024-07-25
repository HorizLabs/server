``/api/users```

### Basic Description and Overview

The endpoint is used to create, delete, and update user accounts. For all the functions, the endpoint requires the following parameters:

**Creation:**
- `name` name of the user
- `role` the role of the user, in lowercase preferably
- `email` the email of the user
- `password` the custom password of the user that you set it to

**Delete:**
- `id` the id of the user

**Update:**
- `id` the id of the user
- `name` name of the user
- `role` the role of the user, in lowercase preferably
- `email` the email of the user

For security reasons, the password cannot be changed apart from being reset by the user.

### Methods and Actions

- `POST` /api/users
    - **Description**: Make an user
    - **Parameters**:
        - `name` name of the user
        - `role` the role of the user, in lowercase preferably
        - `email` the email of the user
        - `password` the custom password of the user
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'CREATED_ACCOUNT', message: 'Created Account Successfully'
            - coreStatus: 'NOT_ALLOWED_CREATE_USER_HIGHER_ROLE', message: 'You are not allowed to create a user with a higher role than you.'
            - coreStatus: 'NOT_ALLOWED_ROLE', message: 'You are not allowed to create a user.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*

- `DELETE` /api/account
    - **Description**: Delete an user
    - **Parameters**:
        - `id` the id of the user
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'DELETED_ACCOUNT', message: 'Deleted Account Successfully'
            - coreStatus: 'NOT_ALLOWED_DELETE_USER_HIGHER_ROLE', message: 'You are not allowed to delete a user with a higher role than you.'
            - coreStatus: 'NOT_ALLOWED_ROLE', message: 'You are not allowed to delete a user.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*

- `PUT` /api/account
    - **Description**: Update information of an user
    - **Parameters**:
        - `id` the id of the user
        - `name` name of the user
        - `role` the role of the user, in lowercase preferably
        - `email` the email of the user
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'UPDATED_ACCOUNT', message: 'Updated Account Successfully'
            - coreStatus: 'NOT_ALLOWED_UPDATE_USER_HIGHER_ROLE', message: 'You are not allowed to update a user with a higher role than you.'
            - coreStatus: 'NOT_ALLOWED_ROLE', message: 'You are not allowed to update a user.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*

\* Note that this is a generic error for a wide variety of issues.