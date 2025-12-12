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
