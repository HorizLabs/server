import { db } from '@/db/db'
import { account, question_bank, tests } from '@/db/schema'
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { eq } from 'drizzle-orm'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    } catch (e) {
        res.status(400).json({
            coreStatus: 'ERROR',
            message: 'An error has occurred.'
        })
    }
}