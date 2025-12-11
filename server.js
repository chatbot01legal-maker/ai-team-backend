require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const api = require('./src/routes/api');

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json({ limit: '1mb' }));

app.use('/api', api);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 AI Team Backend listening on port ${PORT}`));
