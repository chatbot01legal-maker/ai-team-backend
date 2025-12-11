const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

class GeminiService {
    constructor() {
        this.name = "GeminiService";
        this.logFile = path.join(__dirname, "gemini.log");
    }

    async sendMessage(message) {
        // Log del mensaje recibido
        const logEntry = `${new Date().toISOString()} - Mensaje recibido: ${message}\n`;
        fs.appendFileSync(this.logFile, logEntry);

        // Simulación de error aleatorio
        const random = Math.random();
        if (random < 0.2) {
            const errorMsg = `Error simulado procesando mensaje: ${message}`;
            fs.appendFileSync(this.logFile, `${new Date().toISOString()} - ${errorMsg}\n`);
            return { error: errorMsg };
        }

        // Respuesta simulada normal
        const reply = `Recibí tu mensaje: "${message}"`;
        fs.appendFileSync(this.logFile, `${new Date().toISOString()} - Reply: ${reply}\n`);
        return { reply };
    }
}

module.exports = new GeminiService();
