require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { GeminiService } = require('./src/services/geminiService');

const app = express();
// Usar el puerto dinámico de Render/producción
const PORT = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializar el servicio Gemini en modo real
const geminiService = new GeminiService({ mode: 'real' });

// 1. Health Check simple
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: Date.now() });
});

// 2. Endpoint de prueba POST que usa Gemini
app.post('/api/gemini-test', async (req, res) => {
    const prompt = req.body.prompt || 'Responde con "OK, conexión funcional"';
    console.log(`\n📥 Recibida solicitud de prueba con prompt: "${prompt.substring(0, 30)}..."`);
    
    try {
        const result = await geminiService.generateText(prompt, { signature: 'TEST-WEB', forceSimulated: false });
        
        console.log(`✅ Respuesta de Gemini recibida (Real: ${result.isReal ? 'SI' : 'NO'})`);
        
        res.json({
            ok: true,
            status: result.isReal ? 'REAL_API_OK' : 'SIMULATED_FALLBACK',
            model: result.model,
            response: result.text.substring(0, 200) + '...'
        });
    } catch (error) {
        console.error('❌ Error en /api/gemini-test:', error.message);
        res.status(500).json({ 
            ok: false, 
            error: 'Fallo en la llamada a Gemini', 
            details: error.message 
        });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor de prueba Express escuchando en puerto ${PORT}`);
    console.log(`   URL de prueba local: http://localhost:${PORT}/api/gemini-test`);
});

