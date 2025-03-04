import { getAccessToken } from "@/DB/utils";
import { DriverInit } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { Expired, accessToken } = await getAccessToken();
    if (Expired) {
        return NextResponse.redirect(req.nextUrl.origin + '/auth/login')
    }
    const page = await DriverInit()
    return NextResponse.json({
        accessToken,
        page
    })
}


