import { db } from '@/db/db'
import { account, role } from '@/db/schema'
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
            let role_list = await db.select().from(role).where(eq(role.name, data.role_name))
            // @ts-ignore
            let role_check = await db.select().from(role).where(eq(role.name, accountInfo[0].role))
            if (role_list.length != 0) {
                res.status(422).json({
                    coreStatus: 'CANNOT_CREATE',
                    message: 'The role name conflicts with another role\'s name.'
                })
                return;
            }
            if (role_check.length != 0 && role_check[0].manageRoles == true || accountInfo[0].role == 'owner') {
                let role_management = {
                    'manageRoles': data.manage_roles != null ? data.manage_roles : false,
                    'createTests': data.manage_roles != null ? data.create_tests : false,
                    'createTestQuestions': data.manage_roles != null ? data.create_test_questions : false,
                    'modifyTestSettings': data.manage_test_settings || false,
                    'createTestCredentials': data.create_test_credentials || false,
                    'proctorTests': data.proctor_tests || false,
                    'gradeTestResponses': data.grade_responses || false,
                }
                let name_capitalized = data.role_name.replace(/\s/g, '_').toLowerCase().charAt(0).toUpperCase() + data.role_name.replace(/\s/g, '_').slice(1).toLowerCase()
                await db.insert(role).values({
                    'name': name_capitalized,
                    ...role_management
                })
                            
                res.status(201).json({
                    coreStatus: 'CREATED_ROLE',
                    message: 'Role has been created.'
                })                
            } else {
                res.status(403).json({
                    coreStatus: 'NOT_ALLOWED',
                    message: 'You are not allowed to create a role.'
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
            if (accountInfo.length == 0) {
                res.status(400).json({
                    coreStatus: 'DENIED',
                    message: 'Creation has been denied.'
                })    
                return;
            }
            // @ts-ignore
            let role_list = await db.select().from(role).where(eq(role.name, data.role_name))
            // @ts-ignore
            let role_check = await db.select().from(role).where(eq(role.name, accountInfo[0].role))
            if (role_check.length != 0 && role_check[0].manageRoles == true || accountInfo[0].role == 'owner') {
                let role_management = {
                    'manageRoles': data.manage_roles != null ? data.manage_roles : false,
                    'createTests': data.manage_roles != null ? data.create_tests : false,
                    'createTestQuestions': data.manage_roles != null ? data.create_test_questions : false,
                    'modifyTestSettings': data.manage_test_settings || false,
                    'createTestCredentials': data.create_test_credentials || false,
                    'proctorTests': data.proctor_tests || false,
                    'gradeTestResponses': data.grade_responses || false,
                }
                let name_capitalized = data.role_name.replace(/\s/g, '_').toLowerCase().charAt(0).toUpperCase() + data.role_name.replace(/\s/g, '_').slice(1).toLowerCase()
                await db.update(role).set({
                    'name': name_capitalized,
                    ...role_management
                }).where(eq(role.id, data.role_id))
                await db.update(account).set({
                    role: name_capitalized
                }).where(eq(account.role, data.initial_role_name))
                res.status(201).json({
                    coreStatus: 'UPDATED_ROLE',
                    message: 'Role has been modified.'
                })                
            } else {
                res.status(403).json({
                    coreStatus: 'NOT_ALLOWED',
                    message: 'You are not allowed to manage a role.'
                })
            }       
        } catch (e) {
            res.status(431).json({
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
            if (accountInfo.length == 0) {
                res.status(400).json({
                    coreStatus: 'DENIED',
                    message: 'Creation has been denied.'
                })    
                return;
            }
            // @ts-ignore
            let role_check = await db.select().from(role).where(eq(role.name, accountInfo[0].role))
            if (role_check.length != 0 && role_check[0].manageRoles == true || accountInfo[0].role == 'owner') {
                await db.delete(role).where(eq(role.id, data.role_id))
                await db.update(account).set({
                    role: 'staff'
                }).where(eq(account.role, data.role_name))

                res.status(201).json({
                    coreStatus: 'DELETED_ROLE',
                    message: 'Role has been deleted successfully.'
                })                
            } else {
                res.status(403).json({
                    coreStatus: 'NOT_ALLOWED',
                    message: 'You are not allowed to delete a role.'
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