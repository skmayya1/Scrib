import { getAccessToken } from "@/DB/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { Expired, accessToken } = await getAccessToken();

  console.log(req.headers.get("authorization"));

  // Check if request is from a browser extension
  const isExtension = req.headers.get("sec-fetch-mode") === "cors";

  if (isExtension && Expired) {
    return NextResponse.json(req.nextUrl.origin + "/auth/login");
  }

  if (Expired) {
    return NextResponse.redirect(req.nextUrl.origin + "/auth/login");
  }
  return NextResponse.json({ accessToken });
}
