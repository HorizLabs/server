# 📓 Horizon TestA, the test-making and management platform created by Horizon Labs
## About TestA
TestA is a test-creation and management platform shipped as a server created by Horizon Labs. It is designed to be a simple, easy-to-use, and efficent platform for creating tests and for individuals to be able to access and submit tests and is written in NextJS.

## Features
- Easy to use platform
- Simple and easy to setup

## Requirements
- NodeJS or Bun
- PostgreSQL

## Installation
Clone the repository and run the install command:
```bash
bun install
```
Then you will need to configure the database, with the database being a postgresql database. Please then fill out the .env file by referencing the values from .env.example and incorporating your own values from the database and a password that you set up.

After that, setup the database with the following command:
```bash
bun run setup
```

After that, you can run the server with the following command:
```bash
bun run dev
```

That's it! You can access the server at [http://localhost:3000](http://localhost:3000)