import { pgEnum, pgSchema, serial, text } from "drizzle-orm/pg-core";

export const platform = pgSchema('platform')


export const account = platform.table('platform_account', {
    id: serial('id').primaryKey(),
    name: text('name'),
    email: text('email'),
    password: text('password'),
    salt: text('salt'),
    role: text('role'),
})