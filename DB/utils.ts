import prisma from "./prisma";

export async function getAccessToken(email: string): Promise<string> {
    const data = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            accounts: {
                select: {
                   accessToken: true
               }
           }
        }
    })
    return data?.accounts[0].accessToken as string;
}