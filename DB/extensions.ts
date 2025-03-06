import { Prisma } from "@prisma/client";
import { AssemblyAI } from "assemblyai";

export const MeetingsExtension = Prisma.defineExtension({
  name: "MeetingsExtension",
  query: {
    meetings: {
      async create({ args, query }) {
        const result = (await query(args)) as MeetingsProps;
        console.log("New Meeting Created:", result);
        const meetingData: MeetingsProps = {
          Audio: result.Audio ? Buffer.from(result.Audio) : undefined,
          id: result.id, // Ensure to include the id
          userId: result.userId, // Ensure to include the userId
          title: result.title || null, // Include title, default to null if not present
          createdAt: result.createdAt || new Date(), // Include createdAt, default to current date if not present
          updatedAt: result.updatedAt || new Date(), // Include updatedAt, default to current date if not present
          text: result.text || null, // Include text, default to null if not present
        };
        return await getText(meetingData);
      },
    },
  },
});

async function getText(meeting: MeetingsProps) {
  console.log("Running custom logic for meeting:", meeting);
  if (!meeting.Audio) {
    return meeting;
  }
  const text = await audioToText(meeting.Audio);
  console.log("Transcript:", text);
  return {
    ...meeting,
    text,
  };
}

interface MeetingsProps {
  Audio: Buffer | undefined;
  id: string;
  userId: string;
  title: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  text: string | null;
}

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY as string,
});
 async function audioToText(audio: Buffer) {
  const transcript = await client.transcripts.transcribe({
    audio: audio,
  });
  return transcript.text;
}