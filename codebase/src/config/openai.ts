/**
 * Zentrale OpenAI Konfiguration
 *
 * Alle OpenAI-bezogenen Konstanten hier definiert für einfache Wartung.
 */

/**
 * Das zu verwendende OpenAI Model für alle API-Calls.
 * Ändern Sie diesen Wert um das Modell global zu wechseln.
 *
 * Verfügbare Modelle (Stand Januar 2025):
 * - "gpt-4o-2024-08-06" - Aktuell verwendet, unterstützt Structured Outputs
 * - "gpt-4o" - Neueste Version (auto-update)
 * - "gpt-4o-mini" - Schneller/günstiger, weniger capable
 */
//export const OPENAI_MODEL_OLD = "gpt-4o-2024-08-06" as const;
export const OPENAI_MODEL = "gpt-4o-mini" as const;

/**
 * Type für das Model (für TypeScript Type-Safety)
 */
export type OpenAIModel = typeof OPENAI_MODEL;
