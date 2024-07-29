``/api/role```

### Basic Description and Overview

The endpoint is utilize to create, update, and delete roles. It requires that users need to be an owner or have the "manage_roles" permission to be able to create, modify, and delete roles.

### Methods and Actions

- `POST` /api/role
    - **Description**: Create Roles
    - **Parameters**:
        - `role_name`: Name of the Role.
        - `role_id`: ID of the role being changed
        - `initial_role_name`: Initial name of the role
        - Parameters, optional:
            - `manage_roles`: Permission for managing roles
            - `create_tests`: Permission for creating tests
            - `create_test_questions`: Permission to create test questions
            - `manage_test_settings`: Permission to manage test settings
            - `create_test_credentials`: Create test credentials for users
            - `proctor_tests`: Permission for individuals to proctor tests
            - `grade_responses`: Permission to grade test responses
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'DENIED', message: 'Creation has been denied.'
            - coreStatus: 'CANNOT_CREATE', message: 'The role name conflicts with another role's name.'
            - coreStatus: 'CREATED_ROLE', message: 'Role has been created.'
            - coreStatus: 'NOT_ALLOWED', message: 'You are not allowed to create a role.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*

- `PUT` /api/role
    - **Description**: Update role information in the database.
    - **Parameters**:
        - `role_name`: New name of the Role.
        - ``
        - Parameters, optional:
            - `manage_roles`: Permission for managing roles
            - `create_tests`: Permission for creating tests
            - `create_test_questions`: Permission to create test questions
            - `manage_test_settings`: Permission to manage test settings
            - `create_test_credentials`: Create test credentials for users
            - `proctor_tests`: Permission for individuals to proctor tests
            - `grade_responses`: Permission to grade test responses
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'DENIED', message: 'Updation has been denied.'
            - coreStatus: 'UPDATED_ROLE', message: 'Role has been modified.'
            - coreStatus: 'NOT_ALLOWED', message: 'You are not allowed to manage a role.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*

- `DELETE` /api/tests
    - **Description**: Delete role information and change users registered to staff role.
    - **Parameters**:
        - `role_name`: Name of the test to be deleted
        - `role_id`: ID of the test to be deleted
    - **Returns**:
        - coreStatus, message
    - **Status**:
        - Depends on the coreStatus and message, list are:
            - coreStatus: 'DENIED', message: 'Deletion has been denied.'
            - coreStatus: 'DELETED_ROLE', message: 'Role has been deleted successfully.'
            - coreStatus: 'NOT_ALLOWED', message: 'You are not allowed to delete a role.'
            - coreStatus: 'ERROR', message: 'An error has occurred.'\*

\* Note that the "ERROR" coreStatus is generic and should be evaluated further for issues.