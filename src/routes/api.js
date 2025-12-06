const express = require('express');
const router = express.Router();
const YoOrquestador = require('../orchestrator/yoOrquestador');
const { v4: uuidv4 } = require('uuid');

const orchestrator = new YoOrquestador();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

router.post('/run-ticket', async (req, res) => {
  try {
    const ticketId = req.body.ticketId || "ticket_" + uuidv4().slice(0, 8);
    const question = req.body.question;
    const mode = req.body.mode || 'simulated';
    const agentModes = req.body.agentModes || {};
    
    if (!question) {
      return res.status(400).json({
        error: 'Question is required',
        example: {
          ticketId: 'optional_ticket_id',
          question: 'How to implement a secure payment system?',
          mode: 'simulated',
          agentModes: {
            Director: 'simulated',
            Analitico: 'real'
          }
        }
      });
    }
    
    console.log("📥 Received ticket: " + ticketId + ", mode: " + mode);
    
    const result = await orchestrator.run({
      ticketId,
      question,
      mode,
      agentModes
    });
    
    res.json(result);
    
  } catch (error) {
    console.error('Error in /run-ticket:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      traceId: "error_" + Date.now()
    });
  }
});

router.get('/session/:ticketId', (req, res) => {
  try {
    const session = orchestrator.memory.getSession(req.params.ticketId);
    res.json(session);
  } catch (error) {
    res.status(404).json({ error: 'Session not found' });
  }
});

router.post('/test-compare', async (req, res) => {
  try {
    const ticketId = req.body.ticketId || "test_" + uuidv4().slice(0, 8);
    const question = req.body.question;
    const modeA = req.body.modeA || 'simulated';
    const modeB = req.body.modeB || 'hybrid';
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required for comparison' });
    }
    
    console.log("🔬 Running comparison test: " + modeA + " vs " + modeB);
    
    // Ejecutar en modo A
    const resultA = await orchestrator.run({
      ticketId: ticketId + "_A",
      question,
      mode: modeA
    });
    
    // Ejecutar en modo B
    const resultB = await orchestrator.run({
      ticketId: ticketId + "_B",
      question,
      mode: modeB
    });
    
    // Calcular diferencias
    const comparison = {
      ticketId,
      question,
      modes: { modeA, modeB },
      timestamp: Date.now(),
      results: {
        modeA: {
          sequenceLength: resultA.sequence.length,
          agents: resultA.sequence.map(a => a.agent),
          metrics: resultA.metrics,
          duration: resultA.timings.totalMs
        },
        modeB: {
          sequenceLength: resultB.sequence.length,
          agents: resultB.sequence.map(a => a.agent),
          metrics: resultB.metrics,
          duration: resultB.timings.totalMs
        }
      },
      differences: {
        sequenceLengthDiff: Math.abs(resultA.sequence.length - resultB.sequence.length),
        durationDiff: Math.abs(resultA.timings.totalMs - resultB.timings.totalMs),
        pairwiseDistanceDiff: Math.abs(resultA.metrics.avgPairwiseDistance - resultB.metrics.avgPairwiseDistance)
      }
    };
    
    res.json(comparison);
    
  } catch (error) {
    console.error('Error in /test-compare:', error);
    res.status(500).json({ error: 'Comparison failed', message: error.message });
  }
});

router.get('/telemetry', (req, res) => {
  try {
    const metrics = orchestrator.getTelemetry();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get telemetry' });
  }
});

module.exports = router;
