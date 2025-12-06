// Archivo simple para probar el sistema
const { runTestHarness } = require('./src/tests/harness.test.js');

console.log('🚀 Iniciando prueba simple del sistema AI Team\n');
runTestHarness().then(() => {
  console.log('\n✨ Prueba completada');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error en prueba:', error);
  process.exit(1);
});
