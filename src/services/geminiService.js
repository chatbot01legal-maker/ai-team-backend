require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

/**
 * SERVICIO DE GEMINI - Estabilizado y Corregido para @google/genai
 */
class GeminiService {
  constructor({ mode = process.env.GEMINI_MODE || 'simulated' } = {}) {
    this.mode = mode;
    // Usar el modelo más estable y actual para generación de texto
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    // Modelo de embedding recomendado
    this.embeddingModelName = 'models/embedding-001';

    if (mode === 'real') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('❌ GEMINI_API_KEY no configurada en .env. Cambiando a modo simulado.');
        this.mode = 'simulated';
      } else {
        try {
          // Inicializar el SDK de Google GenAI
          this.ai = new GoogleGenAI({ apiKey });
          console.log(`✅ GeminiService: REAL mode connected, using model: ${this.modelName}`);
        } catch (error) {
          console.error('❌ Error initializing GoogleGenAI:', error.message);
          this.mode = 'simulated';
        }
      }
    }

    if (this.mode === 'simulated') {
      console.log('⚠️ GeminiService: SIMULATED mode active');
    }
  }

  async generateText(prompt, options = {}) {
    const signature = options.signature || 'GEN';
    const forceSimulated = options.forceSimulated || this.mode !== 'real';

    if (forceSimulated) {
      return this._simulateGeneration(prompt, signature);
    }

    try {
      // API call using the correct structure for the new SDK
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }] 
      });

      const text = response.text || 'No response generated';

      return {
        text: text,
        model: this.modelName,
        isReal: true,
        signature: `${signature}-REAL`,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`❌ generateText error (${this.modelName}):`, error.message);
      return this._simulateGeneration(prompt, signature);
    }
  }

  async embed(text, options = {}) {
    const forceSimulated = options.forceSimulated || this.mode !== 'real';

    if (forceSimulated) {
      return this._simulateEmbedding(text);
    }

    try {
      // CORRECCIÓN CRÍTICA: Estructura correcta para embedContent
      const response = await this.ai.models.embedContent({
        model: this.embeddingModelName,
        content: { parts: [{ text: text }] } 
      });

      // El embedding viene en response.embedding.values
      const embedding = response.embedding?.values || [];

      if (embedding.length === 0) {
        throw new Error('Embedding vacío recibido de la API.');
      }

      return embedding;
    } catch (error) {
      console.error(`❌ embed error:`, error.message);
      return this._simulateEmbedding(text);
    }
  }

  _simulateGeneration(prompt, signature) {
    const responses = [
      `[${signature}-SIM] Análisis completado: "${prompt.substring(0, 50)}...". Recomiendo enfoque en tres fases.`,
      `[${signature}-SIM] Identificadas variables clave. Propongo modelo iterativo.`,
      `[${signature}-SIM] Solución creativa al problema. Implementa validación incremental.`
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return {
      text: randomResponse,
      model: 'simulated-1.0',
      isReal: false,
      signature: `${signature}-SIM`,
      timestamp: Date.now()
    };
  }

  _simulateEmbedding(text) {
    const dimensions = 768;
    const embedding = [];
    let seed = 0;
    for (let i = 0; i < text.length; i++) seed += text.charCodeAt(i);
    for (let i = 0; i < dimensions; i++) {
      const val = Math.sin(seed * (i + 1)) * 0.5;
      embedding.push(parseFloat(val.toFixed(6)));
    }
    return embedding;
  }
}

module.exports = { GeminiService };
