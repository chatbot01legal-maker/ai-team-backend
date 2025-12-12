// ============================================================
// 🚀 AI TEAM BACKEND - VERSIÓN SIMPLIFICADA FUNCIONAL
// ============================================================

console.log('\n' + '='.repeat(60));
console.log('🚀 INICIANDO AI TEAM BACKEND - VERSIÓN SIMPLIFICADA');
console.log('='.repeat(60));

const express = require('express');
const cors = require('cors');
const app = express();

// Configuración básica
const PORT = process.env.PORT || 10000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`📊 Entorno: ${NODE_ENV}`);
console.log(`🔌 Puerto: ${PORT}`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('✅ Middleware configurado');

// ==================== RUTAS ====================

// Ruta raíz
app.get('/', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /`);
  res.json({
    ok: true,
    service: 'AI Team Backend',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /health`);
  res.json({
    ok: true,
    status: 'healthy',
    environment: NODE_ENV,
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Ruta de diagnóstico
app.get('/api/diagnostics', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/diagnostics`);
  res.json({
    ok: true,
    status: 'AI Team Backend Operational',
    environment: {
      node_env: NODE_ENV,
      port: PORT,
      gemini_mode: process.env.GEMINI_MODE || 'not set'
    },
    system: {
      node_version: process.version,
      platform: process.platform
    }
  });
});

// Ruta de orquestación simulada
app.post('/api/orchestrate', (req, res) => {
  console.log(`[${new Date().toISOString()}] POST /api/orchestrate`);
  
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Se requiere el campo "prompt"' 
    });
  }
  
  // Simulación simple de orquestación dinámica
  const result = {
    ticketId: `TICKET-${Date.now()}`,
    prompt: prompt,
    history: [
      {
        agent: 'director',
        response: 'Director: Analizando la situación inicial...',
        metrics: { novelty_score: 8.2, ambiguity_index: 4.5, coherence_score: 6.1 },
        timestamp: new Date().toISOString()
      },
      {
        agent: 'creative',
        response: 'Creative: Generando ideas creativas basadas en el análisis...',
        metrics: { novelty_score: 9.1, ambiguity_index: 3.2, coherence_score: 7.8 },
        timestamp: new Date().toISOString()
      }
    ],
    finalResult: {
      agent: 'creative',
      response: 'Orquestación completada exitosamente',
      status: 'COMPLETED'
    }
  };
  
  res.json({
    ok: true,
    message: 'Orquestación simulada exitosa',
    result: result
  });
});

// Ruta de prueba de Gemini (siempre funciona)
app.get('/api/gemini-test', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/gemini-test`);
  res.json({
    ok: true,
    mode: 'simulation',
    message: 'Endpoint de prueba funcionando',
    test: 'SIMULATED_API_OK'
  });
});

// Manejo de 404
app.use((req, res) => {
  console.warn(`[${new Date().toISOString()}] 404: ${req.method} ${req.url}`);
  res.status(404).json({
    ok: false,
    error: `Ruta no encontrada: ${req.method} ${req.url}`,
    available_routes: [
      'GET /',
      'GET /health', 
      'GET /api/diagnostics',
      'POST /api/orchestrate',
      'GET /api/gemini-test'
    ]
  });
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('✅ SERVIDOR INICIADO CORRECTAMENTE');
  console.log('='.repeat(60));
  console.log(`🔌 Puerto: ${PORT}`);
  console.log(`🌍 URL: http://0.0.0.0:${PORT}`);
  console.log(`📅 Hora: ${new Date().toISOString()}`);
  console.log('='.repeat(60));
  console.log('📋 Endpoints disponibles:');
  console.log(`   • GET  /                 - Estado del servicio`);
  console.log(`   • GET  /health           - Health check`);
  console.log(`   • GET  /api/diagnostics  - Diagnóstico completo`);
  console.log(`   • POST /api/orchestrate  - Orquestación de agentes`);
  console.log(`   • GET  /api/gemini-test  - Test de conexión`);
  console.log('='.repeat(60) + '\n');
});
