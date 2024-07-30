import { db } from '@/db/db'
import { accessProctorMap, account, proctor, proctorID, question_bank, questionSubmission, role, test_access, tests, testSettings } from '@/db/schema'
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { eq } from 'drizzle-orm'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        // Get data
        const data = JSON.parse(req.body)
        // Get the check to be able to determine if need to create a master account or to login
        const master_account_check = (await db.select().from(account)).length != 0
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
    } else if (req.method == 'DELETE') {
        try {
            // Get data
            const data = JSON.parse(req.body)
            let confirmation = data.confirmation;
            let cookie = await req.cookies['token']
            // @ts-ignore
            let info = await await (await jwt.jwtVerify(cookie, crypto.createSecretKey(process.env.JWT_SECRET, 'utf-8')));
            // @ts-ignore
            let accountInfo = await db.select().from(account).where(eq(account.email, info.payload.email))
            if (accountInfo[0].role == 'owner') {
                let password = data.password
                let salt = accountInfo[0].salt
                // @ts-ignore
                let hash_password = crypto.pbkdf2Sync(password, salt, 19847, 80, 'sha512').toString('hex')
                if (hash_password == accountInfo[0].password && confirmation == true) {
                    await db.delete(account)
                    await db.delete(tests)
                    await db.delete(testSettings)
                    await db.delete(question_bank)
                    await db.delete(test_access)
                    await db.delete(questionSubmission)
                    await db.delete(role)
                    await db.delete(proctor)
                    await db.delete(proctorID)
                    await db.delete(accessProctorMap)
                    
                    res.status(201).json({
                        coreStatus: 'CONFIRMED_DELETED',
                        message: 'Everything has been deleted. Have a good day!'
                    })
                }
            } else {
                let password = data.password
                let salt = accountInfo[0].salt
                // @ts-ignore
                let hash_password = crypto.pbkdf2Sync(password, salt, 19847, 80, 'sha512').toString('hex')
                if (hash_password == accountInfo[0].password && confirmation == true) {
                    await db.delete(account).where(eq(account.id, accountInfo[0].id))
                    await db.delete(proctorID).where(eq(proctorID.proctor_id, accountInfo[0].id))
                    res.status(201).json({
                        coreStatus: 'CONFIRMED_DELETED',
                        message: 'Account has been deleted. Have a good day!'
                    })
                }
            }
        } catch (e) {
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'Could not delete account',
            })
        }
    } else if (req.method == 'PUT') {
        try {
            // Get data
            const data = JSON.parse(req.body)
            let cookie = await req.cookies['token']
            // @ts-ignore
            let info = await await (await jwt.jwtVerify(cookie, crypto.createSecretKey(process.env.JWT_SECRET, 'utf-8')));
            // @ts-ignore
            let accountInfo = await db.select().from(account).where(eq(account.email, info.payload.email))

            if (accountInfo.length == 0) { 
                res.status(403).json({
                    coreStatus: 'CANNOT_CHANGE',
                    message: 'You are not authenticated.'
                })
                return;
            } else {
                if (data.feature == 'CHANGE_EMAIL'
                    && data.new_email == data.confirm_new_email
                    && accountInfo[0].email == data.old_email) {
                        let check = await db.select().from(account).where(eq(account.email, data.new_email))
                        if (check.length >= 1) {
                            res.status(402).json({
                                coreStatus: 'CONFLICTING_EMAIL',
                                message: 'Current email conflicts with annother account.'
                            })
                            return;        
                        }
                        await db.update(account).set({
                            'email': data.new_email
                        }).where(eq(account.id, accountInfo[0].id))
                    res.status(200).json({
                        coreStatus: 'CHANGED_EMAIL',
                        message: 'Successfully changed your account.'
                    })
                    return;
                } else if (data.feature == 'CHANGE_EMAIL'
                    && data.new_email != data.confirm_new_email) {
                    res.status(200).json({
                        coreStatus: 'FAILED_TO_CHANGE_EMAIL',
                        message: 'Failed to change email due to new email not being confirmed.'
                    })
                    return;
                } else if (data.feature == 'CHANGE_PASSWORD'
                    && data.new_password == data.confirm_new_password
                    // @ts-ignore
                    && accountInfo[0].password == crypto.pbkdf2Sync(data.old_password, accountInfo[0].salt, 19847, 80, 'sha512').toString('hex'))
                {
                    let new_salt = crypto.randomBytes(32).toString('hex')
                    // Create hash
                    let new_password = crypto.pbkdf2Sync(data.new_password, new_salt, 19847, 80, 'sha512').toString('hex')
                    await db.update(account).set({
                        'password': new_password,
                        'salt': new_salt
                    }).where(eq(account.id, accountInfo[0].id))
                    res.status(200).json({
                        coreStatus: 'CHANGED_PASSWORD',
                        message: 'Changed password successfully.'
                    })
                }
            }
        } catch (e) {
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'Could not delete account',
            })
        }
    }
}