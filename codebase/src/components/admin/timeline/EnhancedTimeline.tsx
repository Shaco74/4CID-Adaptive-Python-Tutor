"use client";

import { useState } from "react";
import { Box, VStack, Text, HStack, Badge, Button } from "@chakra-ui/react";
import { Clock, Activity, List, Layers, FolderOpen, ChevronDown, ChevronRight } from "lucide-react";
import type { TimelineEvent } from "@/actions/getUserMetrics";
import {
  enrichEventsWithDeltas,
  calculateTimelineSummary,
  type EnrichedTimelineEvent,
} from "@/lib/timelineUtils";
import { TimelineHeader } from "./TimelineHeader";
import { TimelineEvent as TimelineEventComponent } from "./TimelineEvent";

type ViewMode = "chronological" | "time-grouped" | "step-grouped";

interface TimeGroup {
  id: string;
  startTime: Date;
  endTime: Date;
  events: EnrichedTimelineEvent[];
  label: string;
}

interface StepGroup {
  id: string;
  courseId: string;
  stepNumber: number | null;
  stepId: string;
  events: EnrichedTimelineEvent[];
  label: string;
}

// Group events by time proximity (events within threshold are grouped)
function groupEventsByTime(events: EnrichedTimelineEvent[], thresholdMs: number = 30000): TimeGroup[] {
  if (events.length === 0) return [];

  const groups: TimeGroup[] = [];
  let currentGroup: EnrichedTimelineEvent[] = [events[0]];
  let groupStartTime = new Date(events[0].timestamp);

  for (let i = 1; i < events.length; i++) {
    const event = events[i];
    const deltaMs = event.deltaMs ?? 0;

    // If delta is within threshold, add to current group
    if (deltaMs <= thresholdMs) {
      currentGroup.push(event);
    } else {
      // Finalize current group and start new one
      const groupEndTime = new Date(currentGroup[currentGroup.length - 1].timestamp);
      groups.push({
        id: `time-group-${groups.length}`,
        startTime: groupStartTime,
        endTime: groupEndTime,
        events: currentGroup,
        label: formatTimeGroupLabel(groupStartTime, currentGroup.length),
      });

      currentGroup = [event];
      groupStartTime = new Date(event.timestamp);
    }
  }

  // Don't forget the last group
  if (currentGroup.length > 0) {
    const groupEndTime = new Date(currentGroup[currentGroup.length - 1].timestamp);
    groups.push({
      id: `time-group-${groups.length}`,
      startTime: groupStartTime,
      endTime: groupEndTime,
      events: currentGroup,
      label: formatTimeGroupLabel(groupStartTime, currentGroup.length),
    });
  }

  return groups;
}

function formatTimeGroupLabel(startTime: Date, eventCount: number): string {
  const timeStr = startTime.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = startTime.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });
  return `${dateStr} ${timeStr} (${eventCount} Events)`;
}

// Group events by step_complete or course_complete boundaries
// All events until a step_complete/course_complete belong to one group
function groupEventsByStep(events: EnrichedTimelineEvent[]): StepGroup[] {
  if (events.length === 0) return [];

  const groups: StepGroup[] = [];
  let currentGroup: EnrichedTimelineEvent[] = [];
  let completedStepNumber: number | null = null;

  for (const event of events) {
    const isStepCompleted = event.type === "step_complete";
    const isCourseCompleted = event.type === "course_complete";
    const eventStepNumber = event.data?.stepNumber ?? null;
    const eventCourseId = event.courseId || "unknown";

    // Add event to current group
    currentGroup.push(event);

    // When step_complete or course_complete happens, finalize the group
    if (isStepCompleted || isCourseCompleted) {
      const stepNum = eventStepNumber ?? completedStepNumber;
      const label = isCourseCompleted
        ? formatCourseCompleteLabel(eventCourseId, currentGroup.length)
        : formatStepGroupLabel(eventCourseId, stepNum, currentGroup.length);

      groups.push({
        id: `step-group-${groups.length}`,
        courseId: eventCourseId,
        stepNumber: stepNum,
        stepId: `${eventCourseId}-step-${stepNum ?? "start"}`,
        events: currentGroup,
        label,
      });
      currentGroup = [];
      if (eventStepNumber !== null) {
        completedStepNumber = eventStepNumber;
      }
    }
  }

  // Don't forget remaining events after last step_complete
  if (currentGroup.length > 0) {
    // Find the most likely step number from events in this group
    const lastStepStart = currentGroup.find(e => e.type === "step_start");
    const stepNum = lastStepStart?.data?.stepNumber ?? (completedStepNumber !== null ? completedStepNumber + 1 : null);
    const courseId = currentGroup.find(e => e.courseId && e.courseId !== "unknown")?.courseId || "unknown";

    groups.push({
      id: `step-group-${groups.length}`,
      courseId: courseId,
      stepNumber: stepNum,
      stepId: `${courseId}-step-${stepNum ?? "ongoing"}`,
      events: currentGroup,
      label: formatStepGroupLabel(courseId, stepNum, currentGroup.length) + " (in Arbeit)",
    });
  }

  return groups;
}

function formatCourseCompleteLabel(courseId: string, eventCount: number): string {
  const courseName = courseId === "bmi-calculator" ? "BMI-Rechner" :
    courseId === "interest-calculator" ? "Zinsrechner" :
      courseId || "Unbekannt";
  return `${courseName} - Abgeschlossen (${eventCount} Events)`;
}

function formatStepGroupLabel(courseId: string, stepNumber: number | null, eventCount: number): string {
  const courseName = courseId === "bmi-calculator" ? "BMI-Rechner" :
    courseId === "interest-calculator" ? "Zinsrechner" :
      courseId || "Unbekannt";

  if (stepNumber === null) {
    return `${courseName} - Start (${eventCount} Events)`;
  }
  return `${courseName} - Step ${stepNumber} (${eventCount} Events)`;
}

interface EnhancedTimelineProps {
  userId: string;
  events: TimelineEvent[];
}

// Accordion Group Component
function AccordionGroup({
  label,
  events,
  defaultOpen = false,
  colorScheme = "blue",
}: {
  label: string;
  events: EnrichedTimelineEvent[];
  defaultOpen?: boolean;
  colorScheme?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Box
      border="1px solid"
      borderColor="gray.600"
      borderRadius="md"
      overflow="hidden"
      mb={2}
    >
      <HStack
        as="button"
        w="100%"
        p={3}
        bg="gray.700"
        _hover={{ bg: "gray.650" }}
        onClick={() => setIsOpen(!isOpen)}
        cursor="pointer"
        justify="space-between"
      >
        <HStack gap={2}>
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <Text fontWeight="medium" color="white" fontSize="sm">
            {label}
          </Text>
        </HStack>
        <Badge colorScheme={colorScheme} fontSize="xs">
          {events.length} Events
        </Badge>
      </HStack>

      {isOpen && (
        <Box p={3} bg="gray.800">
          {events.map((event, index) => (
            <TimelineEventComponent
              key={event.id}
              event={event}
              isFirst={index === 0}
              isLast={index === events.length - 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export function EnhancedTimeline({ userId, events }: EnhancedTimelineProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("chronological");

  // Events anreichern mit Zeitdeltas
  const enrichedEvents = enrichEventsWithDeltas(events);
  const summary = calculateTimelineSummary(events);

  // Grouped views
  const timeGroups = groupEventsByTime(enrichedEvents, 30000); // 30 seconds threshold
  const stepGroups = groupEventsByStep(enrichedEvents);

  if (events.length === 0) {
    return (
      <Box
        bg="gray.800"
        p={8}
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.700"
        textAlign="center"
      >
        <Activity size={48} color="#6b7280" style={{ margin: "0 auto 16px" }} />
        <Text color="gray.400" fontSize="lg">
          Keine Events gefunden
        </Text>
        <Text color="gray.500" fontSize="sm" mt={2}>
          Für diesen User wurden noch keine Aktivitäten aufgezeichnet.
        </Text>
      </Box>
    );
  }

  const getViewModeLabel = () => {
    switch (viewMode) {
      case "chronological":
        return "Chronologisch (älteste zuerst)";
      case "time-grouped":
        return `Zeit-Gruppiert (${timeGroups.length} Gruppen, <30s Abstand)`;
      case "step-grouped":
        return `Nach Steps (${stepGroups.length} Gruppen)`;
    }
  };

  return (
    <VStack align="stretch" gap={0}>
      {/* User Summary Header */}
      <TimelineHeader userId={userId} summary={summary} />

      {/* Timeline */}
      <Box
        bg="gray.800"
        p={6}
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.700"
      >
        <VStack align="stretch" gap={4}>
          {/* Timeline Header with View Switch */}
          <HStack justify="space-between" flexWrap="wrap" gap={3}>
            <HStack gap={2}>
              <Clock size={20} color="#3b82f6" />
              <Text fontWeight="bold" color="white">
                Event Timeline
              </Text>
            </HStack>

            {/* View Mode Switch */}
            <HStack gap={2}>
              <Button
                size="xs"
                variant={viewMode === "chronological" ? "solid" : "outline"}
                colorScheme={viewMode === "chronological" ? "blue" : "gray"}
                onClick={() => setViewMode("chronological")}
              >
                <List size={14} />
                Chronologisch
              </Button>
              <Button
                size="xs"
                variant={viewMode === "time-grouped" ? "solid" : "outline"}
                colorScheme={viewMode === "time-grouped" ? "purple" : "gray"}
                onClick={() => setViewMode("time-grouped")}
              >
                <Layers size={14} />
                Zeit-Gruppen
              </Button>
              <Button
                size="xs"
                variant={viewMode === "step-grouped" ? "solid" : "outline"}
                colorScheme={viewMode === "step-grouped" ? "green" : "gray"}
                onClick={() => setViewMode("step-grouped")}
              >
                <FolderOpen size={14} />
                Nach Steps
              </Button>
            </HStack>
          </HStack>

          {/* View Mode Info */}
          <Badge colorScheme="gray" fontSize="xs" alignSelf="flex-start">
            {events.length} Events | {getViewModeLabel()}
          </Badge>

          {/* Timeline Events - Chronological View */}
          {viewMode === "chronological" && (
            <Box>
              {enrichedEvents.map((event, index) => (
                <TimelineEventComponent
                  key={event.id}
                  event={event}
                  isFirst={index === 0}
                  isLast={index === enrichedEvents.length - 1}
                />
              ))}
            </Box>
          )}

          {/* Timeline Events - Time Grouped View */}
          {viewMode === "time-grouped" && (
            <Box>
              {timeGroups.map((group, index) => (
                <AccordionGroup
                  key={group.id}
                  label={group.label}
                  events={group.events}
                  defaultOpen={index === 0}
                  colorScheme="purple"
                />
              ))}
            </Box>
          )}

          {/* Timeline Events - Step Grouped View */}
          {viewMode === "step-grouped" && (
            <Box>
              {stepGroups.map((group, index) => (
                <AccordionGroup
                  key={group.id}
                  label={group.label}
                  events={group.events}
                  defaultOpen={index === 0}
                  colorScheme="green"
                />
              ))}
            </Box>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}
