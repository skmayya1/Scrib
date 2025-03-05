import prisma from "@/DB/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // Get Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    const data = await req.formData();
    const file = data.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
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
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const updatedBuffer = Buffer.concat([existingMeeting.chunk, buffer]);

    await prisma.meet.update({
      where: { id: meetingId as string },
      data: { chunk: updatedBuffer },
    });

    console.log("iscopmleted", isCompleted);

    // Convert buffer to audio file when completed
    if (isCompleted) {
      const audioFilePath = path.join("/tmp", `${meetingId}.mp3`);

      fs.writeFileSync(audioFilePath, updatedBuffer);

      console.log(`Audio file saved: ${audioFilePath}`);

      return NextResponse.json({ meetingId, audioFilePath }, { status: 200 });
    }

    return NextResponse.json({ meetingId }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
