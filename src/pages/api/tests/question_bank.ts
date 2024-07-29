import { db } from '@/db/db'
import { account, question_bank, questionSubmission, role, tests } from '@/db/schema'
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { eq } from 'drizzle-orm'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        try {
            // Get data
            const data = JSON.parse(req.body)
            let cookie = await req.cookies['token']
            // @ts-ignore
            let info = await await (await jwt.jwtVerify(cookie, crypto.createSecretKey(process.env.JWT_SECRET, 'utf-8')));
            // @ts-ignore
            let accountInfo = await db.select().from(account).where(eq(account.email, info.payload.email))
            if (accountInfo.length == 0) {
                res.status(400).json({
                    coreStatus: 'DENIED',
                    message: 'Creation has been denied.'
                })    
            }
            // @ts-ignore
            let roleCheck = await db.select().from(role).where(eq(role.name, accountInfo[0].role))
            if ((roleCheck.length != 0 && roleCheck[0].createTestQuestions == true) || accountInfo[0].role == 'owner' || accountInfo[0].role == 'admin') {
                let cleanedOptions = await data.question_options.split(/, | /).toString()
                let cleanedAnswers = await data.question_answer.split(/, | /).toString()
                let questionTypes = {
                    'Multiple Choice': 'multiple_choice',
                    'Short Answer': 'short_answer',
                    'Long Answer': 'long_answer'
                }
                // @ts-ignore
                let questionType = questionTypes[data.question_type]
                await db.insert(question_bank).values({
                    'answer': cleanedAnswers,
                    'test_id': data.test_id,
                    'question': data.question,
                    'options': cleanedOptions,
                    'points': data.points,
                    'long_answer' : questionType == 'long_answer',
                    'short_answer': questionType == 'short_answer',
                    'multiple_choice': questionType == 'multiple_choice'
                })
                res.status(201).json({
                    coreStatus: 'SUCCESS',
                    message: 'Question has been added to Question Bank.'
                })
            } else {
                res.status(400).json({
                    coreStatus: 'DENIED',
                    message: 'Creation has been denied due to no permissions being provided.'
                })
            }
        } catch (e) {
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }
    } else if (req.method == 'DELETE') {
        try {
            // Get data
            const data = JSON.parse(req.body)
            let cookie = await req.cookies['token']
            // @ts-ignore
            let info = await await (await jwt.jwtVerify(cookie, crypto.createSecretKey(process.env.JWT_SECRET, 'utf-8')));
            // @ts-ignore
            let accountInfo = await db.select().from(account).where(eq(account.email, info.payload.email))
            // @ts-ignore
            let roleCheck = await db.select().from(role).where(eq(role.name, accountInfo[0].role))

            if (accountInfo.length == 0 || (roleCheck.length != 0 && roleCheck[0].createTestQuestions == true) || accountInfo[0].role == 'owner' || accountInfo[0].role == 'admin') {
                res.status(400).json({
                    coreStatus: 'DENIED',
                    message: 'Deletion has been denied due to you being unauthenticated.'
                })    
            } else if (data.confirmation != true) {
                res.status(400).json({
                    coreStatus: 'DELETION_DENIED_CONFIRMATION',
                    message: 'Deletion has been denied due to no confirmation being provided.'
                })
            }
            await db.delete(question_bank).where(eq(question_bank.id, data.question_id))
            await db.delete(questionSubmission).where(eq(questionSubmission.question_id, data.question_id))
            res.status(201).json({
                coreStatus: 'DELETED',
                message: 'Question has been deleted from the Question Bank.'
            })
        } catch (e) {
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }
    }
}