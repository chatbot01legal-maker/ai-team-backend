require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

class GeminiService {
  constructor({ mode = process.env.GEMINI_MODE || 'simulated' } = {}) {
    this.mode = mode;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

    if (mode === 'real' || mode === 'hybrid') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not configured in .env');
        this.mode = 'simulated';
      } else {
        try {
          this.ai = new GoogleGenAI({ apiKey: apiKey });
          console.log(`✅ GeminiService: REAL mode connected, using model: ${this.modelName}`);
        } catch (error) {
          console.error('❌ Error initializing GoogleGenAI:', error.message);
          this.mode = 'simulated';
        }
      }
    } else {
      console.log('⚠️ GeminiService: SIMULATED mode active');
    }
  }

  async generateText(prompt, options = {}) {
    const signature = options.signature || 'GEN';
    const forceSimulated = options.forceSimulated || this.mode !== 'real';

    if (forceSimulated || this.mode !== 'real') {
      return this._simulateGeneration(prompt, signature);
    }

    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      return {
        text: response.text || 'No response generated',
        model: this.modelName,
        isReal: true,
        signature: `${signature}-REAL`,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`❌ generateText error:`, error.message);
      return this._simulateGeneration(prompt, signature);
    }
  }

  async embed(text, options = {}) {
    const forceSimulated = options.forceSimulated || this.mode !== 'real';

    if (forceSimulated || this.mode !== 'real') {
      return this._simulateEmbedding(text);
    }

    try {
      // FORMATO CORREGIDO: usar 'contents' como array
      const response = await this.ai.models.embedContent({
        model: 'models/embedding-001',
        contents: [{ parts: [{ text: text }] }]
      });

      // Respuesta tiene 'embeddings' (array) no 'embedding'
      if (response.embeddings && response.embeddings.length > 0) {
        const embedding = response.embeddings[0].values || [];
        if (embedding.length > 0) {
          return embedding;
        }
      }
      
      console.log('⚠️  Embedding vacío, usando simulado');
      return this._simulateEmbedding(text);
    } catch (error) {
      console.error(`❌ embed error:`, error.message);
      return this._simulateEmbedding(text);
    }
  }

  _simulateGeneration(prompt, signature) {
    const responses = [
      \`[\${signature}-SIM] Análisis completado: "\${prompt.substring(0, 50)}...". Recomiendo enfoque en tres fases.\`,
      \`[\${signature}-SIM] Identificadas variables clave. Propongo modelo iterativo.\`,
      \`[\${signature}-SIM] Solución creativa al problema. Implementa validación incremental.\`
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return {
      text: randomResponse,
      model: 'simulated-1.0',
      isReal: false,
      signature: \`\${signature}-SIM\`,
      timestamp: Date.now()
    };
  }

  _simulateEmbedding(text) {
    const dimensions = 768;
    const embedding = [];
    let seed = 0;
    for (let i = 0; i < text.length; i++) seed += text.charCodeAt(i);
    for (let i = 0; i < dimensions; i++) {
      embedding.push(parseFloat((Math.sin(seed * (i + 1)) * 0.5).toFixed(6)));
    }
    return embedding;
  }
}

module.exports = { GeminiService };
