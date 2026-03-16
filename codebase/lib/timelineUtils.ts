/**
 * Timeline Utilities
 *
 * Helper-Funktionen für die Enhanced Timeline:
 * - Zeitdelta-Berechnung zwischen Events
 * - Pausen-Erkennung
 * - Formatierung
 */

import type { TimelineEvent } from "@/actions/getUserMetrics";

// ============================================================================
// TYPES
// ============================================================================

export interface EnrichedTimelineEvent extends TimelineEvent {
  deltaMs: number | null;     // Zeit seit vorherigem Event (ms)
  deltaFormatted: string;     // Formatierte Zeit ("⏱️ +25s")
  isPause: boolean;           // Ist eine Pause (>2min)
  pauseFormatted: string;     // Formatierte Pause ("⏸️ 5 min Pause")
}

export interface TimelineSummary {
  totalDuration: number;        // Gesamtdauer in Sekunden
  totalDurationFormatted: string;
  totalEvents: number;
  firstEvent: Date | null;
  lastEvent: Date | null;
  stepsCompleted: number;
  helpRequests: number;
  codeExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  avgHintLevel: number;
  stepRange: { from: number | null; to: number | null };
  browser: string;
  screenResolution: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PAUSE_THRESHOLD_MS = 2 * 60 * 1000; // 2 Minuten

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Berechnet die Zeit zwischen zwei Timestamps in Millisekunden
 */
export function calculateTimeDelta(prevTimestamp: string, currentTimestamp: string): number {
  const prev = new Date(prevTimestamp).getTime();
  const current = new Date(currentTimestamp).getTime();
  return current - prev;
}

/**
 * Prüft ob ein Zeitdelta als Pause gilt (>2min)
 */
export function isPause(deltaMs: number): boolean {
  return deltaMs > PAUSE_THRESHOLD_MS;
}

/**
 * Formatiert ein Zeitdelta in lesbares Format
 * @returns z.B. "+25s", "+2m 15s", "+1h 5m"
 */
export function formatTimeDelta(deltaMs: number): string {
  if (deltaMs < 0) return "";

  const seconds = Math.floor(deltaMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `+${hours}h ${remainingMinutes}m`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    if (remainingSeconds > 0) {
      return `+${minutes}m ${remainingSeconds}s`;
    }
    return `+${minutes}m`;
  }

  return `+${seconds}s`;
}

/**
 * Formatiert eine Pause-Dauer
 * @returns z.B. "⏸️ 5 min Pause"
 */
export function formatPause(deltaMs: number): string {
  const minutes = Math.floor(deltaMs / 1000 / 60);

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes > 0) {
      return `⏸️ ${hours}h ${remainingMinutes}min Pause`;
    }
    return `⏸️ ${hours}h Pause`;
  }

  return `⏸️ ${minutes} min Pause`;
}

/**
 * Formatiert eine Dauer in Sekunden
 * @returns z.B. "1h 23m", "45m", "30s"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    if (remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${hours}h`;
  }

  return `${minutes}m`;
}

/**
 * Formatiert einen Timestamp als Uhrzeit
 * @returns z.B. "14:30:00"
 */
export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Formatiert einen Timestamp als Datum + Uhrzeit
 * @returns z.B. "26. Nov, 14:30"
 */
export function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString("de-DE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Reichert Events mit Zeitdeltas und Pausen-Information an
 * Sortiert chronologisch (älteste zuerst)
 */
export function enrichEventsWithDeltas(events: TimelineEvent[]): EnrichedTimelineEvent[] {
  // Sortiere chronologisch (älteste zuerst für natürlichen Flow)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return sortedEvents.map((event, index) => {
    if (index === 0) {
      return {
        ...event,
        deltaMs: null,
        deltaFormatted: "",
        isPause: false,
        pauseFormatted: "",
      };
    }

    const prevEvent = sortedEvents[index - 1];
    const deltaMs = calculateTimeDelta(prevEvent.timestamp, event.timestamp);
    const isEventPause = isPause(deltaMs);

    return {
      ...event,
      deltaMs,
      deltaFormatted: formatTimeDelta(deltaMs),
      isPause: isEventPause,
      pauseFormatted: isEventPause ? formatPause(deltaMs) : "",
    };
  });
}

/**
 * Berechnet Summary-Statistiken aus Events
 */
export function calculateTimelineSummary(events: TimelineEvent[]): TimelineSummary {
  if (events.length === 0) {
    return {
      totalDuration: 0,
      totalDurationFormatted: "0s",
      totalEvents: 0,
      firstEvent: null,
      lastEvent: null,
      stepsCompleted: 0,
      helpRequests: 0,
      codeExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      avgHintLevel: 0,
      stepRange: { from: null, to: null },
      browser: "Unbekannt",
      screenResolution: "Unbekannt",
    };
  }

  // Sortiere für Zeitberechnung
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const firstEvent = new Date(sortedEvents[0].timestamp);
  const lastEvent = new Date(sortedEvents[sortedEvents.length - 1].timestamp);
  const totalDuration = Math.floor((lastEvent.getTime() - firstEvent.getTime()) / 1000);

  // Zähle Events
  let stepsCompleted = 0;
  let helpRequests = 0;
  let codeExecutions = 0;
  let successfulExecutions = 0;
  let failedExecutions = 0;
  let totalHintLevel = 0;
  let browser = "Unbekannt";
  let screenResolution = "Unbekannt";
  const completedStepNumbers: number[] = [];

  for (const event of events) {
    switch (event.type) {
      case "step_complete":
        stepsCompleted++;
        if (event.step !== undefined) {
          completedStepNumbers.push(event.step);
        }
        break;

      case "help_request":
        helpRequests++;
        if (event.data?.hintLevel) {
          totalHintLevel += event.data.hintLevel;
        }
        break;

      case "code_execution":
        codeExecutions++;
        if (event.data?.success) {
          successfulExecutions++;
        } else {
          failedExecutions++;
        }
        break;

      case "session_start":
        if (event.data?.userAgent) {
          browser = extractBrowser(event.data.userAgent);
        }
        if (event.data?.screenResolution) {
          screenResolution = event.data.screenResolution;
        }
        break;
    }
  }

  const avgHintLevel = helpRequests > 0 ? totalHintLevel / helpRequests : 0;
  const sortedSteps = completedStepNumbers.sort((a, b) => a - b);

  return {
    totalDuration,
    totalDurationFormatted: formatDuration(totalDuration),
    totalEvents: events.length,
    firstEvent,
    lastEvent,
    stepsCompleted,
    helpRequests,
    codeExecutions,
    successfulExecutions,
    failedExecutions,
    avgHintLevel,
    stepRange: {
      from: sortedSteps.length > 0 ? sortedSteps[0] : null,
      to: sortedSteps.length > 0 ? sortedSteps[sortedSteps.length - 1] : null,
    },
    browser,
    screenResolution,
  };
}

/**
 * Extrahiert den Browser-Namen aus User-Agent
 */
function extractBrowser(userAgent: string): string {
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    const match = userAgent.match(/Chrome\/(\d+)/);
    return match ? `Chrome ${match[1]}` : "Chrome";
  }
  if (userAgent.includes("Firefox")) {
    const match = userAgent.match(/Firefox\/(\d+)/);
    return match ? `Firefox ${match[1]}` : "Firefox";
  }
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    return "Safari";
  }
  if (userAgent.includes("Edg")) {
    const match = userAgent.match(/Edg\/(\d+)/);
    return match ? `Edge ${match[1]}` : "Edge";
  }
  return "Browser";
}

// ============================================================================
// EVENT DISPLAY HELPERS
// ============================================================================

export type EventColor = "blue" | "green" | "cyan" | "purple" | "orange" | "yellow" | "teal" | "gray" | "red" | "pink";

/**
 * Gibt die Farbe für einen Event-Typ zurück
 */
export function getEventColor(type: TimelineEvent["type"]): EventColor {
  switch (type) {
    case "help_request":
      return "blue";
    case "step_complete":
      return "green";
    case "course_complete":
      return "green";
    case "step_start":
      return "cyan";
    case "course_access":
      return "purple";
    case "code_execution":
      return "orange";
    case "note_added":
      return "yellow";
    case "session_start":
      return "teal";
    case "session_end":
      return "gray";
    case "drill_attempt":
    case "drill_shown":
      return "teal";
    case "drill_mcq_completed":
    case "drill_code_completed":
    case "drill_session_completed":
      return "green";
    case "onboarding_start":
    case "onboarding_complete":
      return "purple";
    case "chapter_start":
    case "chapter_complete":
      return "cyan";
    // Learning Profile Events
    case "learning_profile_initialized":
      return "purple";
    case "performance_score_update":
      return "blue";
    case "error_entry_added":
      return "red";
    case "topic_weight_change":
      return "orange";
    case "topic_introduced":
      return "cyan";
    case "incorrect_solution":
      return "red";
    // Step Snapshot
    case "step_snapshot":
      return "purple";
    // AI Events
    case "ai_drill_selection":
      return "pink";
    default:
      return "gray";
  }
}

/**
 * Gibt das deutsche Label für einen Event-Typ zurück
 */
export function getEventLabel(type: TimelineEvent["type"]): string {
  switch (type) {
    case "help_request":
      return "Hilfe angefragt";
    case "step_complete":
      return "Step abgeschlossen";
    case "course_complete":
      return "Kurs abgeschlossen";
    case "step_start":
      return "Step gestartet";
    case "course_access":
      return "Kurs geöffnet";
    case "code_execution":
      return "Code ausgeführt";
    case "note_added":
      return "Notiz hinzugefügt";
    case "session_start":
      return "Session gestartet";
    case "session_end":
      return "Session beendet";
    case "drill_attempt":
      return "Drill-Versuch";
    case "drill_shown":
      return "Drill angezeigt";
    case "drill_mcq_completed":
      return "MCQ abgeschlossen";
    case "drill_code_completed":
      return "Code-Task abgeschlossen";
    case "drill_session_completed":
      return "Drill-Session abgeschlossen";
    case "onboarding_start":
      return "Onboarding gestartet";
    case "onboarding_complete":
      return "Onboarding abgeschlossen";
    case "chapter_start":
      return "Kapitel gestartet";
    case "chapter_complete":
      return "Kapitel abgeschlossen";
    // Learning Profile Events
    case "learning_profile_initialized":
      return "Lernprofil erstellt";
    case "performance_score_update":
      return "Score-Update";
    case "error_entry_added":
      return "Fehler erfasst";
    case "topic_weight_change":
      return "Topic-Gewicht geändert";
    case "topic_introduced":
      return "Topic eingeführt";
    case "incorrect_solution":
      return "Falsche Lösung";
    // Step Snapshot
    case "step_snapshot":
      return "Lernprofil-Snapshot";
    // AI Events
    case "ai_drill_selection":
      return "KI-Drill-Auswahl";
    default:
      return type;
  }
}
