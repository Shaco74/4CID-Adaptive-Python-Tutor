"use client";

import React, { useState, useEffect, useRef } from "react";
import ChatIcon from "./ChatIcon";
import ChatDrawer from "./ChatDrawer";
import { useUser } from "../../context/UserContext";
import type { CourseContextType } from "../../context/CourseContext";

/**
 * Wrapper Component to conditionally access CourseContext
 * Needed because useCourseContext can only be called inside CourseContextProvider
 */
function ChatSystemWithContext({
  user,
  isOpen,
  setIsOpen,
  courseContext,
}: {
  user: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  courseContext: CourseContextType | null;
}) {
  // Debug Logging - nur bei relevanten Änderungen (nicht bei jedem Code-Change)
  const lastLoggedStep = useRef<number | null>(null);
  const lastLoggedCourseId = useRef<string | null>(null);

  useEffect(() => {
    // Log nur wenn Kapitel oder Schritt sich ändert, NICHT bei Code-Updates
    const step = courseContext?.step ?? null;
    const courseId = courseContext?.courseId ?? null;

    if (
      courseContext &&
      (step !== lastLoggedStep.current || courseId !== lastLoggedCourseId.current)
    ) {
      // // console.log("=== CHAT SYSTEM CONTEXT DEBUG ===");
      // // console.log("User:", user?.username);
      // // console.log("AI Chat Access:", user?.aiChatTutorIsEnabled);
      // // console.log("Course:", courseId, "Step:", step);
      lastLoggedStep.current = step;
      lastLoggedCourseId.current = courseId;
    }
  }, [courseContext?.step, courseContext?.courseId, user?.username, user?.aiChatTutorIsEnabled, courseContext]);

  // Don't render chat if user doesn't have AI access
  if (!user?.aiChatTutorIsEnabled) {
    return null;
  }

  return (
    <>
      <ChatDrawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        user={user}
        courseContext={courseContext}
      />

      <ChatIcon onClick={() => setIsOpen(true)} isOpen={isOpen} />
    </>
  );
}

/**
 * ChatSystem Component (for non-course pages)
 */
export default function ChatSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  return (
    <ChatSystemWithContext
      user={user}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      courseContext={null}
    />
  );
}

/**
 * ChatSystem Component with Course Context (for course pages)
 * This version is used inside CourseLayout where CourseContext is available
 */
export function ChatSystemWithCourseContext({
  courseContext,
}: {
  courseContext: CourseContextType;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  return (
    <ChatSystemWithContext
      user={user}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      courseContext={courseContext}
    />
  );
}