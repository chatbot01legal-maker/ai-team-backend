import { generateText } from "./src/services/geminiService.js";

(async () => {
  try {
    const r = await generateText("Hola, ¿cómo estás?");
    console.log("Respuesta de Gemini:", r);
  } catch (err) {
    console.error("Error al probar Gemini:", err);
  }
})();
