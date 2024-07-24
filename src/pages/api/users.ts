import { db } from '@/db/db'
import { account } from '@/db/schema'
import * as jwt from 'jose'
import * as crypto from 'crypto'
import { eq } from 'drizzle-orm'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'DELETE') {
        try {
            const roleModify = (roleA: string, roleB: string) => {
                let roles = ['staff', 'admin', 'owner']
                let roleAIndex = roles.indexOf(roleA)
                let roleBIndex = roles.indexOf(roleB)
                return roleAIndex > roleBIndex
            }    
            // Get data
            const data = JSON.parse(req.body)
            let cookie = await req.cookies['token']
            // @ts-ignore
            let info = await await (await jwt.jwtVerify(cookie, crypto.createSecretKey(process.env.JWT_SECRET, 'utf-8')));
            // @ts-ignore
            let accountInfo = await db.select().from(account).where(eq(account.email, info.payload.email))
            // @ts-ignore
            let currentReq = await db.select().from(account).where(eq(account.id, data.id))
            if (accountInfo[0].role == 'owner' && currentReq != null || accountInfo[0].role == 'admin' && currentReq != null) {
                // @ts-ignore
                if (roleModify(currentReq[0].role, accountInfo[0].role)) {
                    res.status(403).json({
                        coreStatus: 'NOT_ALLOWED_DELETE_USER_HIGHER_ROLE',
                        message: 'You are not allowed to delete a user with a higher role than you.'
                    })
                    return;
                }
                // Create account
                await db.delete(account).where(eq(account.id, data.id))
                res.status(201).json({
                    coreStatus: 'DELETED_ACCOUNT',
                    message: 'Deleted Account Successfully'
                })
            } else {
                res.status(403).json({
                    coreStatus: 'NOT_ALLOWED_ROLE',
                    message: 'You are not allowed to delete a user.'
                })
            }
        } catch (e) {
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }    
    } else if (req.method == 'PUT') {
        try {
            const roleModify = (roleA: string, roleB: string) => {
                let roles = ['staff', 'admin', 'owner']
                let roleAIndex = roles.indexOf(roleA)
                let roleBIndex = roles.indexOf(roleB)
                return roleAIndex > roleBIndex
            }    
            // Get data
            const data = JSON.parse(req.body)
            let cookie = await req.cookies['token']
            // @ts-ignore
            let info = await await (await jwt.jwtVerify(cookie, crypto.createSecretKey(process.env.JWT_SECRET, 'utf-8')));
            // @ts-ignore
            let accountInfo = await db.select().from(account).where(eq(account.email, info.payload.email))
            if (accountInfo[0].role == 'owner' || accountInfo[0].role == 'admin') {
                // Update role
                let updatedRole = data?.role.toLowerCase();
                if (roleModify(updatedRole, accountInfo[0].role)) {
                    res.status(403).json({
                        coreStatus: 'NOT_ALLOWED_UPDATE_USER_HIGHER_ROLE',
                        message: 'You are not allowed to update a user with a higher role than you.'
                    })
                    return;
                }
                // Update account
                await db.update(account).set({'name': data.name, 'email': data.email, 'role': updatedRole}).where(eq(account.id, data.id))
                res.status(201).json({
                    coreStatus: 'UPDATED_ACCOUNT',
                    message: 'Updated Account Successfully'
                })
            } else {
                res.status(403).json({
                    coreStatus: 'NOT_ALLOWED_ROLE',
                    message: 'You are not allowed to update a user.'
                })
            }
        } catch (e) {
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }    
    } else if (req.method == 'POST') {
        try {
            const roleModify = (roleA: string, roleB: string) => {
                let roles = ['staff', 'admin', 'owner']
                let roleAIndex = roles.indexOf(roleA)
                let roleBIndex = roles.indexOf(roleB)
                return roleAIndex > roleBIndex
            }    
            // Get data
            const data = JSON.parse(req.body)
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
                if (roleModify(updatedRole, accountInfo[0].role)) {
                    res.status(403).json({
                        coreStatus: 'NOT_ALLOWED_CREATE_USER_HIGHER_ROLE',
                        message: 'You are not allowed to create a user with a higher role than you.'
                    })
                    return;
                }
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
            res.status(400).json({
                coreStatus: 'ERROR',
                message: 'An error has occurred.'
            })
        }    
    }
}