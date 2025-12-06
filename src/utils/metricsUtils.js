function estimateMetrics(text) {
  const len = Math.min(10, Math.floor(text.length / 40) + 1);
  const novelty = Math.max(1, Math.min(10, len));
  const ambiguity = Math.max(1, Math.min(5, Math.floor((text.split('?').length - 1) + (text.split('...').length - 1))));
  const coherence = Math.max(1, Math.min(10, 10 - Math.floor(ambiguity * 1.5)));
  const feasibility = Math.random() * 0.5 + 0.4;
  const risk = Math.random() * 0.5;
  return { novelty, ambiguity, coherence, feasibility, risk };
}

function calculatePairwiseDistance(embeddings) {
  if (embeddings.length < 2) return 0;
  
  let totalDistance = 0;
  let pairs = 0;
  
  for (let i = 0; i < embeddings.length; i++) {
    for (let j = i + 1; j < embeddings.length; j++) {
      const dotProduct = embeddings[i].reduce((sum, val, idx) => sum + val * embeddings[j][idx], 0);
      const normA = Math.sqrt(embeddings[i].reduce((sum, val) => sum + val * val, 0));
      const normB = Math.sqrt(embeddings[j].reduce((sum, val) => sum + val * val, 0));
      const similarity = dotProduct / (normA * normB);
      const distance = 1 - similarity;
      totalDistance += distance;
      pairs++;
    }
  }
  
  return pairs > 0 ? totalDistance / pairs : 0;
}

module.exports = { estimateMetrics, calculatePairwiseDistance };
