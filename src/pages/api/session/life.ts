import type { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jose";
import * as crypto from "crypto";
import { db } from "@/db/db";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest,res: NextApiResponse,) {
    let token = req.cookies.token;
    if (!token) {
        res.status(403).json({ coreStatus: "NOT_ALLOWED", message: "Unauthorized." });
    } else {
        // @ts-ignore
        let token_info = await (await jwt.jwtVerify(token, crypto.createSecretKey(process.env.JWT_Secret, 'utf-8'))).payload?.email;
        // @ts-ignore
        let account_info = await db.select().from(account).where(eq(account.email, token_info))
        if (account_info.length == 0) {
            res.status(403).json({ coreStatus: "NOT_ALLOWED", message: "Unauthorized." });
        }
        res.status(200).json({ coreStatus: "RESPONSE_SUCCESS", message: "Session active.", account: account_info[0]});
    }
}
