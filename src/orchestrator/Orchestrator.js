// ============================================================
// 🤖 ORCHESTRATOR.JS - CÓDIGO CORREGIDO
// ============================================================
// ¡ATENCIÓN! La línea de abajo ha sido corregida.
const { GeminiService } = require('../services/geminiService.js'); 
// La ruta anterior era '../../services/...' y fallaba en Render.

// Importa tus Agentes aquí
const DirectorAgent = require('../agents/DirectorAgent.js');
const CreativeAgent = require('../agents/CreativeAgent.js');
// ... (Importa el resto de tus agentes aquí: Analítico, Controlador, Coach)

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
            // ... (inicializa el resto de tus agentes aquí)
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
                currentAgent = 'creative'; // Simulación de flujo: Director -> Creativo
            } else {
                currentAgent = null; // Detener flujo si no es el director
            }

            currentState = agentResponse.new_state || currentState;
            maxIterations--;
        }

        return {
            final_result: result || 'Flujo de orquestación finalizado sin respuesta definitiva (simulación).',
            full_history: this.history,
            gemini_mode: this.gemini.mode
        };
    }
}

module.exports = { Orchestrator };
// ============================================================
