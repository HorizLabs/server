import { db } from '@/db/db'
import { account, role, role } from '@/db/schema'
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
                return;
            }
            // @ts-ignore
            let role_list = await db.select().from(role).where(eq(role.name, accountInfo[0].role))
            if (role_list.length != 0) {
                res.status(421).json({
                    coreStatus: 'CANNOT_CREATE',
                    message: 'The role name conflicts with another role.'
                })
            }
            

            res.status(201).json({
                coreStatus: 'CREATED_ROLE',
                message: 'Role has been created.'
            })
        } catch (e) {
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }
    }
}