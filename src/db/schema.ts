import { randomBytes } from "crypto";
import { boolean, date, pgEnum, pgSchema, serial, text, uuid } from "drizzle-orm/pg-core";

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
    created_on: date('created_on').defaultNow(),
    starts_on: text('start_by'),
    ends_on: text('end_by'),
    test_status: text('test_status', {enum: ['draft', 'active', 'suspended', 'archived']}).default('draft'),
})

export const question_bank = platform.table('platform_question_bank', {
    id: serial('id').primaryKey(),
    test_id: serial('test_id'),
    question: text('question'),
    multiple_choice: boolean('multiple_choice'),
    long_answer: boolean('long_answer'),
    short_answer: boolean('short_answer'),
    points: serial('points'),
    options: text('options'),
    answer: text('answer'),
})