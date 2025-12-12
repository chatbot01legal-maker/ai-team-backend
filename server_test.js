require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(bodyParser.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post("/test", async (req, res) => {
  try {
    const prompt = req.body.prompt || "Hola Gemini desde curl";

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const text =
      result.candidates?.[0]?.content?.parts?.[0]?.text || "(sin texto)";

    res.json({
      ok: true,
      response: text
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Servidor de prueba listo en http://localhost:3001/test");
});
