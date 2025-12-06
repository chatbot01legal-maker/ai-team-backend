class BaseAgent {
  constructor({ name, geminiService, memory, telemetry }) {
    this.name = name;
    this.gemini = geminiService;
    this.memory = memory;
    this.telemetry = telemetry;
  }

  async think(input, sessionId, opts = {}) {
    throw new Error('Method think() must be implemented in subclass');
  }

  getAgentMode() {
    const envVar = 'AGENT_' + this.name.toUpperCase() + '_MODE';
    return process.env[envVar] || 'simulated';
  }

  async _executeWithTelemetry(operation, agentName) {
    const startTime = Date.now();
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      this.telemetry.logAgentCall(agentName || this.name, duration, true);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.telemetry.logAgentCall(agentName || this.name, duration, false);
      this.telemetry.logError(error, { agent: this.name });
      throw error;
    }
  }
}

module.exports = BaseAgent;
