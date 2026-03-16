"use server";

/**
 * AI Drill Selection from Static Pool (Gruppe B)
 *
 * Die KI wählt aus dem GLEICHEN statischen Pool wie Gruppe A,
 * aber basierend auf User-Performance statt random-weighted.
 *
 * Vorteile:
 * - Didaktisch sicher: Nur kuratierte Drills
 * - Kein Risiko für unpassende Konzepte (z.B. len() bevor es gelernt wurde)
 * - Sauberer A/B-Test: Gleiche Aufgaben, unterschiedliche Auswahl-Methode
 */

import OpenAI from "openai";
import { z } from "zod";
import { getCumulativeDrillsUpToStep, type DrillAssignment } from "@/courses/drillAssignments";
import { OPENAI_MODEL } from "@/config/openai";
import { getDrillTasks, type Locale } from "@/courses/getDrillData";
import type { DrillMCQuestion, DrillCodeTask, CodeTask } from "@/types/courseTypes";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

// ============================================
// Types
// ============================================

export interface UserPerformanceContext {
  completedDrillIds: string[];
  drillAttemptCounts?: Record<string, number>; // Wie oft wurde jeder Drill schon gezeigt
  recentAttempts?: { drillId: string; success: boolean; attempts: number }[];
  avgSuccessRate?: number; // 0-100
  commonErrors?: string[]; // Häufige Fehlertypen
}

export interface AIPoolSelectionInput {
  courseId: string;
  currentStep: number;
  topics: string[];
  userPerformance: UserPerformanceContext;
  /** OpenAI Response ID für Chat-Continuation - verbindet Drill-Auswahl mit Chat-Kontext */s
  previous_response_id?: string;
  /** Sprache für Drill-Texte ("de" oder "en") */
  locale?: Locale;
}

export interface AIPoolSelectionResult {
  success: boolean;
  mcq?: DrillMCQuestion & { _trackingId: string };
  codeTask?: CodeTask;
  reasoning?: string;
  error?: string;
  /** Neue Response-ID für Chat-Continuation - speichern für nächste Interaktion */
  newResponseId?: string;
  metadata?: {
    model: string;
    responseTime: number;
    selectedMcqId: string;
    selectedCodeId: string;
    poolSize: { mcq: number; code: number };
  };
}

// ============================================
// Zod Schema für AI Response
// ============================================

const AISelectionSchema = z.object({
  selectedMcqId: z.string().describe("ID der ausgewählten MCQ"),
  selectedCodeId: z.string().describe("ID der ausgewählten Code-Task"),
  reasoning: z.string().describe("Kurze Begründung für die Auswahl (2-3 Sätze)"),
});

// ============================================
// JSON Schema für OpenAI Structured Output
// ============================================

const SELECTION_JSON_SCHEMA = {
  type: "json_schema" as const,
  name: "drill_pair_selection",
  strict: true,
  schema: {
    type: "object",
    properties: {
      selectedMcqId: {
        type: "string",
        description: "Die ID der ausgewählten MCQ aus dem Pool"
      },
      selectedCodeId: {
        type: "string",
        description: "Die ID der ausgewählten Code-Task aus dem Pool"
      },
      reasoning: {
        type: "string",
        description: "Ausführliche Didaktische Begründung für die Auswahl. Positive Gründe für die Wahl und negative Gründe für nicht gewählte Drills."
      }
    },
    required: ["selectedMcqId", "selectedCodeId", "reasoning"],
    additionalProperties: false
  }
};

// ============================================
// Helper Functions
// ============================================

interface DrillPoolItem {
  id: string;
  type: "mcq" | "code";
  topic: string;
  questionType?: string;
  question: string;
  priority: number;
  timesShown: number; // Wie oft wurde dieser Drill schon gezeigt
}

/**
 * Konvertiert DrillAssignments zu einem Pool mit Drill-Details
 */
function buildDrillPool(
  assignments: DrillAssignment[],
  completedDrillIds: string[],
  attemptCounts: Record<string, number> = {},
  locale: Locale = "de"
): { mcqPool: DrillPoolItem[]; codePool: DrillPoolItem[] } {
  const mcqPool: DrillPoolItem[] = [];
  const codePool: DrillPoolItem[] = [];
  const drillTasks = getDrillTasks(locale);

  for (const assignment of assignments) {
    // Skip bereits erledigte Drills
    if (completedDrillIds.includes(assignment.drillId)) {
      continue;
    }

    const timesShown = attemptCounts[assignment.drillId] || 0;

    if (assignment.drillId.startsWith("mcq-")) {
      // Parse MCQ ID: "mcq-{topic}-{index}"
      const match = assignment.drillId.match(/^mcq-(.+)-(\d+)$/);
      if (!match) continue;

      const [, topic] = match;

      // Find drill by topic
      const drill = drillTasks.find(d => d.topic.toLowerCase() === topic.toLowerCase());
      if (!drill) continue;

      // Find MCQ by ID (not by index!)
      const mcq = drill.mcQuestions.find(q => q.id === assignment.drillId);
      if (!mcq) continue;

      mcqPool.push({
        id: assignment.drillId,
        type: "mcq",
        topic: drill.topic,
        questionType: mcq.type,
        question: mcq.question.substring(0, 150),
        priority: assignment.priority,
        timesShown
      });
    } else if (assignment.drillId.startsWith("code-")) {
      // Finde Code-Task
      for (const drill of drillTasks) {
        const codeTask = drill.codeTasks.find(t => t.id === assignment.drillId);
        if (codeTask) {
          codePool.push({
            id: assignment.drillId,
            type: "code",
            topic: drill.topic,
            question: codeTask.prompt.substring(0, 150),
            priority: assignment.priority,
            timesShown
          });
          break;
        }
      }
    }
  }

  return { mcqPool, codePool };
}

/**
 * Findet MCQ-Objekt anhand der ID
 */
function findMCQById(drillId: string, locale: Locale = "de"): DrillMCQuestion | null {
  const match = drillId.match(/^mcq-(.+)-(\d+)$/);
  if (!match) return null;

  const [, topic] = match;

  const drillTasks = getDrillTasks(locale);
  const drill = drillTasks.find(d => d.topic.toLowerCase() === topic.toLowerCase());
  if (!drill) return null;

  // Find by ID, not by index!
  const mcq = drill.mcQuestions.find(q => q.id === drillId);
  return mcq || null;
}

/**
 * Findet Code-Task anhand der ID
 */
function findCodeTaskById(drillId: string, locale: Locale = "de"): DrillCodeTask | null {
  const drillTasks = getDrillTasks(locale);
  for (const drill of drillTasks) {
    const codeTask = drill.codeTasks.find(t => t.id === drillId);
    if (codeTask) return codeTask;
  }
  return null;
}

// ============================================
// Main Action
// ============================================

/**
 * Wählt Drills aus dem statischen Pool basierend auf KI-Empfehlung
 *
 * Die KI erhält:
 * - Alle verfügbaren Drills für Steps 1 bis currentStep
 * - User-Performance-Daten
 * - Bereits erledigte Drills (werden aus Pool gefiltert)
 *
 * Die KI wählt die didaktisch beste Kombination aus MCQ + Code-Task
 */
export async function selectDrillsFromPoolWithAI(
  input: AIPoolSelectionInput
): Promise<AIPoolSelectionResult> {
  const startTime = Date.now();

  if (!apiKey) {
    return {
      success: false,
      error: "OPENAI_API_KEY is not set"
    };
  }

  // 1. Hole kumulativen Pool (Steps 1 bis currentStep)
  const assignments = getCumulativeDrillsUpToStep(input.courseId, input.currentStep);

  if (assignments.length === 0) {
    return {
      success: false,
      error: `Keine Drill-Assignments für ${input.courseId} Step ${input.currentStep}`
    };
  }

  // Get locale (default to German)
  const locale = input.locale || "de";

  // 2. Baue Pool mit Drill-Details (ohne bereits erledigte, mit Attempt-Counts)
  const attemptCounts = input.userPerformance.drillAttemptCounts || {};
  const { mcqPool, codePool } = buildDrillPool(
    assignments,
    input.userPerformance.completedDrillIds,
    attemptCounts,
    locale
  );

  // Falls alle durch → Reset (wie bei Gruppe A)
  let finalMcqPool = mcqPool;
  let finalCodePool = codePool;

  if (mcqPool.length === 0) {
    console.log("[aiPoolSelection] Alle MCQs erledigt → Reset");
    const { mcqPool: fullMcq } = buildDrillPool(assignments, [], attemptCounts, locale);
    finalMcqPool = fullMcq;
  }

  if (codePool.length === 0) {
    console.log("[aiPoolSelection] Alle Code-Tasks erledigt → Reset");
    const { codePool: fullCode } = buildDrillPool(assignments, [], attemptCounts, locale);
    finalCodePool = fullCode;
  }

  if (finalMcqPool.length === 0 || finalCodePool.length === 0) {
    return {
      success: false,
      error: "Kein ausreichender Drill-Pool verfügbar"
    };
  }

  // 3. Baue Prompt für KI
  const systemPrompt = `Du bist ein KI-Tutor für Python-Anfänger. Deine Aufgabe ist es, die didaktisch beste Kombination aus einer MCQ (Multiple-Choice-Frage) und einer Code-Aufgabe auszuwählen.

WICHTIGE REGELN:
1. Wähle IDs die EXAKT im Pool vorkommen - erfinde KEINE neuen IDs!
2. Berücksichtige die User-Performance:
   - Bei niedriger Erfolgsrate → wähle einfachere Aufgaben (niedrigere Priorität = einfacher)
   - Bei hoher Erfolgsrate → wähle herausforderndere Aufgaben
3. Variiere den Aufgabentyp (predict-output, spot-the-error, fill-the-blank, etc.)
4. MCQ und Code-Task sollten thematisch zusammenpassen wenn möglich
5. Berücksichtige die Priorität als "didaktische Wichtigkeit" - höhere Priorität = wichtiger für den Lernfortschritt
6. WICHTIG: Bevorzuge Drills mit timesShown=0 (noch nie gezeigt) gegenüber Drills die schon mehrfach gezeigt wurden
   - timesShown=0: Noch nie gezeigt → bevorzugen!
   - timesShown>0: Schon X mal gezeigt → nur wenn nötig für Wiederholung

PFLICHT-FORMAT für die Begründung (reasoning):
Deine Begründung MUSS ZWEI TEILE haben und didaktisch qualitativ sein:

TEIL 1 - GEWÄHLT: Erkläre warum du diese MCQ und Code-Task gewählt hast. Sei dabei didaktisch sinnvoll und ausführlich.

TEIL 2 - NICHT GEWÄHLT: Liste mindestens 2 andere Drills (aus MCQ oder Code) und erkläre warum sie NICHT gewählt wurden.
Format: "Nicht gewählt: [drill-id] - [Grund]"

WICHTIG: Ohne den "Nicht gewählt"-Teil ist die Begründung UNVOLLSTÄNDIG!`;

  const performanceInfo = input.userPerformance.avgSuccessRate !== undefined
    ? `Durchschnittliche Erfolgsrate: ${input.userPerformance.avgSuccessRate}%`
    : "Keine Performance-Daten verfügbar";

  const recentInfo = input.userPerformance.recentAttempts?.length
    ? `Letzte Versuche: ${input.userPerformance.recentAttempts
        .slice(-5)
        .map(a => `${a.drillId}: ${a.success ? "✓" : "✗"} (${a.attempts} Versuche)`)
        .join(", ")}`
    : "";

  const userPrompt = `## Kontext
Kurs: ${input.courseId}
Aktueller Step: ${input.currentStep}
Topics: ${input.topics.join(", ")}
${performanceInfo}
${recentInfo}

## Verfügbare MCQs (${finalMcqPool.length} Stück)
${JSON.stringify(finalMcqPool.map(m => ({
  id: m.id,
  topic: m.topic,
  type: m.questionType,
  priority: m.priority,
  timesShown: m.timesShown, // 0 = noch nie gezeigt, bevorzugen!
  preview: m.question.substring(0, 80) + "..."
})), null, 2)}

## Verfügbare Code-Tasks (${finalCodePool.length} Stück)
${JSON.stringify(finalCodePool.map(c => ({
  id: c.id,
  topic: c.topic,
  priority: c.priority,
  timesShown: c.timesShown, // 0 = noch nie gezeigt, bevorzugen!
  preview: c.question.substring(0, 80) + "..."
})), null, 2)}

## Aufgabe
Wähle die beste Kombination aus einer MCQ und einer Code-Task.
Bevorzuge Drills mit timesShown=0 (noch nicht gezeigt) wenn möglich!`;

  try {
    // Build base config
    const baseConfig = {
      model: OPENAI_MODEL,
      input: [
        { role: "system" as const, content: systemPrompt },
        { role: "user" as const, content: userPrompt }
      ],
      text: {
        format: SELECTION_JSON_SCHEMA
      },
      store: true, // Speichert Response für Continuation
    };

    // Add previous_response_id if available (Chat-Continuation)
    const response = input.previous_response_id
      ? await openai.responses.create({ ...baseConfig, previous_response_id: input.previous_response_id })
      : await openai.responses.create(baseConfig);

    const responseTime = Date.now() - startTime;
    const outputText = response.output_text;

    if (!outputText) {
      return {
        success: false,
        error: "Keine Antwort von OpenAI",
        newResponseId: response.id, // Auch bei Fehler für Debugging
        metadata: {
          model: OPENAI_MODEL,
          responseTime,
          selectedMcqId: "",
          selectedCodeId: "",
          poolSize: { mcq: finalMcqPool.length, code: finalCodePool.length }
        }
      };
    }

    // Parse Response
    const parsed = JSON.parse(outputText);
    const validated = AISelectionSchema.safeParse(parsed);

    if (!validated.success) {
      return {
        success: false,
        error: `Validierungsfehler: ${validated.error.message}`,
        newResponseId: response.id,
        metadata: {
          model: OPENAI_MODEL,
          responseTime,
          selectedMcqId: "",
          selectedCodeId: "",
          poolSize: { mcq: finalMcqPool.length, code: finalCodePool.length }
        }
      };
    }

    const { selectedMcqId, selectedCodeId, reasoning } = validated.data;

    // Verifiziere dass IDs im Pool existieren
    const mcqInPool = finalMcqPool.some(m => m.id === selectedMcqId);
    const codeInPool = finalCodePool.some(c => c.id === selectedCodeId);

    if (!mcqInPool || !codeInPool) {
      console.error("[aiPoolSelection] KI hat ungültige IDs gewählt:", {
        selectedMcqId,
        selectedCodeId,
        mcqInPool,
        codeInPool
      });

      // Fallback: Nimm erste verfügbare
      const fallbackMcqId = finalMcqPool[0].id;
      const fallbackCodeId = finalCodePool[0].id;

      const mcq = findMCQById(fallbackMcqId, locale);
      const codeTaskData = findCodeTaskById(fallbackCodeId, locale);

      if (!mcq || !codeTaskData) {
        return {
          success: false,
          error: "Fallback-Drills nicht gefunden"
        };
      }

      return {
        success: true,
        mcq: { ...mcq, _trackingId: fallbackMcqId },
        codeTask: {
          type: "code",
          id: codeTaskData.id,
          title: codeTaskData.title,
          description: codeTaskData.description,
          starterCode: codeTaskData.starterCode,
          solutionString: codeTaskData.solutionString,
          solutionCode: codeTaskData.solutionCode,
          hint: codeTaskData.prompt,
        },
        reasoning: `Fallback: KI wählte ungültige IDs (${selectedMcqId}, ${selectedCodeId})`,
        newResponseId: response.id,
        metadata: {
          model: OPENAI_MODEL,
          responseTime,
          selectedMcqId: fallbackMcqId,
          selectedCodeId: fallbackCodeId,
          poolSize: { mcq: finalMcqPool.length, code: finalCodePool.length }
        }
      };
    }

    // Lade die tatsächlichen Drill-Objekte
    const mcq = findMCQById(selectedMcqId, locale);
    const codeTaskData = findCodeTaskById(selectedCodeId, locale);

    if (!mcq || !codeTaskData) {
      return {
        success: false,
        error: `Drill-Objekte nicht gefunden: MCQ=${selectedMcqId}, Code=${selectedCodeId}`
      };
    }

    console.log(`[aiPoolSelection] ✅ KI-Auswahl: MCQ=${selectedMcqId}, Code=${selectedCodeId}`);
    console.log(`[aiPoolSelection] Begründung: ${reasoning}`);
    console.log(`[aiPoolSelection] Response-ID für Continuation: ${response.id}`);

    return {
      success: true,
      mcq: { ...mcq, _trackingId: selectedMcqId },
      codeTask: {
        type: "code",
        id: codeTaskData.id,
        title: codeTaskData.title,
        description: codeTaskData.description,
        starterCode: codeTaskData.starterCode,
        solutionString: codeTaskData.solutionString,
        solutionCode: codeTaskData.solutionCode,
        hint: codeTaskData.prompt,
      },
      reasoning,
      newResponseId: response.id, // Für Chat-Continuation speichern!
      metadata: {
        model: OPENAI_MODEL,
        responseTime,
        selectedMcqId,
        selectedCodeId,
        poolSize: { mcq: finalMcqPool.length, code: finalCodePool.length }
      }
    };

  } catch (error: any) {
    console.error("[aiPoolSelection] Fehler:", error);
    return {
      success: false,
      error: error.message || "Unbekannter Fehler"
    };
  }
}
