require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(bodyParser.json());

// Puerto dinámico para Render
const PORT = process.env.PORT || 3001;

app.post('/test', async (req, res) => {
  const { prompt } = req.body;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ ok: true, response: text });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de prueba listo en http://localhost:${PORT}/test`);
});
