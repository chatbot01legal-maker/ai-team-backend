// Server mínimo de diagnóstico para Render
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
  console.log('GET / recibido');
  res.json({ 
    ok: true, 
    message: 'AI Team Backend Test',
    timestamp: new Date().toISOString()
  });
});

// Ruta de diagnóstico simple
app.get('/api/test', (req, res) => {
  console.log('GET /api/test recibido');
  res.json({
    ok: true,
    status: 'working',
    port: PORT,
    node_env: process.env.NODE_ENV || 'development',
    gemini_mode: process.env.GEMINI_MODE || 'not set'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`🚀 AI Team Test Server iniciado`);
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌍 URL: http://0.0.0.0:${PORT}`);
  console.log(`=========================================`);
});
