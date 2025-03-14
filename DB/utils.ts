import { auth } from "@/lib/auth";
import prisma from "./prisma";
import { headers } from "next/headers";


export async function getAccessToken(): Promise<{
    accessToken: string ,
    Expired:boolean,
    trials: number
}> {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) { 
        return {
            accessToken: '',
            Expired: true,
            trials: 0
        }
    }
    const email = session?.user?.email;
    console.log(email);
    

    const data = await prisma.user.findUnique({
        where: {
            email: email as string
        },
        select: {
           id: true,
           trials: true
        }
    })
    
    if (!data) {
        throw new Error('No user found')
    }
    return {
        accessToken: data.id,
        Expired: false,
        trials: data.trials
    }
}
