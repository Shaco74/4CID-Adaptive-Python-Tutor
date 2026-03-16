/**
 * Event-Sourcing System für Research-Datenerhebung
 *
 * Alle User-Aktionen werden als atomare Events in einer zentralen Collection gespeichert.
 * Derived State (wie completedSteps, progress) wird aus Events berechnet.
 */

import { Timestamp } from "firebase/firestore";

// ============================================================================
// BASE EVENT TYPE
// ============================================================================

export interface BaseEvent {
  id: string;
  userId: string;
  timestamp: Timestamp;
  sessionId: string; // Gruppiert Events einer Lernsession
  type: EventType;
}

export type EventType =
  | "session_start"
  | "session_end"
  | "onboarding_start"
  | "onboarding_complete"
  | "course_access"
  | "course_complete"  // NEW: When user finishes all steps of a course
  | "chapter_start"
  | "chapter_complete"
  | "step_start"
  | "step_complete"
  | "step_snapshot"  // NEW: Learning profile snapshot at step start/end
  | "help_request"
  | "note_added"
  | "code_execution"
  | "drill_attempt"
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
  | "ai_drill_selection"
  // Evaluation Event
  | "evaluation_submitted";

// ============================================================================
// SESSION EVENTS - Tracking von Login/Logout und Session-Dauer
// ============================================================================

export interface SessionStartEvent extends BaseEvent {
  type: "session_start";
  data: {
    userAgent: string;
    referrer?: string; // Only present if available
    screenResolution?: string; // Only present in browser context
  };
}

export interface SessionEndEvent extends BaseEvent {
  type: "session_end";
  data: {
    durationSeconds: number;
    eventsInSession: number;
  };
}

// ============================================================================
// ONBOARDING EVENTS - Tracking von Onboarding-Prozess
// ============================================================================

export interface OnboardingStartEvent extends BaseEvent {
  type: "onboarding_start";
  data: {
    isFirstTime: boolean;
  };
}

export interface OnboardingCompleteEvent extends BaseEvent {
  type: "onboarding_complete";
  data: {
    durationSeconds: number;
  };
}

// ============================================================================
// COURSE NAVIGATION EVENTS
// ============================================================================

export interface CourseAccessEvent extends BaseEvent {
  type: "course_access";
  courseId: string;
  data: {
    isFirstAccess: boolean;
    previousProgress?: number; // 0-100%
  };
}

export interface CourseCompleteEvent extends BaseEvent {
  type: "course_complete";
  courseId: string;
  data: {
    totalSteps: number;
    totalDurationSeconds: number;
    totalHelpRequests: number;
    averageHintLevel: number;
  };
}

export interface ChapterStartEvent extends BaseEvent {
  type: "chapter_start";
  courseId: string;
  chapterId: string;
  data: {
    chapterTitle: string;
    stepCount: number;
  };
}

export interface ChapterCompleteEvent extends BaseEvent {
  type: "chapter_complete";
  courseId: string;
  chapterId: string;
  data: {
    durationSeconds: number;
    totalHelpRequests: number;
    averageHintLevel: number;
  };
}

// ============================================================================
// STEP EVENTS - Granulares Tracking von Lernfortschritt
// ============================================================================

export interface StepStartEvent extends BaseEvent {
  type: "step_start";
  courseId: string;
  stepId: string;
  data: {
    stepNumber: number;
    stepTitle: string;
    isRetry: boolean; // Falls User Step wiederholt
  };
}

export interface StepCompleteEvent extends BaseEvent {
  type: "step_complete";
  courseId: string;
  stepId: string;
  data: {
    stepNumber: number;
    durationSeconds: number;
    totalHelpRequests: number;
    averageHintLevel: number;
    codeExecutions: number;
    finalCode: string;
    isRetry: boolean; // Falls User Step wiederholt
  };
}

/**
 * Step Snapshot Event - Captures learning profile state at step boundaries
 * Enables analysis of topic weight and performance score changes per step
 */
export interface StepSnapshotEvent extends BaseEvent {
  type: "step_snapshot";
  courseId: string;
  stepId: string;
  data: {
    stepNumber: number;
    snapshotType: "start" | "end";  // When the snapshot was taken
    performanceScore: number;        // Current performance score (0-100)
    topicWeights: Record<string, number>;  // All topic weights at this moment
    errorCount: number;              // Total errors in errorHistory
    recentTopics: string[];          // Topics covered in last few steps
  };
}

// ============================================================================
// HELP REQUEST EVENTS - KI-Unterstützung
// ============================================================================

export interface HelpRequestEvent extends BaseEvent {
  type: "help_request";
  courseId: string;
  stepId: string;
  data: {
    stepNumber: number;
    requestNumber: number; // N-te Request in diesem Step
    hintLevel: number;
    userMessage: string;
    aiResponse: string;
    aiResponseId: string; // OpenAI Response ID für Auswertung
    tokenCount?: number;
  };
}

// ============================================================================
// NOTE EVENTS - Lernnotizen
// ============================================================================

export interface NoteAddedEvent extends BaseEvent {
  type: "note_added";
  courseId?: string;
  stepId?: string;
  data: {
    note: string;
    noteLength: number;
  };
}

// ============================================================================
// CODE EXECUTION EVENTS - Detailliertes Tracking von Code-Versuchen
// ============================================================================

export interface CodeExecutionEvent extends BaseEvent {
  type: "code_execution";
  courseId: string;
  stepId: string;
  data: {
    stepNumber: number;
    code: string;
    success: boolean;
    errorMessage?: string;
    executionTimeMs?: number;
  };
}

// ============================================================================
// DRILL EVENTS - Part-Task Practice Tracking
// ============================================================================

export interface DrillAttemptEvent extends BaseEvent {
  type: "drill_attempt";
  drillId: string;
  data: {
    drillTitle: string;
    questionType: "mc" | "code" | "spot-error" | "predict-output" | "fill-blank";
    questionIndex: number;
    correct: boolean;
    attemptNumber: number; // Wie oft wurde diese Frage versucht
    timeToAnswerSeconds: number;
    userAnswer: string;
  };
}

export interface DrillShownEvent extends BaseEvent {
  type: "drill_shown";
  courseId?: string;
  data: {
    step?: number;
    topics?: string[];
    userGroup?: "A" | "B";
    difficultyRecommended?: string;
    // Full drill IDs for analysis (optional for legacy compat)
    mcqDrillId?: string;           // e.g., "mcq_print_003"
    codeDrillId?: string;          // e.g., "code_print_002"
    mcqTopic?: string;             // Topic of MCQ drill
    codeTopic?: string;            // Topic of code drill
    [key: string]: any;            // Legacy compatibility
  };
}

export interface DrillMCQCompletedEvent extends BaseEvent {
  type: "drill_mcq_completed";
  courseId?: string;
  data: {
    step?: number;
    topics?: string[];
    userGroup?: "A" | "B";
    // Full drill identification (optional for legacy compat)
    mcqDrillId?: string;           // e.g., "mcq_print_003"
    mcqTopic?: string;
    mcqType?: "multiple-choice" | "spot-the-error" | "predict-output" | "fill-the-blank";
    mcqAttempts?: number;
    success?: boolean;
    timeToAnswerMs?: number;
    [key: string]: any;            // Legacy compatibility
  };
}

export interface DrillCodeCompletedEvent extends BaseEvent {
  type: "drill_code_completed";
  courseId?: string;
  data: {
    step?: number;
    topics?: string[];
    userGroup?: "A" | "B";
    // Full drill identification (optional for legacy compat)
    codeDrillId?: string;          // e.g., "code_print_002"
    codeTopic?: string;
    codeAttempts?: number;
    success?: boolean;
    timeToCompleteMs?: number;
    finalCode?: string;
    [key: string]: any;            // Legacy compatibility
  };
}

export interface DrillSessionCompletedEvent extends BaseEvent {
  type: "drill_session_completed";
  courseId?: string;
  data: {
    step?: number;
    topics?: string[];
    userGroup?: "A" | "B";
    difficultyRecommended?: string;
    // Full drill IDs (optional for legacy compat)
    mcqDrillId?: string;
    codeDrillId?: string;
    mcqTopic?: string;
    codeTopic?: string;
    // Results
    mcqAttempts?: number;
    codeAttempts?: number;
    mcqSuccess?: boolean;
    codeSuccess?: boolean;
    totalTimeMs?: number;
    // Learning profile delta (for research)
    performanceScoreBefore?: number;
    performanceScoreAfter?: number;
    [key: string]: any;            // Legacy compatibility
  };
}

// ============================================================================
// LEARNING PROFILE EVENTS - Adaptive Lernfortschritt-Tracking
// ============================================================================

export interface LearningProfileInitializedEvent extends BaseEvent {
  type: "learning_profile_initialized";
  data: {
    performanceScore: number;
  };
}

export interface PerformanceScoreUpdateEvent extends BaseEvent {
  type: "performance_score_update";
  data: {
    oldScore: number;
    newScore: number;
    delta: number;
    reason?: string;
  };
}

export interface ErrorEntryAddedEvent extends BaseEvent {
  type: "error_entry_added";
  courseId?: string;
  stepId?: string;
  data: {
    errorType: string;
    topic: string;
    errorMessage: string;
    code?: string;
  };
}

export interface TopicWeightChangeEvent extends BaseEvent {
  type: "topic_weight_change";
  data: {
    topic: string;
    oldWeight: number;
    newWeight: number;
    reason: "correct" | "error" | "incorrect";
  };
}

export interface TopicIntroducedEvent extends BaseEvent {
  type: "topic_introduced";
  data: {
    topic: string;
    initialWeight: number;
  };
}

export interface IncorrectSolutionEvent extends BaseEvent {
  type: "incorrect_solution";
  courseId?: string;
  stepId?: string;
  data: {
    topic: string;
    performanceDelta: number;
    topicWeightDelta: number;
    oldPerformanceScore?: number;
    newPerformanceScore?: number;
    oldTopicWeight?: number;
    newTopicWeight?: number;
  };
}

// ============================================================================
// AI DRILL SELECTION EVENTS - KI-gesteuerte Übungsauswahl
// ============================================================================

export interface AIDrillSelectionEvent extends BaseEvent {
  type: "ai_drill_selection";
  courseId?: string;
  data: {
    step: number;
    topics: string[];
    userGroup: "A" | "B";
    // AI Selection Results
    selectedMcqId: string;
    selectedCodeId: string;
    reasoning: string;
    confidence: "high" | "medium" | "low";
    alternativeMcqIds?: string[];
    alternativeCodeIds?: string[];
    // User Profile Context
    performanceScore: number;
    topicWeights: Record<string, number>;
    recentErrorCount: number;
    // Metadata
    responseTimeMs: number;
    tokensUsed?: number;
    aiResponseId?: string;
  };
}

// ============================================================================
// EVALUATION EVENT - Abschließender Fragebogen
// ============================================================================

export interface EvaluationSubmittedEvent extends BaseEvent {
  type: "evaluation_submitted";
  data: {
    // Group Assignment
    aiGroupEnabled: boolean;
    // Demographics
    ageGroup: string | null;
    employmentStatus: string;
    isITField: string;
    programmingKnowledge: number | null;
    // Self-Efficacy (Likert 1-7)
    selfEfficacy: Record<string, number>;
    // Cognitive Load
    mentalEffort: number; // 1-9
    frustration: number; // 0-100
    // SUS (Likert 1-5)
    susValues: Record<string, number>;
    // UEQ-S (Semantic Differential)
    ueqValues: Record<string, number>;
    // AI-specific (conditional)
    aiUsefulness?: Record<string, number>;
    aiTrust?: Record<string, number>;
    // NPS & Open Feedback
    npsScore: number | null;
    openFeedback: string;
  };
}

// ============================================================================
// UNION TYPE - Alle Events
// ============================================================================

export type UserEvent =
  | SessionStartEvent
  | SessionEndEvent
  | OnboardingStartEvent
  | OnboardingCompleteEvent
  | CourseAccessEvent
  | CourseCompleteEvent  // NEW
  | ChapterStartEvent
  | ChapterCompleteEvent
  | StepStartEvent
  | StepCompleteEvent
  | StepSnapshotEvent
  | HelpRequestEvent
  | NoteAddedEvent
  | CodeExecutionEvent
  | DrillAttemptEvent
  | DrillShownEvent
  | DrillMCQCompletedEvent
  | DrillCodeCompletedEvent
  | DrillSessionCompletedEvent
  // Learning Profile Events
  | LearningProfileInitializedEvent
  | PerformanceScoreUpdateEvent
  | ErrorEntryAddedEvent
  | TopicWeightChangeEvent
  | TopicIntroducedEvent
  | IncorrectSolutionEvent
  // AI Drill Selection Events
  | AIDrillSelectionEvent
  // Evaluation Event
  | EvaluationSubmittedEvent;

// ============================================================================
// SERIALIZED TYPES - Für Client Components (Timestamps -> ISO Strings)
// ============================================================================

export type SerializedEvent = Omit<UserEvent, "timestamp"> & {
  timestamp: string; // ISO string
};

// ============================================================================
// QUERY HELPERS - Für häufige Analytics-Abfragen
// ============================================================================

export interface EventQuery {
  userId: string;
  sessionId?: string;
  courseId?: string;
  stepId?: string;
  type?: EventType | EventType[];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

// ============================================================================
// DERIVED STATE - Wird aus Events berechnet
// ============================================================================

export interface UserProgress {
  userId: string;
  courses: {
    [courseId: string]: {
      firstAccess: Date;
      lastAccess: Date;
      completedSteps: string[]; // Computed from step_complete events
      completedChapters: string[]; // Computed from chapter_complete events
      totalHelpRequests: number;
      averageHintLevel: number;
      totalTimeSeconds: number;
    };
  };
  totalSessions: number;
  totalLearningTimeSeconds: number;
  lastActivity: Date;
}
