const { GeminiService } = require('./src/services/geminiService');

async function test() {
  console.log('🧪 Probando embedding con formato corregido...');
  
  const service = new GeminiService({ mode: 'real' });
  
  try {
    const embedding = await service.embed('Texto de prueba', {
      forceSimulated: false
    });
    
    console.log(\`✅ Embedding REAL generado: \${embedding.length} dimensiones\`);
    console.log(\`📏 Primeros 3 valores: \${embedding.slice(0, 3).map(v => v.toFixed(6)).join(', ')}\`);
    
    // Probar simulado también
    const simEmbedding = await service.embed('Texto', {
      forceSimulated: true
    });
    console.log(\`✅ Embedding SIMULADO: \${simEmbedding.length} dimensiones\`);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

test();
