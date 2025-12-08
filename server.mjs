import express from 'express';
import cors from 'cors';

const app = express();

// Permitir solo desde el frontend desplegado en Render
app.use(cors({
  origin: 'https://ai-team-frontend-7dpt.onrender.com'
}));

// Rutas existentes
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ...otras rutas que tengas

app.listen(10000, () => console.log('Server listening on port 10000'));
