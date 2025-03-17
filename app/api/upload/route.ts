import prisma from "@/DB/prisma";
import { MeetingTask } from "@/trigger/meetings";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const maxDuration = 60;

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'audio-chunks');

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': 'chrome-extension://imehigbjghjofmefgjakipphedmmbgcn',
      'Access-Control-Allow-Credentials': 'true'
    };

    const token = authHeader.split(" ")[1];

    const data = await req.formData();
    const file = data.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400, headers: corsHeaders });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("File size:", buffer.length);

    const meetingId = data.get("meetingId") as string | null;
    const isCompleted = data.get("isCompleted") === "true";

    console.log("Meeting ID:", meetingId);

    const meetIdIsEmpty = !meetingId || meetingId.trim() === "";

    let Meeting;

    if (!meetIdIsEmpty) {
      Meeting = await prisma.meet.findUnique({
        where: { id: meetingId as string },
        select: { chunkPath: true, id: true },
      });

      if (!Meeting) {
        return NextResponse.json({ error: "Meeting not found" }, { status: 404, headers: corsHeaders });
      }
    } else {
      console.log(token);
      await prisma.meet.deleteMany({
        where: { userId: token },
      });
      
      const newId = crypto.randomUUID();
      const chunkPath = path.join(STORAGE_DIR, `${newId}.raw`);
      
      Meeting = await prisma.meet.create({
        data: {
          id: newId,
          chunkPath: chunkPath,
          userId: token,
        },
      });
      console.log("Meeting ID:", Meeting.id);
    }

    let existingBuffer = Buffer.alloc(0);
    try {
      if (Meeting.chunkPath) {
        existingBuffer = await readFile(Meeting.chunkPath);
      }
    } catch (error) {
      console.log(error);
      console.log("No existing chunk found or error reading chunk");
    }

    const updatedBuffer = Buffer.concat([existingBuffer, buffer]);

    if (!isCompleted) {
      await writeFile(Meeting.chunkPath, updatedBuffer);
    }
    
    console.log("iscopmleted", isCompleted);

    if (isCompleted && updatedBuffer.length > 0) {
      console.log("isCompleted - creating new meeting", isCompleted);

      const newMeeting = await prisma.meetings.create({
        data: {
          Audio: updatedBuffer as Buffer,
          userId: token,
        },
      });

      console.log("newMeeting", newMeeting.Audio?.length);

      console.log("About to trigger background job");
      await MeetingTask.trigger({
        id: newMeeting.id
      });
      console.log("Background job triggered");

      // Clean up the temporary chunk file
      try {
        await prisma.meet.delete({
          where: { id: Meeting.id }
        });
        // Delete the local audio file
        await unlink(Meeting.chunkPath);
      } catch (error) {
        console.error("Error cleaning up temporary meeting:", error);
      }

      console.log("Meeting created:", newMeeting.id);
      return NextResponse.json(
        { message: "Meeting creation is processing in background", isCompleted },
        { status: 202, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { meetingId: meetIdIsEmpty ? Meeting.id : meetingId as string, isCompleted },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: {
        'Access-Control-Allow-Origin': 'chrome-extension://imehigbjghjofmefgjakipphedmmbgcn',
        'Access-Control-Allow-Credentials': 'true'
      }}
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': 'chrome-extension://imehigbjghjofmefgjakipphedmmbgcn',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
