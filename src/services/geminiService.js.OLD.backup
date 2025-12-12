import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Nombre real del modelo Gemeni 2.5 (turbine)
const MODEL_NAME = "gemini-2.5-flash";

export async function generateText(prompt) {
  try {
    if (!prompt) throw new Error("Prompt vacío.");

    const model = client.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(prompt);

    const text = result?.response?.text?.();

    return text || "[Respuesta vacía de Gemini]";
  } catch (err) {
    console.error("Gemini ERROR:", err);
    throw err;
  }
}
