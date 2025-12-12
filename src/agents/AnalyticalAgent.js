const Base = require('./BaseAgent');
const { estimateMetrics } = require('../utils/metricsUtils');

class AnaliticoAgent extends Base {
  constructor(deps) { 
    super({ name: 'Analitico', ...deps }); 
  }

  async think(input, sessionId, opts = {}) {
    return this._executeWithTelemetry(async () => {
      const forceSimulated = this.getAgentMode() === 'simulated' || opts.forceSimulated;
      
      const prompt = 'ANALÍTICO: Realiza validaciones técnicas, análisis de complejidad y verificación de supuestos.\nPregunta: ' + input.question + '\nContexto anterior: ' + JSON.stringify(input.context || {}, null, 2) + '\nProporciona:\n1. Lista de verificaciones técnicas\n2. Análisis de complejidad\n3. Supuestos identificados\n4. Posibles riesgos técnicos';
      
      const gen = await this.gemini.generateText(prompt, { 
        signature: 'ANA',
        forceSimulated 
      });
      
      const emb = await this.gemini.embed(gen.text);
      const metrics = estimateMetrics(gen.text);
      
      // Modificación específica para métricas analíticas
      metrics.coherence = Math.min(10, metrics.coherence + 2);
      metrics.ambiguity = Math.max(1, metrics.ambiguity - 1);
      
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

module.exports = AnaliticoAgent;
