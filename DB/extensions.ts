import { Prisma } from "@prisma/client";
import { AssemblyAI } from "assemblyai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const MeetingsExtension = Prisma.defineExtension({
  name: "MeetingsExtension",
  query: {
    meetings: {
      async create({ args, query }) {
        const result = (await query(args)) as MeetingsProps;
        console.log("New Meeting Created:", result);
        const meetingData: MeetingsProps = {
          Audio: result.Audio ? Buffer.from(result.Audio) : undefined,
          id: result.id,
          userId: result.userId,
          title: result.title || null,
          createdAt: result.createdAt || new Date(),
          updatedAt: result.updatedAt || new Date(),
          text: result.text || null,
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
  console.log("Transcribing audio...", audio);

  const transcript = await client.transcripts.transcribe({
    audio: audio,
  });
  console.log("Transcript:", transcript.text);
  await geminiAi(transcript.text as string);
  return transcript.text;
}

const prompt = `You are an AI assistant processing a meeting transcript.Here is a transcript of a meeting. Please extract the key takeaways from the discussion. If there are any tasks mentioned, list them separately along with their assigned persons (if specified). Additionally, note any deadlines provided. Format the response in a structured way: 

**Key Takeaways:**  
- [List key points]  

**Tasks:**  
- Task: [Description]  
  - Assigned to: [Person]  
  - Deadline: [If mentioned]  

**Deadlines:**  
- [List any deadlines separately if not part of tasks]  

Transcript: `;

async function geminiAi(text: string | undefined) {
  const api_key = process.env.GEMINI_API_KEY as string;
  if (!api_key) {
    throw new Error("Gemini API key not found");
  }
  const genAI = new GoogleGenerativeAI(api_key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt + text);
  console.log("Gemini AI result:", result.response.text());
  return result.response.text();
}
