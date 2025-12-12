const { GeminiService } = require('./src/services/geminiService');
const DirectorAgent = require('./src/agents/directorAgent');
const MemoryService = require('./src/services/memoryService');

async function test() {
  console.log('🧪 Probando DirectorAgent en modo REAL...');
  
  // Crear servicios
  const geminiService = new GeminiService({ mode: 'real' });
  const memoryService = new MemoryService();
  
  // Crear agente Director con dependencias
  const director = new DirectorAgent({
    geminiService: geminiService,
    memory: memoryService,
    name: 'Director'
  });
  
  const ticketId = 'director_test_' + Date.now();
  
  try {
    console.log('📤 Enviando pregunta al Director...');
    const result = await director.think(
      {
        question: '¿Cómo implementar métricas para agentes AI?',
        context: { events: [] }
      },
      ticketId,
      { forceSimulated: false }  // ¡IMPORTANTE! Forzar modo real
    );
    
    console.log('✅ Resultado:');
    console.log('- Agente:', result.agent);
    console.log('- Es real?', result.isReal ? 'SÍ' : 'NO');
    console.log('- Modelo:', result.model);
    console.log('- Texto (primeros 150 chars):', result.text.substring(0, 150) + '...');
    console.log('- Métricas:', result.metrics);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Stack:', error.stack);
  }
}

test();
