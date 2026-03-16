"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from "next/navigation";
import CourseLayout from "@/components/course/CourseLayout";
import { addCompletedStep, getCourseForUser } from '@/db/utils';
import type { CourseTask } from '@/types/courseTypes';
import { useUser } from '@/context/UserContext';
import { showStepSuccessToast, showProgressErrorToast, showLoginRequiredToast, showAllStepsFinishedToast } from '@/util/hooks/useStandardToaster';
import AuthGuard from "@/components/AuthGuard";
import { getBmiCourseData, getBmiCourseTask, type Locale } from '@/courses/getCourseData';
import { logCourseAccess, logStepStart } from '@/db/eventTracking';
import { useLocale } from 'next-intl';

interface BmiCalculatorCourseProps {
  step: number;
}

export default function BmiCalculatorCourse({ step }: BmiCalculatorCourseProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [courseTask, setCourseTask] = useState<CourseTask | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { userId, isLoggedIn } = useUser();

  // Memoize course data based on locale
  const courseData = useMemo(() => getBmiCourseData(locale), [locale]);
  const courseLength = courseData.tasks.length;
  const stepTitles = useMemo(() => courseData.tasks.map(task => task.title), [courseData]);
  const courseTitle = locale === 'en' ? 'BMI Calculator' : 'BMI-Rechner';

  useEffect(() => {
    document.title = `Python Bootcamp - ${courseTitle} Step ${step}`;

    const taskData = getBmiCourseTask(step, locale);
    setCourseTask(taskData);

    if (!taskData) {
      router.push('/pfade/bmi-calculator/1');
    }
  }, [step, router, locale, courseTitle]);

  // Load completed steps and log step start with isRetry
  useEffect(() => {
    async function loadCompletedStepsAndLogStart() {
      if (isLoggedIn && userId) {
        try {
          const courseData = await getCourseForUser(userId, 'bmi-calculator');
          let isCompleted = false;

          if (courseData && courseData.completedSteps) {
            setCompletedSteps(courseData.completedSteps);
            isCompleted = courseData.completedSteps.includes(step);
          }

          // Log course access (first access = step 1)
          logCourseAccess(userId, 'bmi-calculator', step === 1).catch(error => {
            console.error('❌ Error tracking course access:', error);
          });

          // Log step start with correct isRetry flag
          const taskDataForLog = getBmiCourseTask(step, locale);
          if (taskDataForLog) {
            logStepStart(
              userId,
              'bmi-calculator',
              step.toString(),
              step,
              taskDataForLog.title || `Step ${step}`,
              isCompleted // isRetry: true if step was already completed
            ).catch(error => {
              console.error('❌ Error tracking step start:', error);
            });
          }
        } catch (error) {
          console.error('❌ Error loading completed steps:', error);
        }
      }
    }
    loadCompletedStepsAndLogStart();
  }, [step, isLoggedIn, userId, locale]);

  const handlePrevStep = () => {
    if (step > 1) {
      router.push(`/pfade/bmi-calculator/${step - 1}`);
    }
  };

  const handleNavigateToStep = (targetStep: number) => {
    router.push(`/pfade/bmi-calculator/${targetStep}`);
  };

  const handleNextStep = async () => {
    // Note: logStepComplete is now called in CourseLayout with actual metrics
    if (isLoggedIn && userId) {
      try {
        // Speichere Progress direkt mit Firebase Client SDK
        await addCompletedStep(userId, 'bmi-calculator', step);
        // // console.log('✅ Progress saved successfully:', { userId, courseId: 'bmi-calculator', step });

        // Update local completedSteps state
        setCompletedSteps(prev => Array.from(new Set([...prev, step])).sort((a, b) => a - b));

        showStepSuccessToast(step, locale);
      } catch (error) {
        console.error('❌ Error saving progress:', error);
        showProgressErrorToast(locale);
      }
    } else {
      // // console.warn('⚠️ User not logged in, skipping progress save');
      showLoginRequiredToast(locale);
    }

    if (step < courseLength) {
      router.push(`/pfade/bmi-calculator/${step + 1}`);
    } else {
      showAllStepsFinishedToast(locale);
      router.push('/');
    }
  };

  const getDefaultCode = (task: CourseTask | null): string => {
    if (!task || !task.starterCode) {
      return locale === 'en' ? "# Write your code here" : "# Schreibe deinen Code hier";
    }
    return task.starterCode;
  };

  if (!courseTask) {
    return <div>Loading...</div>;
  }

  return (
    <AuthGuard>
      <CourseLayout
        courseId="bmi-calculator"
        title={courseTitle}
        step={step}
        courseTask={courseTask}
        defaultCode={getDefaultCode(courseTask)}
        onNextStep={handleNextStep}
        onPrevStep={step > 1 ? handlePrevStep : undefined}
        isFirstStep={step === 1}
        isLastStep={step === courseLength}
        totalSteps={courseLength}
        completedSteps={completedSteps}
        onNavigateToStep={handleNavigateToStep}
        stepTitles={stepTitles}
        isStepAlreadyCompleted={completedSteps.includes(step)}
      />
    </AuthGuard>
  );
}