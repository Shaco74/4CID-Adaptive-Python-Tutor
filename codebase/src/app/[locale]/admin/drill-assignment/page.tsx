"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Code,
  Separator,
  Button,
  Input,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import AuthGuard from "@/components/AuthGuard";
import { AdminHeader } from "../components/AdminHeader";
import { AdminNav } from "../components/AdminNav";
import { ContentBlock } from "@/components/course/ContentBlock";

// Data Imports
import { bmiCalculatorCourseData } from "@/courses/bmiCalculatorCourseData";
import { interestCalculatorCourseData } from "@/courses/interestCalculatorCourseData";
import { pythonDrillTasks } from "@/courses/pythonDrillTasks";
import { drillAssignments, getStepsForDrill } from "@/courses/drillAssignments";

import type { CourseData, DrillMCQuestion, DrillCodeTask } from "@/types/courseTypes";

// Available courses
const courses: CourseData[] = [bmiCalculatorCourseData, interestCalculatorCourseData];

// Type labels for question types
const typeLabels = {
  "multiple-choice": "Multiple Choice",
  "spot-the-error": "Fehler finden",
  "predict-output": "Ausgabe vorhersagen",
  "fill-the-blank": "Lückentext"
};

// Collapsible section component
function CollapsibleSection({
  title,
  badge,
  children,
  defaultOpen = false
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Box mb={3}>
      <HStack
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        bg="gray.800"
        p={2}
        borderRadius="md"
        _hover={{ bg: "gray.700" }}
      >
        <Text fontSize="sm" color="gray.400">{isOpen ? "▼" : "▶"}</Text>
        <Text fontWeight="medium" color="white">{title}</Text>
        {badge && <Badge colorPalette="purple" size="sm">{badge}</Badge>}
      </HStack>
      {isOpen && (
        <Box pl={4} pt={2}>
          {children}
        </Box>
      )}
    </Box>
  );
}

// MC Question Preview with selection controls
function MCQuestionPreview({
  question,
  index,
  isSelected,
  priority,
  onToggle,
  onPriorityChange,
}: {
  question: DrillMCQuestion & { id?: string };
  index: number;
  isSelected: boolean;
  priority: number;
  onToggle: () => void;
  onPriorityChange: (priority: number) => void;
}) {
  const usedInSteps = question.id ? getStepsForDrill(question.id) : [];

  return (
    <Box
      bg={isSelected ? "blue.900" : "gray.800"}
      p={4}
      borderRadius="md"
      border="1px solid"
      borderColor={isSelected ? "blue.500" : "gray.600"}
      mb={3}
    >
      {/* Header with checkbox and controls */}
      <HStack justify="space-between" mb={3}>
        <HStack>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <Badge colorPalette="purple" size="sm">
            {typeLabels[question.type]} #{index + 1}
          </Badge>
          {question.id && (
            <Code fontSize="xs" colorPalette="gray">{question.id}</Code>
          )}
        </HStack>
        {isSelected && (
          <HStack>
            <Text fontSize="xs" color="gray.400">Prio:</Text>
            <Input
              size="xs"
              width="50px"
              type="number"
              min={1}
              max={10}
              value={priority}
              onChange={(e) => onPriorityChange(parseInt(e.target.value) || 1)}
              bg="gray.700"
              borderColor="gray.600"
            />
          </HStack>
        )}
      </HStack>

      {/* Question text */}
      <Text fontWeight="medium" color="white" mb={3}>
        {question.question}
      </Text>

      {/* Code block for predict-output, spot-the-error, fill-the-blank */}
      {"code" in question && question.code && (
        <Box
          bg="gray.900"
          p={3}
          borderRadius="md"
          mb={3}
          border="1px solid"
          borderColor="gray.700"
          fontFamily="mono"
        >
          <Text as="pre" fontSize="sm" whiteSpace="pre-wrap" color="green.300" m={0}>
            {question.code}
          </Text>
        </Box>
      )}

      {/* Options with correct answer highlighted */}
      <VStack align="stretch" gap={2}>
        {question.options.map((option, i) => (
          <Box
            key={i}
            p={2}
            bg={option === question.correctAnswer ? "green.900" : "gray.700"}
            borderRadius="sm"
            border="1px solid"
            borderColor={option === question.correctAnswer ? "green.500" : "gray.600"}
          >
            <HStack align="flex-start">
              <Text fontSize="sm" color="gray.400">{String.fromCharCode(65 + i)}.</Text>
              <Text fontSize="sm" color="white" flex={1} whiteSpace="pre-wrap" fontFamily="mono">
                {option}
              </Text>
              {option === question.correctAnswer && (
                <Badge colorPalette="green" size="sm">✓ Richtig</Badge>
              )}
            </HStack>
          </Box>
        ))}
      </VStack>

      {/* Explanation */}
      {question.explanation && (
        <Box mt={3} p={2} bg="blue.900" borderRadius="sm">
          <Text fontSize="xs" color="blue.200">
            <strong>Erklärung:</strong> {question.explanation}
          </Text>
        </Box>
      )}

      {/* Used in steps */}
      {usedInSteps.length > 0 ? (
        <HStack mt={3} flexWrap="wrap">
          <Text fontSize="xs" color="gray.500">Verwendet in:</Text>
          {usedInSteps.map((stepId) => (
            <Badge key={stepId} colorPalette="green" size="xs">{stepId}</Badge>
          ))}
        </HStack>
      ) : (
        <Badge mt={3} colorPalette="yellow" size="xs">Unbenutzt</Badge>
      )}
    </Box>
  );
}

// Code Task Preview with selection controls
function CodeTaskPreview({
  task,
  index,
  isSelected,
  priority,
  onToggle,
  onPriorityChange,
}: {
  task: DrillCodeTask;
  index: number;
  isSelected: boolean;
  priority: number;
  onToggle: () => void;
  onPriorityChange: (priority: number) => void;
}) {
  const usedInSteps = getStepsForDrill(task.id);

  return (
    <Box
      bg={isSelected ? "blue.900" : "gray.800"}
      p={4}
      borderRadius="md"
      border="1px solid"
      borderColor={isSelected ? "blue.500" : "gray.600"}
      mb={3}
    >
      {/* Header with checkbox and controls */}
      <HStack justify="space-between" mb={2}>
        <HStack>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <Badge colorPalette="cyan" size="sm">
            Code-Aufgabe #{index + 1}
          </Badge>
          <Code fontSize="xs" colorPalette="gray">{task.id}</Code>
        </HStack>
        {isSelected && (
          <HStack>
            <Text fontSize="xs" color="gray.400">Prio:</Text>
            <Input
              size="xs"
              width="50px"
              type="number"
              min={1}
              max={10}
              value={priority}
              onChange={(e) => onPriorityChange(parseInt(e.target.value) || 1)}
              bg="gray.700"
              borderColor="gray.600"
            />
          </HStack>
        )}
      </HStack>

      {/* Prompt (main task description) */}
      <Text fontWeight="medium" color="white" mb={2}>
        {task.prompt}
      </Text>

      {/* Description */}
      <Text fontSize="sm" color="gray.400" mb={3}>
        {task.description}
      </Text>

      {/* Starter Code */}
      <Box mb={3}>
        <Text fontSize="xs" color="gray.500" mb={1}>Starter Code:</Text>
        <Box
          bg="gray.900"
          p={3}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.700"
          fontFamily="mono"
        >
          <Text as="pre" fontSize="sm" whiteSpace="pre-wrap" color="gray.300" m={0}>
            {task.starterCode || "# (kein Starter Code)"}
          </Text>
        </Box>
      </Box>

      {/* Solution Info */}
      <VStack align="stretch" gap={2}>
        <Box>
          <Text fontSize="xs" color="gray.500">Erwartete Ausgabe:</Text>
          <Code fontSize="sm" colorPalette="green">{task.solutionString}</Code>
        </Box>
        {task.solutionCode && (
          <Box>
            <Text fontSize="xs" color="gray.500">Code-Snippets (müssen im Code vorkommen):</Text>
            <HStack gap={1} flexWrap="wrap">
              {task.solutionCode.map((snippet, i) => (
                <Code key={i} fontSize="xs" colorPalette="yellow">{snippet}</Code>
              ))}
            </HStack>
          </Box>
        )}
      </VStack>

      {/* Used in steps */}
      {usedInSteps.length > 0 ? (
        <HStack mt={3} flexWrap="wrap">
          <Text fontSize="xs" color="gray.500">Verwendet in:</Text>
          {usedInSteps.map((stepId) => (
            <Badge key={stepId} colorPalette="green" size="xs">{stepId}</Badge>
          ))}
        </HStack>
      ) : (
        <Badge mt={3} colorPalette="yellow" size="xs">Unbenutzt</Badge>
      )}
    </Box>
  );
}

export default function DrillAssignmentPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "");
  const [selectedStep, setSelectedStep] = useState<number>(1);

  // State for drill selections: { drillId: priority }
  const [selections, setSelections] = useState<Record<string, number>>({});

  // Filter states
  const [drillFilter, setDrillFilter] = useState<"all" | "assigned" | "unassigned">("all");
  const [topicFilter, setTopicFilter] = useState<string>("relevant"); // "relevant" = nur passende Topics, oder ein spezifisches Topic

  // Get selected course and task
  const selectedCourse = useMemo(() =>
    courses.find(c => c.id === selectedCourseId),
    [selectedCourseId]
  );

  const selectedTask = useMemo(() =>
    selectedCourse?.tasks.find(t => t.step === selectedStep),
    [selectedCourse, selectedStep]
  );

  // Step ID for assignments
  const stepId = selectedTask ? `${selectedCourseId}-step-${selectedStep}` : "";

  // Load existing assignments when step changes
  useMemo(() => {
    if (stepId && drillAssignments[stepId]) {
      const existing: Record<string, number> = {};
      drillAssignments[stepId].forEach(a => {
        existing[a.drillId] = a.priority;
      });
      setSelections(existing);
    } else {
      setSelections({});
    }
  }, [stepId]);

  // All available drills organized by topic
  const drillsByTopic = useMemo(() => {
    const result: Record<string, { mcQuestions: (DrillMCQuestion & { _index: number })[]; codeTasks: DrillCodeTask[] }> = {};

    pythonDrillTasks.forEach(drill => {
      result[drill.topic] = {
        mcQuestions: drill.mcQuestions.map((q, i) => ({ ...q, _index: i })),
        codeTasks: drill.codeTasks,
      };
    });

    return result;
  }, []);

  // Toggle drill selection
  const toggleDrill = (drillId: string) => {
    setSelections(prev => {
      if (prev[drillId] !== undefined) {
        const { [drillId]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [drillId]: 5 }; // Default priority
      }
    });
  };

  // Update priority
  const updatePriority = (drillId: string, priority: number) => {
    const clampedPriority = Math.max(1, Math.min(10, priority));
    setSelections(prev => ({
      ...prev,
      [drillId]: clampedPriority,
    }));
  };

  // Generate output code
  const outputCode = useMemo(() => {
    if (Object.keys(selections).length === 0) {
      return `  // "${stepId}": [],`;
    }

    const assignments = Object.entries(selections)
      .sort((a, b) => b[1] - a[1]) // Sort by priority descending
      .map(([drillId, priority]) => `    { drillId: "${drillId}", priority: ${priority} },`)
      .join("\n");

    return `  "${stepId}": [\n${assignments}\n  ],`;
  }, [selections, stepId]);

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCode);
  };

  return (
    <AuthGuard requireAdmin={true}>
      <Box
        minH="100vh"
        py="8"
        px={{ base: "4", sm: "6" }}
        bg="var(--bgAnthrazitDark)"
        color="white"
      >
        <Box  mx="auto">
          <AdminHeader />
          <AdminNav />

          <Heading size="lg" mb={4}>
            Drill Assignment - Manuelle Zuordnung
          </Heading>

          {/* Course & Step Selection */}
          <HStack gap={4} mb={6} flexWrap="wrap">
            <Box minW="400px">
              <Text fontSize="sm" color="gray.400" mb={1}>Kurs auswählen:</Text>
              <select
                value={selectedCourseId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedStep(1);
                }}
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  width: '100%',
                  minWidth: '450px',
                  borderRadius: '5px',
                  border: '1px solid #4A5568',
                  backgroundColor: '#1A202C',
                  color: 'white'
                }}
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </Box>

            <Box minW="200px">
              <Text fontSize="sm" color="gray.400" mb={1}>Step auswählen:</Text>
              <select
                value={selectedStep}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStep(Number(e.target.value))}
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  width: '100%',
                  minWidth: '300px',
                  borderRadius: '5px',
                  border: '1px solid #4A5568',
                  backgroundColor: '#1A202C',
                  color: 'white'
                }}
              >
                {selectedCourse?.tasks.map(task => (
                  <option key={task.step} value={task.step}>
                    Step {task.step}: {task.title}
                  </option>
                ))}
              </select>
            </Box>

            {/* Selection Summary */}
            <Box ml="auto">
              <Badge colorPalette={Object.keys(selections).length > 0 ? "blue" : "gray"} size="lg" p={2}>
                {Object.keys(selections).length} Drills ausgewählt
              </Badge>
            </Box>
          </HStack>

          {/* Main Content Grid - 2 Columns */}
          <Flex gap={6} direction={{ base: "column", xl: "row" }}>
            {/* LEFT PANEL - Task Details (Full Height) */}
            <Box width={{ base: "100%", xl: "850px" }} flexShrink={0}>
              {selectedTask ? (
                <VStack align="stretch" gap={4}>
                  {/* Task Header */}
                  <Box bg="gray.900" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                    <HStack justify="space-between" mb={2}>
                      <Heading size="md">{selectedTask.title}</Heading>
                      <Badge colorPalette="blue" size="lg">Step {selectedTask.step}</Badge>
                    </HStack>
                    <Text color="gray.400">{selectedTask.description}</Text>
                  </Box>

                  {/* Meta Information */}
                  <Box bg="gray.900" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                    <Heading size="sm" mb={3}>Meta-Informationen</Heading>

                    <VStack align="stretch" gap={3}>
                      {/* Step ID */}
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>Step ID (für drillAssignments):</Text>
                        <Code fontSize="sm" colorPalette="blue">{stepId}</Code>
                      </Box>

                      {/* Topics */}
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>Topics (für Drill-Matching):</Text>
                        <HStack gap={2} flexWrap="wrap">
                          {selectedTask.topics.map(topic => (
                            <Badge key={topic} colorPalette="green" size="md">
                              {topic}
                            </Badge>
                          ))}
                        </HStack>
                      </Box>

                      {/* Solution String */}
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>Expected Output (solutionString):</Text>
                        <Box bg="gray.800" p={2} borderRadius="md">
                          <Code fontSize="sm" whiteSpace="pre-wrap" colorPalette="green">
                            {Array.isArray(selectedTask.solutionString)
                              ? selectedTask.solutionString.join("\n")
                              : selectedTask.solutionString
                            }
                          </Code>
                        </Box>
                      </Box>

                      {/* Task Path */}
                      <HStack gap={4}>
                        <Box>
                          <Text fontSize="xs" color="gray.500">Task ID:</Text>
                          <Code fontSize="xs">{selectedTask.id}</Code>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500">Path:</Text>
                          <Code fontSize="xs">{selectedTask.path}</Code>
                        </Box>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Content Blocks (Aufgabenstellung) - FULL HEIGHT, no scroll */}
                  <Box bg="gray.900" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                    <Heading size="sm" mb={3}>Aufgabenstellung (Content Blocks)</Heading>
                    {selectedTask.blocks.map((block, i) => (
                      <ContentBlock key={i} block={block} />
                    ))}
                  </Box>

                  {/* Starter Code with Monaco Editor */}
                  <Box bg="gray.900" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                    <Heading size="sm" mb={3}>Starter Code</Heading>
                    <Box border="1px solid" borderColor="gray.700" borderRadius="md" overflow="hidden">
                      <Editor
                        height="200px"
                        defaultLanguage="python"
                        value={selectedTask.starterCode}
                        theme="vs-dark"
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    </Box>
                  </Box>
                </VStack>
              ) : (
                <Box p={8} textAlign="center" color="gray.500" bg="gray.900" borderRadius="lg">
                  Keine Task ausgewählt
                </Box>
              )}
            </Box>

            {/* RIGHT PANEL - Drill Selection + Output */}
            <Box flex="1" minW="0">
              {/* Output Panel (Top, sticky) */}
              <Box
                bg="gray.900"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.700"
                position="sticky"
                top={4}
                zIndex={10}
                mb={4}
              >
                <HStack justify="space-between" mb={3}>
                  <Heading size="sm">Result (zum Kopieren)</Heading>
                  <HStack>
                    <Badge colorPalette="purple" size="sm">
                      {Object.keys(selections).filter(id => id.startsWith("mcq-")).length} MC
                    </Badge>
                    <Badge colorPalette="cyan" size="sm">
                      {Object.keys(selections).filter(id => id.startsWith("code-")).length} Code
                    </Badge>
                    <Button size="sm" colorScheme="blue" onClick={copyToClipboard}>
                      Copy
                    </Button>
                  </HStack>
                </HStack>

                <Box
                  bg="gray.950"
                  p={3}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.700"
                  fontFamily="mono"
                  fontSize="xs"
                  overflowX="auto"
                  maxH="150px"
                  overflowY="auto"
                >
                  <Text as="pre" whiteSpace="pre-wrap" color="green.300" m={0}>
                    {outputCode}
                  </Text>
                </Box>

                <Text fontSize="xs" color="gray.500" mt={2}>
                  Kopiere diesen Code in drillAssignments.ts
                </Text>
              </Box>

              {/* Drill Selection Header */}
              <Box bg="gray.900" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700" mb={4}>
                <Heading size="md" mb={2}>Drills zum Auswählen</Heading>
                <Text fontSize="sm" color="gray.400" mb={4}>
                  Wähle Drills aus und setze Prioritäten (1-10). Höher = wichtiger.
                </Text>

                {/* Filter Controls */}
                <HStack gap={4} flexWrap="wrap">
                  {/* Drill Status Filter */}
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1}>Status-Filter:</Text>
                    <HStack gap={1}>
                      <Button
                        size="xs"
                        variant={drillFilter === "all" ? "solid" : "outline"}
                        colorScheme={drillFilter === "all" ? "blue" : "gray"}
                        onClick={() => setDrillFilter("all")}
                      >
                        Alle
                      </Button>
                      <Button
                        size="xs"
                        variant={drillFilter === "assigned" ? "solid" : "outline"}
                        colorScheme={drillFilter === "assigned" ? "green" : "gray"}
                        onClick={() => setDrillFilter("assigned")}
                      >
                        Zugewiesen ({Object.keys(selections).length})
                      </Button>
                      <Button
                        size="xs"
                        variant={drillFilter === "unassigned" ? "solid" : "outline"}
                        colorScheme={drillFilter === "unassigned" ? "yellow" : "gray"}
                        onClick={() => setDrillFilter("unassigned")}
                      >
                        Nicht zugewiesen
                      </Button>
                    </HStack>
                  </Box>

                  {/* Topic Filter */}
                  <Box minW="200px">
                    <Text fontSize="xs" color="gray.500" mb={1}>Topic-Filter:</Text>
                    <select
                      value={topicFilter}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTopicFilter(e.target.value)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '14px',
                        width: '100%',
                        borderRadius: '5px',
                        border: '1px solid #4A5568',
                        backgroundColor: '#1A202C',
                        color: 'white'
                      }}
                    >
                      <option value="relevant">Nur relevante Topics ({selectedTask?.topics.join(", ") || "-"})</option>
                      <option value="all">Alle Topics anzeigen</option>
                      <optgroup label="Einzelnes Topic">
                        {Object.keys(drillsByTopic).map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </optgroup>
                    </select>
                  </Box>
                </HStack>
              </Box>

              {/* Drill Topics with full previews */}
              {Object.entries(drillsByTopic)
                // Topic Filter: welche Topics zeigen
                .filter(([topic]) => {
                  if (topicFilter === "all") return true;
                  if (topicFilter === "relevant") {
                    return selectedTask?.topics.includes(topic as typeof selectedTask.topics[number]);
                  }
                  return topic === topicFilter; // Einzelnes Topic
                })
                .map(([topic, drills]) => {
                const isTopicRelevant = selectedTask?.topics.includes(topic as typeof selectedTask.topics[number]);

                // Filter MCQs basierend auf drillFilter
                const filteredMCQs = drills.mcQuestions
                  .filter(q => q.id)
                  .filter(q => {
                    if (drillFilter === "all") return true;
                    if (drillFilter === "assigned") return selections[q.id!] !== undefined;
                    if (drillFilter === "unassigned") return selections[q.id!] === undefined;
                    return true;
                  });

                // Filter Code Tasks basierend auf drillFilter
                const filteredCodeTasks = drills.codeTasks.filter(task => {
                  if (drillFilter === "all") return true;
                  if (drillFilter === "assigned") return selections[task.id] !== undefined;
                  if (drillFilter === "unassigned") return selections[task.id] === undefined;
                  return true;
                });

                const totalFilteredDrills = filteredMCQs.length + filteredCodeTasks.length;

                // Wenn keine Drills nach Filter übrig, Topic nicht anzeigen
                if (totalFilteredDrills === 0) return null;

                return (
                  <CollapsibleSection
                    key={topic}
                    title={`Topic: ${topic}`}
                    badge={`${totalFilteredDrills} Drills${isTopicRelevant ? " - Relevant" : ""}`}
                    defaultOpen={topicFilter !== "all" || isTopicRelevant}
                  >
                    {/* MC Questions with full preview */}
                    {filteredMCQs.length > 0 && (
                      <Box mb={4}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2}>
                          Multiple-Choice Fragen ({filteredMCQs.length}):
                        </Text>
                        {filteredMCQs.map((q, i) => (
                            <MCQuestionPreview
                              key={q.id}
                              question={q}
                              index={i}
                              isSelected={selections[q.id!] !== undefined}
                              priority={selections[q.id!] || 5}
                              onToggle={() => toggleDrill(q.id!)}
                              onPriorityChange={(p) => updatePriority(q.id!, p)}
                            />
                          ))}
                      </Box>
                    )}

                    {/* Code Tasks with full preview */}
                    {filteredCodeTasks.length > 0 && (
                      <Box>
                        <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2}>
                          Code-Aufgaben ({filteredCodeTasks.length}):
                        </Text>
                        {filteredCodeTasks.map((task, i) => (
                          <CodeTaskPreview
                            key={task.id}
                            task={task}
                            index={i}
                            isSelected={selections[task.id] !== undefined}
                            priority={selections[task.id] || 5}
                            onToggle={() => toggleDrill(task.id)}
                            onPriorityChange={(p) => updatePriority(task.id, p)}
                          />
                        ))}
                      </Box>
                    )}
                  </CollapsibleSection>
                );
              })}
            </Box>
          </Flex>
        </Box>
      </Box>
    </AuthGuard>
  );
}
