"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { CourseTask } from "@/types/courseTypes";

/**
 * Course Context Type Definition
 * Stellt alle relevanten Informationen über den aktuellen Kurs-Status bereit
 */
export interface CourseContextType {
  // Meta Information
  courseId: string | null;
  courseName: string | null;
  step: number | null;

  // Task Information
  task: {
    title: string;
    description: string;
    blocks: any[]; // CourseTask blocks
  } | null;

  // Code Information
  code: {
    current: string; // Aktueller Editor-Content
    starter: string; // Original Starter Code
    solution: string[]; // Erwartete Lösung (solutionString)
  } | null;

  // Console Output
  console: {
    output: string;
    hasError: boolean;
  } | null;

  // Help Request Tracking (Progressive Hint System)
  helpRequestCount: number;     // Anzahl Help Requests für aktuellen Step
  currentHintLevel: number;     // Berechneter Hint-Level (1-5)

  // Code Execution Tracking
  codeExecutionCount: number;   // Anzahl Code-Ausführungen für aktuellen Step

  // Setter Functions
  setCourseInfo: (info: {
    courseId: string;
    courseName: string;
    step: number;
  }) => void;
  setTask: (task: CourseTask | null) => void;
  setCodeInfo: (info: { current: string; starter: string; solution: string[] }) => void;
  setConsoleOutput: (output: string, hasError?: boolean) => void;
  incrementHelpRequest: () => void;  // Increment help request count
  incrementCodeExecution: () => void; // Increment code execution count
  resetHelpRequests: () => void;     // Reset bei Step-Wechsel (resets both counters)
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

/**
 * Course Context Provider
 * Wraps CourseLayout und stellt Context für alle Child-Komponenten bereit
 */
export function CourseContextProvider({ children }: { children: ReactNode }) {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseName, setCourseName] = useState<string | null>(null);
  const [step, setStep] = useState<number | null>(null);
  const [task, setTaskState] = useState<CourseContextType["task"]>(null);
  const [code, setCodeState] = useState<CourseContextType["code"]>(null);
  const [console, setConsoleState] = useState<CourseContextType["console"]>(null);
  const [helpRequestCount, setHelpRequestCount] = useState<number>(0);
  const [codeExecutionCount, setCodeExecutionCount] = useState<number>(0);

  // Stable setter functions with useCallback
  const setCourseInfo = useCallback((info: {
    courseId: string;
    courseName: string;
    step: number;
  }) => {
    setCourseId(info.courseId);
    setCourseName(info.courseName);
    setStep(info.step);
  }, []);

  const setTask = useCallback((newTask: CourseTask | null) => {
    if (!newTask) {
      setTaskState(null);
      return;
    }
    setTaskState({
      title: newTask.title,
      description: newTask.description,
      blocks: newTask.blocks,
    });
  }, []);

  const setCodeInfo = useCallback((info: {
    current: string;
    starter: string;
    solution: string[];
  }) => {
    setCodeState(info);
  }, []);

  const setConsoleOutput = useCallback((output: string, hasError: boolean = false) => {
    setConsoleState({ output, hasError });
  }, []);

  const incrementHelpRequest = useCallback(() => {
    setHelpRequestCount((prev) => prev + 1);
  }, []);

  const incrementCodeExecution = useCallback(() => {
    setCodeExecutionCount((prev) => prev + 1);
  }, []);

  const resetHelpRequests = useCallback(() => {
    setHelpRequestCount(0);
    setCodeExecutionCount(0);
  }, []);

  // Berechne aktuellen Hint-Level basierend auf Request-Count
  const currentHintLevel = helpRequestCount === 0 ? 1 :
                           helpRequestCount === 1 ? 2 :
                           helpRequestCount === 2 ? 3 :
                           helpRequestCount === 3 ? 4 : 5;

  const value: CourseContextType = {
    courseId,
    courseName,
    step,
    task,
    code,
    console,
    helpRequestCount,
    currentHintLevel,
    codeExecutionCount,
    setCourseInfo,
    setTask,
    setCodeInfo,
    setConsoleOutput,
    incrementHelpRequest,
    incrementCodeExecution,
    resetHelpRequests,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}

/**
 * Custom Hook: useCourseContext
 * Zugriff auf Course Context aus beliebiger Child-Komponente
 */
export function useCourseContext() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourseContext must be used within CourseContextProvider");
  }
  return context;
}
