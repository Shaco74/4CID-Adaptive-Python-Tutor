"use client";

import React, { useState, useMemo } from "react";
import { Box, Text, Button, Flex, SimpleGrid } from "@chakra-ui/react";
import Link from "next/link";
import { getCoursesData, type Locale } from "@/courses/getCourseData";
import type { CourseChapter } from "@/courses/coursesData";
import { useUser } from "@/context/UserContext";
import { useCourseProgress } from "@/context/CourseProgressContext";
import styles from "./CourseCard.module.scss";
import { useTranslations, useLocale } from "next-intl";


interface CourseCardProps {
  course: CourseChapter;
}

export default function CourseCard({ course }: CourseCardProps) {
  const locale = useLocale() as Locale;
  const coursesData = useMemo(() => getCoursesData(locale), [locale]);
  const [isOpen, setIsOpen] = useState(course.id === coursesData[0].id);
  const { isLoggedIn } = useUser();
  const { allProgress } = useCourseProgress();
  const t = useTranslations("home.courses");

// // console.log(allProgress);

  // Find the course progress from the global context
  const courseProgress = useMemo(() => {
    return allProgress.find(progress => progress.courseId === course.id);
  }, [allProgress, course.id]);

  // Get completed steps from the course progress
  const completedSteps = useMemo(() => {
    return courseProgress?.completedSteps || [];
  }, [courseProgress]);

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.includes(stepIndex);
  };

  // Determine the next available step (first uncompleted step)
  const nextAvailableStep = useMemo(() => {
    for (let i = 1; i <= course.steps; i++) {
      if (!completedSteps.includes(i)) {
        return i;
      }
    }
    return course.steps; // All completed, allow access to last step for review
  }, [completedSteps, course.steps]);

  // Check if a step is accessible (completed or next available)
  const isStepAccessible = (stepNumber: number) => {
    return completedSteps.includes(stepNumber) || stepNumber === nextAvailableStep;
  };

  // Check if prerequisite course is completed
  const isLocked = useMemo(() => {
    if (!course.prerequisiteCourseId) return false; // No prerequisite = unlocked

    const prerequisiteProgress = allProgress.find(
      progress => progress.courseId === course.prerequisiteCourseId
    );

    if (!prerequisiteProgress) return true; // Prerequisite not started = locked

    // Find prerequisite course to get total steps
    const prerequisiteCourse = coursesData.find(c => c.id === course.prerequisiteCourseId);
    if (!prerequisiteCourse) return true;

    // Check if all steps are completed
    return prerequisiteProgress.completedSteps.length < prerequisiteCourse.steps;
  }, [course.prerequisiteCourseId, allProgress]);

  // Check if course is completed
  const isCompleted = useMemo(() => {
    return completedSteps.length === course.steps && course.steps > 0;
  }, [completedSteps.length, course.steps]);

  // Determine colors based on state
  const headerColor = isLocked ? { base: "gray.500", _light: "gray.400" } :
                      isCompleted ? { base: "green.400", _light: "green.600" } :
                      { base: "blue.400", _light: "blue.600" };

  const borderColor = isLocked ? "gray.600" :
                      isCompleted ? "green.500" :
                      "blue.500";

  // Get card class based on state
  const cardClass = `${styles.courseCard} ${isLocked ? styles["courseCard--locked"] : ""} ${isCompleted ? styles["courseCard--completed"] : ""}`;

  return (
    <Box className={cardClass} opacity={isLocked ? 0.6 : 1}>
      <Flex
        as="button"
        onClick={() => !isLocked && setIsOpen(!isOpen)}
        className={`${styles.courseCard__header} ${isOpen ? styles["courseCard__header--open"] : styles["courseCard__header--closed"]}`}
        borderLeftColor={borderColor}
        cursor={isLocked ? "not-allowed" : "pointer"}
      >
        <Text fontSize="lg" fontWeight="semibold" color={headerColor}>
          {isLocked && "🔒 "}
          {isCompleted && "✅ "}
          {course.title}
        </Text>
        <Text
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          bg={
            isLocked ? "whiteAlpha.100" :
            isCompleted ? "green.500" :
            course.steps > 0 ? "blue.500" : "whiteAlpha.200"
          }
          color="white"
          fontWeight="semibold"
          letterSpacing="wide"
        >
          {isLocked ? t("locked") :
           isCompleted ? t("completed") :
           course.steps > 0 ? t("stepsAvailable", { count: course.steps }) : t("comingSoon")}
        </Text>
        {course.optional && (
          <Text
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            bg="purple.500"
            color="white"
            fontWeight="semibold"
            letterSpacing="wide"
          >
            {t("optional")}
          </Text>
        )}
        <Box flex="1" />
        {!isLocked && (
          <Text
            fontSize="lg"
            color={headerColor}
            transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
            transition="transform 0.2s"
            opacity={0.7}
          >
            ▼
          </Text>
        )}
      </Flex>

      {isOpen && !isLocked && (
        <Box className={styles.courseCard__content}>
          <Text mb={4} color="gray.300" lineHeight="tall">{course.description}</Text>

          {course.steps > 0 && (
            <>
              <Text fontWeight="semibold" mb={3} color={isCompleted ? "green.300" : "blue.300"}>
                {isCompleted ? t("allStepsCompleted") : t("availableSteps")}
              </Text>

              {!isLoggedIn && (
                <Box
                  mb={4}
                  p={3}
                  bg="orange.900"
                  borderRadius="lg"
                  borderLeft="3px solid"
                  borderColor="orange.400"
                >
                  <Text fontSize="sm" color="orange.200">
                    {t("loginToSaveProgress")}
                  </Text>
                </Box>
              )}

              <SimpleGrid columns={[4, 6, 12]} gap={3} mb={3}>
                {Array.from({ length: course.steps }, (_, i) => {
                  const stepNumber = i + 1;
                  const completed = isStepCompleted(stepNumber);
                  const accessible = isStepAccessible(stepNumber);
                  const isNextStep = stepNumber === nextAvailableStep && !completed;

                  const button = (
                    <Button
                      bg={
                        completed ? "green.500" :
                        isNextStep ? "blue.500" :
                        accessible ? "rgba(66, 153, 225, 0.3)" :
                        "whiteAlpha.100"
                      }
                      color={accessible ? "white" : "gray.500"}
                      variant="solid"
                      className={`${styles.courseCard__stepButton} ${completed ? styles["courseCard__stepButton--completed"] : styles["courseCard__stepButton--pending"]}`}
                      title={
                        completed ? t("stepCompleted", { step: stepNumber }) :
                        accessible ? t("step", { step: stepNumber }) :
                        t("stepLocked", { step: stepNumber })
                      }
                      cursor={accessible ? "pointer" : "not-allowed"}
                      opacity={accessible ? 1 : 0.5}
                      _hover={accessible ? { transform: "scale(1.05)" } : {}}
                    >
                      {!accessible && "🔒"}
                      {accessible && stepNumber}
                      {completed && <Box className={styles.courseCard__stepIndicator} />}
                    </Button>
                  );

                  return accessible ? (
                    <Link key={i} href={`${course.path}/${stepNumber}`}>
                      {button}
                    </Link>
                  ) : (
                    <Box key={i}>{button}</Box>
                  );
                })}
              </SimpleGrid>

              {isLoggedIn && completedSteps.length > 0 && (
                <Box
                  mt={4}
                  p={3}
                  bg="whiteAlpha.100"
                  borderRadius="lg"
                  display="inline-block"
                >
                  <Text fontSize="sm" color="green.300" fontWeight="medium">
                    ✓ {t("progress", { completed: completedSteps.length, total: course.steps })}
                  </Text>
                </Box>
              )}
            </>
          )}

          {course.steps === 0 && (
            <Box
              p={4}
              bg="whiteAlpha.100"
              borderRadius="lg"
              textAlign="center"
            >
              <Text fontStyle="italic" color="blue.300">
                {t("comingSoonMessage")}
              </Text>
            </Box>
          )}
        </Box>
      )}

      {isOpen && isLocked && (
        <Box className={styles.courseCard__content}>
          <Text mb={3} color="gray.400" fontWeight="medium">🔒 {t("courseLocked")}</Text>
          <Text fontSize="sm" color="gray.500">
            {t("lockedMessage", { course: coursesData.find(c => c.id === course.prerequisiteCourseId)?.title || "" })}
          </Text>
        </Box>
      )}
    </Box>
  );
}
