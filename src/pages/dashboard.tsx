import Head from "next/head";
import { db } from "@/db/db";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InferGetServerSidePropsType } from "next";
import { getCookie } from 'cookies-next';

export const getServerSideProps = (async (context: any) => {  
    console.log(context.req.headers)
    // Get account information to determine if there is an owner account.
    let account_information = await db.select().from(account).where(eq(account.id, 1))
    return {
      // Ternary operator for that determination
      props: {accountCreationStatus: (account_information.length != 0 ? true : false)}
    }
})

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return(
        <></>
    )
}