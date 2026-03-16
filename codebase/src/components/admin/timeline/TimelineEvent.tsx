"use client";

import { Box, HStack, VStack, Text, Badge } from "@chakra-ui/react";
import {
  MessageSquare,
  CheckCircle,
  PlayCircle,
  Activity,
  FileText,
  Code,
  LogIn,
  LogOut,
  Target,
  BookOpen,
  Flag,
  Eye,
  Brain,
  TrendingUp,
  AlertTriangle,
  Scale,
  XCircle,
  Sparkles,
  Camera,
  Trophy,
} from "lucide-react";
import type { EnrichedTimelineEvent } from "@/lib/timelineUtils";
import { getEventColor, getEventLabel, formatTime } from "@/lib/timelineUtils";
import { CodePreview } from "./CodePreview";

interface TimelineEventProps {
  event: EnrichedTimelineEvent;
  isFirst: boolean;
  isLast: boolean;
}

export function TimelineEvent({ event, isFirst, isLast }: TimelineEventProps) {
  const color = getEventColor(event.type);
  const label = getEventLabel(event.type);

  const getIcon = () => {
    switch (event.type) {
      case "help_request":
        return <MessageSquare size={18} />;
      case "step_complete":
        return <CheckCircle size={18} />;
      case "course_complete":
        return <Trophy size={18} />;
      case "step_start":
        return <PlayCircle size={18} />;
      case "course_access":
        return <Activity size={18} />;
      case "note_added":
        return <FileText size={18} />;
      case "code_execution":
        return <Code size={18} />;
      case "session_start":
        return <LogIn size={18} />;
      case "session_end":
        return <LogOut size={18} />;
      case "drill_attempt":
      case "drill_session_completed":
        return <Target size={18} />;
      case "drill_shown":
        return <Eye size={18} />;
      case "drill_mcq_completed":
      case "drill_code_completed":
        return <CheckCircle size={18} />;
      case "chapter_start":
      case "chapter_complete":
        return <BookOpen size={18} />;
      case "onboarding_start":
      case "onboarding_complete":
        return <Flag size={18} />;
      // Learning Profile Events
      case "learning_profile_initialized":
        return <Brain size={18} />;
      case "performance_score_update":
        return <TrendingUp size={18} />;
      case "error_entry_added":
        return <AlertTriangle size={18} />;
      case "topic_weight_change":
        return <Scale size={18} />;
      case "topic_introduced":
        return <BookOpen size={18} />;
      case "incorrect_solution":
        return <XCircle size={18} />;
      // Step Snapshot
      case "step_snapshot":
        return <Camera size={18} />;
      // AI Events
      case "ai_drill_selection":
        return <Sparkles size={18} />;
      default:
        return <Activity size={18} />;
    }
  };

  const getHintLevelColor = (level: number) => {
    if (level <= 2) return "green";
    if (level <= 4) return "yellow";
    return "red";
  };

  return (
    <Box position="relative">
      {/* Pause Marker */}
      {event.isPause && !isFirst && (
        <Box
          py={4}
          my={2}
          borderTop="2px dashed"
          borderBottom="2px dashed"
          borderColor="gray.600"
          textAlign="center"
        >
          <Text color="gray.400" fontSize="sm">
            {event.pauseFormatted}
          </Text>
        </Box>
      )}

      {/* Event Row */}
      <HStack align="start" gap={4}>
        {/* Timeline Line & Dot */}
        <VStack gap={0} align="center" minW="60px">
          {/* Zeit */}
          <Text fontSize="xs" color="gray.500" fontFamily="mono" mb={2}>
            {formatTime(event.timestamp)}
          </Text>

          {/* Dot */}
          <Box
            w={4}
            h={4}
            borderRadius="full"
            bg={`${color}.500`}
            border="3px solid"
            borderColor="gray.800"
            zIndex={1}
          />

          {/* Line */}
          {!isLast && (
            <Box
              w="2px"
              flex={1}
              minH="40px"
              bg="gray.600"
            />
          )}
        </VStack>

        {/* Event Content */}
        <Box
          flex={1}
          bg="gray.900"
          p={4}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.700"
          mb={4}
          _hover={{ borderColor: "gray.600" }}
        >
          <VStack align="stretch" gap={3}>
            {/* Header */}
            <HStack justify="space-between" flexWrap="wrap" gap={2}>
              <HStack gap={2}>
                <Box color={`${color}.400`}>{getIcon()}</Box>
                <Badge colorScheme={color} fontSize="xs">
                  {label}
                </Badge>
                {event.courseId && (
                  <Text fontSize="xs" color="gray.500">
                    {event.courseId}
                  </Text>
                )}
                {event.step !== undefined && (
                  <Badge colorScheme="gray" variant="outline" fontSize="xs">
                    Step {event.step}
                  </Badge>
                )}
              </HStack>

              {/* Time Delta */}
              {event.deltaFormatted && !event.isPause && (
                <Text fontSize="xs" color="gray.500" fontFamily="mono">
                  {event.deltaFormatted}
                </Text>
              )}
            </HStack>

            {/* Event-specific content */}
            {renderEventContent(event, getHintLevelColor)}
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
}

function renderEventContent(
  event: EnrichedTimelineEvent,
  getHintLevelColor: (level: number) => string
) {
  const drillId =
    event.drillId ||
    event.data?.drillId ||
    event.data?.mcqDrillId ||
    event.data?.codeDrillId ||
    event.data?.mcqId ||
    event.data?.codeTaskId;

  const attemptedAnswer =
    event.data?.userAnswer ||
    event.data?.selectedAnswer ||
    event.data?.answer ||
    event.data?.finalCode;

  switch (event.type) {
    case "help_request":
      return (
        <VStack align="stretch" gap={2}>
          <HStack gap={2}>
            <Badge
              colorScheme={getHintLevelColor(event.data.hintLevel)}
              fontSize="xs"
            >
              Level {event.data.hintLevel}
            </Badge>
            <Text fontSize="xs" color="gray.500">
              Anfrage #{event.data.requestNumber}
            </Text>
          </HStack>

          {/* User Message */}
          <Box
            bg="gray.800"
            p={3}
            borderRadius="md"
            borderLeft="3px solid"
            borderColor="blue.500"
          >
            <Text fontSize="xs" color="gray.400" mb={1}>
              User:
            </Text>
            <Text fontSize="sm" color="white">
              {event.data.userMessage}
            </Text>
          </Box>

          {/* AI Response */}
          <Box
            bg="gray.800"
            p={3}
            borderRadius="md"
            borderLeft="3px solid"
            borderColor="green.500"
          >
            <Text fontSize="xs" color="gray.400" mb={1}>
              KI-Tutor:
            </Text>
            <Text fontSize="sm" color="white" whiteSpace="pre-wrap">
              {event.data.aiResponse?.substring(0, 500)}
              {event.data.aiResponse?.length > 500 && "..."}
            </Text>
          </Box>
        </VStack>
      );

    case "code_execution":
      return (
        <VStack align="stretch" gap={2}>
          <HStack gap={2}>
            <Badge
              colorScheme={event.data.success ? "green" : "red"}
              fontSize="xs"
            >
              {event.data.success ? "✓ Erfolgreich" : "✗ Fehler"}
            </Badge>
            {event.data.executionTimeMs && (
              <Text fontSize="xs" color="gray.500">
                {event.data.executionTimeMs}ms
              </Text>
            )}
          </HStack>

          <CodePreview
            code={event.data.code}
            success={event.data.success}
            errorMessage={event.data.errorMessage}
            maxLines={8}
          />
        </VStack>
      );

    case "step_complete":
      return (
        <HStack gap={4} flexWrap="wrap" fontSize="sm" color="gray.400">
          <HStack gap={1}>
            <Text>⏱️</Text>
            <Text>
              {event.data.durationSeconds
                ? `${Math.floor(event.data.durationSeconds / 60)}m ${event.data.durationSeconds % 60}s`
                : "N/A"}
            </Text>
          </HStack>
          <HStack gap={1}>
            <Text>💬</Text>
            <Text>{event.data.totalHelpRequests || 0} Hilfe</Text>
          </HStack>
          <HStack gap={1}>
            <Text>📊</Text>
            <Text>Ø Level {event.data.averageHintLevel?.toFixed(1) || "N/A"}</Text>
          </HStack>
          <HStack gap={1}>
            <Text>💻</Text>
            <Text>{event.data.codeExecutions || 0} Runs</Text>
          </HStack>
        </HStack>
      );

    case "step_start":
      return (
        <HStack gap={2}>
          <Text fontSize="sm" color="gray.300">
            {event.data.stepTitle || `Step ${event.step}`}
          </Text>
          {event.data.isRetry && (
            <Badge colorScheme="yellow" fontSize="xs">
              Retry
            </Badge>
          )}
        </HStack>
      );

    case "session_start":
      return (
        <VStack align="stretch" gap={1}>
          <Text fontSize="sm" color="gray.400">
            {event.data.userAgent?.includes("Chrome")
              ? "Chrome"
              : event.data.userAgent?.includes("Firefox")
                ? "Firefox"
                : "Browser"}{" "}
            | {event.data.screenResolution || "Unbekannt"}
          </Text>
          {event.data.referrer && (
            <Text fontSize="xs" color="gray.500">
              Referrer: {event.data.referrer}
            </Text>
          )}
        </VStack>
      );

    case "session_end":
      return (
        <HStack gap={4} fontSize="sm" color="gray.400">
          <Text>
            ⏱️ Dauer: {Math.floor((event.data.durationSeconds || 0) / 60)}m
          </Text>
          <Text>📊 Events: {event.data.eventsInSession || 0}</Text>
        </HStack>
      );

    case "note_added":
      return (
        <Box
          bg="gray.800"
          p={3}
          borderRadius="md"
          borderLeft="3px solid"
          borderColor="yellow.500"
        >
          <Text fontSize="sm" color="white">
            {event.data.note}
          </Text>
        </Box>
      );

    case "course_access":
      return (
        <HStack gap={2}>
          {event.data.isFirstAccess && (
            <Badge colorScheme="purple" fontSize="xs">
              Erster Zugriff
            </Badge>
          )}
          {event.data.previousProgress !== undefined && (
            <Text fontSize="sm" color="gray.400">
              Fortschritt: {event.data.previousProgress}/12
            </Text>
          )}
        </HStack>
      );

    case "drill_attempt":
      return (
        <VStack align="stretch" gap={2}>
          <HStack gap={4} flexWrap="wrap" fontSize="sm" color="gray.400">
            <Badge colorScheme={event.data.correct ? "green" : "red"} fontSize="xs">
              {event.data.correct ? "Richtig" : "Falsch"}
            </Badge>
            <Text>Typ: {event.data.questionType || "unbekannt"}</Text>
            <Text>Versuch #{event.data.attemptNumber ?? "?"}</Text>
            <Text>⏱️ {event.data.timeToAnswerSeconds ?? "?"}s</Text>
          </HStack>

          <Box
            as="details"
            bg="gray.800"
            p={3}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.700"
          >
            <Text as="summary" fontSize="sm" color="gray.200" cursor="pointer" fontWeight="medium">
              Drill-Details & Antwort anzeigen
            </Text>

            <VStack align="stretch" gap={2} mt={3}>
              {drillId && (
                <Text fontSize="sm" color="gray.300">
                  Drill-ID: <Text as="span" color="cyan.300">{String(drillId)}</Text>
                </Text>
              )}
              {event.data?.drillTitle && (
                <Text fontSize="sm" color="gray.300">
                  Titel: {String(event.data.drillTitle)}
                </Text>
              )}
              {event.data?.questionIndex !== undefined && (
                <Text fontSize="sm" color="gray.400">
                  Frage-Index: {String(event.data.questionIndex)}
                </Text>
              )}

              {attemptedAnswer && (
                <Box
                  bg="gray.900"
                  p={2}
                  borderRadius="md"
                  borderLeft="3px solid"
                  borderColor="teal.500"
                >
                  <Text fontSize="xs" color="gray.400" mb={1}>
                    Versuchte Antwort:
                  </Text>
                  <Text fontSize="sm" color="white" whiteSpace="pre-wrap" wordBreak="break-word">
                    {String(attemptedAnswer)}
                  </Text>
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
      );

    case "chapter_complete":
      return (
        <HStack gap={4} fontSize="sm" color="gray.400">
          <Text>⏱️ {Math.floor((event.data.durationSeconds || 0) / 60)}m</Text>
          <Text>💬 {event.data.totalHelpRequests || 0} Hilfe</Text>
        </HStack>
      );

    // Drill Events
    case "drill_shown":
      return (
        <VStack align="stretch" gap={2}>
          <HStack gap={2} flexWrap="wrap" fontSize="sm" color="gray.400">
            <Badge colorScheme="teal" fontSize="xs">
              Step {event.data.step}
            </Badge>
            <Badge colorScheme={event.data.userGroup === "B" ? "purple" : "gray"} fontSize="xs">
              Gruppe {event.data.userGroup}
            </Badge>
            {event.data.topics && (
              <Text>Topics: {event.data.topics.join(", ")}</Text>
            )}
          </HStack>

          <Box
            as="details"
            bg="gray.800"
            p={3}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.700"
          >
            <Text as="summary" fontSize="sm" color="gray.200" cursor="pointer" fontWeight="medium">
              Drill-Details anzeigen
            </Text>

            <VStack align="stretch" gap={2} mt={3}>
              {(event.data.mcqDrillId || event.data.mcqId) && (
                <Text fontSize="sm" color="gray.300">
                  MCQ-Drill: <Text as="span" color="cyan.300">{String(event.data.mcqDrillId || event.data.mcqId)}</Text>
                </Text>
              )}
              {(event.data.codeDrillId || event.data.codeTaskId) && (
                <Text fontSize="sm" color="gray.300">
                  Code-Drill: <Text as="span" color="cyan.300">{String(event.data.codeDrillId || event.data.codeTaskId)}</Text>
                </Text>
              )}
              {event.data.mcqTopic && <Text fontSize="sm" color="gray.400">MCQ-Topic: {String(event.data.mcqTopic)}</Text>}
              {event.data.codeTopic && <Text fontSize="sm" color="gray.400">Code-Topic: {String(event.data.codeTopic)}</Text>}

              {event.data.mcqQuestion && (
                <Box
                  bg="gray.900"
                  p={2}
                  borderRadius="md"
                  borderLeft="3px solid"
                  borderColor="teal.500"
                >
                  <Text fontSize="xs" color="gray.400" mb={1}>MCQ-Frage:</Text>
                  <Text fontSize="sm" color="white" whiteSpace="pre-wrap" wordBreak="break-word">
                    {String(event.data.mcqQuestion)}
                  </Text>
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
      );

    case "drill_mcq_completed":
    case "drill_code_completed":
      return (
        <VStack align="stretch" gap={2}>
          <HStack gap={2} flexWrap="wrap" fontSize="sm" color="gray.400">
            <Badge colorScheme={event.data.success ? "green" : "red"} fontSize="xs">
              {event.data.success ? "Richtig" : "Falsch"}
            </Badge>
            <Text>
              {event.data.mcqAttempts ? `${event.data.mcqAttempts} MCQ-Versuche` : ""}
              {event.data.codeAttempts ? `${event.data.codeAttempts} Code-Versuche` : ""}
            </Text>
          </HStack>

          <Box
            as="details"
            bg="gray.800"
            p={3}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.700"
          >
            <Text as="summary" fontSize="sm" color="gray.200" cursor="pointer" fontWeight="medium">
              Drill-Details anzeigen
            </Text>

            <VStack align="stretch" gap={2} mt={3}>
              {drillId && (
                <Text fontSize="sm" color="gray.300">
                  Drill-ID: <Text as="span" color="cyan.300">{String(drillId)}</Text>
                </Text>
              )}
              {event.data?.mcqTopic && <Text fontSize="sm" color="gray.400">MCQ-Topic: {String(event.data.mcqTopic)}</Text>}
              {event.data?.codeTopic && <Text fontSize="sm" color="gray.400">Code-Topic: {String(event.data.codeTopic)}</Text>}
              {event.data?.timeToAnswerMs !== undefined && (
                <Text fontSize="sm" color="gray.400">Zeit (MCQ): {String(event.data.timeToAnswerMs)}ms</Text>
              )}
              {event.data?.timeToCompleteMs !== undefined && (
                <Text fontSize="sm" color="gray.400">Zeit (Code): {String(event.data.timeToCompleteMs)}ms</Text>
              )}

              {event.type === "drill_code_completed" && event.data?.finalCode && (
                <Box
                  bg="gray.900"
                  p={2}
                  borderRadius="md"
                  borderLeft="3px solid"
                  borderColor="orange.500"
                >
                  <Text fontSize="xs" color="gray.400" mb={1}>
                    Letzter Code-Versuch:
                  </Text>
                  <Text fontSize="sm" color="white" whiteSpace="pre-wrap" wordBreak="break-word" fontFamily="mono">
                    {String(event.data.finalCode)}
                  </Text>
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
      );

    case "drill_session_completed":
      return (
        <VStack align="stretch" gap={2}>
          <HStack gap={2} flexWrap="wrap" fontSize="sm" color="gray.400">
            <Badge colorScheme="green" fontSize="xs">Abgeschlossen</Badge>
            <Text>MCQ: {event.data.mcqAttempts || 0} Versuche</Text>
            <Text>Code: {event.data.codeAttempts || 0} Versuche</Text>
            {event.data.topics && (
              <Text>Topics: {event.data.topics.join(", ")}</Text>
            )}
          </HStack>

          <Box
            as="details"
            bg="gray.800"
            p={3}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.700"
          >
            <Text as="summary" fontSize="sm" color="gray.200" cursor="pointer" fontWeight="medium">
              Drill-Session Details anzeigen
            </Text>

            <VStack align="stretch" gap={2} mt={3}>
              {event.data?.mcqDrillId && (
                <Text fontSize="sm" color="gray.300">
                  MCQ-Drill: <Text as="span" color="cyan.300">{String(event.data.mcqDrillId)}</Text>
                </Text>
              )}
              {event.data?.codeDrillId && (
                <Text fontSize="sm" color="gray.300">
                  Code-Drill: <Text as="span" color="cyan.300">{String(event.data.codeDrillId)}</Text>
                </Text>
              )}
              {event.data?.mcqSuccess !== undefined && (
                <Text fontSize="sm" color="gray.400">MCQ Erfolg: {event.data.mcqSuccess ? "ja" : "nein"}</Text>
              )}
              {event.data?.codeSuccess !== undefined && (
                <Text fontSize="sm" color="gray.400">Code Erfolg: {event.data.codeSuccess ? "ja" : "nein"}</Text>
              )}
              {event.data?.totalTimeMs !== undefined && (
                <Text fontSize="sm" color="gray.400">Gesamtzeit: {String(event.data.totalTimeMs)}ms</Text>
              )}
            </VStack>
          </Box>
        </VStack>
      );

    // Learning Profile Events
    case "learning_profile_initialized":
      return (
        <HStack gap={2} fontSize="sm" color="gray.400">
          <Badge colorScheme="purple" fontSize="xs">Neues Profil</Badge>
          <Text>Score: {event.data.performanceScore}/100</Text>
        </HStack>
      );

    case "performance_score_update":
      return (
        <HStack gap={2} flexWrap="wrap" fontSize="sm">
          <Badge colorScheme={event.data.delta > 0 ? "green" : "red"} fontSize="xs">
            {event.data.delta > 0 ? "+" : ""}{event.data.delta}
          </Badge>
          <Text color="gray.400">
            {event.data.oldScore} → {event.data.newScore}
          </Text>
          {event.data.reason && (
            <Text color="gray.500" fontSize="xs">({event.data.reason})</Text>
          )}
        </HStack>
      );

    case "error_entry_added":
      return (
        <VStack align="stretch" gap={2}>
          <HStack gap={2}>
            <Badge colorScheme="red" fontSize="xs">{event.data.errorType}</Badge>
            <Badge colorScheme="orange" fontSize="xs">{event.data.topic}</Badge>
            {event.data.step && (
              <Badge colorScheme="gray" variant="outline" fontSize="xs">Step {event.data.step}</Badge>
            )}
          </HStack>
          {/* Error Message */}
          {event.data.errorMessage && (
            <Box
              bg="gray.800"
              p={2}
              borderRadius="md"
              borderLeft="3px solid"
              borderColor="red.500"
            >
              <Text fontSize="xs" color="gray.400" mb={1}>Fehlermeldung:</Text>
              <Text fontSize="sm" color="red.300" fontFamily="mono">
                {event.data.errorMessage?.substring(0, 300)}
                {event.data.errorMessage?.length > 300 && "..."}
              </Text>
            </Box>
          )}
          {/* Code that caused the error */}
          {event.data.code && (
            <CodePreview
              code={event.data.code}
              success={false}
              maxLines={5}
            />
          )}
        </VStack>
      );

    case "topic_weight_change":
      return (
        <HStack gap={2} flexWrap="wrap" fontSize="sm">
          <Badge colorScheme="cyan" fontSize="xs">{event.data.topic}</Badge>
          <Badge colorScheme={event.data.newWeight < event.data.oldWeight ? "green" : "orange"} fontSize="xs">
            {event.data.oldWeight?.toFixed(2)} → {event.data.newWeight?.toFixed(2)}
          </Badge>
          <Text color="gray.500" fontSize="xs">
            ({event.data.reason === "correct" ? "richtig" : event.data.reason === "error" ? "Fehler" : "falsche Lösung"})
          </Text>
        </HStack>
      );

    case "topic_introduced":
      return (
        <HStack gap={2} fontSize="sm" color="gray.400">
          <Badge colorScheme="cyan" fontSize="xs">Neues Topic</Badge>
          <Text>{event.data.topic}</Text>
          <Text fontSize="xs" color="gray.500">(Gewicht: {event.data.initialWeight})</Text>
        </HStack>
      );

    case "incorrect_solution":
      return (
        <HStack gap={2} flexWrap="wrap" fontSize="sm">
          <Badge colorScheme="red" fontSize="xs">Falsche Lösung</Badge>
          <Badge colorScheme="orange" fontSize="xs">{event.data.topic}</Badge>
          <Text color="gray.400">
            Score: {event.data.performanceDelta} | Gewicht: +{event.data.topicWeightDelta}
          </Text>
        </HStack>
      );

    // Step Snapshot Event (Learning Profile state at step boundaries)
    case "step_snapshot":
      return (
        <VStack align="stretch" gap={2}>
          <HStack gap={2} flexWrap="wrap">
            <Badge
              colorScheme={event.data.snapshotType === "start" ? "cyan" : "green"}
              fontSize="xs"
            >
              {event.data.snapshotType === "start" ? "Step Start" : "Step Ende"}
            </Badge>
            <Badge colorScheme="purple" fontSize="xs">
              Score: {event.data.performanceScore}/100
            </Badge>
            <Badge colorScheme="orange" fontSize="xs">
              {event.data.errorCount || 0} Fehler
            </Badge>
          </HStack>

          {/* Topic Weights */}
          {event.data.topicWeights && Object.keys(event.data.topicWeights).length > 0 && (
            <Box bg="gray.800" p={2} borderRadius="md">
              <Text fontSize="xs" color="gray.400" mb={2}>Topic-Gewichtungen:</Text>
              <HStack gap={2} flexWrap="wrap">
                {Object.entries(event.data.topicWeights)
                  .filter(([, weight]) => (weight as number) !== -1)
                  .map(([topic, weight]) => (
                    <Badge
                      key={topic}
                      colorScheme={
                        (weight as number) > 1.2 ? "red" :
                        (weight as number) < 0.8 ? "green" : "gray"
                      }
                      fontSize="xs"
                      variant="outline"
                    >
                      {topic}: {(weight as number).toFixed(2)}
                    </Badge>
                  ))}
              </HStack>
            </Box>
          )}

          {/* Recent Topics */}
          {event.data.recentTopics && event.data.recentTopics.length > 0 && (
            <HStack gap={1} fontSize="xs" color="gray.500">
              <Text>Topics in diesem Step:</Text>
              {event.data.recentTopics.map((topic: string) => (
                <Badge key={topic} colorScheme="cyan" fontSize="xs" variant="outline">
                  {topic}
                </Badge>
              ))}
            </HStack>
          )}
        </VStack>
      );

    // AI Drill Selection Events
    case "ai_drill_selection":
      return (
        <VStack align="stretch" gap={2}>
          <HStack gap={2} flexWrap="wrap">
            <Badge colorScheme="pink" fontSize="xs">KI-Auswahl</Badge>
            <Badge colorScheme={
              event.data.confidence === "high" ? "green" :
              event.data.confidence === "medium" ? "yellow" : "red"
            } fontSize="xs">
              {event.data.confidence}
            </Badge>
            <Text fontSize="sm" color="gray.400">
              {event.data.responseTimeMs}ms
            </Text>
          </HStack>
          <HStack gap={2} fontSize="sm" color="gray.400">
            <Text>MCQ: <Text as="span" color="cyan.300">{event.data.selectedMcqId}</Text></Text>
            <Text>Code: <Text as="span" color="cyan.300">{event.data.selectedCodeId}</Text></Text>
          </HStack>
          {event.data.reasoning && (
            <Box
              bg="gray.800"
              p={2}
              borderRadius="md"
              borderLeft="3px solid"
              borderColor="pink.500"
            >
              <Text fontSize="xs" color="gray.400" mb={1}>KI-Begründung:</Text>
              <Text fontSize="sm" color="white">
                {event.data.reasoning}
              </Text>
            </Box>
          )}
          <HStack gap={2} fontSize="xs" color="gray.500">
            <Text>Score: {event.data.performanceScore}/100</Text>
            <Text>Fehler: {event.data.recentErrorCount}</Text>
            {event.data.tokensUsed && <Text>Tokens: {event.data.tokensUsed}</Text>}
          </HStack>
        </VStack>
      );

    default:
      return null;
  }
}
