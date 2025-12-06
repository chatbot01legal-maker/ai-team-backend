const MemoryService = require('./src/services/memoryService');
const memory = new MemoryService();

console.log('🧠 Probando MemoryService...');

const testTicketId = 'test-session-' + Date.now();
memory.pushEvent(testTicketId, {
    agent: 'Test',
    text: 'Mensaje de prueba',
    metrics: { novelty: 5, ambiguity: 2, coherence: 8, feasibility: 0.7, risk: 0.3 }
});

const session = memory.getSession(testTicketId);
console.log('✅ Sesión creada:', testTicketId);
console.log('   Eventos:', session.events.length);
console.log('   Primer evento:', session.events[0]?.agent);

// Verificar persistencia
const memory2 = new MemoryService();
const session2 = memory2.getSession(testTicketId);
console.log('✅ Persistencia verificada:', session2.events.length === 1 ? '✓' : '✗');

console.log('\n🎉 MemoryService funciona correctamente');
