import { date, pgEnum, pgSchema, serial, text } from "drizzle-orm/pg-core";

export const platform = pgSchema('platform')


export const account = platform.table('platform_account', {
    id: serial('id').primaryKey(),
    name: text('name'),
    email: text('email'),
    password: text('password'),
    salt: text('salt'),
    role: text('role'),
})

export const tests = platform.table('platform_tests', {
    id: serial('id').primaryKey(),
    name: text('name'),
    description: text('description'),
    created_by: text('created_by'),
    created_on: date('created_on').defaultNow(),
    ends_on: date('end_by'),
    test_status: text('test_status', {enum: ['draft', 'active', 'suspended', 'archived']}).default('draft'),
})