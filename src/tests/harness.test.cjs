const YoOrquestador = require('../orchestrator/yoOrquestador');

async function runTestHarness() {
  console.log('🧪 EJECUTANDO TEST HARNESS');
  console.log('==========================\n');
  
  const orchestrator = new YoOrquestador();
  const testCases = [
    {
      name: 'Test 1: Pregunta técnica simple',
      question: 'Cómo implementar autenticación JWT en Node.js?',
      mode: 'simulated'
    },
    {
      name: 'Test 2: Pregunta de diseño compleja',
      question: 'Diseñar una arquitectura microservicios para e-commerce con 1M usuarios',
      mode: 'simulated'
    },
    {
      name: 'Test 3: Pregunta creativa',
      question: 'Ideas innovadoras para reducir la latencia en APIs globales',
      mode: 'simulated'
    }
  ];
  
  const results = [];
  
  for (const testCase of testCases) {
    console.log("\n🔍 Ejecutando: " + testCase.name);
    console.log("   Pregunta: " + testCase.question);
    
    try {
      const startTime = Date.now();
      const result = await orchestrator.run({
        ticketId: "test_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        question: testCase.question,
        mode: testCase.mode
      });
      const duration = Date.now() - startTime;
      
      console.log("   ✅ Éxito: " + result.sequence.length + " agentes ejecutados");
      console.log("   ⏱️  Duración: " + duration + "ms");
      console.log("   📊 Distancia promedio: " + result.metrics.avgPairwiseDistance.toFixed(3));
      
      if (result.warning) {
        console.log("   ⚠️  Advertencia: " + result.warning);
      }
      
      results.push({
        test: testCase.name,
        success: true,
        duration,
        agents: result.sequence.map(a => a.agent),
        metrics: result.metrics,
        warning: result.warning
      });
      
    } catch (error) {
      console.log("   ❌ Error: " + error.message);
      results.push({
        test: testCase.name,
        success: false,
        error: error.message
      });
    }
  }
  
  // Resumen
  console.log('\n📊 RESUMEN DE TESTS');
  console.log('==================');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log("✅ Pasados: " + passed);
  console.log("❌ Fallados: " + failed);
  
  if (failed === 0) {
    console.log('\n🎉 ¡Todos los tests pasaron!');
  } else {
    console.log('\n🔧 Algunos tests fallaron, revisar implementación.');
  }
  
  return results;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runTestHarness().catch(console.error);
}

module.exports = { runTestHarness };
