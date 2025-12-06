const Base = require('./baseAgent');
const { estimateMetrics } = require('../utils/metricsUtils');

class ControladorAgent extends Base {
  constructor(deps) { 
    super({ name: 'Controlador', ...deps }); 
  }

  async think(input, sessionId, opts = {}) {
    return this._executeWithTelemetry(async () => {
      const forceSimulated = this.getAgentMode() === 'simulated' || opts.forceSimulated;
      
      const prompt = 'CONTROLADOR: Valida factibilidad, identifica riesgos y propone plan de pruebas.\nPregunta: ' + input.question + '\nContexto: ' + JSON.stringify(input.context || {}, null, 2) + '\nProporciona:\n1. Análisis de factibilidad (viable/semi-viable/inviable)\n2. Plan de pruebas (unitarias, integración, humo)\n3. Riesgos identificados y mitigaciones\n4. Estimación de esfuerzo';
      
      const gen = await this.gemini.generateText(prompt, { 
        signature: 'CTL',
        forceSimulated 
      });
      
      const emb = await this.gemini.embed(gen.text);
      const metrics = estimateMetrics(gen.text);
      
      // Modificación específica para métricas de control
      metrics.feasibility = Math.max(0.3, metrics.feasibility - 0.1);
      metrics.coherence = Math.min(10, metrics.coherence + 1);
      
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

module.exports = ControladorAgent;
