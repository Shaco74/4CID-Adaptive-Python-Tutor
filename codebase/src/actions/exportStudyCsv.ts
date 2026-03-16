"use server";

import { db } from "@/lib/firebase";
import { coursesData } from "@/courses/coursesData";
import { collection, getDocs } from "firebase/firestore";

type GroupLabel = "A" | "B";

interface ParticipantRow {
  participant_id: string;
  group: GroupLabel;
  num_course_tasks_solved: number;
  num_course_tasks_total: number;
  num_drills_attempted: number;
  num_drills_solved: number;
  drill_success_rate: number;
  total_time_minutes: number;
  num_runs_code: number;
  num_python_errors: number;
  num_progress_errors: number;
  num_help_requests: number;
  num_chat_messages: number;
  num_drill_selections_ai: number;
  bmi_tasks_solved: number;
  bmi_tasks_total: number;
  bmi_completion_rate: number;
  bmi_time_minutes: number;
  bmi_runs_code: number;
  bmi_python_errors: number;
  bmi_progress_errors: number;
  bmi_help_requests: number;
  bmi_avg_hint_level: number;
}

interface TaskLevelRow {
  participant_id: string;
  group: GroupLabel;
  course_id: string;
  step_number: number;
  step_started_at: string;
  step_completed_at: string;
  time_on_task_seconds: number;
  attempts_code_runs: number;
  python_errors: number;
  progress_errors: number;
  help_requests: number;
  avg_hint_level: number;
  solved: number;
}

interface GroupSummaryRow {
  group: GroupLabel;
  n: number;
  mean_bmi_tasks_solved: number;
  sd_bmi_tasks_solved: number;
  mean_bmi_completion_rate: number;
  sd_bmi_completion_rate: number;
  mean_bmi_time_minutes: number;
  sd_bmi_time_minutes: number;
  mean_bmi_python_errors: number;
  sd_bmi_python_errors: number;
  mean_bmi_progress_errors: number;
  sd_bmi_progress_errors: number;
  mean_bmi_help_requests: number;
  sd_bmi_help_requests: number;
}

interface ExportStudyCsvResult {
  files: { name: string; content: string }[];
  participantsCountUnfiltered: number;
  participantsCountFiltered: number;
  courseId: string;
}

interface EventTimelineRow {
  participant_id: string;
  group: GroupLabel;
  timestamp: string;
  event_type: string;
  session_id: string;
  course_id: string;
  step_number: number;
  success: number;
  duration_seconds: number;
  hint_level: number;
}

interface ChatMessageRow {
  participant_id: string;
  group: GroupLabel;
  timestamp: string;
  is_user: number;
  message_length: number;
  response_id: string;
}

interface DrillEventRow {
  participant_id: string;
  group: GroupLabel;
  timestamp: string;
  event_type: string;
  course_id: string;
  step_number: number;
  mcq_drill_id: string;
  code_drill_id: string;
  selected_drill_ids: string;
  reasoning?: string;
  confidence?: string;
}

interface EvaluationRow {
  participant_id: string;
  group: GroupLabel;
  timestamp: string;
  test_with_ai: number;
  used_ai_help: number;
  age_group: string;
  employment_status: string;
  is_it_field: string;
  programming_knowledge: number;
  mental_effort: number;
  frustration: number;
  nps_score: number;
  raw_data_json: string;
}

interface StepAggregate {
  participant_id: string;
  group: GroupLabel;
  course_id: string;
  step_number: number;
  startAt?: Date;
  completeAt?: Date;
  durationFromEventSeconds: number;
  attempts_code_runs: number;
  python_errors: number;
  progress_errors: number;
  help_requests: number;
  hintLevelSum: number;
  solved: boolean;
}

function toDate(value: any): Date | null {
  if (!value) return null;
  if (value?.toDate && typeof value.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function toIso(value: any): string {
  const date = toDate(value);
  return date ? date.toISOString() : "";
}

function getStepNumber(event: any): number | null {
  const direct = event?.data?.stepNumber;
  if (typeof direct === "number") return direct;

  const stepId = event?.stepId;
  if (typeof stepId === "string") {
    const parsed = Number.parseInt(stepId, 10);
    if (!Number.isNaN(parsed)) return parsed;
    const match = stepId.match(/(\d+)$/);
    if (match) {
      const fromSuffix = Number.parseInt(match[1], 10);
      if (!Number.isNaN(fromSuffix)) return fromSuffix;
    }
  }

  return null;
}

function safeNumber(value: any): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function isAdminUser(userDocId: string, userData: Record<string, any>): boolean {
  const normalizedDocId = String(userDocId ?? "").trim().toLowerCase();
  const normalizedUsername = String(userData?.username ?? "").trim().toLowerCase();
  const normalizedUserIdField = String(userData?.userId ?? "").trim().toLowerCase();

  return (
    normalizedDocId === "admin" ||
    normalizedUsername === "admin" ||
    normalizedUserIdField === "admin" ||
    userData?.isAdmin === true
  );
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((acc, cur) => acc + cur, 0) / values.length;
}

function sd(values: number[]): number {
  if (values.length <= 1) return 0;
  const avg = mean(values);
  const variance = values.reduce((acc, cur) => acc + (cur - avg) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function round(value: number, decimals: number = 4): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function csvEscape(value: string | number): string {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\n") || text.includes('"')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv<T extends object>(rows: T[], headers: (keyof T)[]): string {
  const lines: string[] = [];
  lines.push(headers.join(","));

  for (const row of rows) {
    const line = headers.map((header) => csvEscape((row[header] as string | number) ?? "")).join(",");
    lines.push(line);
  }

  return lines.join("\n");
}

function buildGroupSummaryRows(rows: ParticipantRow[]): GroupSummaryRow[] {
  const byGroup = new Map<GroupLabel, ParticipantRow[]>();
  for (const row of rows) {
    if (!byGroup.has(row.group)) byGroup.set(row.group, []);
    byGroup.get(row.group)!.push(row);
  }

  return (["A", "B"] as GroupLabel[]).map((group) => {
    const groupedRows = byGroup.get(group) ?? [];

    const bmiTasksSolved = groupedRows.map((r) => r.bmi_tasks_solved);
    const bmiCompletionRate = groupedRows.map((r) => r.bmi_completion_rate);
    const bmiTimeMinutes = groupedRows.map((r) => r.bmi_time_minutes);
    const bmiPythonErrors = groupedRows.map((r) => r.bmi_python_errors);
    const bmiProgressErrors = groupedRows.map((r) => r.bmi_progress_errors);
    const bmiHelpRequests = groupedRows.map((r) => r.bmi_help_requests);

    return {
      group,
      n: groupedRows.length,
      mean_bmi_tasks_solved: round(mean(bmiTasksSolved), 4),
      sd_bmi_tasks_solved: round(sd(bmiTasksSolved), 4),
      mean_bmi_completion_rate: round(mean(bmiCompletionRate), 4),
      sd_bmi_completion_rate: round(sd(bmiCompletionRate), 4),
      mean_bmi_time_minutes: round(mean(bmiTimeMinutes), 4),
      sd_bmi_time_minutes: round(sd(bmiTimeMinutes), 4),
      mean_bmi_python_errors: round(mean(bmiPythonErrors), 4),
      sd_bmi_python_errors: round(sd(bmiPythonErrors), 4),
      mean_bmi_progress_errors: round(mean(bmiProgressErrors), 4),
      sd_bmi_progress_errors: round(sd(bmiProgressErrors), 4),
      mean_bmi_help_requests: round(mean(bmiHelpRequests), 4),
      sd_bmi_help_requests: round(sd(bmiHelpRequests), 4),
    };
  });
}

function normalizeSelectedDrillIds(value: any): string {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "").trim()).filter(Boolean).join("|");
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function parseChatTimestampFromKey(key: string): Date | null {
  const raw = String(key ?? "").split("_")[0];
  const millis = Number.parseInt(raw, 10);
  if (!Number.isFinite(millis)) return null;
  const parsed = new Date(millis);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function exportStudyCsv(courseId: string = "bmi-calculator"): Promise<ExportStudyCsvResult> {
  const usersSnap = await getDocs(collection(db, "users"));

  const totalCourseTasks = coursesData.reduce((sum, course) => sum + course.steps, 0);
  const selectedCourse = coursesData.find((course) => course.id === courseId);
  const selectedCourseSteps = selectedCourse?.steps ?? 0;

  const participantRows: ParticipantRow[] = [];
  const taskLevelRows: TaskLevelRow[] = [];
  const eventTimelineRows: EventTimelineRow[] = [];
  const chatMessageRows: ChatMessageRow[] = [];
  const drillEventRows: DrillEventRow[] = [];
  const evaluationRows: EvaluationRow[] = [];

  for (const userDoc of usersSnap.docs) {
    const userId = userDoc.id;
    const userData = userDoc.data() as Record<string, any>;

    if (isAdminUser(userId, userData)) {
      continue;
    }

    const group: GroupLabel = userData?.aiChatTutorIsEnabled ? "B" : "A";

    const chatHistory = userData?.chatHistory as Record<string, any> | undefined;
    const userChatMessagesForBackfill: Date[] = [];

    if (chatHistory) {
      for (const [key, entry] of Object.entries(chatHistory) as [string, any][]) {
        const isUser = entry?.isUser === true;
        const ts = toDate(entry?.timestamp) ?? parseChatTimestampFromKey(key);

        chatMessageRows.push({
          participant_id: userId,
          group,
          timestamp: ts ? ts.toISOString() : "",
          is_user: isUser ? 1 : 0,
          message_length: String(entry?.message ?? "").length,
          response_id: String(entry?.responseId ?? ""),
        });

        if (isUser && ts) {
          userChatMessagesForBackfill.push(ts);
        }
      }
    }

    const numChatMessages = userChatMessagesForBackfill.length;

    const eventsSnap = await getDocs(collection(db, "users", userId, "events"));
    const events = eventsSnap.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      .sort((a: any, b: any) => {
        const ad = toDate(a.timestamp)?.getTime() ?? 0;
        const bd = toDate(b.timestamp)?.getTime() ?? 0;
        return ad - bd;
      });

    let totalTimeSeconds = 0;
    let totalStepTimeSeconds = 0;
    let totalRunsCode = 0;
    let totalPythonErrors = 0;
    let totalProgressErrors = 0;
    let totalHelpRequests = 0;
    let drillAttempts = 0;
    let drillSolved = 0;
    let aiDrillSelections = 0;

    let bmiTimeSeconds = 0;
    let bmiRunsCode = 0;
    let bmiPythonErrors = 0;
    let bmiProgressErrors = 0;
    let bmiHelpRequests = 0;
    let bmiHintLevelSum = 0;

    const solvedStepsAll = new Set<string>();
    const solvedStepsSelected = new Set<number>();

    const stepAggregates = new Map<string, StepAggregate>();
    const stepStartEvents: Array<{ course_id: string; step_number: number; started_at: Date }> = [];

    for (const event of events as any[]) {
      const eventType = event.type;
      const eventCourseId = event.courseId as string | undefined;
      const eventStep = getStepNumber(event);
      const eventTimestamp = toDate(event.timestamp);

      eventTimelineRows.push({
        participant_id: userId,
        group,
        timestamp: eventTimestamp ? eventTimestamp.toISOString() : "",
        event_type: String(eventType ?? ""),
        session_id: String(event?.sessionId ?? ""),
        course_id: String(eventCourseId ?? ""),
        step_number: typeof eventStep === "number" ? eventStep : 0,
        success: event?.data?.success === true ? 1 : 0,
        duration_seconds: safeNumber(event?.data?.durationSeconds),
        hint_level: safeNumber(event?.data?.hintLevel),
      });

      if (
        eventType === "drill_shown" ||
        eventType === "drill_attempt" ||
        eventType === "drill_session_completed" ||
        eventType === "ai_drill_selection"
      ) {
        drillEventRows.push({
          participant_id: userId,
          group,
          timestamp: eventTimestamp ? eventTimestamp.toISOString() : "",
          event_type: String(eventType ?? ""),
          course_id: String(eventCourseId ?? ""),
          step_number: typeof eventStep === "number" ? eventStep : 0,
          mcq_drill_id: String(event?.data?.mcqDrillId ?? ""),
          code_drill_id: String(event?.data?.codeDrillId ?? ""),
          selected_drill_ids: normalizeSelectedDrillIds(event?.data?.selectedDrillIds ?? event?.data?.drillIds),
          reasoning: eventType === "ai_drill_selection" ? String(event?.data?.reasoning ?? "") : "",
          confidence: eventType === "ai_drill_selection" ? String(event?.data?.confidence ?? "") : "",
        });
      }

      if (eventType === "evaluation_submitted") {
        evaluationRows.push({
          participant_id: userId,
          group,
          timestamp: eventTimestamp ? eventTimestamp.toISOString() : "",
          test_with_ai: event?.data?.testWithAI === true ? 1 : 0,
          used_ai_help: event?.data?.usedAIHelp === true ? 1 : 0,
          age_group: String(event?.data?.ageGroup ?? ""),
          employment_status: String(event?.data?.employmentStatus ?? ""),
          is_it_field: String(event?.data?.isITField ?? ""),
          programming_knowledge: safeNumber(event?.data?.programmingKnowledge),
          mental_effort: safeNumber(event?.data?.mentalEffort),
          frustration: safeNumber(event?.data?.frustration),
          nps_score: safeNumber(event?.data?.npsScore),
          raw_data_json: JSON.stringify(event?.data ?? {}),
        });
      }

      if (eventType === "session_end") {
        totalTimeSeconds += safeNumber(event?.data?.durationSeconds);
      }

      if (eventType === "step_complete") {
        const stepKeyAll = `${eventCourseId ?? "unknown"}::${eventStep ?? "unknown"}`;
        solvedStepsAll.add(stepKeyAll);

        const stepDurationSeconds = safeNumber(event?.data?.durationSeconds);
        totalStepTimeSeconds += stepDurationSeconds;

        if (eventCourseId === courseId && typeof eventStep === "number") {
          solvedStepsSelected.add(eventStep);
          bmiTimeSeconds += stepDurationSeconds;
        }
      }

      if (eventType === "code_execution") {
        totalRunsCode += 1;
        if (event?.data?.success === false) totalPythonErrors += 1;

        if (eventCourseId === courseId) {
          bmiRunsCode += 1;
          if (event?.data?.success === false) bmiPythonErrors += 1;
        }
      }

      if (eventType === "incorrect_solution") {
        totalProgressErrors += 1;
        if (eventCourseId === courseId) bmiProgressErrors += 1;
      }

      if (eventType === "help_request") {
        totalHelpRequests += 1;
        if (eventCourseId === courseId) {
          bmiHelpRequests += 1;
          bmiHintLevelSum += safeNumber(event?.data?.hintLevel);
        }
      }

      if (eventType === "drill_session_completed") {
        drillAttempts += 1;
        const mcqSuccess = event?.data?.mcqSuccess;
        const codeSuccess = event?.data?.codeSuccess;
        const legacySuccess = event?.data?.success;
        const solved = (mcqSuccess === true && codeSuccess === true) || legacySuccess === true;
        if (solved) drillSolved += 1;
      }

      if (eventType === "ai_drill_selection") {
        aiDrillSelections += 1;
      }

      if (!eventCourseId || typeof eventStep !== "number") {
        continue;
      }

      const aggregateKey = `${eventCourseId}::${eventStep}`;
      if (!stepAggregates.has(aggregateKey)) {
        stepAggregates.set(aggregateKey, {
          participant_id: userId,
          group,
          course_id: eventCourseId,
          step_number: eventStep,
          durationFromEventSeconds: 0,
          attempts_code_runs: 0,
          python_errors: 0,
          progress_errors: 0,
          help_requests: 0,
          hintLevelSum: 0,
          solved: false,
        });
      }

      const aggregate = stepAggregates.get(aggregateKey)!;

      if (eventType === "step_start" && eventTimestamp) {
        aggregate.startAt = eventTimestamp;
        stepStartEvents.push({
          course_id: eventCourseId,
          step_number: eventStep,
          started_at: eventTimestamp,
        });
      }

      if (eventType === "step_complete") {
        aggregate.solved = true;
        if (eventTimestamp) aggregate.completeAt = eventTimestamp;
        aggregate.durationFromEventSeconds += safeNumber(event?.data?.durationSeconds);
      }

      if (eventType === "code_execution") {
        aggregate.attempts_code_runs += 1;
        if (event?.data?.success === false) aggregate.python_errors += 1;
      }

      if (eventType === "incorrect_solution") {
        aggregate.progress_errors += 1;
      }

      if (eventType === "help_request") {
        aggregate.help_requests += 1;
        aggregate.hintLevelSum += safeNumber(event?.data?.hintLevel);
      }
    }

    const hasRealHelpEvents = totalHelpRequests > 0;
    if (!hasRealHelpEvents && userChatMessagesForBackfill.length > 0 && stepStartEvents.length > 0) {
      const sortedStarts = [...stepStartEvents].sort(
        (a, b) => a.started_at.getTime() - b.started_at.getTime()
      );

      const perStepRequestCounter = new Map<string, number>();

      for (const chatTs of userChatMessagesForBackfill) {
        let bestIndex = -1;
        for (let i = 0; i < sortedStarts.length; i++) {
          if (sortedStarts[i].started_at.getTime() <= chatTs.getTime()) {
            bestIndex = i;
          } else {
            break;
          }
        }

        if (bestIndex < 0) {
          continue;
        }

        const activeStep = sortedStarts[bestIndex];
        const stepKey = `${activeStep.course_id}::${activeStep.step_number}`;

        const currentCount = (perStepRequestCounter.get(stepKey) ?? 0) + 1;
        perStepRequestCounter.set(stepKey, currentCount);

        const syntheticHintLevel = Math.min(5, currentCount);

        totalHelpRequests += 1;
        if (activeStep.course_id === courseId) {
          bmiHelpRequests += 1;
          bmiHintLevelSum += syntheticHintLevel;
        }

        if (!stepAggregates.has(stepKey)) {
          stepAggregates.set(stepKey, {
            participant_id: userId,
            group,
            course_id: activeStep.course_id,
            step_number: activeStep.step_number,
            durationFromEventSeconds: 0,
            attempts_code_runs: 0,
            python_errors: 0,
            progress_errors: 0,
            help_requests: 0,
            hintLevelSum: 0,
            solved: false,
          });
        }

        const aggregate = stepAggregates.get(stepKey)!;
        aggregate.help_requests += 1;
        aggregate.hintLevelSum += syntheticHintLevel;
      }
    }

    const participantRow: ParticipantRow = {
      participant_id: userId,
      group,
      num_course_tasks_solved: solvedStepsAll.size,
      num_course_tasks_total: totalCourseTasks,
      num_drills_attempted: drillAttempts,
      num_drills_solved: drillSolved,
      drill_success_rate: drillAttempts > 0 ? round(drillSolved / drillAttempts) : 0,
      total_time_minutes: round(Math.max(totalTimeSeconds, totalStepTimeSeconds) / 60, 2),
      num_runs_code: totalRunsCode,
      num_python_errors: totalPythonErrors,
      num_progress_errors: totalProgressErrors,
      num_help_requests: totalHelpRequests,
      num_chat_messages: group === "B" ? numChatMessages : 0,
      num_drill_selections_ai: group === "B" ? aiDrillSelections : 0,
      bmi_tasks_solved: solvedStepsSelected.size,
      bmi_tasks_total: selectedCourseSteps,
      bmi_completion_rate: selectedCourseSteps > 0 ? round(solvedStepsSelected.size / selectedCourseSteps) : 0,
      bmi_time_minutes: round(bmiTimeSeconds / 60, 2),
      bmi_runs_code: bmiRunsCode,
      bmi_python_errors: bmiPythonErrors,
      bmi_progress_errors: bmiProgressErrors,
      bmi_help_requests: bmiHelpRequests,
      bmi_avg_hint_level: bmiHelpRequests > 0 ? round(bmiHintLevelSum / bmiHelpRequests, 2) : 0,
    };

    participantRows.push(participantRow);

    for (const aggregate of stepAggregates.values()) {
      const fallbackDuration =
        aggregate.startAt && aggregate.completeAt
          ? Math.max(0, Math.round((aggregate.completeAt.getTime() - aggregate.startAt.getTime()) / 1000))
          : 0;

      taskLevelRows.push({
        participant_id: aggregate.participant_id,
        group: aggregate.group,
        course_id: aggregate.course_id,
        step_number: aggregate.step_number,
        step_started_at: aggregate.startAt ? aggregate.startAt.toISOString() : "",
        step_completed_at: aggregate.completeAt ? aggregate.completeAt.toISOString() : "",
        time_on_task_seconds:
          aggregate.durationFromEventSeconds > 0 ? round(aggregate.durationFromEventSeconds, 2) : fallbackDuration,
        attempts_code_runs: aggregate.attempts_code_runs,
        python_errors: aggregate.python_errors,
        progress_errors: aggregate.progress_errors,
        help_requests: aggregate.help_requests,
        avg_hint_level:
          aggregate.help_requests > 0 ? round(aggregate.hintLevelSum / aggregate.help_requests, 2) : 0,
        solved: aggregate.solved ? 1 : 0,
      });
    }
  }

  const groupSummaryRowsUnfiltered = buildGroupSummaryRows(participantRows);

  const participantIdsFiltered = new Set(
    participantRows.filter((row) => row.num_runs_code > 2).map((row) => row.participant_id)
  );

  const participantRowsFiltered = participantRows.filter((row) => participantIdsFiltered.has(row.participant_id));
  const taskLevelRowsFiltered = taskLevelRows.filter((row) => participantIdsFiltered.has(row.participant_id));
  const eventTimelineRowsFiltered = eventTimelineRows.filter((row) => participantIdsFiltered.has(row.participant_id));
  const chatMessageRowsFiltered = chatMessageRows.filter((row) => participantIdsFiltered.has(row.participant_id));
  const drillEventRowsFiltered = drillEventRows.filter((row) => participantIdsFiltered.has(row.participant_id));
  const evaluationRowsFiltered = evaluationRows.filter((row) => participantIdsFiltered.has(row.participant_id));

  const groupSummaryRowsFiltered = buildGroupSummaryRows(participantRowsFiltered);

  const participantsCsvUnfiltered = toCsv(participantRows, [
    "participant_id",
    "group",
    "num_course_tasks_solved",
    "num_course_tasks_total",
    "num_drills_attempted",
    "num_drills_solved",
    "drill_success_rate",
    "total_time_minutes",
    "num_runs_code",
    "num_python_errors",
    "num_progress_errors",
    "num_help_requests",
    "num_chat_messages",
    "num_drill_selections_ai",
    "bmi_tasks_solved",
    "bmi_tasks_total",
    "bmi_completion_rate",
    "bmi_time_minutes",
    "bmi_runs_code",
    "bmi_python_errors",
    "bmi_progress_errors",
    "bmi_help_requests",
    "bmi_avg_hint_level",
  ]);

  const participantsCsvFiltered = toCsv(participantRowsFiltered, [
    "participant_id",
    "group",
    "num_course_tasks_solved",
    "num_course_tasks_total",
    "num_drills_attempted",
    "num_drills_solved",
    "drill_success_rate",
    "total_time_minutes",
    "num_runs_code",
    "num_python_errors",
    "num_progress_errors",
    "num_help_requests",
    "num_chat_messages",
    "num_drill_selections_ai",
    "bmi_tasks_solved",
    "bmi_tasks_total",
    "bmi_completion_rate",
    "bmi_time_minutes",
    "bmi_runs_code",
    "bmi_python_errors",
    "bmi_progress_errors",
    "bmi_help_requests",
    "bmi_avg_hint_level",
  ]);

  const taskLevelCsvUnfiltered = toCsv(taskLevelRows, [
    "participant_id",
    "group",
    "course_id",
    "step_number",
    "step_started_at",
    "step_completed_at",
    "time_on_task_seconds",
    "attempts_code_runs",
    "python_errors",
    "progress_errors",
    "help_requests",
    "avg_hint_level",
    "solved",
  ]);

  const taskLevelCsvFiltered = toCsv(taskLevelRowsFiltered, [
    "participant_id",
    "group",
    "course_id",
    "step_number",
    "step_started_at",
    "step_completed_at",
    "time_on_task_seconds",
    "attempts_code_runs",
    "python_errors",
    "progress_errors",
    "help_requests",
    "avg_hint_level",
    "solved",
  ]);

  const groupSummaryCsvUnfiltered = toCsv(groupSummaryRowsUnfiltered, [
    "group",
    "n",
    "mean_bmi_tasks_solved",
    "sd_bmi_tasks_solved",
    "mean_bmi_completion_rate",
    "sd_bmi_completion_rate",
    "mean_bmi_time_minutes",
    "sd_bmi_time_minutes",
    "mean_bmi_python_errors",
    "sd_bmi_python_errors",
    "mean_bmi_progress_errors",
    "sd_bmi_progress_errors",
    "mean_bmi_help_requests",
    "sd_bmi_help_requests",
  ]);

  const groupSummaryCsvFiltered = toCsv(groupSummaryRowsFiltered, [
    "group",
    "n",
    "mean_bmi_tasks_solved",
    "sd_bmi_tasks_solved",
    "mean_bmi_completion_rate",
    "sd_bmi_completion_rate",
    "mean_bmi_time_minutes",
    "sd_bmi_time_minutes",
    "mean_bmi_python_errors",
    "sd_bmi_python_errors",
    "mean_bmi_progress_errors",
    "sd_bmi_progress_errors",
    "mean_bmi_help_requests",
    "sd_bmi_help_requests",
  ]);

  const eventTimelineCsvUnfiltered = toCsv(eventTimelineRows, [
    "participant_id",
    "group",
    "timestamp",
    "event_type",
    "session_id",
    "course_id",
    "step_number",
    "success",
    "duration_seconds",
    "hint_level",
  ]);

  const eventTimelineCsvFiltered = toCsv(eventTimelineRowsFiltered, [
    "participant_id",
    "group",
    "timestamp",
    "event_type",
    "session_id",
    "course_id",
    "step_number",
    "success",
    "duration_seconds",
    "hint_level",
  ]);

  const chatMessagesCsvUnfiltered = toCsv(chatMessageRows, [
    "participant_id",
    "group",
    "timestamp",
    "is_user",
    "message_length",
    "response_id",
  ]);

  const chatMessagesCsvFiltered = toCsv(chatMessageRowsFiltered, [
    "participant_id",
    "group",
    "timestamp",
    "is_user",
    "message_length",
    "response_id",
  ]);

  const drillEventsCsvUnfiltered = toCsv(drillEventRows, [
    "participant_id",
    "group",
    "timestamp",
    "event_type",
    "course_id",
    "step_number",
    "mcq_drill_id",
    "code_drill_id",
    "selected_drill_ids",
    "reasoning",
    "confidence",
  ]);

  const drillEventsCsvFiltered = toCsv(drillEventRowsFiltered, [
    "participant_id",
    "group",
    "timestamp",
    "event_type",
    "course_id",
    "step_number",
    "mcq_drill_id",
    "code_drill_id",
    "selected_drill_ids",
    "reasoning",
    "confidence",
  ]);

  const evaluationsCsvUnfiltered = toCsv(evaluationRows, [
    "participant_id",
    "group",
    "timestamp",
    "test_with_ai",
    "used_ai_help",
    "age_group",
    "employment_status",
    "is_it_field",
    "programming_knowledge",
    "mental_effort",
    "frustration",
    "nps_score",
    "raw_data_json",
  ]);

  const evaluationsCsvFiltered = toCsv(evaluationRowsFiltered, [
    "participant_id",
    "group",
    "timestamp",
    "test_with_ai",
    "used_ai_help",
    "age_group",
    "employment_status",
    "is_it_field",
    "programming_knowledge",
    "mental_effort",
    "frustration",
    "nps_score",
    "raw_data_json",
  ]);

  return {
    files: [
      { name: "study_participants-unfiltered.csv", content: participantsCsvUnfiltered },
      { name: "study_task_level-unfiltered.csv", content: taskLevelCsvUnfiltered },
      { name: "study_group_summary-unfiltered.csv", content: groupSummaryCsvUnfiltered },
      { name: "study_event_timeline-unfiltered.csv", content: eventTimelineCsvUnfiltered },
      { name: "study_chat_messages-unfiltered.csv", content: chatMessagesCsvUnfiltered },
      { name: "study_drill_events-unfiltered.csv", content: drillEventsCsvUnfiltered },
      { name: "study_evaluations-unfiltered.csv", content: evaluationsCsvUnfiltered },
      { name: "study_participants-filtered.csv", content: participantsCsvFiltered },
      { name: "study_task_level-filtered.csv", content: taskLevelCsvFiltered },
      { name: "study_group_summary-filtered.csv", content: groupSummaryCsvFiltered },
      { name: "study_event_timeline-filtered.csv", content: eventTimelineCsvFiltered },
      { name: "study_chat_messages-filtered.csv", content: chatMessagesCsvFiltered },
      { name: "study_drill_events-filtered.csv", content: drillEventsCsvFiltered },
      { name: "study_evaluations-filtered.csv", content: evaluationsCsvFiltered },
      { name: "study_participants.csv", content: participantsCsvFiltered },
      { name: "study_task_level.csv", content: taskLevelCsvFiltered },
      { name: "study_group_summary.csv", content: groupSummaryCsvFiltered },
    ],
    participantsCountUnfiltered: participantRows.length,
    participantsCountFiltered: participantRowsFiltered.length,
    courseId,
  };
}
