const server = require('./server.js');
const axios = require('axios');

console.log('🌐 Probando servidor Express...');

// El servidor ya está configurado para escuchar en server.js
// Simplemente verificamos que puede responder

setTimeout(async () => {
    try {
        const response = await axios.get('http://localhost:10000/api/health');
        console.log('✅ Health check exitoso:', response.data.status);
        
        // Probar endpoint de run-ticket
        const ticketResponse = await axios.post('http://localhost:10000/api/run-ticket', {
            question: 'Test del sistema completo',
            mode: 'simulated'
        });
        
        console.log('✅ Run-ticket exitoso:');
        console.log('   Ticket ID:', ticketResponse.data.ticketId);
        console.log('   Secuencia:', ticketResponse.data.sequence.map(s => s.agent).join(' → '));
        console.log('   Duración:', ticketResponse.data.timings.totalMs + 'ms');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en prueba de servidor:', error.message);
        process.exit(1);
    }
}, 2000);
