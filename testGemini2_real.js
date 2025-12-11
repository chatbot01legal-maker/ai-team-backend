import 'dotenv/config';
import OpenAI from '@google/generative-ai';

const client = new OpenAI.GenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function ask(question) {
  try {
    const response = await client.generateText({
      model: 'gemini-2.5-flash',
      prompt: question,
      temperature: 0.7,
    });

    console.log('Pregunta:', question);
    console.log('Respuesta:', response.candidates[0].content);
  } catch (error) {
    console.error('Error llamando a Gemini:', error);
  }
}

ask('¿Quién escribió Cien años de soledad?');
