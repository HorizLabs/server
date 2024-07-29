import { db } from '@/db/db'
import { account } from '@/db/schema'
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { eq } from 'drizzle-orm'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from 'fs'

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
                    message: 'Changing experiment status has been denied.'
                })    
                return;
            }

            if (accountInfo[0].role == 'owner' || accountInfo[0].role == 'admin') {
                fs.writeFileSync(`./src/lib/experimental.ts`, `export const experimental = ${data.enable || false}`, 'utf-8')
                res.status(201).json({
                    coreStatus: 'FINALIZED_STATUS',
                    message: 'Experiment status has been updated.'
                })                
            } else {
                res.status(403).json({
                    coreStatus: 'NOT_ALLOWED',
                    message: 'You are not allowed to set experimental features.'
                })
            }       
        } catch (e) {
            res.status(431).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }
    }
}