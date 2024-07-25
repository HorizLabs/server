import { db } from '@/db/db'
import { account, question_bank, test_access, tests, testSettings } from '@/db/schema'
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
                    coreStatus: 'CANNOT_ALLOW',
                    message: 'Your account does not exist.'
                })
            } else {
                let password = crypto.randomBytes(15)
                let username = data.participant_name.replace(/\s/g, '').toLowerCase() + crypto.randomBytes(5).toString('hex') + data.test_id
                // @ts-ignore
                await db.insert(test_access).values({
                    'test_id': parseInt(data.test_id),
                    'participant_name': data.participant_name,
                    'username': username,
                    'password': password
                })
                res.status(201).json({
                    coreStatus: 'CREATED_CREDENTIALS',
                    message: 'Successfully created requested credentials.'
                })

                // res.status(501).json({
                //     coreStatus: 'Stop',
                //     message: 'This feature is currently being worked on. Please try again later!'
                // })
            }
        } catch (e) {
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }
    }
}