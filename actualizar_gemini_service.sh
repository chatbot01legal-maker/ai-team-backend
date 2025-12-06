#!/bin/bash
echo "🔄 ACTUALIZANDO GEMINI SERVICE CON SDK REAL"
echo "=========================================="

cd ~/ai_team_v1/ai_team_backend

# Crear backup del archivo actual
cp src/services/geminiService.js src/services/geminiService.js.backup

# Crear nueva versión con SDK real
cat > src/services/geminiService.js << 'GEMINIEOF'
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');

const DEFAULT_MODELS = [
  'gemini-2.0-flash',  // Más rápido y económico
  'gemini-1.5-pro',    // Más capaz
  'gemini-2.0-pro'     // Más reciente
];

class GeminiService {
  constructor({ apiKey, mode = 'simulated', modelList } = {}) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.mode = process.env.GEMINI_MODE || mode;
    this.models = modelList || DEFAULT_MODELS;
    this.timeoutMs = 30000; // 30 segundos para respuestas reales
    
    // Inicializar cliente Gemini si estamos en modo real/hybrid y hay API key
    if ((this.mode === 'real' || this.mode === 'hybrid') && this.apiKey && this.apiKey !== 'tu_api_key_aquí') {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: this.models[0] });
        console.log('✅ Gemini SDK inicializado con modelo:', this.models[0]);
      } catch (error) {
        console.error('❌ Error inicializando Gemini SDK:', error.message);
        this.mode = 'simulated'; // Fallback a simulated
      }
    }
  }

  async generateText(prompt, opts = {}) {
    // Forzar simulated si se solicita
    if (this.mode === 'simulated' || opts.forceSimulated) {
      return this._simulatedText(prompt, opts);
    }

    // Si no hay API key válida, usar simulated
    if (!this.apiKey || this.apiKey === 'tu_api_key_aquí') {
      console.warn('⚠️  API key no configurada, usando modo simulated');
      return this._simulatedText(prompt, opts);
    }

    try {
      // Llamada real a Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return { 
        text, 
        model: this.models[0],
        fullResponse: response
      };
      
    } catch (error) {
      console.error('❌ Error en Gemini API:', error.message);
      
      // Fallback a simulated o otro modelo
      if (this.models.length > 1) {
        console.log('🔄 Intentando con modelo alternativo...');
        try {
          const fallbackModel = this.genAI.getGenerativeModel({ model: this.models[1] });
          const result = await fallbackModel.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          return { 
            text, 
            model: this.models[1],
            fallback: true 
          };
        } catch (fallbackError) {
          console.error('❌ Fallback también falló:', fallbackError.message);
        }
      }
      
      // Último recurso: simulated
      return this._simulatedText(prompt, opts);
    }
  }

  async embed(text) {
    if (this.mode === 'simulated') {
      return this._simulatedEmbed(text);
    }

    // Embedding real (si está disponible)
    try {
      const embeddingModel = this.genAI.getGenerativeModel({ model: 'embedding-001' });
      const result = await embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.warn('⚠️  Embedding no disponible, usando simulated');
      return this._simulatedEmbed(text);
    }
  }

  _simulatedText(prompt, opts) {
    const base = (opts.signature || 'SIM') + ' | ' + prompt.slice(0, 200);
    const text = \`\${base} -- simulated response\`;
    return { text, model: 'simulated' };
  }

  _simulatedEmbed(text) {
    const seed = [...text].reduce((s, ch) => s + ch.charCodeAt(0), 0);
    const v = new Array(128).fill(0).map((_, i) => Math.sin(seed + i));
    return v;
  }
}

module.exports = { GeminiService };
GEMINIEOF

echo "✅ geminiService.js actualizado con SDK real"
echo ""
echo "📦 Dependencias actualizadas:"
npm list @google/generative-ai 2>/dev/null || echo "Instalando dependencia..."
