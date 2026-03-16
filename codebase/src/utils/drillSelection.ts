/**
 * Drill Selection Logic für statische Drills (Gruppe A)
 *
 * Wählt passende MCQ und Code-Tasks basierend auf:
 * 1. Manuelle drillAssignments (Priorität-gewichtet)
 * 2. Fallback: Topics der Learning Tasks
 * 3. Bereits absolvierte Drills (Anti-Wiederholung)
 */

import { getDrillTasks, type Locale } from "@/courses/getDrillData";
import { drillAssignments, getDrillsForStep, getCumulativeDrillsUpToStep, logCumulativeDrills, type DrillAssignment } from "@/courses/drillAssignments";
import type { MCQTask, CodeTask, DrillMCQuestion, DrillCodeTask, DrillTask } from "@/types/courseTypes";

export interface DrillSelectionResult {
  mcq: DrillMCQuestion & { _trackingId?: string };  // Vollständiger MCQ-Type mit allen Feldern
  codeTask: CodeTask;
}

/**
 * Findet eine MCQ anhand der ID
 */
function findMCQById(drillId: string, locale: Locale): { mcq: DrillMCQuestion; topic: string; index: number } | null {
  // ID Format: "mcq-{topic}-{index}" z.B. "mcq-print-1"
  const match = drillId.match(/^mcq-(.+)-(\d+)$/);
  if (!match) return null;

  const [, topic] = match;

  const drillTasks = getDrillTasks(locale);
  const drill = drillTasks.find(d => d.topic.toLowerCase() === topic.toLowerCase());
  if (!drill) return null;

  // Find by ID, not by index! IDs are not sequential (e.g., mcq-strings-1, mcq-strings-3, mcq-strings-10)
  const mcqIndex = drill.mcQuestions.findIndex(q => q.id === drillId);
  if (mcqIndex === -1) return null;

  return {
    mcq: drill.mcQuestions[mcqIndex],
    topic: drill.topic,
    index: mcqIndex,
  };
}

/**
 * Findet eine Code-Task anhand der ID
 */
function findCodeTaskById(drillId: string, locale: Locale): { codeTask: DrillCodeTask; topic: string } | null {
  // ID Format: "code-{topic}-{index}" z.B. "code-print-1"
  const drillTasks = getDrillTasks(locale);
  for (const drill of drillTasks) {
    const codeTask = drill.codeTasks.find(t => t.id === drillId);
    if (codeTask) {
      return { codeTask, topic: drill.topic };
    }
  }
  return null;
}

/**
 * Gewichtete Zufallsauswahl basierend auf Priorität
 * Höhere Priorität = höhere Wahrscheinlichkeit
 */
function weightedRandomSelect<T extends { priority: number }>(items: T[]): T | null {
  if (items.length === 0) return null;

  // Berechne Gesamtgewicht
  const totalWeight = items.reduce((sum, item) => sum + item.priority, 0);

  // Zufälliger Punkt im Gewichtsbereich
  let random = Math.random() * totalWeight;

  // Finde das Item an diesem Punkt
  for (const item of items) {
    random -= item.priority;
    if (random <= 0) {
      return item;
    }
  }

  // Fallback: erstes Item
  return items[0];
}

/**
 * Wählt Drills basierend auf manuellen Assignments (mit Priorität)
 * KUMULATIV: Sammelt Drills von allen vorherigen Steps, neuere haben höhere Prio
 *
 * @param courseId - Kurs-ID z.B. "bmi-calculator"
 * @param currentStep - Aktueller Step-Nummer
 * @param completedDrillIds - Array von bereits absolvierten Drill-IDs
 * @param locale - Sprache für Drill-Texte ("de" oder "en")
 * @returns Object mit mcq und codeTask, oder null wenn keine Drills gefunden
 */
export function selectDrillsFromAssignments({
  courseId,
  currentStep,
  completedDrillIds = [],
  locale = "de",
}: {
  courseId: string;
  currentStep: number;
  completedDrillIds: string[];
  locale?: Locale;
}): DrillSelectionResult | null {
  // Hole ALLE Drills kumulativ bis zum aktuellen Step
  const assignments = getCumulativeDrillsUpToStep(courseId, currentStep);

  if (assignments.length === 0) {
    console.warn(`[drillSelection] ⚠️ KEINE MAPPINGS gefunden für ${courseId} step ${currentStep}!`);
    console.warn(`[drillSelection] Verfügbare Kurse:`, Object.keys(drillAssignments).map(k => k.split('-step-')[0]).filter((v, i, a) => a.indexOf(v) === i));
    return null; // Keine manuellen Zuordnungen für diesen Kurs
  }

  // Trenne MCQ und Code Assignments
  const mcqAssignments = assignments.filter(a => a.drillId.startsWith("mcq-"));
  const codeAssignments = assignments.filter(a => a.drillId.startsWith("code-"));

  // Filtere bereits absolvierte Drills raus
  const availableMCQs = mcqAssignments.filter(a => !completedDrillIds.includes(a.drillId));
  const availableCode = codeAssignments.filter(a => !completedDrillIds.includes(a.drillId));

  // Falls alle durch → Reset zu allen (zyklisch)
  const mcqPool = availableMCQs.length > 0 ? availableMCQs : mcqAssignments;
  const codePool = availableCode.length > 0 ? availableCode : codeAssignments;

  // ========== DETAILED LOGGING ==========
  console.log(`\n========== DRILL SELECTION für ${courseId} Step ${currentStep} ==========`);

  // Zeige kumulative Drill-Liste
  logCumulativeDrills(courseId, currentStep);

  console.log(`\n📋 Alle verfügbaren Drills (kumulativ, ${assignments.length} total):`);
  assignments
    .sort((a, b) => b.priority - a.priority)
    .forEach(a => {
      const isCompleted = completedDrillIds.includes(a.drillId);
      const status = isCompleted ? '✅ erledigt' : '⏳ offen';
      console.log(`   ${a.drillId} (Prio: ${a.priority}) - ${status}`);
    });

  console.log(`\n📊 Statistik:`);
  console.log(`   MCQ: ${availableMCQs.length}/${mcqAssignments.length} verfügbar`);
  console.log(`   Code: ${availableCode.length}/${codeAssignments.length} verfügbar`);

  if (availableMCQs.length === 0 && mcqAssignments.length > 0) {
    console.log(`   ⚠️ Alle MCQs erledigt → Reset zu allen`);
  }
  if (availableCode.length === 0 && codeAssignments.length > 0) {
    console.log(`   ⚠️ Alle Code-Tasks erledigt → Reset zu allen`);
  }

  console.log(`\n🎯 Pool für Auswahl (gewichtet nach Priorität):`);
  console.log(`   MCQ Pool:`, mcqPool.sort((a, b) => b.priority - a.priority).map(a => `${a.drillId}(${a.priority})`).join(', '));
  console.log(`   Code Pool:`, codePool.sort((a, b) => b.priority - a.priority).map(a => `${a.drillId}(${a.priority})`).join(', '));

  console.log(`\n👤 User's completedDrillIds (${completedDrillIds.length} total):`);
  if (completedDrillIds.length > 0) {
    completedDrillIds.forEach(id => console.log(`   - ${id}`));
  } else {
    console.log(`   (keine)`);
  }
  // ========================================

  if (mcqPool.length === 0 || codePool.length === 0) {
    console.warn(`[drillSelection] Not enough assignments for ${courseId} step ${currentStep}`);
    return null;
  }

  // Gewichtete Auswahl (höhere Priorität = häufiger)
  const selectedMCQAssignment = weightedRandomSelect(mcqPool);
  const selectedCodeAssignment = weightedRandomSelect(codePool);

  if (!selectedMCQAssignment || !selectedCodeAssignment) {
    return null;
  }

  // Finde die tatsächlichen Drill-Objekte
  const mcqResult = findMCQById(selectedMCQAssignment.drillId, locale);
  const codeResult = findCodeTaskById(selectedCodeAssignment.drillId, locale);

  if (!mcqResult || !codeResult) {
    console.error(`[drillSelection] Could not find drill objects for IDs:`, {
      mcq: selectedMCQAssignment.drillId,
      code: selectedCodeAssignment.drillId,
    });
    return null;
  }

  // ========== SELECTION RESULT LOGGING ==========
  console.log(`\n🎲 AUSGEWÄHLT (gewichtet):`);
  console.log(`   MCQ: ${selectedMCQAssignment.drillId} (Prio: ${selectedMCQAssignment.priority})`);
  console.log(`   Code: ${selectedCodeAssignment.drillId} (Prio: ${selectedCodeAssignment.priority})`);
  console.log(`   MCQ Frage: "${mcqResult.mcq.question.substring(0, 60)}..."`);
  console.log(`   Code Task: "${codeResult.codeTask.prompt.substring(0, 60)}..."`);
  console.log(`=================================================\n`);
  // ==============================================

  // Behalte vollständiges DrillMCQuestion Objekt (mit type, code, etc.)
  const mcqTask: DrillMCQuestion & { _trackingId?: string } = {
    ...mcqResult.mcq,
    _trackingId: selectedMCQAssignment.drillId,
  };

  const codeTask: CodeTask = {
    type: "code",
    id: codeResult.codeTask.id,
    title: codeResult.codeTask.title,
    description: codeResult.codeTask.description,
    starterCode: codeResult.codeTask.starterCode,
    solutionString: codeResult.codeTask.solutionString,
    solutionCode: codeResult.codeTask.solutionCode,
    hint: codeResult.codeTask.prompt,
  };

  return { mcq: mcqTask, codeTask };
}

/**
 * Wählt statische Drills - nutzt manuelle Assignments wenn vorhanden,
 * sonst Fallback auf Topic-basierte Auswahl
 *
 * @param courseId - Optional: Kurs-ID für manuelle Assignments
 * @param step - Optional: Step-Nummer
 * @param topics - Array von Topics aus den letzten Learning Tasks (Fallback)
 * @param completedDrillIds - Array von bereits absolvierten Drill-IDs
 * @param preferredMcqId - Optional: Bevorzugte MCQ-ID (z.B. von AI ausgewählt)
 * @param preferredCodeId - Optional: Bevorzugte Code-Task-ID (z.B. von AI ausgewählt)
 * @param locale - Sprache für Drill-Texte ("de" oder "en")
 * @returns Object mit mcq und codeTask, oder null wenn keine Drills gefunden
 */
export function selectStaticDrills({
  courseId,
  step,
  topics,
  completedDrillIds = [],
  preferredMcqId,
  preferredCodeId,
  locale = "de",
}: {
  courseId?: string;
  step?: number;
  topics: string[];
  completedDrillIds: string[];
  preferredMcqId?: string;
  preferredCodeId?: string;
  locale?: Locale;
}): DrillSelectionResult | null {
  // Get locale-specific drill tasks
  const drillTasks = getDrillTasks(locale);

  // 0. Wenn BEIDE bevorzugten IDs angegeben sind, versuche diese direkt zu laden
  if (preferredMcqId && preferredCodeId) {
    console.log(`[drillSelection] 🎯 Preferred drill pair requested: MCQ=${preferredMcqId}, Code=${preferredCodeId}`);

    const mcqResult = findMCQById(preferredMcqId, locale);
    const codeResult = findCodeTaskById(preferredCodeId, locale);

    if (mcqResult && codeResult) {
      const mcqTask: DrillMCQuestion & { _trackingId?: string } = {
        ...mcqResult.mcq,
        _trackingId: preferredMcqId,
      };

      const codeTask: CodeTask = {
        type: "code",
        id: codeResult.codeTask.id,
        title: codeResult.codeTask.title,
        description: codeResult.codeTask.description,
        starterCode: codeResult.codeTask.starterCode,
        solutionString: codeResult.codeTask.solutionString,
        solutionCode: codeResult.codeTask.solutionCode,
        hint: codeResult.codeTask.prompt,
      };

      console.log(`[drillSelection] ✅ Using AI-selected drill pair: MCQ(${mcqResult.topic}) + Code(${codeResult.topic})`);
      return { mcq: mcqTask, codeTask };
    }

    console.log(`[drillSelection] ⚠️ Could not find preferred drill pair, falling back`);
  }

  // 0b. Wenn nur eine ID angegeben ist, versuche diese mit passendem Partner zu laden
  if (preferredMcqId && !preferredCodeId) {
    console.log(`[drillSelection] 🎯 Preferred MCQ ID requested: ${preferredMcqId}`);

    const mcqResult = findMCQById(preferredMcqId, locale);
    if (mcqResult) {
      // Finde eine passende Code-Task für das gleiche Topic
      const topicDrill = drillTasks.find(d => d.topic === mcqResult.topic);
      if (topicDrill && topicDrill.codeTasks.length > 0) {
        const availableCodeTasks = topicDrill.codeTasks.filter(
          t => !completedDrillIds.includes(t.id)
        );
        const codeTaskToUse = availableCodeTasks.length > 0
          ? availableCodeTasks[0]
          : topicDrill.codeTasks[0];

        const mcqTask: DrillMCQuestion & { _trackingId?: string } = {
          ...mcqResult.mcq,
          _trackingId: preferredMcqId,
        };

        const codeTask: CodeTask = {
          type: "code",
          id: codeTaskToUse.id,
          title: codeTaskToUse.title,
          description: codeTaskToUse.description,
          starterCode: codeTaskToUse.starterCode,
          solutionString: codeTaskToUse.solutionString,
          solutionCode: codeTaskToUse.solutionCode,
          hint: codeTaskToUse.prompt,
        };

        console.log(`[drillSelection] ✅ Using preferred MCQ with auto-paired code task`);
        return { mcq: mcqTask, codeTask };
      }
    }
  }

  if (preferredCodeId && !preferredMcqId) {
    console.log(`[drillSelection] 🎯 Preferred Code ID requested: ${preferredCodeId}`);

    const codeResult = findCodeTaskById(preferredCodeId, locale);
    if (codeResult) {
      // Finde eine passende MCQ für das gleiche Topic
      const topicDrill = drillTasks.find(d => d.topic === codeResult.topic);
      if (topicDrill && topicDrill.mcQuestions.length > 0) {
        const availableMCQs = topicDrill.mcQuestions
          .map((mcq, index) => ({ mcq, index }))
          .filter(({ mcq, index }) => !completedDrillIds.includes(mcq.id || `mcq-${topicDrill.topic}-${index + 1}`));

        const mcqToUse = availableMCQs.length > 0
          ? availableMCQs[0]
          : { mcq: topicDrill.mcQuestions[0], index: 0 };

        const mcqId = mcqToUse.mcq.id || `mcq-${topicDrill.topic}-${mcqToUse.index + 1}`;

        const mcqTask: DrillMCQuestion & { _trackingId?: string } = {
          ...mcqToUse.mcq,
          _trackingId: mcqId,
        };

        const codeTask: CodeTask = {
          type: "code",
          id: codeResult.codeTask.id,
          title: codeResult.codeTask.title,
          description: codeResult.codeTask.description,
          starterCode: codeResult.codeTask.starterCode,
          solutionString: codeResult.codeTask.solutionString,
          solutionCode: codeResult.codeTask.solutionCode,
          hint: codeResult.codeTask.prompt,
        };

        console.log(`[drillSelection] ✅ Using preferred code task with auto-paired MCQ`);
        return { mcq: mcqTask, codeTask };
      }
    }
  }

  if (preferredMcqId || preferredCodeId) {
    console.log(`[drillSelection] ⚠️ Could not use preferred drill(s), falling back to normal selection`);
  }

  // 1. Versuche manuelle Assignments wenn courseId und step vorhanden
  if (courseId && step) {
    const assignmentResult = selectDrillsFromAssignments({ courseId, currentStep: step, completedDrillIds, locale });
    if (assignmentResult) {
      console.log(`[drillSelection] Using manual assignments for ${courseId} step ${step}`);
      return assignmentResult;
    }
    console.log(`[drillSelection] No manual assignments for ${courseId} step ${step}, falling back to topics`);
  }

  // 2. Fallback: Topic-basierte Auswahl (alter Algorithmus)
  const matchingDrills = drillTasks.filter(drill =>
    topics.includes(drill.topic)
  );

  if (matchingDrills.length === 0) {
    console.error(`[drillSelection] No drills found for topics:`, topics);
    console.error(`[drillSelection] Available topics:`, drillTasks.map(d => d.topic));
    return null;
  }

  // Wähle ZUFÄLLIG einen passenden Drill aus allen matching Topics
  const randomIndex = Math.floor(Math.random() * matchingDrills.length);
  const selectedDrill = matchingDrills[randomIndex];

  // Filtere verfügbare MCQs (noch nicht absolviert)
  const availableMCQs = selectedDrill.mcQuestions
    .map((mcq, index) => ({ mcq, index }))
    .filter(({ mcq, index }) => !completedDrillIds.includes(mcq.id || `mcq-${selectedDrill.topic}-${index}`));

  // Filtere verfügbare Code Tasks (noch nicht absolviert)
  const availableCodeTasks = selectedDrill.codeTasks
    .filter(task => !completedDrillIds.includes(task.id));

  // Wenn alle MCQs durch → Reset zu allen MCQs
  const mcqPool = availableMCQs.length > 0 ? availableMCQs : selectedDrill.mcQuestions.map((mcq, index) => ({ mcq, index }));

  // Wenn alle Code Tasks durch → Reset zu allen Code Tasks
  const codePool = availableCodeTasks.length > 0 ? availableCodeTasks : selectedDrill.codeTasks;

  // Zufällige Auswahl
  const randomMCQObj = mcqPool[Math.floor(Math.random() * mcqPool.length)];
  const randomMCQ = randomMCQObj.mcq;
  const mcqIndex = randomMCQObj.index;

  const randomCodeTask = codePool[Math.floor(Math.random() * codePool.length)];

  // Behalte vollständiges DrillMCQuestion Objekt (mit type, code, etc.)
  const mcqId = randomMCQ.id || `mcq-${selectedDrill.topic}-${mcqIndex}`;

  const mcqTask: DrillMCQuestion & { _trackingId?: string } = {
    ...randomMCQ,
    _trackingId: mcqId,
  };

  const codeTask: CodeTask = {
    type: "code",
    id: randomCodeTask.id,
    title: randomCodeTask.title,
    description: randomCodeTask.description,
    starterCode: randomCodeTask.starterCode,
    solutionString: randomCodeTask.solutionString,
    solutionCode: randomCodeTask.solutionCode,
    hint: randomCodeTask.prompt,
  };

  return {
    mcq: mcqTask,
    codeTask: codeTask,
  };
}

/**
 * Generiert unique Drill-IDs für Tracking
 *
 * @param drillSession - Die Drill-Session mit mcq und codeTask
 * @returns Array von Drill-IDs für completedDrillIds Tracking
 */
export function generateDrillIds(drillSession: DrillSelectionResult & { topics: string[] }): string[] {
  // Verwende die _trackingId wenn vorhanden, sonst fallback zu Topic-basierter ID
  const mcqId = (drillSession.mcq as any)._trackingId || `mcq-${drillSession.topics[0] || "unknown"}`;

  return [
    mcqId,                       // MCQ ID mit Index für Eindeutigkeit
    drillSession.codeTask.id,    // Code Task ID (bereits eindeutig)
  ];
}
