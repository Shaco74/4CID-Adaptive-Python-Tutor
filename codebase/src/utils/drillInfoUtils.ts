/**
 * Utilities für Drill-Info Extraktion und Filterung
 * (Separate Datei da diese synchronen Funktionen nicht in "use server" Files sein können)
 */

import { pythonDrillTasks } from "@/courses/pythonDrillTasks";

/**
 * Vereinfachte Drill-Info für den AI-Kontext
 */
export interface DrillInfo {
  id: string;
  topic: string;
  type: "mcq" | "code";
  questionType?: string; // z.B. "multiple-choice", "predict-output", etc.
  question?: string;     // MCQ Question oder Code Prompt
  difficulty?: number;   // 1-3
}

/**
 * User-Kontext für personalisierte Auswahl
 */
export interface UserContext {
  completedDrillIds: string[];
  currentStep: number;
  currentCourse: string;
  topics: string[];
  errorHistory?: string[];  // Letzte Fehler des Users
  performanceScore?: number; // 0-100
}

/**
 * Extrahiert alle verfügbaren Drills aus pythonDrillTasks
 * in einem für die AI optimierten Format
 */
export function extractAllDrillInfos(): DrillInfo[] {
  const drillInfos: DrillInfo[] = [];

  for (const task of pythonDrillTasks) {
    // MCQ Questions
    for (const mcq of task.mcQuestions) {
      drillInfos.push({
        id: mcq.id || `mcq-${task.topic}-${drillInfos.length}`,
        topic: task.topic,
        type: "mcq",
        questionType: mcq.type,
        question: mcq.question.substring(0, 100) + (mcq.question.length > 100 ? "..." : ""),
      });
    }

    // Code Tasks
    for (const codeTask of task.codeTasks) {
      drillInfos.push({
        id: codeTask.id,
        topic: task.topic,
        type: "code",
        question: codeTask.prompt.substring(0, 100) + (codeTask.prompt.length > 100 ? "..." : ""),
      });
    }
  }

  return drillInfos;
}

/**
 * Filtert Drills nach Topic(s)
 */
export function filterDrillsByTopics(drills: DrillInfo[], topics: string[]): DrillInfo[] {
  return drills.filter(drill => topics.includes(drill.topic));
}

/**
 * Filtert bereits abgeschlossene Drills heraus
 */
export function filterCompletedDrills(drills: DrillInfo[], completedIds: string[]): DrillInfo[] {
  return drills.filter(drill => !completedIds.includes(drill.id));
}
