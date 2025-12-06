class Telemetry {
  constructor() {
    this.metrics = {
      agentCalls: {},
      runDurations: [],
      errors: []
    };
  }

  logAgentCall(agentName, duration, success = true) {
    if (!this.metrics.agentCalls[agentName]) {
      this.metrics.agentCalls[agentName] = { total: 0, successes: 0, failures: 0, totalDuration: 0 };
    }
    const agent = this.metrics.agentCalls[agentName];
    agent.total++;
    agent.totalDuration += duration;
    if (success) {
      agent.successes++;
    } else {
      agent.failures++;
    }
  }

  logRun(ticketId, duration, agentSequence) {
    this.metrics.runDurations.push({
      ticketId,
      duration,
      agentSequence,
      timestamp: Date.now()
    });
  }

  logError(error, context = {}) {
    this.metrics.errors.push({
      error: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });
  }

  getMetrics() {
    return {
      ...this.metrics,
      timestamp: Date.now()
    };
  }
}

module.exports = Telemetry;
