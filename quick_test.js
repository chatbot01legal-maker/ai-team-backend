const { runTestHarness } = require('./src/tests/harness.test.js');

console.log('🔍 Prueba rápida del sistema...\n');

runTestHarness().then(results => {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log('\n📋 RESUMEN FINAL:');
    console.log('   Total tests: ' + results.length);
    console.log('   Exitosos: ' + successful.length);
    console.log('   Fallidos: ' + failed.length);
    
    if (failed.length > 0) {
        console.log('\n❌ Tests fallidos:');
        failed.forEach(test => {
            console.log('   - ' + test.test + ': ' + test.error);
        });
        process.exit(1);
    } else {
        console.log('\n🎉 ¡Todos los tests pasaron correctamente!');
        process.exit(0);
    }
}).catch(error => {
    console.error('❌ Error en prueba:', error);
    process.exit(1);
});
