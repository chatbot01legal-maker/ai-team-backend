const axios = require('axios');

const DEFAULT_MODELS = [
  'gemini-2.0-pro',
  'gemini-2.0-flash',
  'gemini-1.5-pro'
];

class GeminiService {
  constructor({ apiKey, mode='simulated', modelList } = {}) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.mode = process.env.GEMINI_MODE || mode;
    this.models = modelList || DEFAULT_MODELS;
    this.timeoutMs = 15000;
  }

  async generateText(prompt, opts = {}) {
    // Siempre usar simulated por ahora
    return this._simulatedText(prompt, opts);
  }

  async embed(text) {
    return this._simulatedEmbed(text);
  }

  _simulatedText(prompt, opts) {
    const base = (opts.signature || 'SIM') + ' | ' + prompt.slice(0, 200);
    const text = base + ' -- simulated response';
    return { text, model: 'simulated' };
  }

  _simulatedEmbed(text) {
    const seed = [...text].reduce((s, ch) => s + ch.charCodeAt(0), 0);
    const v = new Array(128).fill(0).map((_, i) => Math.sin(seed + i));
    return v;
  }
}

module.exports = { GeminiService };
