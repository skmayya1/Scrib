import { Prisma } from "@prisma/client";
import { AssemblyAI } from "assemblyai";
import { model } from "@/gemini/gemini";

interface MeetingsProps {
  Audio: Buffer | undefined;
  id: string;
  userId: string;
  title: string | null;
  description: string | null;
  text: string | null;
  key_takeaways: string[];
  deadlines: string[];
  tasks: Task[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface MeetingSummary {
  title: string;
  description: string;
  key_takeaways: string[];
  tasks: Task[];
  deadlines: string[];
}

interface Task {
  task: string;
  assigned_to: string | null;
  deadline: string | null;
}

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY as string,

});
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000

const system_instruction = `You are an AI assistant processing a meeting transcript. Here is a transcript of a meeting. Extract key takeaways, tasks (with assigned persons, if specified),Also give an title for the meeting and a small decription containing the topic discussed it sshoul be less then two lines, and deadlines. Return only a valid JSON object without markdown formatting or extra text with the following structure:

{
  "title": "Meeting title",
  "description": "Meeting description",
  "key_takeaways": ["Takeaway 1", "Takeaway 2"],
  "tasks": [
    {
      "task": "Task description",
      "assigned_to": "Person (if mentioned)",
      "deadline": "YYYY-MM-DD or 'Not specified'"
    }
  ],
  "deadlines": ["Deadline 1", "Deadline 2"]
}
 `;

export const MeetingsExtension = Prisma.defineExtension({
  name: "MeetingsExtension",
  query: {
    meetings: {
      async create({ args, query }) {
        const result = {  
          ...args.data,
        } as MeetingsProps;
        console.log("New Meeting Created:", result);

        if (!result.Audio) return result;

        const processedMeeting = await getText(result);

        return query({
          ...args,
          data: {
            ...args.data,
            Text: processedMeeting.text,
            title: processedMeeting.title,
            description: processedMeeting.description,
            keytakeaways: processedMeeting.key_takeaways,
            deadlines: processedMeeting.deadlines,
            updatedAt: new Date(),
            tasks: {
              create: processedMeeting.tasks.map((task) => ({
                task: task.task,
                assigned_to: task.assigned_to || null,
                deadline: task.deadline || null,
              })),
            },
          },
        });
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
  const { deadlines, description, key_takeaways, tasks, title } =
    await geminiAi(text as string);
  console.log(deadlines, description, key_takeaways, tasks, title);
  return {
    ...meeting,
    text,
    title,
    description,
    key_takeaways,
    tasks,
    deadlines,
  };
}

async function audioToText(audio: Buffer) {
  console.log("Transcribing audio...", audio.length, "bytes");
  
  const MAX_RETRIES = 3;
  const DELAY_SECONDS = 5;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`Transcription attempt ${attempt + 1}/${MAX_RETRIES}`);
      
      const transcript = await client.transcripts.transcribe({
        audio: audio,
      });
      
      console.log("Transcription successful");
      return transcript.text;
      
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, 
        error instanceof Error ? error.message : String(error));
      
      if (attempt + 1 < MAX_RETRIES) {
        console.log(`Retrying in ${DELAY_SECONDS} seconds...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_SECONDS * 1000));
      } else {
        console.error("Max retries reached. Transcription failed.");
        throw error;
      }
    }
  }

  throw new Error("Transcription failed after maximum retries");
}

 async function geminiAi(text: string): Promise<MeetingSummary> {
  const textPart = {
    text,
  };

  const request = {
    contents: [{ role: "user", parts: [textPart] }],
    systemInstruction: system_instruction,
  };
  const result = await model.generateContent(request);

  console.log("Gemini AI result:", result.response.text());
  const geminiText = result.response.text();
  const cleanedText = geminiText.replace(/```json|```/g, "").trim();
  const jsonData = JSON.parse(cleanedText);

  return jsonData as MeetingSummary;
}
