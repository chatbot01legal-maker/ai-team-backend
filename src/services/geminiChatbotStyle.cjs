// Servicio Gemini usando el MISMO patrón de chatbot_legal
const axios = require('axios');

class GeminiChatbotStyle {
  constructor() {
    // Usa el mismo nombre de variable que en chatbot_legal
    this.apiKey = process.env.gemini_apikey || process.env.GEMINI_API_KEY;
    this.baseURL = 'https://api.gemini.com/v2.5/generate';
    this.timeout = 30000;
    
    console.log('🔧 GeminiChatbotStyle iniciado');
    console.log('   API Key definida:', this.apiKey ? '✅ Sí' : '❌ No');
    console.log('   URL:', this.baseURL);
  }

  async generateText(prompt, opts = {}) {
    if (!this.apiKey) {
      console.log('❌ No hay API key configurada, usando simulated');
      return this._simulatedText(prompt, opts);
    }

    try {
      console.log(`📡 Enviando a ${this.baseURL}`);
      console.log(`   Prompt: ${prompt.substring(0, 100)}...`);
      
      const response = await axios.post(
        this.baseURL,
        { 
          prompt: prompt,
          max_tokens: opts.maxTokens || 100,
          temperature: opts.temperature || 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: this.timeout
        }
      );

      console.log('✅ Respuesta recibida de API');
      
      return {
        text: response.data.response || response.data.text || JSON.stringify(response.data),
        model: 'gemini-chatbot-api',
        source: 'gemini-api',
        timestamp: Date.now(),
        success: true,
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ Error en API Gemini:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Error data:', error.response.data);
      }
      return this._simulatedText(prompt, opts);
    }
  }

  _simulatedText(prompt, opts = {}) {
    const signature = opts.signature || 'SIM';
    const simulatedText = `${signature} | [Simulado] ${prompt.substring(0, 100)}...`;
    
    return {
      text: simulatedText,
      model: 'simulated',
      source: 'simulated',
      timestamp: Date.now(),
      success: false,
      fallbackReason: 'Error en API o no configurado'
    };
  }

  async embed(text) {
    return this._simulatedEmbed(text);
  }

  _simulatedEmbed(text) {
    const seed = [...text].reduce((s, ch) => s + ch.charCodeAt(0), 0);
    return new Array(128).fill(0).map((_, i) => Math.sin(seed + i));
  }

  getStatus() {
    return {
      apiConfigured: this.apiKey ? true : false,
      apiUrl: this.baseURL,
      usingChatbotStyle: true
    };
  }
}

module.exports = GeminiChatbotStyle;
