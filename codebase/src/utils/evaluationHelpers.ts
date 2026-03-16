/**
 * Hilfsfunktionen für Evaluation-Score-Berechnungen
 * Diese Funktionen sind rein clientseitig und können in Server Actions nicht verwendet werden.
 */

/**
 * Berechnet SUS-Score aus den 10 SUS-Items
 * Formel: ((Sum of odd items - 5) + (25 - Sum of even items)) * 2.5
 */
export function calculateSUSScore(susValues: Record<string, number>): number {
  const items = [
    susValues.sus_1 || 0,
    susValues.sus_2 || 0,
    susValues.sus_3 || 0,
    susValues.sus_4 || 0,
    susValues.sus_5 || 0,
    susValues.sus_6 || 0,
    susValues.sus_7 || 0,
    susValues.sus_8 || 0,
    susValues.sus_9 || 0,
    susValues.sus_10 || 0,
  ];

  // Odd items (1,3,5,7,9): subtract 1 from each
  // Even items (2,4,6,8,10): subtract from 5
  let score = 0;
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      // Odd items (0-indexed: 0,2,4,6,8)
      score += items[i] - 1;
    } else {
      // Even items (0-indexed: 1,3,5,7,9)
      score += 5 - items[i];
    }
  }

  return score * 2.5;
}

/**
 * Berechnet UEQ-S Scores (Pragmatic Quality & Hedonic Quality)
 */
export function calculateUEQScores(ueqValues: Record<string, number>): {
  pragmaticQuality: number;
  hedonicQuality: number;
  overall: number;
} {
  // UEQ-S items (1-7 scale, normalized to -3 to +3)
  // Pragmatic: 1-4, Hedonic: 5-8
  const normalize = (val: number) => (val || 4) - 4; // Convert 1-7 to -3 to +3

  const pragmatic = [
    normalize(ueqValues.ueq_1 || 4),
    normalize(ueqValues.ueq_2 || 4),
    normalize(ueqValues.ueq_3 || 4),
    normalize(ueqValues.ueq_4 || 4),
  ];

  const hedonic = [
    normalize(ueqValues.ueq_5 || 4),
    normalize(ueqValues.ueq_6 || 4),
    normalize(ueqValues.ueq_7 || 4),
    normalize(ueqValues.ueq_8 || 4),
  ];

  const pragmaticQuality = pragmatic.reduce((a, b) => a + b, 0) / 4;
  const hedonicQuality = hedonic.reduce((a, b) => a + b, 0) / 4;
  const overall = (pragmaticQuality + hedonicQuality) / 2;

  return { pragmaticQuality, hedonicQuality, overall };
}

/**
 * Kategorisiert NPS-Score
 */
export function getNPSCategory(score: number | null): "promoter" | "passive" | "detractor" | "unknown" {
  if (score === null) return "unknown";
  if (score >= 9) return "promoter";
  if (score >= 7) return "passive";
  return "detractor";
}
