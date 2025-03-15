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
      await prisma.meet.deleteMany();
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
      const deletedData = await prisma.meet.delete({
        where: { id: meetIdIsEmpty ? Meeting.id : meetingId as string },
      });
      console.log("isCompleted - creating new meeting", isCompleted);

     if (deletedData && deletedData.id === (meetIdIsEmpty ? Meeting.id : (meetingId as string))) {
  res.status(202).json({ message: "Processing in background", isCompleted });

  // Run database creation in background
  setTimeout(async () => {
    try {
      const newMeeting = await prisma.meetings.create({
        data: {
          Audio: updatedBuffer,
          userId: token,
        },
      });
      console.log("Meeting created:", newMeeting.id);
    } catch (error) {
      console.error("Background meeting creation failed:", error);
    }
  }, 0);

  return;
}

      return NextResponse.json({ meetingId, isCompleted }, { status: 200 ,        headers: corsHeaders
      });
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
