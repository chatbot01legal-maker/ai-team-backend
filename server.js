require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Orchestrator } = require('./orchestrator/Orchestrator.js');
const { GeminiService } = require('./services/geminiService.js');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializar el servicio Gemini
const geminiService = new GeminiService({ mode: process.env.GEMINI_MODE || 'simulated' });
console.log(`✅ GeminiService: ${geminiService.mode.toUpperCase()} mode connected, using model: ${geminiService.model}`);


// RUTA PRINCIPAL DE LA APLICACIÓN: /api/orchestrate
app.post('/api/orchestrate', async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) {
        return res.status(400).json({ ok: false, error: 'Se requiere el campo "prompt".' });
    }

    const ticketId = `TICKET-${Date.now()}`;
    console.log(`\n======================================================`);
    console.log(`📥 INICIANDO ORQUESTACIÓN: ${ticketId}`);
    console.log(`======================================================`);

    try {
        const orchestrator = new Orchestrator(ticketId, prompt);
        const finalResult = await orchestrator.run();

        console.log(`✅ ORQUESTACIÓN COMPLETA: ${ticketId}`);

        res.json({
            ok: true,
            status: 'ORCHESTRATION_COMPLETED',
            finalAnswer: finalResult.finalResult,
            history: finalResult.history.map(item => ({
                agent: item.agent,
                metrics: item.metrics,
                summary: item.text.substring(0, 100) + '...'
            })),
        });
    } catch (error) {
        console.error('❌ ERROR DURANTE LA ORQUESTACIÓN:', error.message);
        res.status(500).json({
            ok: false,
            error: 'Fallo en la ejecución de la Orquestación',
            details: error.message
        });
    }
});


// RUTA DE DIAGNÓSTICO (Health Check)
app.get('/api/diagnostics', (req, res) => {
    const apiKeyStatus = process.env.GEMINI_API_KEY ? 'CONFIGURADA' : 'NO CONFIGURADA';

    res.json({
        ok: true,
        report: 'DIAGNÓSTICO DE CONEXIÓN GEMINI',
        port_activo: PORT,
        gemini_mode_enviroment: process.env.GEMINI_MODE || 'UNDEFINED',
        gemini_api_key_status: apiKeyStatus,
        gemini_service_internal_mode: geminiService.mode,
        nota: "El Orquestador está cargado en server.js"
    });
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor de Producción Express escuchando en puerto ${PORT}`);
});

