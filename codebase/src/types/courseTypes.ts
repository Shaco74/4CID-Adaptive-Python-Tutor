// Verfügbare Drill-Topics (aus pythonDrillTasks.ts)
export type DrillTopic =
  | "print"           // print() Grundlagen
  | "Variablen"       // Variablen erstellen, zuweisen, nutzen
  | "Datentypen"      // int, float, str, bool
  | "Strings"         // String-Operationen, Konkatenation, f-Strings
  | "Listen"          // Listen erstellen, .append(), Zugriff
  | "Schleifen"       // for, while, range()
  | "Bedingungen";    // if, elif, else

// Mögliche Block-Typen innerhalb einer Kursaufgabe
export type ContentBlockType = 'text' | 'code' | 'hint' | 'task';

// Einzelner Inhaltsbaustein für Aufgaben
export interface ContentBlock {
  type: ContentBlockType;
  content: string;
  title?: string;               // Optionaler Titel (für Code-Blöcke oder Textabschnitte)
  language?: string;            // Programmiersprache, nur relevant für Code-Blöcke
  severity?: 'info' | 'warning' | 'success' | 'error'; // Nur relevant für Hinweis-Blöcke
}

// Repräsentiert eine einzelne Übungsaufgabe in einem Kurs
export interface CourseTask {
  id: string;
  step: number;                 // Position in der Lernsequenz
  title: string;
  description: string;
  blocks: ContentBlock[];      // Inhalt: Text, Code, Hinweise etc.
  showHints: boolean;          // Ob Hilfestellungen angezeigt werden sollen
  path: string;                // URL-/Routing-Pfad
  courseId: string;            // Referenz zum Kurs
  solutionString: string | string[]; // Validierung des Outputs (z. B. bei Tests)
  solutionCode?: string[];     // Code-Snippets die im User-Code vorkommen müssen (Anti-Cheat)
  starterCode: string;         // Ausgangscode für das Editorfeld
  topics: DrillTopic[];        // Topics für Drill-Matching (z.B. ["Variablen", "Strings"])
  hasDrill?: boolean;          // Ob nach diesem Step ein Drill ausgelöst wird (default: false)
}

// Vereinfachte Aufgabe für Drill-Übungen
export interface DrillCodeTask {
  id: string;
  step: number;                 // Position in der Lernsequenz
  title: string;
  description: string;
  blocks: ContentBlock[];
  showHints: false;            // Keine Hilfestellungen in Drills
  path: string;                // URL-Pfad für die spezifische Übung
  courseId: string;            // Referenz zum Kurs
  prompt: string;              // Aufgabenstellung für den Nutzer
  starterCode: string;         // Ausgangscode für das Editorfeld
  solutionString: string;      // Expected output (flexible with .includes())
  solutionCode?: string[];     // Optional: Code snippets that must be present in user's code
  hint?: string;               // Optional: Hinweis für den Nutzer (z.B. bei Leerzeichen-Problemen)
}

// Kursstruktur mit mehreren Aufgaben
export interface CourseData {
  id: string;
  title: string;
  description: string;
  tasks: CourseTask[];
}

// Multiple-Choice-Frage für Drill-Aufgaben
export interface MultipleChoiceQuestion {
  id?: string;                // Eindeutige ID (z.B. "mcq-print-1") - optional für Kompatibilität
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: string;      // Richtige Antwort
  explanation?: string;       // Optionale Erklärung
}

// Spot-the-Error-Frage: Fehler im Code finden
export interface SpotErrorQuestion {
  id?: string;                // Eindeutige ID (z.B. "mcq-print-spot-1") - optional für Kompatibilität
  type: 'spot-the-error';
  question: string;
  code: string;               // Code-Snippet mit Fehler
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

// Predict-Output-Frage: Code-Ausgabe vorhersagen
export interface PredictOutputQuestion {
  id?: string;                // Eindeutige ID (z.B. "mcq-print-predict-1") - optional für Kompatibilität
  type: 'predict-output';
  question: string;
  code: string;               // Code-Snippet
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

// Fill-Blank-Frage: Lückentext ausfüllen
export interface FillBlankQuestion {
  id?: string;                // Eindeutige ID (z.B. "mcq-strings-fill-1") - optional für Kompatibilität
  type: 'fill-the-blank';
  question: string;
  code: string;               // Code mit ___ für Lücken
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

// Union-Type für alle MC-Frage-Typen
export type DrillMCQuestion =
  | MultipleChoiceQuestion
  | SpotErrorQuestion
  | PredictOutputQuestion
  | FillBlankQuestion;

// Drill-Aufgabe, bestehend aus MC-Fragen und Codeübungen
export interface DrillTask {
  topic: string;
  mcQuestions: DrillMCQuestion[];  // Unterstützt alle MCQ-Typen (multiple-choice, predict-output, spot-the-error, fill-the-blank)
  codeTasks: DrillCodeTask[];      // Verwendet nun den spezifischeren Typ
}

// ===== NEU: Drill Session Types für A/B-Testing =====

// Difficulty Recommendation von KI
export interface DifficultyRecommendation {
  recommended: "easy" | "medium" | "hard";
  reasoning: string;
  alternativeLevel: 1 | 2 | 3;
}

// MCQ Task für Drill-Sessions
export interface MCQTask {
  type: "mcq";
  question: string;
  options: string[];            // Genau 4
  correctAnswer: string;        // Exakte Antwort aus options[]
  explanation?: string;         // Warum diese Antwort richtig ist
}

// Code Task für Drill-Sessions
export interface CodeTask {
  type: "code";
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solutionString: string;       // Expected output (console)
  solutionCode?: string[];      // Optional: Code snippets that must exist in user's code
  hint?: string;                // Optional: 1 Tipp
}

// Ergebnisse einer Drill-Task
export interface TaskResult {
  correct: boolean;
  attempts: number;
}

// Ergebnisse einer kompletten Drill-Session
export interface DrillResults {
  mcqCorrect: boolean;
  mcqAttempts: number;
  codeCorrect: boolean;
  codeAttempts: number;
}

// Drill-Session Datenstruktur
export interface DrillSession {
  id: string;
  triggerStep: number;
  topics: string[];              // Topics der letzten 2 Tasks
  userGroup: "A" | "B";
  timestamp: Date;
  tasks: {
    mcq: DrillMCQuestion;        // Alle MCQ-Typen (multiple-choice, fill-the-blank, spot-the-error, predict-output)
    codeTask: CodeTask;
  };
  difficultyRecommendation?: DifficultyRecommendation;  // Nur Gruppe B
}
