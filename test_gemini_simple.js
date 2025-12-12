const { GeminiService } = require('./src/services/geminiService');

async function test() {
  console.log('🧪 Probando servicio Gemini...');
  
  // Probar en modo real
  console.log('\n1. Modo REAL:');
  const realService = new GeminiService({ mode: 'real' });
  
  try {
    // Generar texto
    const textResult = await realService.generateText('Di "Hola mundo"', {
      signature: 'TEST',
      forceSimulated: false
    });
    console.log('✅ Texto generado (real):', textResult.isReal ? 'SI' : 'NO');
    console.log('   Texto:', textResult.text.substring(0, 100));
    
    // Embedding
    const embedResult = await realService.embed('Texto para embedding', {
      forceSimulated: false
    });
    console.log('✅ Embedding generado:', embedResult.length, 'dimensiones');
    
  } catch (error) {
    console.log('❌ Error en modo real:', error.message);
  }
  
  // Probar en modo simulado
  console.log('\n2. Modo SIMULADO:');
  const simService = new GeminiService({ mode: 'simulated' });
  
  try {
    const simResult = await simService.generateText('Test', {
      signature: 'TEST',
      forceSimulated: true
    });
    console.log('✅ Texto generado (simulado):', simResult.isReal ? 'SI' : 'NO');
    console.log('   Texto:', simResult.text);
  } catch (error) {
    console.log('❌ Error en modo simulado:', error.message);
  }
}

test();
