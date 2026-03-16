"use server";

import OpenAI from "openai";
import { z } from "zod";
import type { DrillInfo, UserContext } from "@/utils/drillInfoUtils";
import { OPENAI_MODEL } from "@/config/openai";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey
});

// Re-export types for convenience
export type { DrillInfo, UserContext };

// ============================================
// Types & Schemas
// ============================================

/**
 * Zod Schema für die strukturierte AI-Response
 */
const DrillSelectionResponseSchema = z.object({
  selectedDrillId: z.string().describe("Die ID des ausgewählten Drills"),
  reasoning: z.string().describe("Begründung für die Auswahl"),
  confidence: z.enum(["high", "medium", "low"]).describe("Konfidenz der Auswahl"),
  alternativeIds: z.array(z.string()).describe("Alternative Drill-IDs die auch passen würden").optional(),
});

export type DrillSelectionResponse = z.infer<typeof DrillSelectionResponseSchema>;

/**
 * Input für die AI Drill Selection
 */
export interface AIDrillSelectionInput {
  availableDrills: DrillInfo[];
  userContext?: UserContext;
  customPrompt?: string;
  systemPromptOverride?: string;
}

/**
 * Output der AI Drill Selection
 */
export interface AIDrillSelectionOutput {
  success: boolean;
  response?: DrillSelectionResponse;
  error?: string;
  metadata: {
    model: string;
    tokensUsed?: number;
    responseTime: number;
    rawResponse?: any;
  };
}

// ============================================
// JSON Schema für Structured Output
// ============================================

const DRILL_SELECTION_JSON_SCHEMA = {
  type: "json_schema" as const,
  name: "drill_selection_response",
  strict: true,
  schema: {
    type: "object",
    properties: {
      selectedDrillId: {
        type: "string",
        description: "Die ID des ausgewählten Drills aus der Liste der verfügbaren Drills"
      },
      reasoning: {
        type: "string",
        description: "Ausführliche Didaktische Begründung für die Auswahl. Positive Gründe für die Wahl und negative Gründe für nicht gewählte Drills."
      },
      confidence: {
        type: "string",
        enum: ["high", "medium", "low"],
        description: "Wie sicher ist die AI bei dieser Auswahl"
      },
      alternativeIds: {
        type: "array",
        items: { type: "string" },
        description: "1-2 alternative Drill-IDs die auch passen würden"
      }
    },
    required: ["selectedDrillId", "reasoning", "confidence", "alternativeIds"],
    additionalProperties: false
  }
};

// ============================================
// Default System Prompt
// ============================================

const DEFAULT_SYSTEM_PROMPT = `Du bist ein KI-Tutor für Python-Anfänger, spezialisiert auf didaktisch optimale Übungsauswahl.

Deine Aufgabe: Wähle die beste Drill-Aufgabe aus der Liste der verfügbaren Drills basierend auf:
1. Den aktuellen Topics die der User lernt
2. Bereits abgeschlossene Drills (keine Wiederholung!)
3. Optimale Progression (leicht zu schwer)
4. Varianz in den Aufgabentypen (MCQ, Code, predict-output, spot-the-error, etc.)

Wichtige Regeln:
- Wähle NIEMALS einen Drill der bereits abgeschlossen wurde (completedDrillIds)
- Bevorzuge Drills die zum aktuellen Topic passen
- Bei mehreren passenden: Variiere den Aufgabentyp
- Bei Unsicherheit: Wähle den einfacheren Drill

PFLICHT-FORMAT für die Begründung (reasoning):
Deine Begründung MUSS IMMER zwei Teile haben:

TEIL 1 - GEWÄHLT:
Erkläre warum du diesen Drill gewählt hast.

TEIL 2 - NICHT GEWÄHLT:
Liste 2-3 andere Drills auf und erkläre warum sie NICHT geeignet sind.
Format: "Nicht gewählt: [drill-id] - [Grund]"

Beispiel-Begründung:
"Ich habe 'mcq-variablen-1' gewählt, weil es perfekt zum aktuellen Topic 'Variablen' passt und der User noch keine MCQ zu diesem Thema gemacht hat.

Nicht gewählt: 'mcq-listen-1' - Der User hat das Topic 'Listen' noch nicht gelernt.
Nicht gewählt: 'code-print-1' - Bereits abgeschlossen.
Nicht gewählt: 'mcq-datentypen-3' - Zu fortgeschritten für den aktuellen Lernstand."

Du MUSST eine der verfügbaren Drill-IDs auswählen. Erfinde keine neuen IDs!`;

// ============================================
// Main Action
// ============================================

export async function selectDrillWithAI(input: AIDrillSelectionInput): Promise<AIDrillSelectionOutput> {
  const startTime = Date.now();

  if (!apiKey) {
    return {
      success: false,
      error: "OPENAI_API_KEY is not set",
      metadata: { model: "n/a", responseTime: Date.now() - startTime }
    };
  }

  if (input.availableDrills.length === 0) {
    return {
      success: false,
      error: "No available drills provided",
      metadata: { model: "n/a", responseTime: Date.now() - startTime }
    };
  }

  // Build the context message
  const contextParts: string[] = [];

  // Available Drills
  contextParts.push("## Verfügbare Drills:");
  contextParts.push("```json");
  contextParts.push(JSON.stringify(input.availableDrills, null, 2));
  contextParts.push("```");

  // User Context (if provided)
  if (input.userContext) {
    contextParts.push("\n## User-Kontext:");
    contextParts.push(`- Aktueller Kurs: ${input.userContext.currentCourse}`);
    contextParts.push(`- Aktueller Step: ${input.userContext.currentStep}`);
    contextParts.push(`- Aktuelle Topics: ${input.userContext.topics.join(", ")}`);

    if (input.userContext.completedDrillIds.length > 0) {
      contextParts.push(`- Bereits abgeschlossene Drills: ${input.userContext.completedDrillIds.join(", ")}`);
    } else {
      contextParts.push("- Noch keine Drills abgeschlossen");
    }

    if (input.userContext.errorHistory && input.userContext.errorHistory.length > 0) {
      contextParts.push(`- Letzte Fehler: ${input.userContext.errorHistory.slice(-3).join("; ")}`);
    }

    if (input.userContext.performanceScore !== undefined) {
      contextParts.push(`- Performance-Score: ${input.userContext.performanceScore}/100`);
    }
  }

  // Custom prompt (if provided)
  if (input.customPrompt) {
    contextParts.push("\n## Zusätzliche Anweisungen:");
    contextParts.push(input.customPrompt);
  }

  contextParts.push("\n## Aufgabe:");
  contextParts.push("Wähle den besten Drill aus der Liste und begründe deine Auswahl.");

  const userMessage = contextParts.join("\n");
  const systemPrompt = input.systemPromptOverride || DEFAULT_SYSTEM_PROMPT;

  try {
    const response = await openai.responses.create({
      model: OPENAI_MODEL,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      text: {
        format: DRILL_SELECTION_JSON_SCHEMA
      }
    });

    const responseTime = Date.now() - startTime;

    // Extract structured output
    const outputText = response.output_text;

    if (!outputText) {
      return {
        success: false,
        error: "No output_text in response",
        metadata: {
          model: OPENAI_MODEL,
          responseTime,
          rawResponse: response
        }
      };
    }

    // Parse the JSON response
    let parsed: DrillSelectionResponse;
    try {
      parsed = JSON.parse(outputText);
    } catch (parseError) {
      return {
        success: false,
        error: `Failed to parse response JSON: ${parseError}`,
        metadata: {
          model: OPENAI_MODEL,
          responseTime,
          rawResponse: outputText
        }
      };
    }

    // Validate with Zod
    const validated = DrillSelectionResponseSchema.safeParse(parsed);
    if (!validated.success) {
      return {
        success: false,
        error: `Validation failed: ${validated.error.message}`,
        metadata: {
          model: OPENAI_MODEL,
          responseTime,
          rawResponse: parsed
        }
      };
    }

    // Verify the selected ID exists in available drills
    const selectedIdExists = input.availableDrills.some(d => d.id === validated.data.selectedDrillId);
    if (!selectedIdExists) {
      return {
        success: false,
        error: `Selected ID "${validated.data.selectedDrillId}" not found in available drills`,
        metadata: {
          model: OPENAI_MODEL,
          responseTime,
          rawResponse: parsed
        }
      };
    }

    return {
      success: true,
      response: validated.data,
      metadata: {
        model: OPENAI_MODEL,
        tokensUsed: (response as any).usage?.total_tokens,
        responseTime,
        rawResponse: response
      }
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Unknown error",
      metadata: {
        model: OPENAI_MODEL,
        responseTime: Date.now() - startTime,
        rawResponse: error
      }
    };
  }
}
