import prisma from "@/DB/prisma";
import { chatWithAi } from "@/gemini/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;
  const { prompt } = await req.json();

  try {
    const MeetData = await prisma.meetings.findUnique({
      where: {
        id: slug,
      },
      select: {
        Text: true,
        id: true,
      },
    });
    if (MeetData?.Text === null) {
      return NextResponse.json({ error: "No text found" }, { status: 404 });
    }
    const data = await chatWithAi({
      ctxt: MeetData?.Text as string,
      prompt,
    });
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occured" }, { status: 500 });
  }
}
