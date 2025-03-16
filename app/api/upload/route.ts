import prisma from "@/DB/prisma";
import { MeetingTask } from "@/trigger/meetings";
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
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 , headers: corsHeaders
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("File size:", buffer.length);

    const meetingId = data.get("meetingId") as string | null;
    const isCompleted = data.get("isCompleted") === "true"; // Ensure boolean conversion

    console.log("Meeting ID:", meetingId);

    const meetIdIsEmpty = !meetingId || meetingId.trim() == "";

    let Meeting;

    if (!meetIdIsEmpty) {
     Meeting = await prisma.meet.findUnique({
        where: { id: meetingId as string },
        select: { chunk: true ,id:true},
      });
  
      if (!Meeting) {
        return NextResponse.json({ error: "Meeting not found" }, { status: 404 ,        headers: corsHeaders
        });
      }
    }else{
      console.log(token);
      await prisma.meet.deleteMany({
        where: { userId: token },
      });
      Meeting = await prisma.meet.create({
        data: {
          id: crypto.randomUUID(),
          chunk: buffer,
          userId: token,
        },
      });
      console.log("Meeting ID:", Meeting.id);
    }

    const updatedBuffer = Buffer.concat([Meeting.chunk, buffer]);

    console.log("iscopmleted", isCompleted);

    if (isCompleted && updatedBuffer.length > 0) {
      console.log("isCompleted - creating new meeting", isCompleted);

      const newMeeting = await prisma.meetings.create({
        data: {
          Audio: updatedBuffer,
          userId: token,
        },
      });

      MeetingTask.trigger({
        id:newMeeting.id
      })

      
      console.log("Meeting created:", newMeeting.id);
      return  NextResponse.json(
        { message: "Meeting creation is processing in background", isCompleted },
        { status: 202, headers: corsHeaders }
      );
    }

    await prisma.meet.update({
      where: { id: meetIdIsEmpty ? Meeting.id : meetingId as string },
      data: { chunk: updatedBuffer },
    });

    return NextResponse.json({ meetingId: meetIdIsEmpty ? Meeting.id : meetingId as string, isCompleted }, { status: 200 ,        headers: corsHeaders
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
export async function OPTIONS() {
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
