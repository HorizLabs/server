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
    questionCount: serial('question_count'),
    test_status: text('test_status', {enum: ['draft', 'active', 'suspended', 'archived']}).default('draft'),
})

export const testSettings = platform.table('platform_test_settings', {
    id: serial('id').primaryKey(),
    test_id: serial('test_id').notNull(),
    allow_retakes: boolean('allow_retakes').default(false),
    test_status: text('test_status', {enum: ['draft', 'active', 'suspended', 'archived']}).default('draft'),
    randomize_questions: boolean('randomize_questions').default(false),
    use_web_platform: boolean('use_web_platform').default(false),
    enable_proctoring: boolean('enable_proctoring').default(false),
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

export const test_access = platform.table('platform_test_access', {
    id: serial('id').primaryKey(),
    test_id: serial('test_id'),
    participant_name: text("participant_name"),
    username: text("username"),
    password: text("password"),
})

export const questionSubmission = platform.table('platform_question_submission', {
    id: serial('id').primaryKey(),
    test_id: serial('test_id'),
    participant_id: serial('participant_id'),
    question_id: serial('question_id'),
    response: text('question_response'),
    points_awarded: serial('points')
})

export const role = platform.table('platform_roles', {
    id: serial('id').primaryKey(),
    name: text('role_name'),
    createTests: boolean('create_tests').default(false),
    createTestQuestions: boolean('create_questions').default(true),
    createTestCredentials: boolean('create_test_credentials').default(true),
    gradeTestResponses: boolean('grade_test_responses').default(true),
    modifyTestSettings: boolean('modify_test_settings').default(false),
    proctorTests: boolean('proctor_tests').default(false),
    manageRoles: boolean('manage_roles').default(false)
})