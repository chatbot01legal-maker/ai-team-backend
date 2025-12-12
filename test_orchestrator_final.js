const YoOrquestador = require('./src/orchestrator/yoOrquestador');

async function test() {
  console.log('🧪 Probando orquestador completo...');
  
  // Modo real para Director, otros simulados
  const orchestrator = new YoOrquestador();
  
  try {
    const result = await orchestrator.run({
      ticketId: 'test_final_' + Date.now(),
      question: '¿Cómo implementar un sistema de métricas para agentes AI?',
      mode: 'real',
      agentModes: { Director: 'real' }
    });
    
    console.log('\\n✅ Resultado del orquestador:');
    console.log('- Ticket ID:', result.ticketId);
    console.log('- Secuencia de agentes:');
    
    result.sequence.forEach((agent, i) => {
      console.log(\`  \${i+1}. \${agent.agent} - \${agent.isReal ? 'REAL' : 'SIM'} - \${agent.model}\`);
    });
    
    const realCount = result.sequence.filter(r => r.isReal).length;
    console.log(\`\\n📊 \${realCount} respuestas REALES de \${result.sequence.length} total\`);
    
    if (realCount > 0) {
      console.log('\\n📝 Primera respuesta REAL:');
      const firstReal = result.sequence.find(r => r.isReal);
      console.log(firstReal.text.substring(0, 200) + '...');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Stack:', error.stack);
  }
}

test();
