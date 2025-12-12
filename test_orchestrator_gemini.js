const YoOrquestador = require('./src/orchestrator/yoOrquestador');

async function test() {
  console.log('🧪 Probando orquestador con modo real...');
  const orchestrator = new YoOrquestador();
  
  try {
    const result = await orchestrator.run({
      ticketId: 'test_' + Date.now(),
      question: '¿Cómo implementar un sistema de métricas para agentes?',
      mode: 'real',
      agentModes: { Director: 'real' }
    });
    
    console.log('✅ Resultado obtenido:');
    console.log('- Ticket ID:', result.ticketId);
    console.log('- Secuencia:', result.sequence.map(s => `${s.agent} (${s.isReal ? 'real' : 'sim'})`));
    console.log('- Métricas:', result.metrics);
    
    // Verificar respuestas reales
    const realResponses = result.sequence.filter(r => r.isReal);
    console.log(`\n📊 ${realResponses.length} respuestas reales de ${result.sequence.length} total`);
    
    if (realResponses.length > 0) {
      console.log('\n📝 Primera respuesta real:');
      console.log(realResponses[0].text.substring(0, 200) + '...');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

test();
