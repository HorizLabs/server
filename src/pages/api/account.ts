import { db } from '@/db/db'
import { account } from '@/db/schema'
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { eq } from 'drizzle-orm'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Get data
    const data = JSON.parse(req.body)
    // Get the check to be able to determine if need to create a master account or to login
    const master_account_check = ((await db.select().from(account).where(eq(account.id, 1))).length != 0 ? true : false)
    // @ts-ignore
    // No master account? We shall make one.
    if (!master_account_check) {
        // Create account
        let salt = crypto.randomBytes(32).toString('hex')
        // Create hash
        let password = crypto.pbkdf2Sync(data.password, salt, 19847, 80, 'sha512').toString('hex')
        // Create account
        await db.insert(account).values({'name': data.name, 'email': data.email, 'password': password, 'role': 'owner', 'salt': salt})
        // Create token
        // @ts-ignore
        let token_info = await new jwt.SignJWT({'email': data.email}).setProtectedHeader({alg: 'HS256'}).setExpirationTime('5d').sign(crypto.createSecretKey(process.env?.JWT_SECRET, 'utf-8'))
        // Set cookie and response
        res.setHeader('Set-Cookie', `token=${token_info}; path=/; sameSite=strict;`)
        res.status(200).json({ coreStatus: 'RESPONSE_SUCCESS', message: 'Account created.'})
    } else {
        let account_info = await db.select().from(account).where(eq(account.email, data.email))
        if (account_info.length == 0) {
            res.status(400).json({ coreStatus: 'RESPONSE_ERROR', message: 'Incorrect password or email.'})
        }
        let salt = account_info[0].salt
        // @ts-ignore
        // Create hash
        let password = crypto.pbkdf2Sync(data.password, salt, 19847, 80, 'sha512').toString('hex')
        // // Check if account exists
        if (password != account_info[0].password) {
            res.status(400).json({ coreStatus: 'RESPONSE_ERROR', message: 'Incorrect password or email.'})
        } else {
            // Create token
            // @ts-ignore
            let token_info = await new jwt.SignJWT({'email': data.email}).setProtectedHeader({alg: 'HS256'}).setExpirationTime('5d').sign(crypto.createSecretKey(process.env?.JWT_SECRET, 'utf-8'))

            // Set cookie and response
            res.setHeader('Set-Cookie', `token=${token_info}; path=/; sameSite=strict;`)
            res.status(200).json({ coreStatus: 'RESPONSE_SUCCESS', message: 'Account logged in.'})
        }
    }
}