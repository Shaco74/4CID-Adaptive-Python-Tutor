/**
 * Types für Evaluation-Daten
 */

export interface EvaluationEntry {
  id: string;
  oderId: string;
  timestamp: string;
  sessionId: string;
  data: {
    // Group Assignment
    testWithAI: boolean;
    usedAIHelp: boolean;
    // Demographics
    ageGroup: string | null;
    employmentStatus: string;
    isITField: string;
    programmingKnowledge: number | null;
    // Self-Efficacy
    selfEfficacy: Record<string, number>;
    // Cognitive Load
    mentalEffort: number;
    frustration: number;
    // SUS
    susValues: Record<string, number>;
    // UEQ-S
    ueqValues: Record<string, number>;
    // AI-specific (conditional)
    aiUsefulness?: Record<string, number>;
    aiTrust?: Record<string, number>;
    // NPS & Open Feedback
    npsScore: number | null;
    openFeedback: string;
  };
}
