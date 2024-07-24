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
        console.log(data)
        let s = '5 3'
        let cleanedOptions = await data.question_options.split(/, | /)
        let cleanedAnswers = await data.question_answer.split(/, | /)
        let questionTypes = {
            'Multiple Choice': 'multiple_choice',
            ''
        }
        // await db.insert(question_bank).values({
        //     'answer': cleanedAnswers,
        //     'test_id': data.test_id,
        //     'question': data.question,
        //     'points': data.points,
        // })
    } catch (e) {
        res.status(400).json({
            coreStatus: 'ERROR',
            message: 'An error has occurred.'
        })
    }
}