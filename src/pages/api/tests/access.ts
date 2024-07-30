import { db } from '@/db/db'
import { accessProctorMap, account, proctorID, question_bank, questionSubmission, role, test_access, tests, testSettings } from '@/db/schema'
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
            let roleCheck = await db.select().from(role).where(eq(role.name, accountInfo[0].role))
            let testConfig = await db.select().from(testSettings).where(eq(testSettings.test_id, parseInt(data.test_id)))
            let proctor_check = await db.select().from(proctorID).where(eq(proctorID.test_id, parseInt(data.test_id)))
            if (testConfig[0].enable_proctoring == true && proctor_check.length != 0) {
                let proctor = await db.select().from(account).where(eq(account.email, data.proctor_email))
                if (accountInfo.length == 0 || (roleCheck.length != 0 && (roleCheck[0].createTestCredentials == false)) || accountInfo[0].role == 'staff') {
                    res.status(400).json({
                        coreStatus: 'CANNOT_ALLOW',
                        message: 'Your account does not exist.'
                    })
                } else if (proctor.length == 0) {
                    res.status(400).json({
                        coreStatus: 'CANNOT_ALLOW',
                        message: 'The proctor account does not exist.'
                    })
                } else {
                    let password = crypto.randomBytes(15).toString('hex')
                    let username = data.participant_name.replace(/\s/g, '').toLowerCase() + crypto.randomBytes(5).toString('hex') + data.test_id
                    // @ts-ignore
                    let id = await db.insert(test_access).values({
                        'test_id': parseInt(data.test_id),
                        'participant_name': data.participant_name,
                        'username': username,
                        'password': password
                    }).returning()
                    await db.insert(accessProctorMap).values({
                        'test_id': parseInt(data.test_id),
                        'participant_id': id[0].id,
                        'proctor_id': proctor[0].id
                    })
                    res.status(201).json({
                        coreStatus: 'CREATED_CREDENTIALS',
                        message: 'Successfully created requested credentials.'
                    })
                }
                return;
            }
            if (accountInfo.length == 0 || (roleCheck.length != 0 && (roleCheck[0].createTestCredentials == false)) || accountInfo[0].role == 'staff') {
                res.status(400).json({
                    coreStatus: 'CANNOT_ALLOW',
                    message: 'Your account does not exist.'
                })
            } else {
                let password = crypto.randomBytes(15).toString('hex')
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
            console.log(e)
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }
    } else if (req.method == 'DELETE') {
        try {
            // Get data
            const data = JSON.parse(req.body)
            let cookie = await req.cookies['token']
            // @ts-ignore
            let info = await await (await jwt.jwtVerify(cookie, crypto.createSecretKey(process.env.JWT_SECRET, 'utf-8')));
            // @ts-ignore
            let accountInfo = await db.select().from(account).where(eq(account.email, info.payload.email))
            // @ts-ignore
            let roleCheck = await db.select().from(role).where(eq(role.name, accountInfo[0].role))
            if (accountInfo.length == 0 || (roleCheck.length != 0 && (roleCheck[0].createTestCredentials == false)) || accountInfo[0].role == 'staff') {
                res.status(400).json({
                    coreStatus: 'CANNOT_ALLOW',
                    message: 'Your account does not exist.'
                })
                return;
            }
            if (accountInfo.length == 0) {
                res.status(400).json({
                    coreStatus: 'CANNOT_ALLOW',
                    message: 'Your account does not exist.'
                })
            } else {
                // @ts-ignore
                await db.delete(questionSubmission).where(eq(questionSubmission.participant_id, data.participant_id))
                await db.delete(accessProctorMap).where(eq(accessProctorMap.participant_id, data.participant_id))
                // @ts-ignore
                await db.delete(test_access).where(eq(test_access.id, data.participant_id))
                res.status(201).json({
                    coreStatus: 'REVOKED_ACCESS',
                    message: 'Successfully revoked the requested credentials.'
                })

                // res.status(501).json({
                //     coreStatus: 'Stop',
                //     message: 'This feature is currently being worked on. Please try again later!'
                // })
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }
    }
}