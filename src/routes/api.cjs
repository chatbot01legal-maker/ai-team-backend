const express = require('express');
const router = express.Router();
const yoOrquestador = require('../orchestrator/yoOrquestador.cjs');

router.use(express.json());

router.post('/message', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const reply = await yoOrquestador.handleMessage(userMessage);
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error procesando el mensaje' });
    }
});

module.exports = router;
