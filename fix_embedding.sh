#!/bin/bash
# Reemplazar solo la función embed
FILE="src/services/geminiService.js"

# Crear backup
cp "$FILE" "$FILE.backup"

# Actualizar la función embed
sed -i '/async embed(text, options = {})/,/^  \}/{
  /async embed(text, options = {})/{
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
    n
  }
}' "$FILE"

# Ahora reescribir la función completa
cat > temp_embed.js << 'EMBEDFIX
  async embed(text, options = {}) {
    const forceSimulated = options.forceSimulated || this.mode !== "real";

    if (forceSimulated || this.mode !== "real") {
      return this._simulateEmbedding(text);
    }

    try {
      // FORMATO CORREGIDO para @google/genai
      const response = await this.ai.models.embedContent({
        model: "models/embedding-001",
        content: {
          parts: [{ text: text }]
        }
      });

      // El embedding viene en response.embedding?.values
      const embedding = response.embedding?.values || [];
      
      if (embedding.length === 0) {
        console.log("⚠️  Embedding vacío, usando simulado");
        return this._simulateEmbedding(text);
      }
      
      return embedding;
    } catch (error) {
      console.error("❌ embed error:", error.message);
      if (error.details) {
        console.error("Detalles:", JSON.stringify(error.details, null, 2));
      }
      return this._simulateEmbedding(text);
    }
  }
EMBEDFIX

# Insertar la función corregida
awk '
  /async embed\(text, options = \{}\) \{/,/^  \}/ {
    if (/async embed\(text, options = \{}\) \{/) {
      print "  async embed(text, options = {}) {"
      system("cat temp_embed.js | tail -n +2 | head -n -1")
      next
    }
    if (/^  \}/ && in_embed) {
      in_embed = 0
      next
    }
    if (/async embed\(text, options = \{}\) \{/) {
      in_embed = 1
    }
    next
  }
  { print }
' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"

rm temp_embed.js
echo "✅ Función embed corregida"
