"use client";

import { Box, HStack, VStack, Text, Badge, SimpleGrid } from "@chakra-ui/react";
import {
  User,
  Clock,
  Activity,
  MessageSquare,
  Code,
  CheckCircle,
  Monitor,
  TrendingUp,
} from "lucide-react";
import type { TimelineSummary } from "@/lib/timelineUtils";

interface TimelineHeaderProps {
  userId: string;
  summary: TimelineSummary;
}

export function TimelineHeader({ userId, summary }: TimelineHeaderProps) {
  const successRate =
    summary.codeExecutions > 0
      ? Math.round((summary.successfulExecutions / summary.codeExecutions) * 100)
      : 0;

  return (
    <Box
      bg="gray.800"
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.700"
      mb={6}
    >
      <VStack align="stretch" gap={4}>
        {/* User Header */}
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <HStack gap={3}>
            <Box
              bg="blue.500"
              p={2}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <User size={24} color="white" />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontSize="xl" fontWeight="bold" color="white">
                {userId}
              </Text>
              {summary.firstEvent && (
                <Text fontSize="sm" color="gray.400">
                  {summary.firstEvent.toLocaleDateString("de-DE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              )}
            </VStack>
          </HStack>

          {/* Journey Badge */}
          {summary.stepRange.from !== null && summary.stepRange.to !== null && (
            <HStack gap={2}>
              <TrendingUp size={16} color="#10b981" />
              <Text color="gray.300" fontSize="sm">
                Journey: Step {summary.stepRange.from} → Step {summary.stepRange.to}
              </Text>
              <Badge colorScheme="green" fontSize="xs">
                {summary.stepsCompleted} abgeschlossen
              </Badge>
            </HStack>
          )}
        </HStack>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} gap={4}>
          {/* Gesamtdauer */}
          <Box bg="gray.900" p={3} borderRadius="md">
            <HStack gap={2} mb={1}>
              <Clock size={16} color="#3b82f6" />
              <Text fontSize="xs" color="gray.400">
                Gesamtdauer
              </Text>
            </HStack>
            <Text fontSize="lg" fontWeight="bold" color="white">
              {summary.totalDurationFormatted}
            </Text>
          </Box>

          {/* Events */}
          <Box bg="gray.900" p={3} borderRadius="md">
            <HStack gap={2} mb={1}>
              <Activity size={16} color="#8b5cf6" />
              <Text fontSize="xs" color="gray.400">
                Events
              </Text>
            </HStack>
            <Text fontSize="lg" fontWeight="bold" color="white">
              {summary.totalEvents}
            </Text>
          </Box>

          {/* Hilfe-Anfragen */}
          <Box bg="gray.900" p={3} borderRadius="md">
            <HStack gap={2} mb={1}>
              <MessageSquare size={16} color="#3b82f6" />
              <Text fontSize="xs" color="gray.400">
                Hilfe-Anfragen
              </Text>
            </HStack>
            <Text fontSize="lg" fontWeight="bold" color="white">
              {summary.helpRequests}
            </Text>
            {summary.helpRequests > 0 && (
              <Text fontSize="xs" color="gray.500">
                Ø Level {summary.avgHintLevel.toFixed(1)}
              </Text>
            )}
          </Box>

          {/* Code-Ausführungen */}
          <Box bg="gray.900" p={3} borderRadius="md">
            <HStack gap={2} mb={1}>
              <Code size={16} color="#f97316" />
              <Text fontSize="xs" color="gray.400">
                Code-Runs
              </Text>
            </HStack>
            <Text fontSize="lg" fontWeight="bold" color="white">
              {summary.codeExecutions}
            </Text>
            {summary.codeExecutions > 0 && (
              <Text fontSize="xs" color={successRate >= 50 ? "green.400" : "red.400"}>
                {successRate}% erfolgreich
              </Text>
            )}
          </Box>

          {/* Steps */}
          <Box bg="gray.900" p={3} borderRadius="md">
            <HStack gap={2} mb={1}>
              <CheckCircle size={16} color="#10b981" />
              <Text fontSize="xs" color="gray.400">
                Steps fertig
              </Text>
            </HStack>
            <Text fontSize="lg" fontWeight="bold" color="white">
              {summary.stepsCompleted}
            </Text>
          </Box>

          {/* Browser/Screen */}
          <Box bg="gray.900" p={3} borderRadius="md">
            <HStack gap={2} mb={1}>
              <Monitor size={16} color="#6b7280" />
              <Text fontSize="xs" color="gray.400">
                Gerät
              </Text>
            </HStack>
            <Text fontSize="sm" fontWeight="medium" color="white" truncate>
              {summary.browser}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {summary.screenResolution}
            </Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
