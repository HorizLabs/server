import { db } from '@/db/db'
import { account } from '@/db/schema'
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
            // Update role
            let updatedRole = data?.role.toLowerCase();
            // Create account salt
            let salt = crypto.randomBytes(32).toString('hex')
            // Create hash
            let password = crypto.pbkdf2Sync(data.password, salt, 19847, 80, 'sha512').toString('hex')
            // Create account
            await db.insert(account).values({'name': data.name, 'email': data.email, 'password': password, 'role': updatedRole, 'salt': salt})
            res.status(201).json({
                coreStatus: 'CREATED_ACCOUNT',
                message: 'Created Account Successfully'
            })
        } else {
            res.status(403).json({
                coreStatus: 'NOT_ALLOWED_ROLE',
                message: 'You are not allowed to create a user.'
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