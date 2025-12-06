const Base = require('./baseAgent');
const { estimateMetrics } = require('../utils/metricsUtils');

class CreativoAgent extends Base {
  constructor(deps) { 
    super({ name: 'Creativo', ...deps }); 
  }

  async think(input, sessionId, opts = {}) {
    return this._executeWithTelemetry(async () => {
      const forceSimulated = this.getAgentMode() === 'simulated' || opts.forceSimulated;
      
      const prompt = 'CREATIVO: Genera ideas innovadoras y enfoques alternativos.\nPregunta: ' + input.question + '\nContexto: ' + JSON.stringify(input.context || {}, null, 2) + '\nProporciona:\n1. 3-5 enfoques alternativos\n2. Una idea radical (fuera de lo común)\n3. Pros y contras de cada enfoque\n4. Potencial de innovación';
      
      const gen = await this.gemini.generateText(prompt, { 
        signature: 'CRE',
        forceSimulated 
      });
      
      const emb = await this.gemini.embed(gen.text);
      const metrics = estimateMetrics(gen.text);
      
      // Modificación específica para métricas creativas
      metrics.novelty = Math.min(10, metrics.novelty + 3);
      metrics.risk = Math.min(1, metrics.risk + 0.2);
      
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

module.exports = CreativoAgent;
