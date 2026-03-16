"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { CourseProgress, getAllProgressForUser } from "@/db/models/userProgress";
import { useUser } from "./UserContext";

// Define the context type
interface CourseProgressContextType {
  allProgress: CourseProgress[];
  loading: boolean;
  error: Error | null;
  refetchProgress: () => Promise<void>;
}

// Create the context with default values
const CourseProgressContext = createContext<CourseProgressContextType>({
  allProgress: [],
  loading: false,
  error: null,
  refetchProgress: async () => {},
});

// Provider component
export const CourseProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allProgress, setAllProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { userId, isLoggedIn } = useUser();

  // Function to fetch all progress data - wrapped in useCallback to avoid dependency changes on every render
  const fetchAllProgress = useCallback(async () => {
    if (!isLoggedIn || !userId) {
      setAllProgress([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // // console.log('Fetching all progress data for user', userId);
      const progress = await getAllProgressForUser(userId);
      // // console.log('All progress data:', progress);
      setAllProgress(progress || []);
    } catch (err) {
      console.error('Error fetching all progress:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch progress'));
    } finally {
      setLoading(false);
    }
  }, [userId, isLoggedIn]);

  // Fetch progress when user changes
  useEffect(() => {
    fetchAllProgress();
  }, [userId, isLoggedIn, fetchAllProgress]);

  // Context value
  const contextValue: CourseProgressContextType = {
    allProgress,
    loading,
    error,
    refetchProgress: fetchAllProgress,
  };

  return (
    <CourseProgressContext.Provider value={contextValue}>
      {children}
    </CourseProgressContext.Provider>
  );
};

// Custom hook to use the context
export const useCourseProgress = () => useContext(CourseProgressContext);
