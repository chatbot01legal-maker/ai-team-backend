import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Habilitar CORS solo para tu frontend en Render
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://ai-team-frontend-7dpt.onrender.com',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Ruta ejemplo para llamar a Gemini
app.post('/gemini', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    // Aquí iría la lógica de Gemini
    const output = "respuesta simulada de Gemini"; // temporal
    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error conectando a Gemini' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
