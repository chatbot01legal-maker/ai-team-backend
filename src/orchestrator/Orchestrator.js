// ============================================================
// 🤖 ORCHESTRATOR.JS - CORRECCIÓN DE RUTAS DE AGENTES
// ============================================================

// Ruta de Servicios: CORREGIDA
const { GeminiService } = require('../services/geminiService.js'); 

// Rutas de Agentes: CORREGIDAS
// NOTA: Si el error persiste, confirma la nomenclatura exacta de tus archivos dentro de /src/agents/
const DirectorAgent = require('../agents/DirectorAgent.js');
const CreativeAgent = require('../agents/CreativeAgent.js');
const AnalyticalAgent = require('../agents/AnalyticalAgent.js'); // Asunción
const ControllerAgent = require('../agents/ControllerAgent.js'); // Asunción
const CoachAgent = require('../agents/CoachAgent.js'); // Asunción


class Orchestrator {
    constructor(ticketId, initialPrompt) {
        this.ticketId = ticketId;
        this.prompt = initialPrompt;
        this.gemini = new GeminiService();
        this.history = []; // Memoria persistente

        // Inicializa tus agentes
        this.agents = {
            director: new DirectorAgent(this.gemini),
            creative: new CreativeAgent(this.gemini),
            analytical: new AnalyticalAgent(this.gemini),
            controller: new ControllerAgent(this.gemini),
            coach: new CoachAgent(this.gemini),
        };
    }

    async run() {
        console.log(`[ORCHESTRATOR ${this.ticketId}] Iniciando Orquestación.`);
        
        // FASE 1: Director analiza y decide el flujo
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
            if (!agent) {
                console.error(`Agente no encontrado: ${currentAgent}`);
                break;
            }

            const agentResponse = await agent.execute(currentState, this.history);
            
            // Actualizar el estado y la historia
            this.history.push({
                agent: currentAgent,
                input: currentState,
                output: agentResponse
            });

            // Lógica de Orquestación Dinámica (Simplificada para el test de despliegue)
            if (agentResponse.final_answer) {
                result = agentResponse.final_answer;
                break;
            }

            // Simulación de cambio de agente o detención
            if (currentAgent === 'director') {
                currentAgent = 'creative'; 
            } else if (currentAgent === 'creative') {
                currentAgent = 'analytical';
            } else {
                currentAgent = null; // Detener flujo
            }

            currentState = agentResponse.new_state || currentState;
            maxIterations--;
        }

        return {
            final_result: result || 'Flujo de orquestación finalizado sin respuesta definitiva.',
            full_history: this.history,
            gemini_mode: this.gemini.mode
        };
    }
}

module.exports = { Orchestrator };
// ============================================================
