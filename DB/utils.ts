import { auth } from "@/lib/auth";
import prisma from "./prisma";
import { headers } from "next/headers";

export async function getAccessToken(): Promise<{
    accessToken: string ,
    Expired:boolean
}> {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) { 
        return {
            accessToken: '',
            Expired: true
        }
    }
    const email = session?.user?.email;


    const data = await prisma.user.findUnique({
        where: {
            email: email as string
        },
        select: {
            accounts: {
                select: {
                    accessToken: true,
                    accessTokenExpiresAt: true
               }
           }
        }
    })
    
    if (!data) {
        throw new Error('No user found')
    }
    return {
        accessToken: data?.accounts[0].accessToken as string,
        Expired: new Date(data?.accounts[0].accessTokenExpiresAt as Date) < new Date()
    }
}