/**
 * Firebase Tracking für User Learning Profile
 *
 * Speichert:
 * - performanceScore: Gesamtleistung (100 Start, -5 Fehler, +2 korrekt)
 * - errorHistory: Alle Fehler mit Kontext
 * - topicWeights: Gewichtung pro Topic für adaptive Drill-Auswahl
 */

import { doc, getDoc, updateDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { logEvent, getOrCreateSession } from "@/db/eventTracking";
import type {
  UserLearningProfile,
  ErrorEntry,
  ErrorType,
  DEFAULT_LEARNING_PROFILE,
  TOPIC_WEIGHT_CONFIG,
  PERFORMANCE_SCORE_CONFIG,
} from "@/types/learningProfile";

// Re-import constants since we need actual values, not just types
const TOPIC_WEIGHT = {
  NOT_INTRODUCED: -1,
  INITIAL: 1,
  MIN: 0.1,
  MAX: 3.0,
  CORRECT_DELTA: -0.2,
  ERROR_DELTA: 0.3,
  /** Für falsche Lösungen OHNE Python-Error (z.B. 1,79 statt 1.79) */
  INCORRECT_DELTA: 0.15,
} as const;

const PERFORMANCE = {
  INITIAL: 100,
  ERROR_DELTA: -5,
  CORRECT_DELTA: 2,
  /** Für falsche Lösungen OHNE Python-Error - weniger hart als echte Errors */
  INCORRECT_DELTA: -2,
  MIN: 0,
} as const;

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Holt das Learning Profile eines Users
 *
 * @param userId - User ID
 * @returns UserLearningProfile oder null wenn nicht vorhanden
 */
export async function getLearningProfile(userId: string): Promise<UserLearningProfile | null> {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.warn(`[learningProfile] User not found: ${userId}`);
      return null;
    }

    const data = userDoc.data();
    const profile = data?.learningProfile;

    if (!profile) {
      console.log(`[learningProfile] No profile found for user: ${userId}`);
      return null;
    }

    // Convert Firestore Timestamp to Date
    return {
      performanceScore: profile.performanceScore ?? PERFORMANCE.INITIAL,
      errorHistory: (profile.errorHistory || []).map((entry: any) => ({
        ...entry,
        timestamp: entry.timestamp?.toDate?.() || new Date(entry.timestamp),
      })),
      topicWeights: profile.topicWeights || {},
      lastUpdated: profile.lastUpdated?.toDate?.() || new Date(),
    };
  } catch (error) {
    console.error(`[learningProfile] Error fetching profile:`, error);
    return null;
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialisiert ein Learning Profile für einen neuen User
 *
 * @param userId - User ID
 * @returns Das initialisierte Profile
 */
export async function initializeLearningProfile(userId: string): Promise<UserLearningProfile> {
  const defaultProfile: UserLearningProfile = {
    performanceScore: PERFORMANCE.INITIAL,
    errorHistory: [],
    topicWeights: {},
    lastUpdated: new Date(),
  };

  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.warn(`[learningProfile] Cannot initialize - user not found: ${userId}`);
      return defaultProfile;
    }

    const data = userDoc.data();

    // Nur initialisieren wenn noch nicht vorhanden
    if (!data.learningProfile) {
      await updateDoc(userRef, {
        learningProfile: {
          performanceScore: PERFORMANCE.INITIAL,
          errorHistory: [],
          topicWeights: {},
          lastUpdated: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });

      console.log(`[learningProfile] Initialized profile for user: ${userId}`);

      // Log event
      await logLearningProfileEvent(userId, "learning_profile_initialized", {
        performanceScore: PERFORMANCE.INITIAL,
      });
    }

    return defaultProfile;
  } catch (error) {
    console.error(`[learningProfile] Error initializing profile:`, error);
    return defaultProfile;
  }
}

// ============================================================================
// PERFORMANCE SCORE
// ============================================================================

/**
 * Aktualisiert den Performance Score eines Users
 *
 * @param userId - User ID
 * @param delta - Änderung (+2 für korrekt, -5 für Fehler)
 * @returns Neuer Performance Score
 */
export async function updatePerformanceScore(userId: string, delta: number): Promise<number> {
  try {
    const profile = await getLearningProfile(userId);
    const currentScore = profile?.performanceScore ?? PERFORMANCE.INITIAL;

    // Berechne neuen Score (minimum 0)
    const newScore = Math.max(PERFORMANCE.MIN, currentScore + delta);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      "learningProfile.performanceScore": newScore,
      "learningProfile.lastUpdated": serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`[learningProfile] Performance score updated: ${currentScore} -> ${newScore} (delta: ${delta})`);

    // Log event
    await logLearningProfileEvent(userId, "performance_score_update", {
      oldScore: currentScore,
      newScore,
      delta,
    });

    return newScore;
  } catch (error) {
    console.error(`[learningProfile] Error updating performance score:`, error);
    throw error;
  }
}

/**
 * Reduziert Performance Score bei Fehler (-5)
 */
export async function recordError(userId: string): Promise<number> {
  return updatePerformanceScore(userId, PERFORMANCE.ERROR_DELTA);
}

/**
 * Erhöht Performance Score bei korrekter Lösung (+2)
 */
export async function recordCorrect(userId: string): Promise<number> {
  return updatePerformanceScore(userId, PERFORMANCE.CORRECT_DELTA);
}

// ============================================================================
// ERROR HISTORY
// ============================================================================

/**
 * Fügt einen Fehler zur Error History hinzu
 *
 * @param userId - User ID
 * @param error - Fehler-Daten
 */
export async function addErrorEntry(
  userId: string,
  error: Omit<ErrorEntry, "timestamp">
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.warn(`[learningProfile] Cannot add error - user not found: ${userId}`);
      return;
    }

    const data = userDoc.data();
    const currentHistory = data?.learningProfile?.errorHistory || [];

    const newEntry: ErrorEntry = {
      ...error,
      timestamp: new Date(),
    };

    // Append to error history
    await updateDoc(userRef, {
      "learningProfile.errorHistory": [...currentHistory, {
        ...newEntry,
        timestamp: Timestamp.now(),
      }],
      "learningProfile.lastUpdated": serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`[learningProfile] Error entry added:`, {
      errorType: error.errorType,
      topic: error.topic,
      step: error.step,
    });

    // Log event - include errorMessage and code for visibility in admin timeline
    await logLearningProfileEvent(userId, "error_entry_added", {
      errorType: error.errorType,
      topic: error.topic,
      courseId: error.courseId,
      step: error.step,
      errorMessage: error.errorMessage,
      code: error.code,
    });
  } catch (error) {
    console.error(`[learningProfile] Error adding error entry:`, error);
    throw error;
  }
}

// ============================================================================
// TOPIC WEIGHTS
// ============================================================================

/**
 * Aktualisiert die Gewichtung eines Topics basierend auf Erfolg/Fehler
 *
 * @param userId - User ID
 * @param topic - Topic-Name
 * @param isCorrect - War die Lösung korrekt?
 * @returns Neue Gewichtung
 */
export async function updateTopicWeight(
  userId: string,
  topic: string,
  isCorrect: boolean
): Promise<number> {
  try {
    const profile = await getLearningProfile(userId);
    const currentWeight = profile?.topicWeights?.[topic];

    // Nicht eingeführte Topics nicht ändern
    if (currentWeight === TOPIC_WEIGHT.NOT_INTRODUCED || currentWeight === undefined) {
      console.log(`[learningProfile] Topic "${topic}" not introduced, skipping weight update`);
      return currentWeight ?? TOPIC_WEIGHT.NOT_INTRODUCED;
    }

    let newWeight: number;
    if (isCorrect) {
      // Reduziere Gewicht, minimum 0.1
      newWeight = Math.max(TOPIC_WEIGHT.MIN, currentWeight + TOPIC_WEIGHT.CORRECT_DELTA);
    } else {
      // Erhöhe Gewicht, maximum 3.0
      newWeight = Math.min(TOPIC_WEIGHT.MAX, currentWeight + TOPIC_WEIGHT.ERROR_DELTA);
    }

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`learningProfile.topicWeights.${topic}`]: newWeight,
      "learningProfile.lastUpdated": serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`[learningProfile] Topic weight updated: ${topic} ${currentWeight} -> ${newWeight} (${isCorrect ? "correct" : "error"})`);

    // Log event
    await logLearningProfileEvent(userId, "topic_weight_change", {
      topic,
      oldWeight: currentWeight,
      newWeight,
      reason: isCorrect ? "correct" : "error",
    });

    return newWeight;
  } catch (error) {
    console.error(`[learningProfile] Error updating topic weight:`, error);
    throw error;
  }
}

/**
 * Führt ein Topic ein (setzt Gewichtung auf 1)
 *
 * @param userId - User ID
 * @param topic - Topic-Name
 */
export async function introduceTopic(userId: string, topic: string): Promise<void> {
  try {
    const profile = await getLearningProfile(userId);
    const currentWeight = profile?.topicWeights?.[topic];

    // Nur einführen wenn noch nicht eingeführt
    if (currentWeight !== undefined && currentWeight !== TOPIC_WEIGHT.NOT_INTRODUCED) {
      console.log(`[learningProfile] Topic "${topic}" already introduced, skipping`);
      return;
    }

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`learningProfile.topicWeights.${topic}`]: TOPIC_WEIGHT.INITIAL,
      "learningProfile.lastUpdated": serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`[learningProfile] Topic introduced: ${topic}`);

    // Log event
    await logLearningProfileEvent(userId, "topic_introduced", {
      topic,
      initialWeight: TOPIC_WEIGHT.INITIAL,
    });
  } catch (error) {
    console.error(`[learningProfile] Error introducing topic:`, error);
    throw error;
  }
}

/**
 * Führt mehrere Topics auf einmal ein
 *
 * @param userId - User ID
 * @param topics - Array von Topic-Namen
 */
export async function introduceTopics(userId: string, topics: string[]): Promise<void> {
  for (const topic of topics) {
    await introduceTopic(userId, topic);
  }
}

/**
 * Setzt ein Topic als "nicht eingeführt" (-1)
 * Nützlich für Testing/Admin
 */
export async function resetTopic(userId: string, topic: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`learningProfile.topicWeights.${topic}`]: TOPIC_WEIGHT.NOT_INTRODUCED,
      "learningProfile.lastUpdated": serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`[learningProfile] Topic reset: ${topic}`);
  } catch (error) {
    console.error(`[learningProfile] Error resetting topic:`, error);
    throw error;
  }
}

// ============================================================================
// COMBINED OPERATIONS (für Convenience)
// ============================================================================

/**
 * Verarbeitet einen Fehler komplett:
 * - Fügt zur Error History hinzu
 * - Reduziert Performance Score
 * - Erhöht Topic-Gewichtung
 *
 * @param userId - User ID
 * @param errorData - Fehler-Daten ohne Timestamp
 */
export async function processError(
  userId: string,
  errorData: Omit<ErrorEntry, "timestamp">
): Promise<{
  newPerformanceScore: number;
  newTopicWeight: number;
}> {
  // 1. Error History
  await addErrorEntry(userId, errorData);

  // 2. Performance Score (-5)
  const newPerformanceScore = await recordError(userId);

  // 3. Topic Weight (+0.3)
  const newTopicWeight = await updateTopicWeight(userId, errorData.topic, false);

  console.log(`[learningProfile] Processed error for user ${userId}:`, {
    errorType: errorData.errorType,
    topic: errorData.topic,
    newPerformanceScore,
    newTopicWeight,
  });

  return { newPerformanceScore, newTopicWeight };
}

/**
 * Verarbeitet eine korrekte Lösung:
 * - Erhöht Performance Score
 * - Reduziert Topic-Gewichtung
 *
 * @param userId - User ID
 * @param topic - Das Topic das korrekt bearbeitet wurde
 */
export async function processCorrect(
  userId: string,
  topic: string
): Promise<{
  newPerformanceScore: number;
  newTopicWeight: number;
}> {
  // 1. Performance Score (+2)
  const newPerformanceScore = await recordCorrect(userId);

  // 2. Topic Weight (-0.2)
  const newTopicWeight = await updateTopicWeight(userId, topic, true);

  console.log(`[learningProfile] Processed correct answer for user ${userId}:`, {
    topic,
    newPerformanceScore,
    newTopicWeight,
  });

  return { newPerformanceScore, newTopicWeight };
}

/**
 * Verarbeitet eine falsche Lösung OHNE Python-Error:
 * - Reduziert Performance Score (weniger als bei echtem Error)
 * - Erhöht Topic-Gewichtung (weniger als bei echtem Error)
 *
 * Beispiel: User schreibt `height = 1,79` statt `height = 1.79`
 * → Kein SyntaxError, aber falsches Ergebnis (Tuple statt Float)
 *
 * @param userId - User ID
 * @param topic - Das Topic bei dem der User Probleme hatte
 */
export async function processIncorrect(
  userId: string,
  topic: string
): Promise<{
  newPerformanceScore: number;
  newTopicWeight: number;
}> {
  // 1. Performance Score (-2, weniger als Error's -5)
  const newPerformanceScore = await updatePerformanceScore(userId, PERFORMANCE.INCORRECT_DELTA);

  // 2. Topic Weight (+0.15, weniger als Error's +0.3)
  // Nutze updateTopicWeight mit custom delta
  const profile = await getLearningProfile(userId);
  const currentWeight = profile?.topicWeights?.[topic];

  // Nicht eingeführte Topics nicht ändern
  if (currentWeight === TOPIC_WEIGHT.NOT_INTRODUCED || currentWeight === undefined) {
    console.log(`[learningProfile] Topic "${topic}" not introduced, skipping weight update for incorrect`);
    return {
      newPerformanceScore,
      newTopicWeight: currentWeight ?? TOPIC_WEIGHT.NOT_INTRODUCED,
    };
  }

  // Erhöhe Gewicht, maximum 3.0
  const newTopicWeight = Math.min(TOPIC_WEIGHT.MAX, currentWeight + TOPIC_WEIGHT.INCORRECT_DELTA);

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    [`learningProfile.topicWeights.${topic}`]: newTopicWeight,
    "learningProfile.lastUpdated": serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  console.log(`[learningProfile] Processed incorrect answer (no error) for user ${userId}:`, {
    topic,
    newPerformanceScore,
    oldTopicWeight: currentWeight,
    newTopicWeight,
  });

  // Log event
  await logLearningProfileEvent(userId, "incorrect_solution", {
    topic,
    performanceDelta: PERFORMANCE.INCORRECT_DELTA,
    topicWeightDelta: TOPIC_WEIGHT.INCORRECT_DELTA,
    newPerformanceScore,
    newTopicWeight,
  });

  return { newPerformanceScore, newTopicWeight };
}

// ============================================================================
// EVENT LOGGING
// ============================================================================

/**
 * Loggt ein Learning Profile Event
 */
async function logLearningProfileEvent(
  userId: string,
  eventType: string,
  data: Record<string, any>
): Promise<void> {
  try {
    const sessionId = await getOrCreateSession(userId);

    await logEvent({
      userId,
      sessionId,
      timestamp: Timestamp.now(),
      type: eventType as any,
      data,
    });
  } catch (error) {
    // Don't throw - logging failures shouldn't break the main operation
    console.error(`[learningProfile] Error logging event:`, error);
  }
}

// ============================================================================
// ADMIN/DEBUG HELPERS
// ============================================================================

/**
 * Setzt das Learning Profile eines Users komplett zurück
 * NUR FÜR TESTING/ADMIN!
 */
export async function resetLearningProfile(userId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      learningProfile: {
        performanceScore: PERFORMANCE.INITIAL,
        errorHistory: [],
        topicWeights: {},
        lastUpdated: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    });

    console.log(`[learningProfile] Profile reset for user: ${userId}`);
  } catch (error) {
    console.error(`[learningProfile] Error resetting profile:`, error);
    throw error;
  }
}

/**
 * Gibt eine Zusammenfassung des Learning Profiles aus (für Debugging)
 */
export async function getProfileSummary(userId: string): Promise<{
  performanceScore: number;
  errorCount: number;
  introducedTopics: string[];
  topicsNeedingPractice: string[];
  masteredTopics: string[];
} | null> {
  const profile = await getLearningProfile(userId);

  if (!profile) {
    return null;
  }

  const introducedTopics: string[] = [];
  const topicsNeedingPractice: string[] = [];
  const masteredTopics: string[] = [];

  for (const [topic, weight] of Object.entries(profile.topicWeights)) {
    if (weight === TOPIC_WEIGHT.NOT_INTRODUCED) continue;

    introducedTopics.push(topic);

    if (weight > 1.2) {
      topicsNeedingPractice.push(topic);
    } else if (weight < 0.5) {
      masteredTopics.push(topic);
    }
  }

  return {
    performanceScore: profile.performanceScore,
    errorCount: profile.errorHistory.length,
    introducedTopics,
    topicsNeedingPractice,
    masteredTopics,
  };
}
