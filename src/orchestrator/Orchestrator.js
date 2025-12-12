// ============================================================
// 🤖 ORCHESTRATOR.JS - VERSIÓN SIMPLIFICADA SIN COACHAGENT
// ============================================================

const { GeminiService } = require('../services/geminiService.js');

// Importar solo los agentes que existen
const DirectorAgent = require('../agents/DirectorAgent.js');
const CreativeAgent = require('../agents/CreativeAgent.js');
const AnalyticalAgent = require('../agents/AnalyticalAgent.js');
const ControllerAgent = require('../agents/ControllerAgent.js');

class Orchestrator {
    constructor(ticketId, initialPrompt) {
        this.ticketId = ticketId;
        this.prompt = initialPrompt;
        this.gemini = new GeminiService();
        this.history = [];

        // Inicializar solo los agentes que existen
        this.agents = {
            director: new DirectorAgent(this.gemini),
            creative: new CreativeAgent(this.gemini),
            analytical: new AnalyticalAgent(this.gemini),
            controller: new ControllerAgent(this.gemini),
            // coach: new CoachAgent(this.gemini), // Eliminado - no existe
        };
    }

    async run() {
        console.log(`[ORCHESTRATOR ${this.ticketId}] Iniciando Orquestación.`);

        let currentAgent = 'director';
        let currentState = {
            prompt: this.prompt,
            novelty_score: 0.5,
            ambiguity_index: 0.5,
            coherence_score: 0.5
        };

        let maxIterations = 10;
        let result = null;

        while (currentAgent && maxIterations > 0) {
            console.log(`[ORCHESTRATOR] Ejecutando agente: ${currentAgent}`);

            const agent = this.agents[currentAgent];
            
            // Simulación simple de ejecución de agente
            result = {
                agent: currentAgent,
                response: `Simulación de respuesta del agente ${currentAgent} para: ${currentState.prompt}`,
                metrics: {
                    novelty_score: Math.random() * 10,
                    ambiguity_index: Math.random() * 5,
                    coherence_score: Math.random() * 10
                },
                timestamp: new Date().toISOString()
            };

            this.history.push(result);
            console.log(`[ORCHESTRATOR] Agente ${currentAgent} completado.`);

            // Lógica simple de transición basada en métricas
            if (result.metrics.novelty_score > 7) {
                currentAgent = 'creative';
            } else if (result.metrics.ambiguity_index > 3) {
                currentAgent = 'analytical';
            } else if (result.metrics.coherence_score < 6) {
                currentAgent = 'controller';
            } else {
                currentAgent = null; // Terminar orquestación
            }

            maxIterations--;
        }

        console.log(`[ORCHESTRATOR ${this.ticketId}] Orquestación completada.`);
        return {
            ticketId: this.ticketId,
            history: this.history,
            finalResult: result,
            status: 'COMPLETED'
        };
    }
}

module.exports = { Orchestrator };
