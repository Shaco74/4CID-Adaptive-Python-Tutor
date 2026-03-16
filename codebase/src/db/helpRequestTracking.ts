/**
 * Help Request Tracking System
 * Wissenschaftliche Datenerhebung für Progressive Hint System
 *
 * Zweck: Auswertung für Bachelorarbeit
 * - Wie oft brauchen User Hilfe pro Step?
 * - Welche Hint-Levels sind effektiv?
 * - Korrelation: Hint-Level → Success Rate
 */

import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";

/**
 * Help Request Entry für Firebase
 */
export interface HelpRequest {
  timestamp: Date;
  requestNumber: number;        // 1-based counter
  hintLevel: number;            // 1-5 (AI Hint-Level)
  userMessage: string;          // User Frage
  aiResponse: string;           // AI Antwort (plain text)
  aiResponseId: string | null;  // OpenAI Response ID
  courseId: string;             // z.B. "bmi-calculator"
  step: number;                 // Schritt im Kurs
  wasSuccessful?: boolean;      // Hat User danach die Aufgabe gelöst? (wird später gesetzt)
}

/**
 * Step Progress Metadata für Analysen
 */
/* interface StepProgress {
  helpRequests: HelpRequest[];
  totalHelpRequests: number;
  averageHintLevel: number;
  completedAt: Date | null;
  firstHelpRequestAt: Date | null;
  lastHelpRequestAt: Date | null;
} */

/**
 * Berechnet Hint-Level basierend auf Request-Anzahl
 * Level 1-2: Vage Hints
 * Level 3-4: Konkrete Hints mit Code-Snippets
 * Level 5+: Komplette Lösung
 */
export function calculateHintLevel(requestCount: number): number {
  if (requestCount <= 1) return 1;
  if (requestCount === 2) return 2;
  if (requestCount === 3) return 3;
  if (requestCount === 4) return 4;
  return 5; // Ab 5. Anfrage: Komplette Lösung erlaubt
}

/**
 * Lädt aktuelle Help Request Count für einen Step
 */
export async function getHelpRequestCount(
  userId: string,
  courseId: string,
  step: number
): Promise<number> {
  try {
    const stepRef = doc(db, `users/${userId}/courses/${courseId}/steps/${step}`);
    const stepDoc = await getDoc(stepRef);

    if (!stepDoc.exists()) {
      return 0;
    }

    const data = stepDoc.data();
    return data.totalHelpRequests || 0;
  } catch (error) {
    console.error("Error loading help request count:", error);
    return 0;
  }
}

/**
 * Speichert neue Help Request in Firebase
 * Für wissenschaftliche Auswertung
 */
export async function saveHelpRequest(
  userId: string,
  courseId: string,
  step: number,
  helpRequest: Omit<HelpRequest, "timestamp" | "requestNumber" | "courseId" | "step">
): Promise<void> {
  try {
    const stepRef = doc(db, `users/${userId}/courses/${courseId}/steps/${step}`);
    const stepDoc = await getDoc(stepRef);

    const currentCount = stepDoc.exists()
      ? (stepDoc.data().totalHelpRequests || 0)
      : 0;

    const newRequestNumber = currentCount + 1;

    const fullHelpRequest: HelpRequest = {
      ...helpRequest,
      timestamp: new Date(),
      requestNumber: newRequestNumber,
      courseId,
      step,
    };

    if (!stepDoc.exists()) {
      // Erstelle neues Step-Dokument
      await setDoc(stepRef, {
        helpRequests: [fullHelpRequest],
        totalHelpRequests: 1,
        averageHintLevel: helpRequest.hintLevel,
        completedAt: null,
        firstHelpRequestAt: new Date(),
        lastHelpRequestAt: new Date(),
      });
    } else {
      // Update bestehendes Dokument
      const currentRequests = stepDoc.data().helpRequests || [];
      const allRequests = [...currentRequests, fullHelpRequest];
      const avgHintLevel =
        allRequests.reduce((sum, req) => sum + req.hintLevel, 0) / allRequests.length;

      await updateDoc(stepRef, {
        helpRequests: arrayUnion(fullHelpRequest),
        totalHelpRequests: increment(1),
        averageHintLevel: avgHintLevel,
        lastHelpRequestAt: new Date(),
      });
    }

    // // console.log(`✅ Help request saved: User ${userId}, ${courseId} Step ${step}, Request #${newRequestNumber}, Level ${helpRequest.hintLevel}`);
  } catch (error) {
    console.error("Error saving help request:", error);
    throw error;
  }
}

/**
 * Markiert Step als completed
 * Setzt completedAt Timestamp für Time-to-Solution Analyse
 */
export async function markStepCompleted(
  userId: string,
  courseId: string,
  step: number
): Promise<void> {
  try {
    const stepRef = doc(db, `users/${userId}/courses/${courseId}/steps/${step}`);
    const stepDoc = await getDoc(stepRef);

    if (stepDoc.exists()) {
      await updateDoc(stepRef, {
        completedAt: new Date(),
      });
      // // console.log(`✅ Step marked as completed: ${courseId} Step ${step}`);
    }
  } catch (error) {
    console.error("Error marking step as completed:", error);
  }
}

/**
 * Reset Help Requests bei Step-Wechsel
 * Nur für UI-State, nicht in Firebase (für Research wichtig!)
 */
export function resetHelpRequestCountLocally(): void {
  // Wird nur im CourseContext verwendet
  // Firebase-Daten bleiben erhalten für Auswertung
}
