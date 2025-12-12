const { GeminiService } = require('./src/services/geminiService');

async function test() {
  console.log('🧪 Probando generación de texto REAL...');
  
  const service = new GeminiService({ mode: 'real' });
  
  try {
    const result = await service.generateText('Responde con la palabra ÉXITO', {
      signature: 'TEST',
      forceSimulated: false
    });
    
    console.log('✅ Resultado REAL:');
    console.log('- Texto:', result.text);
    console.log('- Modelo:', result.model);
    console.log('- isReal:', result.isReal);
    console.log('- Firma:', result.signature);
    
    // Probar simulado
    const simResult = await service.generateText('Test', {
      signature: 'TEST',
      forceSimulated: true
    });
    
    console.log('\\n✅ Resultado SIMULADO:');
    console.log('- isReal:', simResult.isReal);
    console.log('- Firma:', simResult.signature);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

test();
