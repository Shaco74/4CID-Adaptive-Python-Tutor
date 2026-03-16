"use server";

/**
 * getEvaluations - Lädt alle eingereichten Evaluationen aus Firebase
 *
 * Durchsucht alle User-Events nach "evaluation_submitted" Events.
 */

import { db } from "../../lib/firebase";
import { getDocs, query, where, collectionGroup } from "firebase/firestore";

// Re-export types and helpers from evaluationHelpers
export type { EvaluationEntry } from "./getEvaluationsTypes";

// Import the type for internal use
import type { EvaluationEntry } from "./getEvaluationsTypes";

function serializeTimestamp(timestamp: any): string {
  if (!timestamp) return new Date().toISOString();

  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }

  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }

  if (typeof timestamp === "string") {
    return timestamp;
  }

  return new Date().toISOString();
}

/**
 * Lädt alle Evaluationen aus allen User-Event-Collections
 */
export async function getAllEvaluations(): Promise<EvaluationEntry[]> {
  try {
    // Use collectionGroup to query across all users' events subcollections
    const eventsQuery = query(
      collectionGroup(db, "events"),
      where("type", "==", "evaluation_submitted")
    );

    const snapshot = await getDocs(eventsQuery);

    const evaluations: EvaluationEntry[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      // Extract userId from the document path: users/{userId}/events/{eventId}
      const pathParts = docSnap.ref.path.split("/");
      const userId = pathParts[1]; // users/[userId]/events/[eventId]

      evaluations.push({
        id: docSnap.id,
        oderId: userId,
        timestamp: serializeTimestamp(data.timestamp),
        sessionId: data.sessionId || "",
        data: data.data || {},
      });
    }

    // Sort by timestamp (newest first)
    evaluations.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return evaluations;
  } catch (error) {
    console.error("Error loading evaluations:", error);
    throw error;
  }
}
