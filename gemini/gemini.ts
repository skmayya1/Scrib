import { GoogleGenerativeAI } from "@google/generative-ai";

const api_key = process.env.GEMINI_API_KEY as string;
 const genAI = new GoogleGenerativeAI(api_key);
 export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
