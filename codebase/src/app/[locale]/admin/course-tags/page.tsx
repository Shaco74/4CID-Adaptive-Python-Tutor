"use client";

import React from "react";
import { Box, Heading, Stack, Text, Code, VStack, HStack, Badge } from "@chakra-ui/react";
import { bmiCalculatorCourseData } from "@/courses/bmiCalculatorCourseData";
import { interestCalculatorCourseData } from "@/courses/interestCalculatorCourseData";
import { pythonDrillTasks } from "@/courses/pythonDrillTasks";
import { AdminNav } from "../components/AdminNav";
import type { DrillTopic } from "@/types/courseTypes";
import AuthGuard from "@/components/AuthGuard";

export default function AdminCourseTagsPage() {
  React.useEffect(() => {
    document.title = "Python Bootcamp - Admin Course Tags";
  }, []);

  const courses = [
    { id: "bmi-calculator", data: bmiCalculatorCourseData },
    { id: "interest-calculator", data: interestCalculatorCourseData },
  ];

  // Get available drill topics
  const drillTopics = pythonDrillTasks.map((drill) => drill.topic);

  return (
    <AuthGuard requireAdmin={true}>
      <Box
        py="8"
        px={{ base: "4", sm: "10" }}
        bg="var(--bgAnthrazitDark)"
        minH="100vh"
        color="white"
      >
        <VStack align="stretch" gap={6} maxW="1200px" mx="auto">
          <AdminNav />
          <Box>
          <Heading size="2xl" mb={2}>
            Course Tags Overview
          </Heading>
          <Text color="gray.400" mb={4}>
            Welche Topics hat jeder Step? Zum Abgleich mit verfügbaren Drills.
          </Text>

          {/* Available Drill Topics */}
          <Box mb={6} p={4} bg="green.900" borderRadius="md" borderWidth="1px" borderColor="green.700">
            <Text fontSize="sm" color="green.200" mb={2}>
              Verfügbare Drill-Topics:
            </Text>
            <HStack wrap="wrap" gap={2}>
              {drillTopics.map((topic) => (
                <Badge key={topic} colorScheme="green" fontSize="sm" px={3} py={1}>
                  {topic}
                </Badge>
              ))}
            </HStack>
          </Box>
        </Box>

        {/* Course by Course */}
        {courses.map((course) => (
          <Box key={course.id}>
            <Heading size="lg" mb={4} color="blue.300">
              {course.data.title}
            </Heading>

            <Stack gap={3}>
              {course.data.tasks.map((task) => (
                <Box
                  key={task.id}
                  p={4}
                  bg="gray.800"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.700"
                >
                  <VStack align="stretch" gap={2}>
                    {/* Step Header */}
                    <HStack justify="space-between">
                      <HStack gap={3}>
                        <Badge colorScheme="purple" fontSize="md" px={2}>
                          Step {task.step}
                        </Badge>
                        {task.step > 1 && (
                          <Badge colorScheme="cyan" fontSize="xs" px={2}>
                            → Drill nach diesem Step
                          </Badge>
                        )}
                        <Text fontSize="lg" fontWeight="semibold">
                          {task.title}
                        </Text>
                      </HStack>
                    </HStack>

                    {/* Topics */}
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Topics:
                      </Text>
                      <HStack wrap="wrap" gap={2}>
                        {task.topics && task.topics.length > 0 ? (
                          task.topics.map((topic, idx) => {
                            const hasMatchingDrill = drillTopics.includes(topic);
                            return (
                              <Badge
                                key={idx}
                                colorScheme={hasMatchingDrill ? "green" : "orange"}
                                fontSize="sm"
                                px={3}
                                py={1}
                              >
                                {topic} {hasMatchingDrill ? "✓" : "⚠"}
                              </Badge>
                            );
                          })
                        ) : (
                          <Text fontSize="sm" color="red.400">
                            ⚠ Keine Topics definiert
                          </Text>
                        )}
                      </HStack>
                    </Box>

                    {/* Task ID */}
                    <Code fontSize="xs" colorScheme="gray" p={1}>
                      {task.id}
                    </Code>
                  </VStack>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
        </VStack>
      </Box>
    </AuthGuard>
  );
}
