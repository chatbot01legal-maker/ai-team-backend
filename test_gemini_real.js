require('dotenv').config({ path: '.env' });
const { GeminiService } = require('./src/services/geminiService');

async function test() {
  console.log('🧪 INICIANDO PRUEBA DE CONEXIÓN GEMINI REAL\n');
  
  // 1. Crear servicio en modo REAL
  const service = new GeminiService({ mode: 'real' });
  console.log('1. Servicio creado. Clave API presente:', !!process.env.GEMINI_API_KEY);
  
  // 2. Health Check
  console.log('\n2. Health Check:');
  const health = await service.healthCheck();
  console.log(health);
  
  // 3. Generar texto REAL (forzando modo real)
  console.log('\n3. Probando generación de texto (real):');
  try {
    const textResult = await service.generateText('Responde únicamente con la palabra "CONECTADO".', { 
      signature: 'TEST',
      forceSimulated: false 
    });
    console.log('   ✅ Éxito:', { 
      modelo: textResult.model,
      esReal: textResult.isReal,
      respuesta: textResult.text.substring(0, 100) 
    });
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }
  
  // 4. Embeddings REALES
  console.log('\n4. Probando embeddings (real):');
  try {
    const embedding = await service.embed('Test de embeddings', { forceSimulated: false });
    console.log('   ✅ Éxito - Dimensiones:', embedding.length);
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }
}

test().catch(err => console.error('🔥 Error general:', err.message));
