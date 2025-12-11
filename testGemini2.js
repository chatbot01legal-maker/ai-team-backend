import { generateText } from "./src/services/geminiService.js";

(async () => {
  try {
    console.log("Llamando a Gemini 2.5...");
    const r = await generateText("Dime una frase épica en 5 palabras.");
    console.log("Respuesta:", r);
  } catch (err) {
    console.error("Error:", err);
  }
})();
