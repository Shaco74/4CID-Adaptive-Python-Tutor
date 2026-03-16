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
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import AuthGuard from "@/components/AuthGuard";
import { AdminHeader } from "../components/AdminHeader";
import { AdminNav } from "../components/AdminNav";
import { ContentBlock } from "@/components/course/ContentBlock";

// Course Data Imports
import { bmiCalculatorCourseData } from "@/courses/bmiCalculatorCourseData";
import { interestCalculatorCourseData } from "@/courses/interestCalculatorCourseData";
import { pythonDrillTasks } from "@/courses/pythonDrillTasks";

import type { CourseData, CourseTask, DrillTask, DrillMCQuestion, DrillCodeTask } from "@/types/courseTypes";

// Available courses
const courses: CourseData[] = [bmiCalculatorCourseData, interestCalculatorCourseData];

// Helper function to find matching drills for a task
function findMatchingDrills(task: CourseTask): DrillTask[] {
  if (!task.topics || task.topics.length === 0) return [];

  return pythonDrillTasks.filter(drill =>
    task.topics.includes(drill.topic as typeof task.topics[number])
  );
}

// Preview component for MC Questions (non-interactive)
function MCQuestionPreview({ question, index }: { question: DrillMCQuestion; index: number }) {
  const typeLabels = {
    "multiple-choice": "Multiple Choice",
    "spot-the-error": "Fehler finden",
    "predict-output": "Ausgabe vorhersagen",
    "fill-the-blank": "Lückentext"
  };

  return (
    <Box
      bg="gray.800"
      p={4}
      borderRadius="md"
      border="1px solid"
      borderColor="gray.600"
      mb={3}
    >
      <HStack justify="space-between" mb={2}>
        <Badge colorPalette="purple" size="sm">
          {typeLabels[question.type]} #{index + 1}
        </Badge>
      </HStack>

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

      {question.explanation && (
        <Box mt={3} p={2} bg="blue.900" borderRadius="sm">
          <Text fontSize="xs" color="blue.200">
            <strong>Erklärung:</strong> {question.explanation}
          </Text>
        </Box>
      )}
    </Box>
  );
}

// Preview component for Code Tasks (non-interactive)
function CodeTaskPreview({ task, index }: { task: DrillCodeTask; index: number }) {
  return (
    <Box
      bg="gray.800"
      p={4}
      borderRadius="md"
      border="1px solid"
      borderColor="gray.600"
      mb={3}
    >
      <HStack justify="space-between" mb={2}>
        <Badge colorPalette="cyan" size="sm">
          Code-Aufgabe #{index + 1}
        </Badge>
        <Text fontSize="xs" color="gray.500">ID: {task.id}</Text>
      </HStack>

      <Text fontWeight="medium" color="white" mb={2}>
        {task.prompt}
      </Text>

      <Text fontSize="sm" color="gray.400" mb={2}>
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
            {task.starterCode}
          </Text>
        </Box>
      </Box>

      {/* Solution Info */}
      <HStack gap={4} flexWrap="wrap">
        <Box>
          <Text fontSize="xs" color="gray.500">Erwartete Ausgabe:</Text>
          <Code fontSize="sm" colorPalette="green">{task.solutionString}</Code>
        </Box>
        {task.solutionCode && (
          <Box>
            <Text fontSize="xs" color="gray.500">Code-Snippets:</Text>
            <HStack gap={1} flexWrap="wrap">
              {task.solutionCode.map((snippet, i) => (
                <Code key={i} fontSize="xs" colorPalette="yellow">{snippet}</Code>
              ))}
            </HStack>
          </Box>
        )}
      </HStack>
    </Box>
  );
}

// Drill Preview Component
function DrillPreview({ drill }: { drill: DrillTask }) {
  return (
    <Box
      bg="gray.900"
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.700"
      mb={4}
    >
      <HStack justify="space-between" mb={3}>
        <Heading size="sm" color="white">
          Topic: {drill.topic}
        </Heading>
        <HStack>
          <Badge colorPalette="purple">{drill.mcQuestions.length} MC</Badge>
          <Badge colorPalette="cyan">{drill.codeTasks.length} Code</Badge>
        </HStack>
      </HStack>

      <Separator mb={4} />

      {/* MC Questions */}
      {drill.mcQuestions.length > 0 && (
        <Box mb={4}>
          <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2}>
            Multiple-Choice Fragen:
          </Text>
          {drill.mcQuestions.map((q, i) => (
            <MCQuestionPreview key={i} question={q} index={i} />
          ))}
        </Box>
      )}

      {/* Code Tasks */}
      {drill.codeTasks.length > 0 && (
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2}>
            Code-Aufgaben:
          </Text>
          {drill.codeTasks.map((task, i) => (
            <CodeTaskPreview key={task.id} task={task} index={i} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function CourseReviewPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "");
  const [selectedStep, setSelectedStep] = useState<number>(1);

  // Get selected course
  const selectedCourse = useMemo(() =>
    courses.find(c => c.id === selectedCourseId),
    [selectedCourseId]
  );

  // Get selected task
  const selectedTask = useMemo(() =>
    selectedCourse?.tasks.find(t => t.step === selectedStep),
    [selectedCourse, selectedStep]
  );

  // Get matching drills for the selected task
  const matchingDrills = useMemo(() =>
    selectedTask ? findMatchingDrills(selectedTask) : [],
    [selectedTask]
  );

  return (
    <AuthGuard requireAdmin={true}>
      <Box
        minH="100vh"
        py="8"
        px={{ base: "4", sm: "6" }}
        bg="var(--bgAnthrazitDark)"
        color="white"
      >
        <Box maxW="1800px" mx="auto">
          <AdminHeader />
          <AdminNav />

          <Heading size="lg" mb={4}>
            Course Review - Drill Matching
          </Heading>

          {/* Course & Step Selection */}
          <HStack gap={4} mb={6} flexWrap="wrap">
            <Box minW="200px">
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
                  minWidth: '250px',
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
          </HStack>

          {/* Main Content Grid */}
          <Flex gap={6} direction={{ base: "column", xl: "row" }}>
            {/* LEFT PANEL - Task Details */}
            <Box flex="1" minW="0">
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
                      {/* Topics */}
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Topics (für Drill-Matching):</Text>
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
                        <Text fontSize="sm" color="gray.500" mb={1}>Solution String:</Text>
                        <Box bg="gray.800" p={2} borderRadius="md">
                          <Code fontSize="sm" whiteSpace="pre-wrap">
                            {Array.isArray(selectedTask.solutionString)
                              ? selectedTask.solutionString.join("\n")
                              : selectedTask.solutionString
                            }
                          </Code>
                        </Box>
                      </Box>

                      {/* Task ID & Path */}
                      <HStack gap={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Task ID:</Text>
                          <Code fontSize="xs">{selectedTask.id}</Code>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">Path:</Text>
                          <Code fontSize="xs">{selectedTask.path}</Code>
                        </Box>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Task Content (Blocks) */}
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
                        height="300px"
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
                <Box p={8} textAlign="center" color="gray.500">
                  Keine Task ausgewählt
                </Box>
              )}
            </Box>

            {/* RIGHT PANEL - Matching Drills */}
            <Box flex="1" minW="0">
              <Box bg="gray.900" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700" mb={4}>
                <HStack justify="space-between">
                  <Heading size="md">Matching Drills</Heading>
                  <Badge colorPalette={matchingDrills.length > 0 ? "green" : "red"} size="lg">
                    {matchingDrills.length} Drill{matchingDrills.length !== 1 ? "s" : ""} gefunden
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.400" mt={2}>
                  Drills werden basierend auf den Topics der Aufgabe ausgewählt:
                  {selectedTask?.topics.map(t => ` "${t}"`).join(", ")}
                </Text>
              </Box>

              {matchingDrills.length > 0 ? (
                <VStack align="stretch" gap={4}>
                  {matchingDrills.map(drill => (
                    <DrillPreview key={drill.topic} drill={drill} />
                  ))}
                </VStack>
              ) : (
                <Box p={8} textAlign="center" color="gray.500" bg="gray.900" borderRadius="lg">
                  Keine Drills für die aktuellen Topics gefunden.
                  <br />
                  <Text fontSize="sm" mt={2}>
                    Überprüfe die Topics in der Aufgabe: {selectedTask?.topics.join(", ") || "keine"}
                  </Text>
                </Box>
              )}
            </Box>
          </Flex>
        </Box>
      </Box>
    </AuthGuard>
  );
}
