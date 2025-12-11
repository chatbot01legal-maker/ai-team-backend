const GeminiService = require('../services/geminiService.cjs');

async function handleMessage(message) {
    try {
        console.log('Mensaje recibido en orquestador:', message);
        const reply = await GeminiService.sendMessage(message);
        console.log('Respuesta de Gemini:', reply);
        return reply;
    } catch (err) {
        console.error('Error en yoOrquestador:', err);
        throw err;
    }
}

module.exports = { handleMessage };
