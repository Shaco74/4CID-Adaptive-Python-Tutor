/**
 * Event-Sourcing System - Zentrale Event-Logging Funktionen
 *
 * Alle User-Aktionen werden als atomare Events gespeichert.
 * Eliminiert Redundanz und ermöglicht präzise Research-Analytics.
 */

import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import type {
  UserEvent,
  EventQuery,
  SessionStartEvent,
  SessionEndEvent,
  OnboardingStartEvent,
  OnboardingCompleteEvent,
  CourseAccessEvent,
  CourseCompleteEvent,
  ChapterStartEvent,
  ChapterCompleteEvent,
  StepStartEvent,
  StepCompleteEvent,
  StepSnapshotEvent,
  HelpRequestEvent,
  NoteAddedEvent,
  CodeExecutionEvent,
  DrillAttemptEvent,
  DrillShownEvent,
  DrillMCQCompletedEvent,
  DrillCodeCompletedEvent,
  DrillSessionCompletedEvent,
  EvaluationSubmittedEvent,
} from "@/types/eventTypes";

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

let currentSessionId: string | null = null;
let sessionStartTime: Date | null = null;
let sessionEventCount = 0;

/**
 * Startet eine neue User-Session
 */
export async function startSession(userId: string): Promise<string> {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();

  currentSessionId = sessionId;
  sessionStartTime = now;
  sessionEventCount = 0;

  // Build data object without undefined values
  const data: any = {
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
  };

  // Only add fields if they have values
  if (typeof window !== "undefined") {
    if (document.referrer) {
      data.referrer = document.referrer;
    }
    data.screenResolution = `${window.screen.width}x${window.screen.height}`;
  }

  const event: Omit<SessionStartEvent, "id"> = {
    userId,
    timestamp: Timestamp.fromDate(now),
    sessionId,
    type: "session_start",
    data,
  };

  await logEvent(event);

  return sessionId;
}

/**
 * Beendet die aktuelle Session
 */
export async function endSession(userId: string): Promise<void> {
  if (!currentSessionId || !sessionStartTime) {
    // // console.warn("No active session to end");
    return;
  }

  const now = new Date();
  const durationSeconds = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);

  const event: Omit<SessionEndEvent, "id"> = {
    userId,
    timestamp: Timestamp.fromDate(now),
    sessionId: currentSessionId,
    type: "session_end",
    data: {
      durationSeconds,
      eventsInSession: sessionEventCount,
    },
  };

  await logEvent(event);

  // Reset session state
  currentSessionId = null;
  sessionStartTime = null;
  sessionEventCount = 0;
}

/**
 * Holt oder erstellt SessionId für aktuellen User
 */
export async function getOrCreateSession(userId: string): Promise<string> {
  if (currentSessionId) {
    return currentSessionId;
  }

  // Check if there's an active session in Firebase (< 30 min old)
  const recentEvents = await queryEvents({
    userId,
    type: "session_start",
    limit: 1,
  });

  if (recentEvents.length > 0) {
    const lastSession = recentEvents[0];
    const timeSinceStart = Date.now() - new Date(lastSession.timestamp).getTime();

    // If last session started < 30 minutes ago, reuse it
    if (timeSinceStart < 30 * 60 * 1000 && lastSession.sessionId) {
      currentSessionId = lastSession.sessionId;
      sessionStartTime = new Date(lastSession.timestamp);
      return lastSession.sessionId;
    }
  }

  // Start new session
  return await startSession(userId);
}

// ============================================================================
// ONBOARDING EVENTS
// ============================================================================

/**
 * Loggt Start des Onboardings
 */
export async function logOnboardingStart(userId: string, isFirstTime: boolean = true): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<OnboardingStartEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "onboarding_start",
    data: {
      isFirstTime,
    },
  };

  return await logEvent(event);
}

/**
 * Loggt Abschluss des Onboardings
 */
export async function logOnboardingComplete(userId: string, durationSeconds: number): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<OnboardingCompleteEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "onboarding_complete",
    data: {
      durationSeconds,
    },
  };

  return await logEvent(event);
}

// ============================================================================
// GENERIC EVENT LOGGING
// ============================================================================

/**
 * Zentrale Funktion zum Speichern von Events
 */
export async function logEvent(event: Omit<UserEvent, "id">): Promise<string> {
  try {
    const eventsRef = collection(db, "users", event.userId, "events");

    const docRef = await addDoc(eventsRef, event);

    sessionEventCount++;

    // // console.log(`✅ Event logged: ${event.type} (${docRef.id})`);

    return docRef.id;
  } catch (error) {
    console.error("❌ Error logging event:", error);
    throw error;
  }
}

// ============================================================================
// COURSE NAVIGATION EVENTS
// ============================================================================

export async function logCourseAccess(
  userId: string,
  courseId: string,
  isFirstAccess: boolean = false,
  previousProgress?: number
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  // Build data object without undefined values
  const data: any = {
    isFirstAccess,
  };

  if (previousProgress !== undefined) {
    data.previousProgress = previousProgress;
  }

  const event: Omit<CourseAccessEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "course_access",
    courseId,
    data,
  };

  return await logEvent(event);
}

export async function logCourseComplete(
  userId: string,
  courseId: string,
  totalSteps: number,
  totalDurationSeconds: number,
  totalHelpRequests: number,
  averageHintLevel: number
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<CourseCompleteEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "course_complete",
    courseId,
    data: {
      totalSteps,
      totalDurationSeconds,
      totalHelpRequests,
      averageHintLevel,
    },
  };

  return await logEvent(event);
}

export async function logChapterStart(
  userId: string,
  courseId: string,
  chapterId: string,
  chapterTitle: string,
  stepCount: number
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<ChapterStartEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "chapter_start",
    courseId,
    chapterId,
    data: {
      chapterTitle,
      stepCount,
    },
  };

  return await logEvent(event);
}

export async function logChapterComplete(
  userId: string,
  courseId: string,
  chapterId: string,
  durationSeconds: number,
  totalHelpRequests: number,
  averageHintLevel: number
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<ChapterCompleteEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "chapter_complete",
    courseId,
    chapterId,
    data: {
      durationSeconds,
      totalHelpRequests,
      averageHintLevel,
    },
  };

  return await logEvent(event);
}

// ============================================================================
// STEP EVENTS
// ============================================================================

export async function logStepStart(
  userId: string,
  courseId: string,
  stepId: string,
  stepNumber: number,
  stepTitle: string,
  isRetry: boolean = false
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<StepStartEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "step_start",
    courseId,
    stepId,
    data: {
      stepNumber,
      stepTitle,
      isRetry,
    },
  };

  return await logEvent(event);
}

export async function logStepComplete(
  userId: string,
  courseId: string,
  stepId: string,
  stepNumber: number,
  durationSeconds: number,
  totalHelpRequests: number,
  averageHintLevel: number,
  codeExecutions: number,
  finalCode: string,
  isRetry: boolean = false
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<StepCompleteEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "step_complete",
    courseId,
    stepId,
    data: {
      stepNumber,
      durationSeconds,
      totalHelpRequests,
      averageHintLevel,
      codeExecutions,
      finalCode,
      isRetry,
    },
  };

  return await logEvent(event);
}

/**
 * Logs a step snapshot capturing learning profile state at step start or end
 * Used for research analysis of topic weight and performance score changes
 */
export async function logStepSnapshot(
  userId: string,
  courseId: string,
  stepId: string,
  stepNumber: number,
  snapshotType: "start" | "end",
  performanceScore: number,
  topicWeights: Record<string, number>,
  errorCount: number,
  recentTopics: string[]
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<StepSnapshotEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "step_snapshot",
    courseId,
    stepId,
    data: {
      stepNumber,
      snapshotType,
      performanceScore,
      topicWeights,
      errorCount,
      recentTopics,
    },
  };

  return await logEvent(event);
}

// ============================================================================
// HELP REQUEST EVENTS
// ============================================================================

export async function logHelpRequest(
  userId: string,
  courseId: string,
  stepId: string,
  stepNumber: number,
  requestNumber: number,
  hintLevel: number,
  userMessage: string,
  aiResponse: string,
  aiResponseId: string,
  tokenCount?: number
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  // Build data object without undefined values
  const data: any = {
    stepNumber,
    requestNumber,
    hintLevel,
    userMessage,
    aiResponse,
    aiResponseId,
  };

  if (tokenCount !== undefined) {
    data.tokenCount = tokenCount;
  }

  const event: Omit<HelpRequestEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "help_request",
    courseId,
    stepId,
    data,
  };

  return await logEvent(event);
}

// ============================================================================
// NOTE EVENTS
// ============================================================================

export async function logNoteAdded(
  userId: string,
  note: string,
  courseId?: string,
  stepId?: string
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<NoteAddedEvent, "id"> & { courseId?: string; stepId?: string } = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "note_added",
    data: {
      note,
      noteLength: note.length,
    },
  };

  // Only add courseId and stepId if defined
  if (courseId !== undefined) {
    event.courseId = courseId;
  }
  if (stepId !== undefined) {
    event.stepId = stepId;
  }

  return await logEvent(event);
}

// ============================================================================
// CODE EXECUTION EVENTS
// ============================================================================

export async function logCodeExecution(
  userId: string,
  courseId: string,
  stepId: string,
  stepNumber: number,
  code: string,
  success: boolean,
  errorMessage?: string,
  executionTimeMs?: number
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  // Build data object without undefined values
  const data: any = {
    stepNumber,
    code,
    success,
  };

  if (errorMessage !== undefined) {
    data.errorMessage = errorMessage;
  }
  if (executionTimeMs !== undefined) {
    data.executionTimeMs = executionTimeMs;
  }

  const event: Omit<CodeExecutionEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "code_execution",
    courseId,
    stepId,
    data,
  };

  return await logEvent(event);
}

// ============================================================================
// DRILL EVENTS
// ============================================================================

export async function logDrillAttempt(
  userId: string,
  drillId: string,
  drillTitle: string,
  questionType: "mc" | "code" | "spot-error" | "predict-output" | "fill-blank",
  questionIndex: number,
  correct: boolean,
  attemptNumber: number,
  timeToAnswerSeconds: number,
  userAnswer: string
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<DrillAttemptEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "drill_attempt",
    drillId,
    data: {
      drillTitle,
      questionType,
      questionIndex,
      correct,
      attemptNumber,
      timeToAnswerSeconds,
      userAnswer,
    },
  };

  return await logEvent(event);
}

/**
 * Log when drill modal is shown with full drill IDs
 */
export async function logDrillShown(
  userId: string,
  courseId: string,
  step: number,
  topics: string[],
  userGroup: "A" | "B",
  mcqDrillId: string,
  codeDrillId: string,
  mcqTopic: string,
  codeTopic: string,
  difficultyRecommended?: string
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<DrillShownEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "drill_shown",
    courseId,
    data: {
      step,
      topics,
      userGroup,
      mcqDrillId,
      codeDrillId,
      mcqTopic,
      codeTopic,
      ...(difficultyRecommended !== undefined && { difficultyRecommended }),
    },
  };

  return await logEvent(event);
}

/**
 * Log MCQ drill completion with full identification
 */
export async function logDrillMCQCompleted(
  userId: string,
  courseId: string,
  step: number,
  topics: string[],
  userGroup: "A" | "B",
  mcqDrillId: string,
  mcqTopic: string,
  mcqType: "multiple-choice" | "spot-the-error" | "predict-output" | "fill-the-blank",
  mcqAttempts: number,
  success: boolean,
  timeToAnswerMs?: number
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<DrillMCQCompletedEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "drill_mcq_completed",
    courseId,
    data: {
      step,
      topics,
      userGroup,
      mcqDrillId,
      mcqTopic,
      mcqType,
      mcqAttempts,
      success,
      ...(timeToAnswerMs !== undefined && { timeToAnswerMs }),
    },
  };

  return await logEvent(event);
}

/**
 * Log code drill completion with full identification
 */
export async function logDrillCodeCompleted(
  userId: string,
  courseId: string,
  step: number,
  topics: string[],
  userGroup: "A" | "B",
  codeDrillId: string,
  codeTopic: string,
  codeAttempts: number,
  success: boolean,
  timeToCompleteMs?: number,
  finalCode?: string
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<DrillCodeCompletedEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "drill_code_completed",
    courseId,
    data: {
      step,
      topics,
      userGroup,
      codeDrillId,
      codeTopic,
      codeAttempts,
      success,
      ...(timeToCompleteMs !== undefined && { timeToCompleteMs }),
      ...(finalCode !== undefined && { finalCode }),
    },
  };

  return await logEvent(event);
}

/**
 * Log complete drill session with all details
 */
export async function logDrillSessionCompleted(
  userId: string,
  courseId: string,
  step: number,
  topics: string[],
  userGroup: "A" | "B",
  mcqDrillId: string,
  codeDrillId: string,
  mcqTopic: string,
  codeTopic: string,
  mcqAttempts: number,
  codeAttempts: number,
  mcqSuccess: boolean,
  codeSuccess: boolean,
  totalTimeMs: number,
  difficultyRecommended?: string,
  performanceScoreBefore?: number,
  performanceScoreAfter?: number
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<DrillSessionCompletedEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "drill_session_completed",
    courseId,
    data: {
      step,
      topics,
      userGroup,
      mcqDrillId,
      codeDrillId,
      mcqTopic,
      codeTopic,
      mcqAttempts,
      codeAttempts,
      mcqSuccess,
      codeSuccess,
      totalTimeMs,
      ...(difficultyRecommended !== undefined && { difficultyRecommended }),
      ...(performanceScoreBefore !== undefined && { performanceScoreBefore }),
      ...(performanceScoreAfter !== undefined && { performanceScoreAfter }),
    },
  };

  return await logEvent(event);
}

// ============================================================================
// EVALUATION EVENTS
// ============================================================================

export interface EvaluationData {
  aiGroupEnabled: boolean;
  ageGroup: string | null;
  employmentStatus: string;
  isITField: string;
  programmingKnowledge: number | null;
  selfEfficacy: Record<string, number>;
  mentalEffort: number;
  frustration: number;
  susValues: Record<string, number>;
  ueqValues: Record<string, number>;
  aiUsefulness?: Record<string, number>;
  aiTrust?: Record<string, number>;
  npsScore: number | null;
  openFeedback: string;
}

/**
 * Speichert die Evaluation-Daten des abschließenden Fragebogens
 */
export async function logEvaluationSubmitted(
  userId: string,
  data: EvaluationData
): Promise<string> {
  const sessionId = await getOrCreateSession(userId);

  const event: Omit<EvaluationSubmittedEvent, "id"> = {
    userId,
    timestamp: Timestamp.now(),
    sessionId,
    type: "evaluation_submitted",
    data,
  };

  return await logEvent(event);
}

// ============================================================================
// QUERY HELPERS
// ============================================================================

/**
 * Flexible Event-Abfrage für Analytics
 */
export async function queryEvents(params: EventQuery): Promise<any[]> {
  try {
    const eventsRef = collection(db, "users", params.userId, "events");

    let q = query(eventsRef);

    // Filter by sessionId
    if (params.sessionId) {
      q = query(q, where("sessionId", "==", params.sessionId));
    }

    // Filter by courseId
    if (params.courseId) {
      q = query(q, where("courseId", "==", params.courseId));
    }

    // Filter by stepId
    if (params.stepId) {
      q = query(q, where("stepId", "==", params.stepId));
    }

    // Filter by event type
    if (params.type) {
      if (Array.isArray(params.type)) {
        q = query(q, where("type", "in", params.type));
      } else {
        q = query(q, where("type", "==", params.type));
      }
    }

    // Order by timestamp (newest first)
    q = query(q, orderBy("timestamp", "desc"));

    // Limit results
    if (params.limit) {
      q = query(q, firestoreLimit(params.limit));
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Error querying events:", error);
    throw error;
  }
}

/**
 * Berechnet User-Progress aus Events (Derived State)
 */
export async function computeUserProgress(userId: string): Promise<any> {
  const allEvents = await queryEvents({ userId });

  const courses: any = {};
  let totalSessions = 0;
  let totalLearningTimeSeconds = 0;
  let lastActivity: Date | null = null;

  // Session tracking
  const sessions = new Set<string>();

  for (const event of allEvents) {
    sessions.add(event.sessionId);

    if (!lastActivity || event.timestamp.toDate() > lastActivity) {
      lastActivity = event.timestamp.toDate();
    }

    // Course-specific tracking
    if (event.courseId) {
      if (!courses[event.courseId]) {
        courses[event.courseId] = {
          firstAccess: event.timestamp.toDate(),
          lastAccess: event.timestamp.toDate(),
          completedSteps: [],
          completedChapters: [],
          totalHelpRequests: 0,
          averageHintLevel: 0,
          totalTimeSeconds: 0,
        };
      }

      const course = courses[event.courseId];

      if (event.timestamp.toDate() < course.firstAccess) {
        course.firstAccess = event.timestamp.toDate();
      }
      if (event.timestamp.toDate() > course.lastAccess) {
        course.lastAccess = event.timestamp.toDate();
      }

      // Track completed steps
      if (event.type === "step_complete" && !course.completedSteps.includes(event.stepId)) {
        course.completedSteps.push(event.stepId);
        course.totalTimeSeconds += event.data.durationSeconds;
      }

      // Track completed chapters
      if (
        event.type === "chapter_complete" &&
        !course.completedChapters.includes(event.chapterId)
      ) {
        course.completedChapters.push(event.chapterId);
      }

      // Track help requests
      if (event.type === "help_request") {
        course.totalHelpRequests++;
        course.averageHintLevel =
          (course.averageHintLevel * (course.totalHelpRequests - 1) + event.data.hintLevel) /
          course.totalHelpRequests;
      }
    }

    // Session end events track total learning time
    if (event.type === "session_end") {
      totalLearningTimeSeconds += event.data.durationSeconds;
    }
  }

  totalSessions = sessions.size;

  return {
    userId,
    courses,
    totalSessions,
    totalLearningTimeSeconds,
    lastActivity,
  };
}
