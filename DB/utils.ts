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
           id: true,
        }
    })
    
    if (!data) {
        throw new Error('No user found')
    }
    return {
        accessToken: data.id,
        Expired: false
    }
}