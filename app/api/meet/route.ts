import { getAccessToken } from "@/DB/utils";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {

  const { Expired, accessToken , trials} = await getAccessToken();
  
  console.log(Expired, accessToken);
  console.log(req.headers.get("authorization"));
  
  const isExtension = req.headers.get("sec-fetch-mode") === "cors";
  
  if (isExtension && Expired) {
    return NextResponse.json(req.nextUrl.origin + "/auth/login");
  }
  
  if (Expired) {
    return NextResponse.redirect(req.nextUrl.origin + "/auth/login");
  }


  if(trials === 5) {
    return NextResponse.json({ error: "No trials left" }, { status: 403 });
  }
  
  return NextResponse.json({ accessToken });
}