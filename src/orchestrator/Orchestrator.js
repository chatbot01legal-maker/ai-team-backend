// ============================================================
// 🤖 ORCHESTRATOR.JS - CORRECCIÓN DE NOMENCLATURA (Volviendo a MAYÚSCULAS)
// ============================================================

// Ruta de Servicios: CORRECTA
const { GeminiService } = require('../services/geminiService.js'); 

// Rutas de Agentes: CORREGIDAS (Volvemos a mayúscula en el inicio del archivo)
const DirectorAgent = require('../agents/DirectorAgent.js'); // FORZAMOS MAYÚSCULA
const CreativeAgent = require('../agents/CreativeAgent.js'); // FORZAMOS MAYÚSCULA
const AnalyticalAgent = require('../agents/AnalyticalAgent.js'); 
const ControllerAgent = require('../agents/ControllerAgent.js'); 
const CoachAgent = require('../agents/CoachAgent.js'); 


class Orchestrator {
    constructor(ticketId, initialPrompt) {
        this.ticketId = ticketId;
        this.prompt = initialPrompt;
        this.gemini = new GeminiService();
        this.history = []; 

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
            
            this.history.push({
                agent: currentAgent,
                input: currentState,
                output: agentResponse
            });

            if (agentResponse.final_answer) {
                result = agentResponse.final_answer;
                break;
            }

            if (currentAgent === 'director') {
                currentAgent = 'creative'; 
            } else if (currentAgent === 'creative') {
                currentAgent = 'analytical';
            } else {
                currentAgent = null; 
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
