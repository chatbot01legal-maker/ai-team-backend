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
    if (this.mode === 'simulated' || opts.forceSimulated) {
      return this._simulatedText(prompt, opts);
    }
    if (this.mode === 'hybrid' && opts.simulate) {
      return this._simulatedText(prompt, opts);
    }
    // REAL call placeholder (DeepSeek: plug SDK call here)
    try {
      // Example placeholder for SDK call - replace with real SDK
      const res = await axios.post('https://api.gemini.fake/generate', { prompt }, {
        headers: { Authorization: 'Bearer ' + this.apiKey },
        timeout: this.timeoutMs
      });
      return { text: res.data.text, model: res.data.model };
    } catch (e) {
      // fallback to simulated
      return this._simulatedText(prompt, opts);
    }
  }

  async embed(text) {
    if (this.mode === 'simulated') {
      return this._simulatedEmbed(text);
    }
    // REAL embed placeholder
    try {
      const res = await axios.post('https://api.gemini.fake/embed', { text }, {
        headers: { Authorization: 'Bearer ' + this.apiKey },
        timeout: this.timeoutMs
      });
      return res.data.embedding;
    } catch (e) {
      return this._simulatedEmbed(text);
    }
  }

  _simulatedText(prompt, opts) {
    const base = (opts.signature || 'SIM') + ' | ' + prompt.slice(0, 200);
    const text = base + ' -- simulated response';
    return { text, model: 'simulated' };
  }

  _simulatedEmbed(text) {
    const seed = [...text].reduce((s,ch) => s + ch.charCodeAt(0), 0);
    const v = new Array(128).fill(0).map((_,i) => Math.sin(seed + i));
    return v;
  }
}

module.exports = { GeminiService };
