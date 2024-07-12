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
    
    let token_info = await new jwt.SignJWT({'email': data.email}).setProtectedHeader({alg: 'HS256'}).setExpirationTime('2h').sign(crypto.createSecretKey(process.env?.JWT_SECRET, 'utf-8'))
    res.status(200).json({ name: 'John Doe' })
}