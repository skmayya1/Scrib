import prisma from "@/DB/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': 'chrome-extension://imehigbjghjofmefgjakipphedmmbgcn',
      'Access-Control-Allow-Credentials': 'true'
    };

    // Extract the token
    const token = authHeader.split(" ")[1];

    const data = await req.formData();
    const file = data.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 ,        headers: corsHeaders
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("File size:", buffer.length);

    const meetingId = data.get("meetingId") as string | null;
    const isCompleted = data.get("isCompleted") === "true"; // Ensure boolean conversion

    console.log("Meeting ID:", meetingId);

    if (!meetingId || meetingId.trim() === "") {
      await prisma.meet.deleteMany();
      const Meet = await prisma.meet.create({
        data: {
          id: crypto.randomUUID(),
          chunk: buffer,
          userId: token,
        },
      });
      console.log("Meeting ID:", Meet.id);
      return NextResponse.json({ meetingId: Meet.id }, { status: 200 });
    }

    const existingMeeting = await prisma.meet.findUnique({
      where: { id: meetingId as string },
      select: { chunk: true },
    });

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 ,        headers: corsHeaders
      });
    }

    const updatedBuffer = Buffer.concat([existingMeeting.chunk, buffer]);

    console.log("iscopmleted", isCompleted);

    if (isCompleted && updatedBuffer.length > 0) {
      const deletedData = await prisma.meet.delete({
        where: { id: meetingId as string },
      });
      console.log("isCompleted - creating new meeting", isCompleted);

      if (deletedData && deletedData.id === meetingId) {
        const newMeeting = await prisma.meetings.create({
          data: {
            Audio: updatedBuffer,
            userId: token,
          },
        });
        return NextResponse.json(
          { meetingId: newMeeting.id, isCompleted },
          { status: 200 ,        headers: corsHeaders
          }
        );
      }
      return NextResponse.json({ meetingId, isCompleted }, { status: 200 ,        headers: corsHeaders
      });
    }
    await prisma.meet.update({
      where: { id: meetingId as string },
      data: { chunk: updatedBuffer },
    });

    return NextResponse.json({ meetingId }, { status: 200 ,        headers: corsHeaders
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 , headers: {
        'Access-Control-Allow-Origin': 'chrome-extension://imehigbjghjofmefgjakipphedmmbgcn',
        'Access-Control-Allow-Credentials': 'true'
      }}
    );
  }
}
export async function OPTIONS(req: NextRequest) {
  // Handle preflight request
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': 'chrome-extension://imehigbjghjofmefgjakipphedmmbgcn',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
