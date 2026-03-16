/**
 * getUserMetrics - Event-Sourcing Version
 *
 * Lädt User-Metriken aus der Event-Collection.
 * Berechnet alle Stats aus Events (Single Source of Truth).
 *
 * Falls keine Events vorhanden sind, fällt zurück auf Legacy-Struktur.
 */

"use server";

import { db } from "../../lib/firebase";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";

// ============================================================================
// TYPES (kompatibel mit bestehender UI)
// ============================================================================

export interface TimelineEvent {
  id: string;
  type:
    | "session_start"
    | "session_end"
    | "onboarding_start"
    | "onboarding_complete"
    | "course_access"
    | "course_complete"  // NEW: When user finishes all steps
    | "chapter_start"
    | "chapter_complete"
    | "step_start"
    | "step_complete"
    | "step_snapshot"  // Learning profile snapshot at step boundaries
    | "help_request"
    | "note_added"
    | "code_execution"
    | "drill_attempt"
    // Drill Events
    | "drill_shown"
    | "drill_mcq_completed"
    | "drill_code_completed"
    | "drill_session_completed"
    // Learning Profile Events
    | "learning_profile_initialized"
    | "performance_score_update"
    | "error_entry_added"
    | "topic_weight_change"
    | "topic_introduced"
    | "incorrect_solution"
    // AI Drill Selection Events
    | "ai_drill_selection";
  timestamp: string; // ISO string
  sessionId?: string;
  courseId?: string;
  chapterId?: string;
  stepId?: string;
  drillId?: string;
  step?: number;
  data: any;
}

export interface UserMetricsData {
  userId: string;
  timeline: TimelineEvent[];
  stats: {
    totalHelpRequests: number;
    totalStepsCompleted: number;
    totalCoursesAccessed: number;
    totalNotes: number;
    avgHintLevel: number;
    totalSessions: number;
    totalLearningTimeSeconds: number;
    coursesProgress: {
      courseId: string;
      completedSteps: number[];
      totalSteps: number;
      completionRate: number;
    }[];
  };
}

// ============================================================================
// SERIALIZATION HELPER
// ============================================================================

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

// ============================================================================
// MAIN FUNCTION - Event-Sourcing Version
// ============================================================================

export async function getUserMetrics(userId: string): Promise<UserMetricsData | null> {
  try {
    // Try to load from events collection first
    const eventsRef = collection(db, "users", userId, "events");
    const eventsQuery = query(eventsRef, orderBy("timestamp", "desc"));
    const eventsSnap = await getDocs(eventsQuery);

    // If no events found, fall back to legacy structure
    if (eventsSnap.empty) {
      // // console.log("⚠️  No events found, falling back to legacy structure");
      return await getUserMetricsLegacy(userId);
    }

    // // console.log(`✅ Found ${eventsSnap.size} events for user ${userId}`);

    // Convert Firebase events to timeline
    const timeline: TimelineEvent[] = [];
    const coursesMap = new Map<string, any>();
    const sessionsSet = new Set<string>();

    let totalHelpRequests = 0;
    let totalHintLevel = 0;
    let totalStepsCompleted = 0;
    let totalNotes = 0;
    let totalLearningTimeSeconds = 0;

    for (const eventDoc of eventsSnap.docs) {
      const eventData = eventDoc.data();
      const eventType = eventData.type;

      // Track sessions
      if (eventData.sessionId) {
        sessionsSet.add(eventData.sessionId);
      }

      // Build timeline event
      const timelineEvent: TimelineEvent = {
        id: eventDoc.id,
        type: eventType,
        timestamp: serializeTimestamp(eventData.timestamp),
        sessionId: eventData.sessionId,
        courseId: eventData.courseId,
        step: eventData.data?.stepNumber,
        data: eventData.data || {},
      };

      timeline.push(timelineEvent);

      // Process event for stats
      switch (eventType) {
        case "help_request":
          totalHelpRequests++;
          totalHintLevel += eventData.data.hintLevel || 0;
          break;

        case "step_complete":
          totalStepsCompleted++;

          // Track course progress
          const courseId = eventData.courseId;
          const stepId = eventData.stepId;

          if (courseId && stepId) {
            if (!coursesMap.has(courseId)) {
              coursesMap.set(courseId, {
                completedSteps: [],
                firstAccess: eventData.timestamp,
                lastAccess: eventData.timestamp,
              });
            }

            const course = coursesMap.get(courseId);
            const stepNumber = parseInt(stepId);

            if (!course.completedSteps.includes(stepNumber)) {
              course.completedSteps.push(stepNumber);
            }

            // Update last access
            const eventTime = new Date(serializeTimestamp(eventData.timestamp));
            const lastAccessTime = new Date(serializeTimestamp(course.lastAccess));

            if (eventTime > lastAccessTime) {
              course.lastAccess = eventData.timestamp;
            }
          }
          break;

        case "note_added":
          totalNotes++;
          break;

        case "course_access":
          // Track course access
          if (eventData.courseId && !coursesMap.has(eventData.courseId)) {
            coursesMap.set(eventData.courseId, {
              completedSteps: [],
              firstAccess: eventData.timestamp,
              lastAccess: eventData.timestamp,
            });
          }
          break;

        case "session_end":
          totalLearningTimeSeconds += eventData.data.durationSeconds || 0;
          break;
      }
    }

    // Calculate average hint level
    const avgHintLevel = totalHelpRequests > 0 ? totalHintLevel / totalHelpRequests : 0;

    // Build courses progress array
    const coursesProgress = Array.from(coursesMap.entries()).map(([courseId, data]) => ({
      courseId,
      completedSteps: data.completedSteps.sort((a: number, b: number) => a - b),
      totalSteps: 12, // TODO: Get from course definition
      completionRate: (data.completedSteps.length / 12) * 100,
    }));

    return {
      userId,
      timeline,
      stats: {
        totalHelpRequests,
        totalStepsCompleted,
        totalCoursesAccessed: coursesMap.size,
        totalNotes,
        avgHintLevel,
        totalSessions: sessionsSet.size,
        totalLearningTimeSeconds,
        coursesProgress,
      },
    };
  } catch (error) {
    console.error("❌ Error loading user metrics:", error);
    return null;
  }
}

// ============================================================================
// LEGACY FALLBACK - Reads from old structure
// ============================================================================

async function getUserMetricsLegacy(userId: string): Promise<UserMetricsData | null> {
  try {
    const timeline: TimelineEvent[] = [];
    let totalHelpRequests = 0;
    let totalHintLevel = 0;
    let totalStepsCompleted = 0;
    const coursesMap = new Map<string, any>();

    // 1. Load User Document (Notes)
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Add notes to timeline
      if (userData.notes && Array.isArray(userData.notes)) {
        userData.notes.forEach((note: string, index: number) => {
          timeline.push({
            id: `note-${index}`,
            type: "note_added",
            timestamp: serializeTimestamp(userData.updatedAt),
            data: { note },
          });
        });
      }
    }

    // 2. Load Courses Progress
    const coursesRef = collection(db, "users", userId, "courses");
    const coursesSnap = await getDocs(coursesRef);

    for (const courseDoc of coursesSnap.docs) {
      const courseData = courseDoc.data();
      const courseId = courseDoc.id;

      coursesMap.set(courseId, {
        completedSteps: courseData.completedSteps || [],
        updatedAt: courseData.updatedAt,
      });

      // Add course access event
      timeline.push({
        id: `course-access-${courseId}`,
        type: "course_access",
        timestamp: serializeTimestamp(courseData.updatedAt),
        courseId,
        data: courseData,
      });

      // 3. Load Steps for this course
      const stepsRef = collection(db, "users", userId, "courses", courseId, "steps");
      const stepsSnap = await getDocs(stepsRef);

      for (const stepDoc of stepsSnap.docs) {
        const stepData = stepDoc.data();
        const stepNumber = parseInt(stepDoc.id);

        // Add step completion event
        if (stepData.completedAt) {
          totalStepsCompleted++;

          timeline.push({
            id: `step-completed-${courseId}-${stepNumber}`,
            type: "step_complete",
            timestamp: serializeTimestamp(stepData.completedAt),
            courseId,
            step: stepNumber,
            data: {
              totalHelpRequests: stepData.totalHelpRequests,
              averageHintLevel: stepData.averageHintLevel,
            },
          });
        }

        // Add help requests
        if (stepData.helpRequests && Array.isArray(stepData.helpRequests)) {
          stepData.helpRequests.forEach((request: any, index: number) => {
            totalHelpRequests++;
            totalHintLevel += request.hintLevel;

            timeline.push({
              id: `help-${courseId}-${stepNumber}-${index}`,
              type: "help_request",
              timestamp: serializeTimestamp(request.timestamp),
              courseId,
              step: stepNumber,
              data: request,
            });
          });
        }
      }
    }

    // Sort timeline by timestamp (newest first)
    timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Calculate stats
    const avgHintLevel = totalHelpRequests > 0 ? totalHintLevel / totalHelpRequests : 0;

    const coursesProgress = Array.from(coursesMap.entries()).map(([courseId, data]) => ({
      courseId,
      completedSteps: data.completedSteps,
      totalSteps: 12,
      completionRate: (data.completedSteps.length / 12) * 100,
    }));

    return {
      userId,
      timeline,
      stats: {
        totalHelpRequests,
        totalStepsCompleted,
        totalCoursesAccessed: coursesMap.size,
        totalNotes: userDoc.exists() ? (userDoc.data().notes?.length || 0) : 0,
        avgHintLevel,
        totalSessions: 0,
        totalLearningTimeSeconds: 0,
        coursesProgress,
      },
    };
  } catch (error) {
    console.error("❌ Error loading legacy user metrics:", error);
    return null;
  }
}
