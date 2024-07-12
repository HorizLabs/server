import { pgEnum, pgSchema, serial, text } from "drizzle-orm/pg-core";

export const testa = pgSchema('testa')

export const userRole = pgEnum('role', ['owner', 'administrator', 'staff', 'development'])

export const account = testa.table('account', {
    id: serial('id').primaryKey(),
    name: text('name'),
    email: text('email'),
    password: text('password'),
    salt: text('salt'),
    role: userRole('role'),
})