"use client";
/**
 * DrillModalV2 - Container für Part-Task Practice Drills (verbesserte UX)
 *
 * Zeigt 2 Tasks nacheinander an:
 * 1. MCQ Task (Konzeptverständnis)
 * 2. Code Task (Praktische Anwendung)
 *
 * V2 Änderungen:
 * - Modal kann durch Klicken außerhalb geschlossen werden
 * - User kann Modal wieder öffnen und dort weitermachen wo er war
 * - Drill-Session bleibt erhalten (gleicher Drill, gleicher Fortschritt)
 * - Topics werden nicht mehr angezeigt
 * - Modal ist 20% größer
 */

import { useState } from "react";
import {
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogBackdrop,
  DialogCloseTrigger,
} from "@/components/ui/dialog";
import { ProgressBar, ProgressRoot } from "@/components/ui/progress";
import { Check, Trophy } from "lucide-react";
import { DrillMCQuestionV2 } from "./DrillMCQuestionV2";
import { DrillCodeTaskV2 } from "./DrillCodeTaskV2";
import type { DrillSession, TaskResult } from "@/types/courseTypes";
import { saveDrillSession, markDrillCompleted } from "../../lib/firebase/drillTracking";
import {
  logDrillAttempt,
  logDrillShown,
  logDrillMCQCompleted,
  logDrillCodeCompleted,
  logDrillSessionCompleted
} from "@/db/eventTracking";
import { generateDrillIds } from "@/utils/drillSelection";
import { processCorrect } from "../../lib/firebase/learningProfileTracking";

// Map MCQ types to event tracking types
type MCQType = "multiple-choice" | "spot-the-error" | "predict-output" | "fill-the-blank";
type EventTrackingType = "mc" | "code" | "spot-error" | "predict-output" | "fill-blank";

function mapQuestionType(mcqType: MCQType): EventTrackingType {
  const typeMap: Record<MCQType, EventTrackingType> = {
    "multiple-choice": "mc",
    "spot-the-error": "spot-error",
    "predict-output": "predict-output",
    "fill-the-blank": "fill-blank",
  };
  return typeMap[mcqType] || "mc";
}

interface DrillModalV2Props {
  session: DrillSession | null;  // null während Loading
  userId: string;
  courseId: string;  // NEU: Für besseres Event-Tracking
  isOpen: boolean;
  isLoading?: boolean;  // Zeigt Skeleton während AI Drills auswählt
  onClose: () => void;  // Schließt Modal temporär (kann wieder geöffnet werden)
  onComplete: () => void;  // Drill vollständig abgeschlossen
  // Persistierter State vom Parent (damit er beim Schließen/Öffnen erhalten bleibt)
  currentTask: 1 | 2;
  setCurrentTask: (task: 1 | 2) => void;
  mcqResult: TaskResult | null;
  setMcqResult: (result: TaskResult | null) => void;
  codeResult: TaskResult | null;
  setCodeResult: (result: TaskResult | null) => void;
}

export function DrillModalV2({
  session,
  userId,
  courseId,
  isOpen,
  isLoading = false,
  onClose,
  onComplete,
  currentTask,
  setCurrentTask,
  mcqResult,
  setMcqResult,
  codeResult,
  setCodeResult,
}: DrillModalV2Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drillStartTime] = useState<number>(Date.now());  // Track drill session start
  const [mcqStartTime, setMcqStartTime] = useState<number>(Date.now());
  const [codeStartTime, setCodeStartTime] = useState<number>(Date.now());
  const t = useTranslations("drill.modal");

  const isComplete = mcqResult?.correct && codeResult?.correct;
  const progress = ((currentTask - 1) / 2) * 100 + (currentTask === 2 && codeResult?.correct ? 50 : 0);

  // Log Drill Shown Event (einmalig beim ersten Öffnen, nur wenn session vorhanden)
  useState(() => {
    if (session) {
      // NEU: Verwende spezifische Logging-Funktion mit vollen Drill-IDs
      logDrillShown(
        userId,
        courseId,
        session.triggerStep,
        session.topics,
        session.userGroup,
        session.tasks.mcq.id || `mcq_${session.topics[0]}_unknown`,
        session.tasks.codeTask.id || `code_${session.topics[0]}_unknown`,
        session.topics[0] || "unknown",  // MCQ topic (primary)
        session.topics[0] || "unknown",  // Code topic (primary)
        session.difficultyRecommendation?.recommended
      );
    }
  });

  const handleMCQComplete = (result: TaskResult) => {
    setMcqResult(result);
    const timeToAnswerMs = Date.now() - mcqStartTime;

    // Log MCQ Completed with full drill ID
    if (session) {
      logDrillMCQCompleted(
        userId,
        courseId,
        session.triggerStep,
        session.topics,
        session.userGroup,
        session.tasks.mcq.id || `mcq_${session.topics[0]}_unknown`,
        session.topics[0] || "unknown",
        (session.tasks.mcq.type || "multiple-choice") as "multiple-choice" | "spot-the-error" | "predict-output" | "fill-the-blank",
        result.attempts,
        result.correct,
        timeToAnswerMs
      );
    }

    // Reset code start time when moving to code task
    setCodeStartTime(Date.now());

    // V2: KEINE automatische Navigation - User klickt selbst auf "Weiter zur Code-Aufgabe"
  };

  const handleCodeComplete = (result: TaskResult, finalCode?: string) => {
    setCodeResult(result);
    const timeToCompleteMs = Date.now() - codeStartTime;

    // Log Code Completed with full drill ID
    if (session) {
      logDrillCodeCompleted(
        userId,
        courseId,
        session.triggerStep,
        session.topics,
        session.userGroup,
        session.tasks.codeTask.id || `code_${session.topics[0]}_unknown`,
        session.topics[0] || "unknown",
        result.attempts,
        result.correct,
        timeToCompleteMs,
        finalCode
      );
    }
  };

  const handleComplete = async () => {
    if (!mcqResult || !codeResult || !session) return;

    setIsSubmitting(true);

    try {
      // 1. Speichere Drill-Session in Firebase
      await saveDrillSession(userId, session, {
        mcqCorrect: mcqResult.correct,
        mcqAttempts: mcqResult.attempts,
        codeCorrect: codeResult.correct,
        codeAttempts: codeResult.attempts,
      });

      // 2. Markiere Drills als abgeschlossen
      const drillIds = generateDrillIds({
        ...session.tasks,
        topics: session.topics,
      });
      await markDrillCompleted(userId, drillIds);

      // 3. Update Learning Profile - Topic Weights für erfolgreiche Drills reduzieren
      // Dies sorgt dafür, dass Topics mit weniger Fehlern seltener in Drills vorkommen
      for (const topic of session.topics) {
        if (mcqResult.correct && codeResult.correct) {
          // Beide Tasks korrekt → Topic-Gewichtung reduzieren (-0.2)
          const { newTopicWeight } = await processCorrect(userId, topic);
          console.log(`🎓 [DrillModalV2] Topic "${topic}" weight reduced to ${newTopicWeight} (drill completed successfully)`);
        }
      }

      // 4. Logge Session Completed Event mit vollen Drill-IDs
      const totalTimeMs = Date.now() - drillStartTime;
      await logDrillSessionCompleted(
        userId,
        courseId,
        session.triggerStep,
        session.topics,
        session.userGroup,
        session.tasks.mcq.id || `mcq_${session.topics[0]}_unknown`,
        session.tasks.codeTask.id || `code_${session.topics[0]}_unknown`,
        session.topics[0] || "unknown",
        session.topics[0] || "unknown",
        mcqResult.attempts,
        codeResult.attempts,
        mcqResult.correct,
        codeResult.correct,
        totalTimeMs,
        session.difficultyRecommendation?.recommended
      );

      // 5. Schließe Modal endgültig
      onComplete();
    } catch (error) {
      console.error("[DrillModalV2] Error completing drill:", error);
      // TODO: Show error toast
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open && !isLoading) {
      // Modal wird geschlossen (nur wenn nicht im Loading-State)
      console.log(`[DrillModalV2] Modal closed - Task ${currentTask}, MCQ: ${!!mcqResult?.correct}, Code: ${!!codeResult?.correct}`);
      onClose();
    }
  };

  // Loading-State: Zeige Skeleton während AI Drills auswählt
  if (isLoading || !session) {
    return (
      <DialogRoot
        open={isOpen}
        size="xl"
        closeOnInteractOutside={false}
        closeOnEscape={false}
      >
        <DialogBackdrop />
        <DialogContent bg="gray.800" maxW="1080px">
          <DialogHeader>
            <VStack align="stretch" gap={3}>
              <HStack justify="space-between">
                <Skeleton height="24px" width="280px" />
                <Skeleton height="24px" width="80px" />
              </HStack>
              <Skeleton height="8px" width="100%" />
            </VStack>
          </DialogHeader>
          <DialogBody>
            <VStack align="stretch" gap={6} py={4}>
              {/* Fake MCQ Skeleton */}
              <Box
                bg="gray.700"
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.600"
              >
                <VStack align="stretch" gap={4}>
                  <Skeleton height="16px" width="100px" />
                  <VStack align="stretch" gap={2}>
                    <Skeleton height="16px" width="100%" />
                    <Skeleton height="16px" width="85%" />
                  </VStack>
                  <VStack align="stretch" gap={2} mt={2}>
                    <Skeleton height="44px" width="100%" />
                    <Skeleton height="44px" width="100%" />
                    <Skeleton height="44px" width="100%" />
                    <Skeleton height="44px" width="100%" />
                  </VStack>
                </VStack>
              </Box>

              {/* Loading Indicator */}
              <HStack justify="center" gap={3} py={2}>
                <Spinner size="sm" color="blue.400" />
                <Text color="gray.400" fontSize="sm">
                  {t("loading")}
                </Text>
              </HStack>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    );
  }

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={handleOpenChange}
      size="xl"
      closeOnInteractOutside={true}  // V2: Kann durch Außenklick geschlossen werden
      closeOnEscape={true}  // V2: Kann mit Escape geschlossen werden
    >
      <DialogBackdrop />
      <DialogContent bg="gray.800" maxW="1080px">  {/* V2: 20% größer (900px * 1.2 = 1080px) */}
        <DialogHeader>
          <VStack align="stretch" gap={3}>
            <HStack justify="space-between">
              <Text color="white" fontSize="lg" fontWeight="bold">
                {t("title", { step: session.triggerStep })}
              </Text>
              <HStack gap={2}>
                <Badge colorScheme={currentTask === 1 ? "blue" : "green"} fontSize="sm">
                  {t("taskOf", { current: currentTask, total: 2 })}
                </Badge>
                {/* V2: Close Button - kein asChild da DialogCloseTrigger bereits Button rendert */}
                <DialogCloseTrigger />
              </HStack>
            </HStack>

            {/* V2: Topics entfernt */}

            {/* Progress Bar */}
            <Box>
              <ProgressRoot
                value={progress}
                size="sm"
                colorPalette={isComplete ? "green" : "blue"}
              >
                <ProgressBar />
              </ProgressRoot>
              <Text fontSize="xs" color="gray.500" mt={1}>
                {isComplete ? t("progressComplete") : t("progressPercent", { percent: Math.round(progress) })}
              </Text>
            </Box>

            {/* Difficulty Badge (nur bei KI-generierten Drills) */}
            {session.difficultyRecommendation && session.userGroup === "B" && (
              <Box
                p={2}
                bg="blue.900"
                borderRadius="md"
                border="1px solid"
                borderColor="blue.700"
              >
                <HStack gap={2}>
                  <Text fontSize="xs" color="blue.200" fontWeight="medium">
                    {t("aiRecommendation")}
                  </Text>
                  <Badge
                    colorScheme={
                      session.difficultyRecommendation.recommended === "easy"
                        ? "green"
                        : session.difficultyRecommendation.recommended === "medium"
                        ? "yellow"
                        : "red"
                    }
                    fontSize="xs"
                  >
                    {session.difficultyRecommendation.recommended === "easy"
                      ? t("difficultyEasy")
                      : session.difficultyRecommendation.recommended === "medium"
                      ? t("difficultyMedium")
                      : t("difficultyHard")}
                  </Badge>
                  <Text fontSize="xs" color="gray.400">
                    {session.difficultyRecommendation.reasoning}
                  </Text>
                </HStack>
              </Box>
            )}
          </VStack>
        </DialogHeader>

        <DialogBody>
          {currentTask === 1 ? (
            <DrillMCQuestionV2
              question={session.tasks.mcq}
              onAnswer={() => {}}
              onComplete={handleMCQComplete}
              onAttempt={(data) => {
                logDrillAttempt(
                  userId,
                  session.tasks.mcq.id || 'unknown-mcq',
                  session.tasks.mcq.question,
                  mapQuestionType(session.tasks.mcq.type || 'multiple-choice'),
                  0, // questionIndex (single MCQ per drill)
                  data.correct,
                  data.attemptNumber,
                  Math.floor(data.timeToAnswerMs / 1000),
                  data.selectedAnswer
                );
              }}
            />
          ) : (
            <DrillCodeTaskV2
              task={{
                id: session.tasks.codeTask.id,
                // hint enthält den eigentlichen prompt aus pythonDrillTasks
                // description ist nur die Kurzüberschrift
                prompt: session.tasks.codeTask.hint || session.tasks.codeTask.description,
                starterCode: session.tasks.codeTask.starterCode,
                solutionString: session.tasks.codeTask.solutionString,
                solutionCode: session.tasks.codeTask.solutionCode,
              }}
              onSubmit={() => {}}
              onComplete={handleCodeComplete}
              onAttempt={(data) => {
                logDrillAttempt(
                  userId,
                  session.tasks.codeTask.id || 'unknown-code',
                  session.tasks.codeTask.description,
                  'code',
                  0, // questionIndex (single code task per drill)
                  data.correct,
                  data.attemptNumber,
                  Math.floor(data.timeToAnswerMs / 1000),
                  data.userCode // Use userCode as selected answer for code tasks
                );
              }}
            />
          )}
        </DialogBody>

        <DialogFooter>
          <HStack w="full" justify="space-between">
            {/* Navigation */}
            <HStack gap={2}>
              {mcqResult?.correct && (
                <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                  <Check size={12} />
                  {t("mcqCompleted")}
                </Badge>
              )}
              {codeResult?.correct && (
                <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                  <Check size={12} />
                  {t("codeCompleted")}
                </Badge>
              )}
            </HStack>

            {/* Actions */}
            <HStack gap={3}>
              {/* Zurück Button (nur bei Task 2 und Code noch nicht korrekt) */}
              {currentTask === 2 && !codeResult?.correct && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentTask(1)}
                  disabled={isSubmitting}
                >
                  {t("backToMcq")}
                </Button>
              )}

              {/* Weiter Button - nur wenn MCQ korrekt */}
              {mcqResult?.correct && currentTask === 1 && (
                <Button colorScheme="blue" onClick={() => setCurrentTask(2)}>
                  {t("continueToCode")}
                </Button>
              )}

              {/* Fertig Button - "Kurs fortsetzen" */}
              {isComplete && (
                <Button
                  colorScheme="green"
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  size="lg"
                >
                  <HStack gap={2}>
                    <Trophy size={16} />
                    <Text>{isSubmitting ? t("saving") : t("continueCourse")}</Text>
                  </HStack>
                </Button>
              )}

              {/* V2: "Später fortsetzen" Button entfernt - User kann jetzt einfach Modal schließen */}
            </HStack>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
