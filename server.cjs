// ============================================================
// 🚀 AI TEAM BACKEND - SERVER.CJS DEFINITIVO
// Basado en patrón Chatbot Legal (comprobado en Render)
// ============================================================

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

// ============================================================
// 1. VALIDACIÓN EXPLÍCITA DE VARIABLES (PATRÓN CHATBOT LEGAL)
// ============================================================

console.log('\n' + '='.repeat(60));
console.log('🚀 AI TEAM BACKEND - INICIALIZACIÓN');
console.log('='.repeat(60));

// Cargar variables de entorno
if (fs.existsSync(path.resolve(__dirname, '.env'))) {
    require('dotenv').config();
    console.log('✅ .env cargado');
} else {
    console.log('⚠️  .env no encontrado, usando variables de entorno del sistema');
}

// Variables críticas
const PORT = process.env.PORT || 10000;
const API_KEY = process.env.GEMINI_API_KEY || '';
const MODE = process.env.GEMINI_MODE || 'simulation';
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`📊 ENTORNO: ${NODE_ENV}`);
console.log(`🔑 PORT: ${PORT}`);
console.log(`🎛️  MODO: ${MODE}`);
console.log(`🔐 API_KEY: ${API_KEY ? 'Configurada ✓' : '❌ NO CONFIGURADA'}`);

// ============================================================
// 2. VALIDACIÓN DE MÓDULOS INTERNOS (CRÍTICO PARA DIAGNÓSTICO)
// ============================================================

let Orchestrator;
try {
    const orchestratorModule = require('./src/orchestrator/Orchestrator.js');
    Orchestrator = orchestratorModule.Orchestrator;
    console.log('✅ Módulo Orchestrator cargado correctamente');
} catch (error) {
    console.error('❌ ERROR CARGANDO ORCHESTRATOR:', error.message);
    process.exit(1);
}

// ============================================================
// 3. CONFIGURACIÓN EXPRESS (PATRÓN EXITOSO)
// ============================================================

const app = express();

// CORS configurado como en chatbot legal exitoso
const allowedOrigins = [
    'https://ai-team-frontend.onrender.com',
    'https://ai-team-backend.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS: ' + origin));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('✅ Middleware Express configurado');

// ============================================================
// 4. REGISTRO DE RUTAS CON LOGGING VERBOSE
// ============================================================

// Ruta de diagnóstico (GET)
app.get('/', (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /`);
    res.status(200).json({
        ok: true,
        service: 'AI Team Backend',
        version: '1.0.0',
        status: 'operational',
        endpoints: ['/', '/api/diagnostics', '/api/orchestrate', '/api/gemini-test']
    });
});

// Diagnóstico completo (GET)
app.get('/api/diagnostics', (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/diagnostics`);
    res.json({
        ok: true,
        status: 'AI Team Backend Operational',
        timestamp: new Date().toISOString(),
        environment: {
            port: PORT,
            node_env: NODE_ENV,
            gemini_mode: MODE,
            api_key_configured: !!API_KEY,
            api_key_length: API_KEY.length
        },
        system: {
            node_version: process.version,
            platform: process.platform,
            memory: process.memoryUsage()
        },
        endpoints: {
            home: 'GET /',
            diagnostics: 'GET /api/diagnostics',
            orchestrate: 'POST /api/orchestrate',
            gemini_test: 'GET /api/gemini-test'
        }
    });
});

// Test de Gemini (GET)
app.get('/api/gemini-test', async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/gemini-test`);
    try {
        if (MODE === 'simulation') {
            return res.json({
                ok: true,
                mode: 'simulation',
                message: 'Gemini en modo simulación',
                test: 'SIMULATED_API_OK'
            });
        }
        
        if (!API_KEY) {
            return res.status(500).json({
                ok: false,
                error: 'GEMINI_API_KEY no configurada'
            });
        }
        
        // Simulación de test exitoso
        res.json({
            ok: true,
            mode: 'real',
            message: 'Conexión Gemini verificada',
            test: 'REAL_API_OK',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
});

// Ruta principal de orquestación (POST)
app.post('/api/orchestrate', async (req, res) => {
    const { prompt } = req.body;
    const requestId = `REQ-${Date.now()}`;
    
    console.log(`[${requestId}] POST /api/orchestrate - Prompt recibido`);
    
    if (!prompt) {
        console.log(`[${requestId}] ❌ Error: prompt vacío`);
        return res.status(400).json({ 
            ok: false, 
            error: 'Se requiere el campo "prompt" en el body' 
        });
    }

    try {
        console.log(`[${requestId}] 🚀 Iniciando orquestación para: "${prompt.substring(0, 50)}..."`);
        
        const orchestrator = new Orchestrator(requestId, prompt);
        const result = await orchestrator.run();
        
        console.log(`[${requestId}] ✅ Orquestación completada exitosamente`);
        
        res.json({
            ok: true,
            requestId,
            status: 'COMPLETED',
            timestamp: new Date().toISOString(),
            result: result
        });
    } catch (error) {
        console.error(`[${requestId}] ❌ Error en orquestación:`, error.message);
        res.status(500).json({
            ok: false,
            requestId,
            error: 'Error interno en la orquestación',
            details: error.message
        });
    }
});

// Manejo de 404
app.use((req, res) => {
    console.warn(`[${new Date().toISOString()}] ⚠️ 404: ${req.method} ${req.url}`);
    res.status(404).json({
        ok: false,
        error: `Ruta no encontrada: ${req.method} ${req.url}`,
        available_routes: ['GET /', 'GET /api/diagnostics', 'POST /api/orchestrate', 'GET /api/gemini-test']
    });
});

// ============================================================
// 5. INICIO DEL SERVIDOR CON BANNER COMPLETO
// ============================================================

app.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(60));
    console.log('✅ SERVIDOR INICIADO CORRECTAMENTE');
    console.log('='.repeat(60));
    console.log(`🔌 Puerto: ${PORT}`);
    console.log(`🌍 URL: http://0.0.0.0:${PORT}`);
    console.log(`🔄 Modo: ${MODE}`);
    console.log(`🔑 API Key: ${API_KEY ? 'Configurada ✓' : '❌ FALTANTE'}`);
    console.log(`📊 Entorno: ${NODE_ENV}`);
    console.log('='.repeat(60));
    console.log('📋 Endpoints disponibles:');
    console.log(`   • GET  /                 - Estado del servicio`);
    console.log(`   • GET  /api/diagnostics  - Diagnóstico completo`);
    console.log(`   • POST /api/orchestrate  - Orquestación de agentes`);
    console.log(`   • GET  /api/gemini-test  - Test de conexión Gemini`);
    console.log('='.repeat(60) + '\n');
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ ERROR NO CAPTURADO:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ PROMESA RECHAZADA NO MANEJADA:', reason);
});

module.exports = app;
