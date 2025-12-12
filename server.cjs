// ============================================================
// 🚀 AI TEAM BACKEND - SERVER ENTRY POINT (COMMONJS REVISIÓN FINAL)
// ============================================================

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

// Carga de .env (solo para referencias locales)
if (fs.existsSync(path.resolve(__dirname, '.env'))) {
    require('dotenv').config();
}

// Importación de Módulos Internos (Ruta confirmada como funcional por log de inicio)
const { Orchestrator } = require('./src/orchestrator/Orchestrator.js');

const PORT = process.env.PORT || 10000;
const API_KEY = process.env.GEMINI_API_KEY || '';
const MODE = process.env.GEMINI_MODE || 'simulation';

// Inicializar App
const app = express();

// ============================================================
// 1. CONFIGURACIÓN CRÍTICA DE MIDDLEWARE
// ============================================================
app.use(cors());
// Usar el middleware de Express para JSON (sustituye a body-parser obsoleto)
app.use(express.json());
// Usar el middleware de Express para datos codificados en URL
app.use(express.urlencoded({ extended: true }));

// ============================================================
// 2. REGISTRO EXPLÍCITO DE RUTAS
// ============================================================

// Ruta Raíz (GET)
app.get('/', (req, res) => {
    console.log('[REQ] GET /');
    res.status(200).send('🚀 AI Team Backend - Rutas Registradas OK (FINAL CJS)');
});

// Diagnóstico Detallado (GET)
app.get('/api/diagnostics', (req, res) => {
    console.log('[REQ] GET /api/diagnostics');
    res.json({
        ok: true,
        status: 'Routes and Service OK',
        port: PORT,
        mode: MODE,
        api_key_configured: !!API_KEY
    });
});

// RUTA PRINCIPAL DE ORQUESTACIÓN (POST)
app.post('/api/orchestrate', async (req, res) => {
    const { prompt } = req.body;
    console.log(`[REQ] POST /api/orchestrate - Prompt: ${prompt.substring(0, 30)}...`);

    if (!prompt) return res.status(400).json({ ok: false, error: 'Se requiere el campo "prompt".' });

    try {
        const orchestrator = new Orchestrator(`TICKET-${Date.now()}`, prompt);
        const finalResult = await orchestrator.run();
        res.json({ ok: true, status: 'COMPLETED', result: finalResult });
    } catch (error) {
        console.error('❌ CRITICAL ERROR en Orquestación:', error.message);
        res.status(500).json({ ok: false, error: 'Error interno de orquestación', details: error.message });
    }
});


// Manejo de 404/Ruta no encontrada (Debe ir al final)
app.use((req, res) => {
    console.warn(`⚠️ 404 No Found: ${req.method} ${req.url}`);
    res.status(404).json({ ok: false, error: `Cannot ${req.method} ${req.url}` });
});

// ============================================================
// 3. BANNER DE INICIO Y LISTEN
// ============================================================
function printBanner() {
    console.log('\n============================================');
    console.log('🚀 AI TEAM BACKEND - REVISIÓN FINAL CJS');
    console.log(`✅ Puerto: ${PORT}`);
    console.log(`✅ API Key: ${API_KEY ? 'Configurada' : '❌ FALTANTE'}`);
    console.log('============================================\n');
}

app.listen(PORT, '0.0.0.0', () => {
    printBanner();
});
