const { GeminiService } = require('../services/geminiService.js');
const { MemoryManager } = require('../memory/MemoryManager.js');

/**
 * Orchestrator: Dirige el flujo de trabajo para resolver un ticket.
 * Utiliza MemoryManager para mantener el estado y métricas.
 */
class Orchestrator {
    constructor(ticketId, initialQuestion) {
        this.ticketId = ticketId;
        this.memory = new MemoryManager(ticketId, initialQuestion);
        this.geminiService = new GeminiService({ mode: process.env.GEMINI_MODE || 'real' });
    }

    /**
     * Define y ejecuta la secuencia de agentes (el workflow).
     * @returns {object} El resultado final del proceso.
     */
    async run() {
        console.log(`\n🤖 Iniciando orquestación para ticket ${this.ticketId}.`);
        
        let currentState = {};
        const MAX_STEPS = 5;
        
        // --- Agente 1: Analizador Inicial (Clasificación y Resumen) ---
        let result = await this._runAgent('AnalyzerAgent', this._getAnalyzerPrompt());
        currentState = await this.memory.addResult(result);
        console.log(`[Paso 1: Analyzer] Novedad: ${currentState.metrics.novelty_score}`);

        // --- Agente 2: Buscador de Soluciones (Basado en el Resumen) ---
        if (this.memory.history.length < MAX_STEPS) {
            result = await this._runAgent('SearchAgent', this._getSearchPrompt());
            currentState = await this.memory.addResult(result);
            console.log(`[Paso 2: Searcher] Novedad: ${currentState.metrics.novelty_score}`);
        }
        
        // --- Agente 3: Agente de Retroalimentación/Refinamiento (Condicional) ---
        // Condición de salida: Si la novedad es baja, significa que el agente de búsqueda repitió información.
        if (currentState.metrics.novelty_score < 0.25 && this.memory.history.length < MAX_STEPS) {
            console.log("[Paso 3: Refiner] Novedad baja (<0.25). Refinando la respuesta.");
            
            result = await this._runAgent('RefinerAgent', this._getRefinerPrompt());
            currentState = await this.memory.addResult(result);
            console.log(`[Paso 3: Refiner] Novedad: ${currentState.metrics.novelty_score}`);
        }
        
        // --- Resultado Final ---
        return {
            ticketId: this.ticketId,
            initialQuestion: this.memory.initialQuestion,
            finalResult: this.memory.getLastText(),
            history: this.memory.getHistory(),
            status: 'COMPLETED',
            totalSteps: this.memory.history.length
        };
    }

    /**
     * Llama al servicio Gemini para generar texto usando un prompt específico.
     */
    async _runAgent(agentName, prompt) {
        const signature = `${agentName}-${this.ticketId}`;
        console.log(`  -> Ejecutando ${agentName}...`);
        
        const startTime = Date.now();
        const geminiResult = await this.geminiService.generateText(prompt, { signature: signature, forceSimulated: false });
        const endTime = Date.now();
        
        // Estructura de resultado estandarizada
        return {
            agent: agentName,
            text: geminiResult.text,
            model: geminiResult.model,
            isReal: geminiResult.isReal,
            metrics: {
                time_ms: endTime - startTime,
                // novelty_score será calculado en MemoryManager.addResult()
            }
        };
    }
    
    // --- Prompts específicos para los Agentes (Sin cambios) ---
    
    _getAnalyzerPrompt() {
        return `Eres un agente de clasificación y resumen. Tu trabajo es analizar la siguiente pregunta inicial del usuario y proporcionar una clasificación (ej: "Bug", "Pregunta", "Solicitud") y un resumen detallado que el siguiente agente pueda usar para buscar una solución.
        
        ---
        Pregunta inicial del usuario: "${this.memory.initialQuestion}"
        
        OUTPUT FORMATO:
        Clasificación: [TU CLASIFICACIÓN]
        Resumen: [TU RESUMEN DETALLADO]`;
    }

    _getSearchPrompt() {
        const analyzerResult = this.memory.history[0].text;
        
        return `Eres un agente de búsqueda de soluciones. Tienes la clasificación y el resumen del analizador. Tu tarea es generar una respuesta CONCRETA y ÚTIL directamente al usuario para resolver su problema. Utiliza la información proporcionada a continuación como contexto para tu respuesta.
        
        ---
        Contexto del Análisis:
        ${analyzerResult}
        
        Respuesta al usuario (focada en solución):`;
    }

    _getRefinerPrompt() {
        const lastResult = this.memory.getLastText();
        
        return `Eres un agente de retroalimentación y refinamiento. El agente anterior (SearchAgent) generó la siguiente respuesta, pero el orquestador detectó que el contenido tiene baja novedad (es decir, es repetitivo o demasiado similar al análisis inicial).
        
        Tu tarea es REESCRIBIR y AMPLIAR la respuesta anterior, haciendo la solución más clara y detallada para el usuario.
        
        ---
        Respuesta a refinar:
        ${lastResult}
        
        Respuesta refinada y ampliada:`;
    }
}

module.exports = { Orchestrator };
