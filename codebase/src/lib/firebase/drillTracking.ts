/**
 * Firebase Tracking für Drill-Sessions
 *
 * Speichert:
 * - completedDrillIds für Anti-Wiederholung
 * - drillSessions für Research-Auswertung
 * - Drill-Events für Event-Log
 */

import { doc, getDoc, updateDoc, serverTimestamp, arrayUnion, Timestamp, increment } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { logEvent } from "@/db/eventTracking";
import type { DrillSession, DrillResults } from "@/types/courseTypes";

/**
 * Holt die Liste der bereits absolvierten Drill-IDs
 *
 * @param userId - User ID (z.B. "alice-smith")
 * @returns Array von Drill-IDs
 */
export async function getCompletedDrillIds(userId: string): Promise<string[]> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // // console.warn(`[drillTracking] User not found: ${userId}`);
      return [];
    }

    const data = userDoc.data();
    return data?.completedDrillIds || [];
  } catch (error) {
    console.error(`[drillTracking] Error fetching completed drill IDs:`, error);
    return [];
  }
}

/**
 * Markiert Drills als abgeschlossen
 *
 * @param userId - User ID
 * @param drillIds - Array von Drill-IDs (z.B. ["mcq-Variablen", "drill-variable-1"])
 */
export async function markDrillCompleted(
  userId: string,
  drillIds: string[]
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      completedDrillIds: arrayUnion(...drillIds),
      updatedAt: serverTimestamp(),
    });

    // // console.log(`[drillTracking] Marked drills as completed:`, drillIds);
  } catch (error) {
    console.error(`[drillTracking] Error marking drills as completed:`, error);
    throw error;
  }
}

/**
 * Speichert eine vollständige Drill-Session mit Ergebnissen
 *
 * @param userId - User ID
 * @param session - Drill-Session mit Topics, Tasks, etc.
 * @param results - Ergebnisse der MCQ und Code-Tasks
 */
export async function saveDrillSession(
  userId: string,
  session: DrillSession,
  results: DrillResults
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);

    // Firebase-kompatibles Session-Objekt erstellen
    const sessionData = {
      step: session.triggerStep,
      timestamp: Timestamp.now(),
      topics: session.topics,
      userGroup: session.userGroup,
      difficultyRecommendation: session.difficultyRecommendation || null,
      results: {
        mcqCorrect: results.mcqCorrect,
        mcqAttempts: results.mcqAttempts,
        codeCorrect: results.codeCorrect,
        codeAttempts: results.codeAttempts,
      },
      // Speichere Task-IDs für Referenz
      taskIds: {
        mcqTopic: session.tasks.mcq.question.substring(0, 50), // Erste 50 Zeichen als Identifier
        codeTaskId: session.tasks.codeTask.id,
      }
    };

    await updateDoc(userRef, {
      [`drillSessions.${session.id}`]: sessionData,
      updatedAt: serverTimestamp(),
    });

    // // console.log(`[drillTracking] Saved drill session: ${session.id}`);
  } catch (error) {
    console.error(`[drillTracking] Error saving drill session:`, error);
    throw error;
  }
}

/**
 * Loggt ein Drill-Event für Analytics
 *
 * @param userId - User ID
 * @param eventType - Art des Events
 * @param data - Event-Daten
 */
export async function logDrillEvent(
  userId: string,
  sessionId: string | null,
  eventType: "drill_shown" | "drill_mcq_completed" | "drill_code_completed" | "drill_session_completed",
  data: {
    step?: number;
    topics?: string[];
    userGroup?: "A" | "B";
    difficultyRecommended?: string;
    mcqAttempts?: number;
    codeAttempts?: number;
    success?: boolean;
    [key: string]: any;
  }
): Promise<void> {
  try {
    // Remove undefined values from data (Firebase doesn't allow undefined)
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    await logEvent({
      userId,
      sessionId: sessionId || `drill-event-${Date.now()}`,
      type: eventType,
      timestamp: Timestamp.now(),
      data: cleanData,
    });

    // // console.log(`[drillTracking] Logged event: ${eventType}`);
  } catch (error) {
    console.error(`[drillTracking] Error logging drill event:`, error);
    // Don't throw - logging failures shouldn't break the UX
  }
}

/**
 * Initialisiert completedDrillIds und drillSessions für neuen User
 * (wird beim Login aufgerufen, falls User noch keine Drill-Daten hat)
 *
 * @param userId - User ID
 */
export async function initializeDrillTracking(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // // console.warn(`[drillTracking] Cannot initialize - user not found: ${userId}`);
      return;
    }

    const data = userDoc.data();

    // Nur initialisieren wenn noch nicht vorhanden
    if (!data.completedDrillIds || !data.drillSessions) {
      await updateDoc(userRef, {
        completedDrillIds: data.completedDrillIds || [],
        drillSessions: data.drillSessions || {},
        drilledSteps: data.drilledSteps || [], // NEU: Welche Steps wurden gedrilled
        updatedAt: serverTimestamp(),
      });

      // // console.log(`[drillTracking] Initialized drill tracking for user: ${userId}`);
    }
  } catch (error) {
    console.error(`[drillTracking] Error initializing drill tracking:`, error);
    // Don't throw - initialization failures shouldn't break login
  }
}

/**
 * Holt die Liste der bereits gedrilleden Steps
 *
 * @param userId - User ID
 * @returns Array von Step-IDs (z.B. ["bmi-calculator-step-1", "bmi-calculator-step-2"])
 */
export async function getDrilledSteps(userId: string): Promise<string[]> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return [];
    }

    const data = userDoc.data();
    return data?.drilledSteps || [];
  } catch (error) {
    console.error(`[drillTracking] Error fetching drilled steps:`, error);
    return [];
  }
}

/**
 * Markiert einen Step als gedrilled
 *
 * @param userId - User ID
 * @param stepId - Step-ID (z.B. "bmi-calculator-step-1")
 */
export async function markStepDrilled(
  userId: string,
  stepId: string
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      drilledSteps: arrayUnion(stepId),
      updatedAt: serverTimestamp(),
    });

    console.log(`[drillTracking] Marked step as drilled: ${stepId}`);
  } catch (error) {
    console.error(`[drillTracking] Error marking step as drilled:`, error);
    throw error;
  }
}

/**
 * Prüft ob ein Step bereits gedrilled wurde
 *
 * @param userId - User ID
 * @param stepId - Step-ID
 * @returns true wenn bereits gedrilled
 */
export async function isStepDrilled(userId: string, stepId: string): Promise<boolean> {
  const drilledSteps = await getDrilledSteps(userId);
  return drilledSteps.includes(stepId);
}

// ============================================
// Drill Attempt Counter (für intelligente Auswahl)
// ============================================

/**
 * Struktur für Drill-Attempt-Counts
 * Key = Drill-ID, Value = Anzahl der Versuche
 */
export type DrillAttemptCounts = Record<string, number>;

/**
 * Holt die Attempt-Counts für alle Drills eines Users
 *
 * @param userId - User ID
 * @returns Object mit Drill-ID → Anzahl Versuche
 */
export async function getDrillAttemptCounts(userId: string): Promise<DrillAttemptCounts> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return {};
    }

    const data = userDoc.data();
    return data?.drillAttemptCounts || {};
  } catch (error) {
    console.error(`[drillTracking] Error fetching drill attempt counts:`, error);
    return {};
  }
}

/**
 * Erhöht den Attempt-Counter für einen Drill
 * Wird aufgerufen wenn ein Drill dem User gezeigt wird
 *
 * @param userId - User ID
 * @param drillId - Drill-ID (z.B. "mcq-print-1", "code-variablen-2")
 */
export async function incrementDrillAttempt(
  userId: string,
  drillId: string
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      [`drillAttemptCounts.${drillId}`]: increment(1),
      updatedAt: serverTimestamp(),
    });

    console.log(`[drillTracking] Incremented attempt count for: ${drillId}`);
  } catch (error) {
    console.error(`[drillTracking] Error incrementing drill attempt:`, error);
    // Don't throw - counter failures shouldn't break the UX
  }
}

/**
 * Erhöht die Attempt-Counter für mehrere Drills gleichzeitig
 *
 * @param userId - User ID
 * @param drillIds - Array von Drill-IDs
 */
export async function incrementDrillAttempts(
  userId: string,
  drillIds: string[]
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);

    // Baue Update-Objekt für alle Drills
    const updates: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    for (const drillId of drillIds) {
      updates[`drillAttemptCounts.${drillId}`] = increment(1);
    }

    await updateDoc(userRef, updates);

    console.log(`[drillTracking] Incremented attempt counts for:`, drillIds);
  } catch (error) {
    console.error(`[drillTracking] Error incrementing drill attempts:`, error);
    // Don't throw - counter failures shouldn't break the UX
  }
}

// ============================================
// Chat Response ID Management (für Chat-Continuation)
// ============================================

/**
 * Holt die aktive OpenAI Response-ID für Chat-Continuation
 *
 * Diese ID verbindet alle AI-Interaktionen (Chat + Drill-Selection) zu einer Konversation,
 * sodass der AI-Agent den Nutzer über Zeit kennenlernt.
 *
 * @param userId - User ID
 * @returns Die aktive Response-ID oder null wenn keine existiert
 */
export async function getActiveResponseId(userId: string): Promise<string | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    return data?.activeResponseId || null;
  } catch (error) {
    console.error(`[drillTracking] Error fetching activeResponseId:`, error);
    return null;
  }
}

/**
 * Speichert die neue OpenAI Response-ID für Chat-Continuation
 *
 * Wird nach jeder AI-Interaktion aufgerufen (Chat-Nachricht, Drill-Selection)
 * um die Konversation fortzuführen.
 *
 * @param userId - User ID
 * @param responseId - Die neue OpenAI Response-ID
 */
export async function setActiveResponseId(
  userId: string,
  responseId: string
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      activeResponseId: responseId,
      updatedAt: serverTimestamp(),
    });

    console.log(`[drillTracking] Updated activeResponseId: ${responseId.substring(0, 20)}...`);
  } catch (error) {
    console.error(`[drillTracking] Error setting activeResponseId:`, error);
    // Don't throw - ID failures shouldn't break the UX
  }
}
