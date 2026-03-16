"use client";

import { Box, VStack, HStack, Text, Badge, Tabs } from "@chakra-ui/react";
import { Brain, TrendingUp, Scale } from "lucide-react";
import type { TimelineEvent } from "@/actions/getUserMetrics";
import { ChartWrapper } from "./ChartWrapper";

interface LearningProfileChartsProps {
  events: TimelineEvent[];
}

// Kurs-Struktur: 2 Kapitel mit je 6 Steps
const COURSE_STRUCTURE = {
  chapters: [
    { id: 1, name: "Kapitel 1: Grundlagen", steps: [1, 2, 3, 4, 5, 6] },
    { id: 2, name: "Kapitel 2: Fortgeschritten", steps: [7, 8, 9, 10, 11, 12] },
  ],
  totalSteps: 12,
};

interface StepDataPoint {
  step: number;
  stepLabel: string;
  performanceScore: number;
  topicWeights: Record<string, number>;
  timestamp: string;
}

/**
 * Extrahiert Learning Profile Daten aus Events und gruppiert nach Steps
 * Nutzt primär step_snapshot Events für präzise Daten
 */
function extractLearningProfileData(events: TimelineEvent[]): StepDataPoint[] {
  // Sortiere Events chronologisch
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const dataPoints: StepDataPoint[] = [];
  const seenSteps = new Set<number>();

  // Primär: Nutze step_snapshot Events (am genauesten)
  const snapshotEvents = sortedEvents.filter((e) => e.type === "step_snapshot");

  if (snapshotEvents.length > 0) {
    // Gruppiere Snapshots nach Step und verwende "end" Snapshots
    for (const event of snapshotEvents) {
      const step = event.data?.stepNumber || event.step;
      const snapshotType = event.data?.snapshotType;

      // Bevorzuge "end" Snapshots da sie den finalen Stand zeigen
      if (step && snapshotType === "end" && !seenSteps.has(step)) {
        seenSteps.add(step);
        dataPoints.push({
          step,
          stepLabel: `Step ${step}`,
          performanceScore: event.data?.performanceScore ?? 100,
          topicWeights: event.data?.topicWeights ?? {},
          timestamp: event.timestamp,
        });
      }
    }

    // Sortiere nach Step-Nummer
    dataPoints.sort((a, b) => a.step - b.step);

    if (dataPoints.length > 0) {
      return dataPoints;
    }
  }

  // Fallback: Legacy-Methode für ältere Daten ohne step_snapshot
  let currentScore = 100;
  const currentWeights: Record<string, number> = {};
  let lastStep = 0;

  for (const event of sortedEvents) {
    // Track Performance Score Updates
    if (event.type === "performance_score_update") {
      currentScore = event.data.newScore;
    }

    // Track Topic Weight Changes
    if (event.type === "topic_weight_change") {
      currentWeights[event.data.topic] = event.data.newWeight;
    }

    // Track Topic Introductions
    if (event.type === "topic_introduced") {
      currentWeights[event.data.topic] = event.data.initialWeight;
    }

    // Bei Step Complete: Snapshot speichern
    if (event.type === "step_complete" && event.step) {
      const step = event.step;
      if (step > lastStep) {
        dataPoints.push({
          step,
          stepLabel: `Step ${step}`,
          performanceScore: currentScore,
          topicWeights: { ...currentWeights },
          timestamp: event.timestamp,
        });
        lastStep = step;
      }
    }

    // Auch bei Score/Weight Updates nach einem Step: aktualisiere letzten Datenpunkt
    if (
      (event.type === "performance_score_update" || event.type === "topic_weight_change") &&
      dataPoints.length > 0
    ) {
      const lastPoint = dataPoints[dataPoints.length - 1];
      // Prüfe ob dieses Event kurz nach dem letzten Step kam (innerhalb 5 Minuten)
      const timeDiff = new Date(event.timestamp).getTime() - new Date(lastPoint.timestamp).getTime();
      if (timeDiff < 5 * 60 * 1000) {
        lastPoint.performanceScore = currentScore;
        lastPoint.topicWeights = { ...currentWeights };
      }
    }
  }

  return dataPoints;
}

/**
 * Alle einzigartigen Topics aus den Daten extrahieren
 */
function extractAllTopics(dataPoints: StepDataPoint[]): string[] {
  const topics = new Set<string>();
  for (const point of dataPoints) {
    for (const topic of Object.keys(point.topicWeights)) {
      topics.add(topic);
    }
  }
  return Array.from(topics).sort();
}

// Farben für Topics
const TOPIC_COLORS: Record<string, string> = {
  Variablen: "#3b82f6", // blue
  Datentypen: "#10b981", // green
  Listen: "#f59e0b", // amber
  Dictionaries: "#ef4444", // red
  Schleifen: "#8b5cf6", // purple
  Funktionen: "#ec4899", // pink
  Strings: "#06b6d4", // cyan
  Operatoren: "#84cc16", // lime
  Konsolenausgabe: "#f97316", // orange
  Bedingungen: "#6366f1", // indigo
};

function getTopicColor(topic: string): string {
  return TOPIC_COLORS[topic] || "#9ca3af";
}

export function LearningProfileCharts({ events }: LearningProfileChartsProps) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
  } = require("recharts");

  const dataPoints = extractLearningProfileData(events);
  const allTopics = extractAllTopics(dataPoints);

  if (dataPoints.length === 0) {
    return (
      <Box
        bg="gray.800"
        p={6}
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.700"
        textAlign="center"
      >
        <Brain size={48} color="#6b7280" style={{ margin: "0 auto 16px" }} />
        <Text color="gray.400">
          Keine Learning Profile Daten vorhanden.
        </Text>
        <Text color="gray.500" fontSize="sm" mt={2}>
          Daten werden erfasst wenn der User Steps abschließt.
        </Text>
      </Box>
    );
  }

  // Daten für Kapitel aufteilen
  const chapter1Data = dataPoints.filter((p) =>
    COURSE_STRUCTURE.chapters[0].steps.includes(p.step)
  );
  const chapter2Data = dataPoints.filter((p) =>
    COURSE_STRUCTURE.chapters[1].steps.includes(p.step)
  );

  // Topic Weights für Chart vorbereiten
  const prepareTopicData = (data: StepDataPoint[]) => {
    return data.map((point) => ({
      ...point,
      ...Object.fromEntries(
        allTopics.map((topic) => [topic, point.topicWeights[topic] ?? null])
      ),
    }));
  };

  const allData = prepareTopicData(dataPoints);
  const chapter1TopicData = prepareTopicData(chapter1Data);
  const chapter2TopicData = prepareTopicData(chapter2Data);

  // Custom Tooltip für Performance Score
  const PerformanceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg="gray.900"
          p={3}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.700"
        >
          <Text fontWeight="bold" color="white" mb={2}>
            {label}
          </Text>
          {payload.map((entry: any, index: number) => (
            <HStack key={index} justify="space-between" gap={4}>
              <Text color={entry.color} fontSize="sm">
                {entry.name}:
              </Text>
              <Text color="white" fontSize="sm" fontWeight="bold">
                {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
              </Text>
            </HStack>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Performance Score Chart Komponente
  const PerformanceScoreChart = ({
    data,
    title,
    height = 250,
  }: {
    data: StepDataPoint[];
    title: string;
    height?: number;
  }) => (
    <Box>
      <HStack mb={3}>
        <TrendingUp size={20} color="#3b82f6" />
        <Text fontWeight="bold" color="white" fontSize="sm">
          {title}
        </Text>
        <Badge colorScheme="blue" fontSize="xs">
          Performance Score
        </Badge>
      </HStack>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="stepLabel"
            stroke="#9ca3af"
            tick={{ fontSize: 11 }}
            interval={0}
          />
          <YAxis
            stroke="#9ca3af"
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
            label={{
              value: "Score",
              angle: -90,
              position: "insideLeft",
              fill: "#9ca3af",
              fontSize: 11,
            }}
          />
          <Tooltip content={<PerformanceTooltip />} />
          <ReferenceLine
            y={100}
            stroke="#22c55e"
            strokeDasharray="5 5"
            label={{ value: "Start", fill: "#22c55e", fontSize: 10 }}
          />
          <ReferenceLine
            y={50}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            label={{ value: "Warnung", fill: "#f59e0b", fontSize: 10 }}
          />
          <Line
            type="monotone"
            dataKey="performanceScore"
            name="Performance Score"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );

  // Topic Weights Chart Komponente
  const TopicWeightsChart = ({
    data,
    title,
    height = 250,
  }: {
    data: any[];
    title: string;
    height?: number;
  }) => (
    <Box>
      <HStack mb={3}>
        <Scale size={20} color="#f59e0b" />
        <Text fontWeight="bold" color="white" fontSize="sm">
          {title}
        </Text>
        <Badge colorScheme="orange" fontSize="xs">
          Topic-Gewichtungen
        </Badge>
      </HStack>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="stepLabel"
            stroke="#9ca3af"
            tick={{ fontSize: 11 }}
            interval={0}
          />
          <YAxis
            stroke="#9ca3af"
            domain={[0, 2.5]}
            tick={{ fontSize: 11 }}
            label={{
              value: "Gewicht",
              angle: -90,
              position: "insideLeft",
              fill: "#9ca3af",
              fontSize: 11,
            }}
          />
          <Tooltip content={<PerformanceTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "11px" }}
            iconSize={10}
          />
          <ReferenceLine
            y={1}
            stroke="#22c55e"
            strokeDasharray="5 5"
            label={{ value: "Normal", fill: "#22c55e", fontSize: 10 }}
          />
          <ReferenceLine
            y={1.2}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            label={{ value: "Übung nötig", fill: "#f59e0b", fontSize: 10 }}
          />
          {allTopics.map((topic) => (
            <Line
              key={topic}
              type="monotone"
              dataKey={topic}
              name={topic}
              stroke={getTopicColor(topic)}
              strokeWidth={2}
              dot={{ fill: getTopicColor(topic), r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );

  return (
    <ChartWrapper>
      <Box
        bg="gray.800"
        p={6}
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.700"
      >
        <VStack align="stretch" gap={6}>
          {/* Header */}
          <HStack justify="space-between">
            <HStack>
              <Brain size={24} color="#8b5cf6" />
              <Text fontWeight="bold" color="white" fontSize="lg">
                Learning Profile Verlauf
              </Text>
            </HStack>
            <HStack gap={2}>
              <Badge colorScheme="purple" fontSize="xs">
                {dataPoints.length} Steps
              </Badge>
              <Badge colorScheme="cyan" fontSize="xs">
                {allTopics.length} Topics
              </Badge>
            </HStack>
          </HStack>

          {/* Tabs für verschiedene Ansichten */}
          <Tabs.Root defaultValue="gesamt" variant="enclosed">
            <Tabs.List bg="gray.900" borderRadius="md" p={1}>
              <Tabs.Trigger
                value="gesamt"
                _selected={{ bg: "purple.600", color: "white" }}
                color="gray.400"
                px={4}
                py={2}
                borderRadius="md"
                fontSize="sm"
              >
                Gesamtverlauf
              </Tabs.Trigger>
              <Tabs.Trigger
                value="kapitel1"
                _selected={{ bg: "blue.600", color: "white" }}
                color="gray.400"
                px={4}
                py={2}
                borderRadius="md"
                fontSize="sm"
                disabled={chapter1Data.length === 0}
              >
                Kapitel 1
              </Tabs.Trigger>
              <Tabs.Trigger
                value="kapitel2"
                _selected={{ bg: "green.600", color: "white" }}
                color="gray.400"
                px={4}
                py={2}
                borderRadius="md"
                fontSize="sm"
                disabled={chapter2Data.length === 0}
              >
                Kapitel 2
              </Tabs.Trigger>
            </Tabs.List>

            {/* Gesamtverlauf */}
            <Tabs.Content value="gesamt">
              <VStack align="stretch" gap={6} pt={4}>
                <PerformanceScoreChart
                  data={dataPoints}
                  title="Performance Score - Alle Steps"
                  height={280}
                />
                <TopicWeightsChart
                  data={allData}
                  title="Topic-Gewichtungen - Alle Steps"
                  height={300}
                />
              </VStack>
            </Tabs.Content>

            {/* Kapitel 1 */}
            <Tabs.Content value="kapitel1">
              <VStack align="stretch" gap={6} pt={4}>
                {chapter1Data.length > 0 ? (
                  <>
                    <Box
                      p={3}
                      bg="blue.900"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="blue.700"
                    >
                      <Text color="blue.200" fontSize="sm">
                        {COURSE_STRUCTURE.chapters[0].name} (Steps 1-6)
                      </Text>
                    </Box>
                    <PerformanceScoreChart
                      data={chapter1Data}
                      title="Performance Score - Kapitel 1"
                    />
                    <TopicWeightsChart
                      data={chapter1TopicData}
                      title="Topic-Gewichtungen - Kapitel 1"
                    />
                  </>
                ) : (
                  <Text color="gray.500" textAlign="center" py={8}>
                    Keine Daten für Kapitel 1 vorhanden.
                  </Text>
                )}
              </VStack>
            </Tabs.Content>

            {/* Kapitel 2 */}
            <Tabs.Content value="kapitel2">
              <VStack align="stretch" gap={6} pt={4}>
                {chapter2Data.length > 0 ? (
                  <>
                    <Box
                      p={3}
                      bg="green.900"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="green.700"
                    >
                      <Text color="green.200" fontSize="sm">
                        {COURSE_STRUCTURE.chapters[1].name} (Steps 7-12)
                      </Text>
                    </Box>
                    <PerformanceScoreChart
                      data={chapter2Data}
                      title="Performance Score - Kapitel 2"
                    />
                    <TopicWeightsChart
                      data={chapter2TopicData}
                      title="Topic-Gewichtungen - Kapitel 2"
                    />
                  </>
                ) : (
                  <Text color="gray.500" textAlign="center" py={8}>
                    Keine Daten für Kapitel 2 vorhanden.
                  </Text>
                )}
              </VStack>
            </Tabs.Content>
          </Tabs.Root>

          {/* Legende */}
          <Box
            p={4}
            bg="gray.900"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.700"
          >
            <Text fontSize="xs" color="gray.400" mb={2} fontWeight="bold">
              Legende:
            </Text>
            <HStack gap={4} flexWrap="wrap">
              <HStack>
                <Box w={3} h={0.5} bg="green.500" />
                <Text fontSize="xs" color="gray.500">
                  Startwert / Normal
                </Text>
              </HStack>
              <HStack>
                <Box w={3} h={0.5} bg="yellow.500" />
                <Text fontSize="xs" color="gray.500">
                  Warnung / Übung nötig
                </Text>
              </HStack>
            </HStack>
            <Text fontSize="xs" color="gray.600" mt={2}>
              Performance Score: 100 = Start, sinkt bei Fehlern (-5), steigt bei richtigen Lösungen (+2).
              Topic-Gewicht: 1 = Normal, &gt;1.2 = braucht Übung, &lt;0.5 = gut verstanden.
            </Text>
          </Box>
        </VStack>
      </Box>
    </ChartWrapper>
  );
}
