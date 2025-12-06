require('dotenv').config();
const { GeminiService } = require('./src/services/geminiService.js');

async function testGemini() {
  console.log('🧪 Probando Gemini en modo real...\n');
  
  const gemini = new GeminiService({ 
    mode: 'real',
    apiKey: process.env.GEMINI_API_KEY 
  });
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'tu_api_key_aquí') {
    console.log('❌ API key no configurada. Configura GEMINI_API_KEY en .env');
    console.log('📋 Para probar localmente:');
    console.log('   1. Edita el archivo .env en ai_team_backend/');
    console.log('   2. Cambia GEMINI_API_KEY=tu_api_key_aquí por tu key real');
    console.log('   3. Cambia GEMINI_MODE=simulated a GEMINI_MODE=real');
    return;
  }
  
  try {
    // Probar generación de texto
    console.log('📝 Generando texto...');
    const prompt = 'Explica brevemente qué es la inteligencia artificial';
    const result = await gemini.generateText(prompt);
    
    console.log('✅ Respuesta recibida:');
    console.log('   Modelo:', result.model);
    console.log('   Texto:', result.text.substring(0, 200) + '...\n');
    
    // Probar embedding
    console.log('🧮 Generando embedding...');
    const embedding = await gemini.embed('Texto de prueba para embedding');
    console.log('✅ Embedding generado:');
    console.log('   Longitud:', embedding.length);
    console.log('   Primeros 5 valores:', embedding.slice(0, 5));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('   Stack:', error.stack);
  }
}

testGemini();
