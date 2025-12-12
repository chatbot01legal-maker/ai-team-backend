const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey });

async function test() {
  console.log('🧪 Probando embedding con SDK directamente...');
  
  try {
    const response = await genAI.models.embedContent({
      model: 'models/embedding-001',
      content: { parts: [{ text: 'Hello world embedding test' }] }
    });
    
    console.log('✅ Embedding response recibida');
    console.log('- ¿Tiene embedding?', !!response.embedding);
    console.log('- Keys en response:', Object.keys(response));
    
    if (response.embedding) {
      console.log('- Keys en embedding:', Object.keys(response.embedding));
      console.log('- ¿Tiene values?', !!response.embedding.values);
      console.log('- Longitud de values:', response.embedding.values?.length);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.details) {
      console.error('Detalles:', JSON.stringify(error.details, null, 2));
    }
  }
}

test();
