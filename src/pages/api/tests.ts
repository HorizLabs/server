import { db } from '@/db/db'
import { account, tests } from '@/db/schema'
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { eq } from 'drizzle-orm'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Get data
        const data = JSON.parse(req.body)
        console.log(data)
        let cookie = await req.cookies['token']
        // @ts-ignore
        let info = await await (await jwt.jwtVerify(cookie, crypto.createSecretKey(process.env.JWT_SECRET, 'utf-8')));
        // @ts-ignore
        let accountInfo = await db.select().from(account).where(eq(account.email, info.payload.email))
        if (accountInfo[0].role == 'owner' || accountInfo[0].role == 'admin') {
            await db.insert(tests).values({
                'description': data.description,
                'name': data.name,
                'starts_on': data.start_time,
                'ends_on': data.end_time,
            })
            res.status(201).json({
                coreStatus: 'CREATED_TEST',
                message: 'Created Successfully'
            })
        } else {
            res.status(403).json({
                coreStatus: 'NOT_ALLOWED_ROLE',
                message: 'You are not allowed to make a test.'
            })
        }
    } catch (e) {
        console.log(e)
        res.status(400).json({
            coreStatus: 'ERROR',
            message: 'An error has occurred.'
        })
    }
}