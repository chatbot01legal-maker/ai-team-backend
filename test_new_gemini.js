const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log('❌ No API key found');
  process.exit(1);
}

console.log('🔧 Probando conexión con Gemini SDK (@google/genai)...');
console.log(`📋 API Key (primeros 10 chars): ${apiKey.substring(0, 10)}...`);

const genAI = new GoogleGenAI({ apiKey });

async function test() {
  try {
    // Probar con el modelo correcto (gemini-2.0-flash)
    console.log('🧪 Probando modelo: gemini-2.0-flash');
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: "Responde con 'OK' si estás funcionando" }] }]
    });
    console.log(`✅ Respuesta recibida: ${response.text}`);
  } catch (error) {
    console.log('❌ Error en conexión:', error.message);
    if (error.message.includes('quota')) {
      console.log('⚠️  Error de cuota. Verifica tus límites en Google AI Studio.');
    }
  }
}

test();
