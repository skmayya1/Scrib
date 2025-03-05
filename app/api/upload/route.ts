import prisma from "@/DB/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Request Headers:", Object.fromEntries(req.headers.entries()));

    // Get Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    console.log( token);

    const data = await req.formData();
    const file = data.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    
    const existingAudio = await prisma.meetingAudio.findUnique({
      where: {
        userId: token,
      },
    });

    if (existingAudio) {
      // Append new buffer to existing audio
      const updatedBuffer = Buffer.concat([existingAudio.audio, buffer]);

      await prisma.meetingAudio.update({
        where: { id: existingAudio.id },
        data: { audio: updatedBuffer },
      });

      console.log(`Appended ${buffer.length} bytes to meeting `);
    } else {
      await prisma.meetingAudio.create({
        data: { userId: token, meetingId:'1',audio: buffer },
      });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
