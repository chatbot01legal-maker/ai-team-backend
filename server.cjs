const express = require('express');
const app = express();
const apiRouter = require('./src/routes/api.cjs');

app.use(express.json()); // Parsear JSON
app.use('/api', apiRouter);

const PORT = 10000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
