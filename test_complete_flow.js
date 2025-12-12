const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey });

async function testComplete() {
  console.log('🔧 Probando flujo completo: generate + embed');
  
  try {
    // 1. Generar texto
    console.log('\n1. Generando texto...');
    const genResponse = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: 'Responde OK' }] }]
    });
    console.log('✅ Texto generado:', genResponse.text.substring(0, 100));
    
    // 2. Embedding del texto generado
    console.log('\n2. Creando embedding...');
    const embedResponse = await genAI.models.embedContent({
      model: 'models/embedding-001',
      content: { parts: [{ text: genResponse.text }] }
    });
    
    console.log('✅ Embedding creado');
    if (embedResponse.embedding?.values) {
      console.log(`   - Dimensiones: ${embedResponse.embedding.values.length}`);
      console.log(`   - Primeros 3 valores: ${embedResponse.embedding.values.slice(0, 3).map(v => v.toFixed(4))}`);
    }
    
    console.log('\n🎯 ¡Todo funciona! El SDK está conectado correctamente.');
    
  } catch (error) {
    console.error('❌ Error en flujo:', error.message);
  }
}

testComplete();
