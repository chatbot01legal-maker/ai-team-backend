const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = process.env.GEMINI_API_KEY || require('fs').readFileSync('.env', 'utf8').match(/GEMINI_API_KEY=(.+)/)?.[1];

if (!apiKey) {
  console.log('❌ No API key found');
  process.exit(1);
}

console.log('🔧 Probando conexión con Gemini SDK...');
console.log(`📋 API Key (primeros 10 chars): ${apiKey.substring(0, 10)}...`);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Test simple
async function test() {
  try {
    const result = await model.generateContent("Responde con 'OK' si estás funcionando");
    const response = await result.response;
    const text = response.text();
    console.log(`✅ Respuesta recibida: ${text}`);
  } catch (error) {
    console.log('❌ Error en conexión:', error.message);
    console.log('⚠️  Probando con modelo más simple...');
    try {
      const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await modelFlash.generateContent("Responde con 'OK'");
      const response = await result.response;
      console.log(`✅ Respuesta con Flash: ${response.text()}`);
    } catch (error2) {
      console.log('❌ Error también con Flash:', error2.message);
    }
  }
}

test();
