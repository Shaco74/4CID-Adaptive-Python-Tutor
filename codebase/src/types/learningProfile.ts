/**
 * Types für das User Learning Profile System
 *
 * Dieses System trackt den Lernfortschritt eines Users über:
 * - Performance Score: Gesamtleistung (100 Start, -5 pro Fehler, +2 pro korrekte Lösung)
 * - Error History: Alle Fehler mit Kontext für AI-Auswertung
 * - Topic Weights: Gewichtung pro Topic für adaptive Drill-Auswahl
 */

/**
 * Fehlertypen die im System erfasst werden
 */
export type ErrorType = "syntax" | "runtime" | "logic" | "validation";

/**
 * Ein einzelner Fehler-Eintrag mit vollem Kontext
 */
export interface ErrorEntry {
  /** Zeitpunkt des Fehlers */
  timestamp: Date;

  /** Kurs-ID wo der Fehler aufgetreten ist */
  courseId: string;

  /** Step im Kurs (1-indexed) */
  step: number;

  /** Art des Fehlers */
  errorType: ErrorType;

  /** Die Fehlermeldung */
  errorMessage: string;

  /** Das Topic das der User gerade lernte */
  topic: string;

  /** Optional: Der Code der den Fehler verursachte */
  code?: string;
}

/**
 * Topic-Gewichtung für adaptive Drill-Auswahl
 *
 * Werte:
 * - -1: Topic noch nicht eingeführt (nicht für Drills verfügbar)
 * - 1: Topic gerade eingeführt (Standard-Gewichtung)
 * - 1.2 - 3.0: Braucht Übung (Fehler gemacht, AI sollte dieses Topic bevorzugen)
 * - 0.1 - 0.9: Gut verstanden (weniger Drill-Bedarf)
 * - ~0: Gemeistert (keine weiteren Drills nötig)
 */
export type TopicWeight = number;

/**
 * Das vollständige Learning Profile eines Users
 * Wird in Firebase unter /users/{userId}/learningProfile gespeichert
 */
export interface UserLearningProfile {
  /**
   * Performance Score: Gesamtleistung des Users
   * - Start: 100
   * - Pro Fehler: -5
   * - Pro korrekte Lösung: +2
   * - Minimum: 0
   * - Maximum: unbegrenzt
   */
  performanceScore: number;

  /**
   * Historie aller Fehler mit Kontext
   * Unbegrenzt - User machen typischerweise nur 5-30 Fehler
   */
  errorHistory: ErrorEntry[];

  /**
   * Gewichtung pro Topic für adaptive Drill-Auswahl
   * Key: Topic-Name (z.B. "print", "Variablen", "Listen")
   * Value: Gewichtung (-1 bis 3.0)
   */
  topicWeights: Record<string, TopicWeight>;

  /**
   * Letztes Update des Profiles
   */
  lastUpdated: Date;
}

/**
 * Default-Werte für ein neues Learning Profile
 */
export const DEFAULT_LEARNING_PROFILE: UserLearningProfile = {
  performanceScore: 100,
  errorHistory: [],
  topicWeights: {}, // Topics werden bei Einführung mit 1 initialisiert
  lastUpdated: new Date(),
};

/**
 * Konstanten für das Topic-Gewichtungssystem
 */
export const TOPIC_WEIGHT_CONFIG = {
  /** Wert für nicht eingeführte Topics */
  NOT_INTRODUCED: -1,

  /** Startwert wenn ein Topic eingeführt wird */
  INITIAL: 1,

  /** Minimum Gewichtung (Topic gemeistert) */
  MIN: 0.1,

  /** Maximum Gewichtung (braucht viel Übung) */
  MAX: 3.0,

  /** Reduktion bei korrekter Lösung */
  CORRECT_DELTA: -0.2,

  /** Erhöhung bei Fehler */
  ERROR_DELTA: 0.3,
} as const;

/**
 * Konstanten für das Performance-Score-System
 */
export const PERFORMANCE_SCORE_CONFIG = {
  /** Startwert für neue User */
  INITIAL: 100,

  /** Änderung pro Fehler */
  ERROR_DELTA: -5,

  /** Änderung pro korrekte Lösung */
  CORRECT_DELTA: 2,

  /** Minimum Score */
  MIN: 0,
} as const;
