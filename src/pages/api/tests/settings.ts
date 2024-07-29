import { db } from '@/db/db'
import { account, question_bank, role, tests, testSettings } from '@/db/schema'
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { eq } from 'drizzle-orm'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'PUT') {
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
            if (accountInfo[0].role != 'staff' || (roleCheck.length != 0 && roleCheck[0].modifyTestSettings == true)) {
                // await db.update(tests).set({
                //     'description': data.description,
                //     'name': data.name,
                //     'starts_on': data.start_time,
                //     'ends_on': data.end_time,
                // }).where(eq(tests.id, data.id))
                let test_settings = await db.select().from(testSettings).where(eq(testSettings.test_id,data.test_id))
                if (data.name == 'publish_test') {
                    await db.update(tests).set({
                        'test_status': (data.status ? 'active' : 'draft')
                    }).where(eq(tests.id, data.test_id))
                }
                if (test_settings.length == 0) {
                    await db.insert(testSettings).values({
                        'test_id': data.test_id,
                        'allow_retakes': (data.status != undefined && data.name == 'allow_retakes' ? data.status : false),
                        'test_status': (data.status != undefined && data.status && data.name == 'publish_test' ? 'active' : 'draft'),
                        'randomize_questions': (data.status != undefined && data.status && data.name == 'randomize_questions' ? data.status : test_settings[0].randomize_questions),
                    })
                } else {
                    let settingConstraints = {
                        allowRetakes: (data.status != undefined && data.name == 'allow_retakes' ? data.status : test_settings[0].allow_retakes),
                        visibility: (data.status != undefined && data.status && data.name == 'publish_test' ? 'active' : 'draft'),
                        randomize_questions: (data.status != undefined && data.status && data.name == 'randomize_questions' ? data.status : test_settings[0].randomize_questions)
                    }
                    await db.update(testSettings).set({
                        'allow_retakes': settingConstraints.allowRetakes,
                        // @ts-ignore
                        'test_status': settingConstraints.visibility,
                        'randomize_questions': settingConstraints.randomize_questions
                    }).where(eq(testSettings.test_id, data.test_id))
                }
                res.status(201).json({
                    coreStatus: 'UPDATED_TEST',
                    message: 'Updated test information successfully'
                })
            } else {
                res.status(403).json({
                    coreStatus: 'NOT_ALLOWED_ROLE',
                    message: 'You are not allowed to update a test.'
                })
            }
        } catch (e) {
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }
    }
}