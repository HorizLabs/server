import { db } from '@/db/db'
import { account, proctor, proctorID, role } from '@/db/schema'
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
            // @ts-ignore
            let role_check = await db.select().from(role).where(eq(role.name, accountInfo[0].role))
            if (accountInfo.length == 0 && (role_check.length == 0 || role_check.length != 0 && role_check[0].modifyTestSettings == false) || accountInfo[0].role == 'staff') {
                res.status(400).json({
                    coreStatus: 'NOT_ALLOWED',
                    message: 'You are not allowed to create a proctor account.'
                })    
                return;
            }

            if (accountInfo[0].role == 'owner' || accountInfo[0].role == 'admin' || (role_check.length != 0 && role_check[0].modifyTestSettings == true)) {
                let account_configuration_check = await db.select().from(account).where(eq(account.email, data.proctor_email))
                if (account_configuration_check.length != 0) {
                    res.status(400).json({
                        coreStatus: 'ALREADY_EXISTS',
                        message: 'Proctor account/account with credentials already exists.'
                    })
                    return;
                }
                // Create account
                let salt = crypto.randomBytes(32).toString('hex')
                // Create hash
                let password = crypto.pbkdf2Sync(data.proctor_password, salt, 19847, 80, 'sha512').toString('hex')
                // Create account
                let roleCheck = await db.select().from(role).where(eq(role.name, 'Proctor'))
                if (roleCheck.length == 0) {
                    let role_management = {
                        'manageRoles': false,
                        'createTests': false,
                        'createTestQuestions': false,
                        'modifyTestSettings': false,
                        'createTestCredentials': false,
                        'proctorTests': true,
                        'gradeTestResponses': false,
                    }    
                    await db.insert(role).values({'name': 'Proctor', ...role_management})
                }
                let account_confirmation = await db.insert(account).values({'name': data.proctor_name, 'email': data.proctor_email, 'password': password, 'role': 'Proctor', 'salt': salt}).returning()
                let proctor_check = await db.select().from(proctor).where(eq(proctor.test_id, parseInt(data.test_id)))
                if (proctor_check.length == 0) {
                    // Create link
                    await db.insert(proctor).values({
                        'test_id': data.test_id,
                        'instructions': "None provided."
                    })
                }
                await db.insert(proctorID).values({
                    'test_id': data.test_id,
                    'proctor_id': account_confirmation[0].id,
                })
                res.status(200).json({
                    coreStatus: 'CREATED_ACCOUNT',
                    message: 'Proctor account created.'
                })
            } else {
                res.status(403).json({
                    coreStatus: 'NOT_ALLOWED',
                    message: 'You are not allowed to create a proctor account.'
                })
            }       
        } catch (e) {
            res.status(431).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
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
            // @ts-ignore
            let role_check = await db.select().from(role).where(eq(role.name, accountInfo[0].role))
            if (accountInfo.length == 0 && (role_check.length == 0 || role_check.length != 0 && role_check[0].modifyTestSettings == false) || accountInfo[0].role == 'staff') {
                res.status(400).json({
                    coreStatus: 'NOT_ALLOWED',
                    message: 'You are not allowed to update proctoring instructions.'
                })    
                return;
            }
            // Update instructions
            let locate_instructions = await db.select().from(proctor).where(eq(proctor.test_id, (data.test_id)))
            if (locate_instructions.length == 0) {
                await db.insert(proctor).values({
                    'test_id': data.test_id,
                    'instructions': data.instructions
                })
            } else {
                await db.update(proctor).set({'instructions': data.instructions}).where(eq(proctor.test_id, data.test_id))
            }
            res.status(200).json({
                coreStatus: 'UPDATED_INSTRUCTIONS',
                message: 'Instructions have been updated.'
            })
        } catch (e) {
            res.status(431).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }
    }
}