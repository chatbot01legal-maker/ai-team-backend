require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

async function test() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Dime un saludo de prueba."
    });

    const text = res.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Respuesta:", text);

  } catch (err) {
    console.error("Error al conectar con Gemini:", err);
  }
}

test();
