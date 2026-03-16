"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from "next/navigation";
import CourseLayout from "@/components/course/CourseLayout";
import { addCompletedStep, getCourseForUser } from '@/db/utils';
import { CourseTask } from '@/types/courseTypes';
import { useUser } from '@/context/UserContext';
import { showStepSuccessToast, showProgressErrorToast, showLoginRequiredToast, showAllStepsFinishedToast } from '@/util/hooks/useStandardToaster';
import AuthGuard from "@/components/AuthGuard";
import { getInterestCalculatorData, getInterestCalculatorTask, type Locale } from '@/courses/getCourseData';
import { logCourseAccess, logStepStart } from '@/db/eventTracking';
import { useLocale } from 'next-intl';

interface InterestCalculatorCourseProps {
  step: number;
}

export default function InterestCalculatorCourse({ step }: InterestCalculatorCourseProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [courseTask, setCourseTask] = useState<CourseTask | null>(null);
  const [isStepAlreadyCompleted, setIsStepAlreadyCompleted] = useState<boolean>(false);
  const { userId, isLoggedIn } = useUser();

  // Memoize course data based on locale
  const courseData = useMemo(() => getInterestCalculatorData(locale), [locale]);
  const courseLength = courseData.tasks.length;
  const stepTitles = useMemo(() => courseData.tasks.map(task => task.title), [courseData]);
  const courseTitle = locale === 'en' ? 'Interest Calculator' : 'Zinsrechner';

  useEffect(() => {
    document.title = `Python Bootcamp - ${courseTitle} Step ${step}`;

    const taskData = getInterestCalculatorTask(step, locale);
    setCourseTask(taskData);

    if (!taskData) {
      router.push('/pfade/interest-calculator/1');
    }
  }, [step, router, locale, courseTitle]);

  // Check if current step is already completed and log step start with isRetry
  useEffect(() => {
    const checkStepCompletionAndLogStart = async () => {
      if (isLoggedIn && userId) {
        try {
          const taskData = getInterestCalculatorTask(step, locale);
          const userCourseData = await getCourseForUser(userId, 'interest-calculator');
          let isCompleted = false;

          if (userCourseData && userCourseData.completedSteps) {
            isCompleted = userCourseData.completedSteps.includes(step);
            setIsStepAlreadyCompleted(isCompleted);
          } else {
            setIsStepAlreadyCompleted(false);
          }

          // Log course access (first access = step 1)
          logCourseAccess(userId, 'interest-calculator', step === 1).catch(error => {
            console.error('❌ Error tracking course access:', error);
          });

          // Log step start with correct isRetry flag
          if (taskData) {
            logStepStart(
              userId,
              'interest-calculator',
              step.toString(),
              step,
              taskData.title || `Step ${step}`,
              isCompleted // isRetry: true if step was already completed
            ).catch(error => {
              console.error('❌ Error tracking step start:', error);
            });
          }
        } catch (error) {
          console.error('❌ Error checking step completion:', error);
          setIsStepAlreadyCompleted(false);
        }
      } else {
        setIsStepAlreadyCompleted(false);
      }
    };

    checkStepCompletionAndLogStart();
  }, [step, userId, isLoggedIn, locale]);

  // Load all completed steps for navigation
  const [allCompletedSteps, setAllCompletedSteps] = React.useState<number[]>([]);

  useEffect(() => {
    const loadAllCompletedSteps = async () => {
      if (isLoggedIn && userId) {
        try {
          const courseData = await getCourseForUser(userId, 'interest-calculator');
          if (courseData && courseData.completedSteps) {
            setAllCompletedSteps(courseData.completedSteps);
          }
        } catch (error) {
          console.error('❌ Error loading completed steps:', error);
        }
      }
    };

    loadAllCompletedSteps();
  }, [userId, isLoggedIn]);

  const handleNavigateToStep = (targetStep: number) => {
    router.push(`/pfade/interest-calculator/${targetStep}`);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      router.push(`/pfade/interest-calculator/${step - 1}`);
    }
  };

  const handleNextStep = async () => {
    // Note: logStepComplete is now called in CourseLayout with actual metrics
    if (isLoggedIn && userId) {
      try {
        await addCompletedStep(userId, 'interest-calculator', step);
        // // console.log('✅ Progress saved successfully:', { userId, courseId: 'interest-calculator', step });

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
      router.push(`/pfade/interest-calculator/${step + 1}`);
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
        courseId="interest-calculator"
        title={courseTitle}
        step={step}
        courseTask={courseTask}
        defaultCode={getDefaultCode(courseTask)}
        onNextStep={handleNextStep}
        onPrevStep={step > 1 ? handlePrevStep : undefined}
        isFirstStep={step === 1}
        isLastStep={step === courseLength}
        isStepAlreadyCompleted={isStepAlreadyCompleted}
        totalSteps={courseLength}
        completedSteps={allCompletedSteps}
        onNavigateToStep={handleNavigateToStep}
        stepTitles={stepTitles}
      />
    </AuthGuard>
  );
}