const { GeminiService } = require('../../services/geminiService.js');
const { MemoryManager } = require('../../memory/MemoryManager.js');

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

    async _runAgent(agentName, prompt) {
        const signature = `${agentName}-${this.ticketId}`;
        console.log(`  -> Ejecutando ${agentName}...`);
        
        const startTime = Date.now();
        const geminiResult = await this.geminiService.generateText(prompt, { signature: signature, forceSimulated: false });
        const endTime = Date.now();
        
        return {
            agent: agentName,
            text: geminiResult.text,
            model: geminiResult.model,
            isReal: geminiResult.isReal,
            metrics: {
                time_ms: endTime - startTime,
            }
        };
    }
    
    _getAnalyzerPrompt() {
        return `Eres un agente de clasificación y resumen. Tu trabajo es analizar la siguiente pregunta inicial del usuario...`;
    }

    _getSearchPrompt() {
        const analyzerResult = this.memory.history[0].text;
        return `Eres un agente de búsqueda de soluciones. Tienes la clasificación y el resumen del analizador...`;
    }

    _getRefinerPrompt() {
        const lastResult = this.memory.getLastText();
        return `Eres un agente de retroalimentación y refinamiento. El agente anterior (SearchAgent) generó la siguiente respuesta...`;
    }
}

module.exports = { Orchestrator };
