import 'dotenv/config';
import { GenerativeAI } from '@google/generative-ai';

// Cliente Gemini real
const realClient = new GenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Función simulada
async function simulatedAsk(question) {
  return `Simulado: "${question}" → Respuesta: Forjamos nuestro propio destino.`;
}

async function runComparison() {
  const question = '¿Quién escribió Cien años de soledad?';

  // Ejecutar paralelo: simulada y real
  const [simulatedResp, realResp] = await Promise.all([
    simulatedAsk(question),
    realClient.generateText({
      model: 'gemini-2.5-flash',
      prompt: question,
      temperature: 0.7,
    }).then(res => res.candidates[0].content).catch(err => `Error real: ${err}`)
  ]);

  console.log('--- COMPARACIÓN ---');
  console.log('Simulada:', simulatedResp);
  console.log('Real    :', realResp);
}

runComparison();
