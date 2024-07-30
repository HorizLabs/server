![horizon_dashboard](https://github.com/user-attachments/assets/7f3ec544-2431-418a-bf9f-c16261b22525)

# 📓 Horizon Server, the test-making and management platform created by Horizon Labs
## About Horizon Server
Horizon Server is a test-creation and management platform shipped as a server created by Horizon Labs. It is designed to be a simple, easy-to-use, and efficent platform for creating tests and for individuals to be able to access and submit tests and is written in NextJS. The project utilizes the AGPL-3 license to be able to allow for you to learn and utilize the platform as standalone.

## Features
- Easy to use platform
- Simple and easy to setup

## Requirements
- NodeJS or Bun
- PostgreSQL

## Installation
Clone the repository and run the install command:

Bun:  ```bash bun install```
NodeJS:  ```npm bun install```

### Database Configuration

Next, create a PostgreSQL database and get the connection string. You can watch a tutorial on how to make the database through a list of videos [here](https://www.youtube.com/results?search_query=create+postgresql+database)

### Environment Configuration
After you have created the database, create a .env file in the root directory and add the following (also referenceable from .env.example):

```bash
DB_USER = "DB_USRNAME"
DB_HOST = "DB_HOST"
DB_NAME = "DB_NAME"
DB_PASSWORD = 'DB_PASSWORD'
DB_PORT = "DB_PORT"
DB_SSL = "SSL_REQUIRED_OR_NOT_AS_TRUE_OR_FALSE"
JWT_SECRET = "JWT_SECRET_HERE"
```

To give you an example, here is sample content:

```bash
DB_USER = "postgres"
DB_HOST = "localhost"
DB_NAME = "horizon"
DB_PASSWORD = 'password'
DB_PORT = "5432"
DB_SSL = "false"
JWT_SECRET = "SECRET_CORP_HORIZON"
```

Note that the JWT_SECRET can be anything you want, but it is recommended for it to be long and secure. You can achieve this through a password generator.

### Initializing the Database and running the server
After you have completed the previous steps, you can initialize the database by running:

Bun: ```bash bun run setup```
NodeJS: ```npm bun run setup```

After you have initialized the database, you can run the server by running:

Bun: ```bash bun run dev```
NodeJS: ```npm bun run dev```

After you have run the server, you can access the server at http://localhost:3000

### Building

If you are content with the server and your changes, you can build the server by following the tutorial [here](https://nextjs.org/docs/pages/building-your-application/deploying).

## Contributing

Contributions to the project are welcome and encouraged. To contribute, please fork the repository and create a pull request. Please remember to follow the [Loom Project Policies](https://avnce.org/Project_Policies.pdf) as they apply and are enforced on this project and all Loom projects, including Horizon Labs.

## License

This project is licensed under the AGPL-3 License. You can view the license [here](https://github.com/HorizLabs/TestA/blob/main/LICENSE).

## Documentation

Documentation for the repository can be found in the documentation folder.
