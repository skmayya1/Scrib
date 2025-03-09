import {  model } from "./gemini";

const systemInstructions = `
You are a meeting assistant. Use the provided meeting context to answer user questions accurately.
Context:
  
`;

export async function chatWithAi({ prompt, ctxt }: { prompt: string; ctxt: string }) {
  const textPart = {
   text: prompt,
  };
  const Instructions = systemInstructions + ctxt;

  const request = {
    contents: [{ role: "user", parts: [textPart] }],
    systemInstruction: Instructions,
  };
  const result = await model.generateContent(request);

    console.log("Gemini AI result:", result.response.text());
    
    return result.response.text()
}
