// Import libraries
import {drizzle} from "drizzle-orm/node-postgres"
// @ts-ignore
import { Client } from "pg"
import * as schema from "./schema"

// DB Client
export const client = new Client({
    user: process.env.DB_USER!,
    host: process.env.DB_HOST!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD!,
    port: parseInt(process.env.DB_PORT!),
    ssl: process.env.DB_SSL?.toLowerCase() == 'true' ? true : false,
})

client.connect()

export const db = drizzle(client, {schema})