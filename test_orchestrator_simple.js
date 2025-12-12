const YoOrquestador = require('./src/orchestrator/yoOrquestador');

async function test() {
  console.log('Testing orchestrator...');
  
  const orchestrator = new YoOrquestador();
  
  try {
    const result = await orchestrator.run({
      ticketId: 'test_simple_' + Date.now(),
      question: 'How to implement AI agent metrics?',
      mode: 'real',
      agentModes: { Director: 'real' }
    });
    
    console.log('\nResult:');
    console.log('Ticket ID:', result.ticketId);
    console.log('Sequence length:', result.sequence.length);
    
    // Mostrar cada agente
    result.sequence.forEach((agent, i) => {
      const realStatus = agent.isReal ? 'REAL' : 'SIM';
      console.log(i+1 + '. ' + agent.agent + ' - ' + realStatus + ' - ' + agent.model);
    });
    
    // Contar respuestas reales
    const realCount = result.sequence.filter(r => r.isReal).length;
    console.log('\nReal responses: ' + realCount + ' of ' + result.sequence.length);
    
  } catch (error) {
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
  }
}

test();
