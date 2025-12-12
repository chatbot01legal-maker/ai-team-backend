const Base = require('./BaseAgent');
const { estimateMetrics } = require('../utils/metricsUtils');

class DirectorAgent extends Base {
  constructor(deps) { 
    super({ name: 'Director', ...deps }); 
  }

  async think(input, sessionId, opts = {}) {
    return this._executeWithTelemetry(async () => {
      const forceSimulated = this.getAgentMode() === 'simulated' || opts.forceSimulated;
      
      const prompt = "DIRECTOR/COACH: Resume y explica pasos. \nPregunta: " + input.question + "\nContexto: " + JSON.stringify(input.context || {}, null, 2);
      
      const gen = await this.gemini.generateText(prompt, { 
        signature: 'DIR',
        forceSimulated 
      });
      
      const emb = await this.gemini.embed(gen.text);
      const metrics = estimateMetrics(gen.text);
      
      return { 
        agent: this.name, 
        text: gen.text, 
        metrics, 
        embedding: emb, 
        model: gen.model,
        timestamp: Date.now()
      };
    });
  }
}

module.exports = DirectorAgent;
