import express from 'express';
import cors from 'cors';

const app = express();

// Configurar CORS solo para tu frontend en Render
const frontendURL = 'https://ai-team-frontend-7dpt.onrender.com';
app.use(cors({
  origin: frontendURL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Rutas
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Ejemplo de endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Hola desde backend!' });
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
