import { configure, logger, task, wait } from "@trigger.dev/sdk/v3";
import { PrismaClient } from "@prisma/client";
import { AssemblyAI } from "assemblyai";
import { model } from "@/gemini/gemini";

const prisma = new PrismaClient();


interface MeetingsProps {
    Audio: Buffer | undefined;
    id: string;
    userId: string;
    title: string | null;
    description: string | null;
    Text: string | null;
    keytakeaways: string[];
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

type MeetingProps = {
    id: string;
}

configure({
    secretKey: process.env["TRIGGER_SECRET_KEY"], // starts with tr_dev_ or tr_prod_
});

export const MeetingTask = task({
    id: 'MeetingTask',
    maxDuration: 600, 
    run: async (payload: MeetingProps, { ctx }) => {
        logger.log("Hello, world!yo");

      const data = await prisma.meetings.findUnique({
        where:{
            id:payload.id
        },select:{
            Audio:true,
            userId:true
        }
      })

      if (!data) {
        return {
          message: "Meeting not found",
        }
      }

      logger.log("Hello, world!", { payload, ctx });

      const audioBuffer = data.Audio ? Buffer.from(data.Audio) : undefined;
      const Text = await getText(audioBuffer);

      if (!Text) {
        return {
          message: "Failed to process audio",
        };
      }


      await prisma.meetings.update({
        where:{
            id:payload.id
        },
        data:{
            Text: Text.text,
            title: Text.title,
            description: Text.description,
            keytakeaways: Text.key_takeaways,
            deadlines: Text.deadlines,
            tasks: {
              deleteMany: {}, 
              create: Text.tasks.map(task => ({
                task: task.task,
                assigned_to: task.assigned_to,
                deadline: task.deadline
              }))
            }
        }
      })

      await prisma.meet.deleteMany({
        where:{
          userId:data.userId
        }
      })

      return {
        message: "Meeting processed successfully",
      }
    },
  });


async function getText(Audio: Buffer | undefined) {
    if (!Audio) {
      return;
    }
    const text = await audioToText(Audio);
    const { deadlines, description, key_takeaways, tasks, title } =
await geminiAi(text as string);
    return {
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
  