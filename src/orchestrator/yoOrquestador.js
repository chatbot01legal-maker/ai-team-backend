const MemoryService = require('../services/memoryService');
const { GeminiService } = require('../services/geminiService');
const Telemetry = require('../services/telemetry');
const DirectorAgent = require('../agents/directorAgent');
const AnaliticoAgent = require('../agents/analiticoAgent');
const CreativoAgent = require('../agents/creativoAgent');
const ControladorAgent = require('../agents/controladorAgent');
const { calculatePairwiseDistance } = require('../utils/metricsUtils');

class YoOrquestador {
  constructor({ config = {} } = {}) {
    this.gemini = new GeminiService({ mode: process.env.GEMINI_MODE || 'simulated' });
    this.memory = new MemoryService();
    this.telemetry = new Telemetry();
    
    const deps = { 
      geminiService: this.gemini, 
      memory: this.memory,
      telemetry: this.telemetry
    };
    
    this.agents = {
      Director: new DirectorAgent(deps),
      Analitico: new AnaliticoAgent(deps),
      Creativo: new CreativoAgent(deps),
      Controlador: new ControladorAgent(deps)
    };
  }

  _decideNext(metrics, previousSequence = []) {
    // Lógica de decisión basada en métricas
    if (metrics.novelty >= 8 && previousSequence.every(a => a.agent !== 'Creativo')) {
      return 'Creativo';
    }
    if (metrics.ambiguity >= 4 && previousSequence.every(a => a.agent !== 'Analitico')) {
      return 'Analitico';
    }
    if (metrics.coherence < 5 && previousSequence.every(a => a.agent !== 'Controlador')) {
      return 'Controlador';
    }
    if (metrics.feasibility < 0.5) {
      return 'Controlador';
    }
    
    // Por defecto, seguir con Analítico
    return 'Analitico';
  }

  _shouldContinue(sequence, maxSteps = 5) {
    if (sequence.length >= maxSteps) return false;
    
    // No continuar si el último agente fue Controlador (cierre)
    if (sequence.length > 0 && sequence[sequence.length - 1].agent === 'Controlador') {
      return false;
    }
    
    return true;
  }

  async run({ ticketId, question, mode = 'simulated', agentModes = {} }) {
    const startTime = Date.now();
    
    try {
      const session = this.memory.getSession(ticketId);
      const context = { events: session.events.slice(-10) };
      const sequence = [];
      
      // Ejecutar Director primero (siempre)
      console.log("🎬 Iniciando ejecución para ticket " + ticketId);
      
      const director = await this.agents.Director.think(
        { question, context }, 
        ticketId, 
        { forceSimulated: agentModes.Director === 'simulated' }
      );
      
      this.memory.pushEvent(ticketId, director);
      sequence.push(director);
      
      // Secuencia dinámica basada en métricas
      while (this._shouldContinue(sequence)) {
        const lastAgent = sequence[sequence.length - 1];
        const nextAgentName = this._decideNext(lastAgent.metrics, sequence);
        
        console.log("🔀 Decisión: " + lastAgent.agent + " -> " + nextAgentName);
        
        const nextAgent = this.agents[nextAgentName];
        if (!nextAgent) break;
        
        const agentResponse = await nextAgent.think(
          { question, context }, 
          ticketId, 
          { forceSimulated: agentModes[nextAgentName] === 'simulated' }
        );
        
        this.memory.pushEvent(ticketId, agentResponse);
        sequence.push(agentResponse);
      }
      
      // Calcular métricas de diferenciación
      const embeddings = sequence.map(step => step.embedding);
      const avgPairwiseDistance = calculatePairwiseDistance(embeddings);
      
      const duration = Date.now() - startTime;
      this.telemetry.logRun(ticketId, duration, sequence.map(s => s.agent));
      
      return { 
        ok: true, 
        ticketId, 
        sequence, 
        traceId: "trace_" + ticketId + "_" + Date.now(),
        timings: { totalMs: duration },
        metrics: { avgPairwiseDistance },
        warning: avgPairwiseDistance < 0.15 ? 'Baja diferenciación entre agentes' : null
      };
      
    } catch (error) {
      this.telemetry.logError(error, { ticketId, question });
      throw error;
    }
  }
  
  getTelemetry() {
    return this.telemetry.getMetrics();
  }
}

module.exports = YoOrquestador;
