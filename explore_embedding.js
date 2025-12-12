const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey });

async function explore() {
  console.log('🔍 Explorando formato de embedding...');
  
  // Intentar diferentes formatos
  const formats = [
    { name: 'Formato 1 (actual)', call: () => genAI.models.embedContent({
        model: 'models/embedding-001',
        content: { parts: [{ text: 'Hello' }] }
      })
    },
    { name: 'Formato 2 (sin models/)', call: () => genAI.models.embedContent({
        model: 'embedding-001',
        content: { parts: [{ text: 'Hello' }] }
      })
    },
    { name: 'Formato 3 (array contents)', call: () => genAI.models.embedContent({
        model: 'models/embedding-001',
        contents: [{ parts: [{ text: 'Hello' }] }]
      })
    },
    { name: 'Formato 4 (array requests)', call: () => genAI.models.embedContent({
        requests: [{
          model: 'models/embedding-001',
          content: { parts: [{ text: 'Hello' }] }
        }]
      })
    }
  ];
  
  for (const fmt of formats) {
    console.log(`\n🧪 Probando ${fmt.name}...`);
    try {
      const response = await fmt.call();
      console.log(`✅ Éxito:`, response);
      if (response.embedding) {
        console.log(`   Embedding recibido, tipo: ${typeof response.embedding}`);
      }
      break; // Si uno funciona, salir
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

explore();
