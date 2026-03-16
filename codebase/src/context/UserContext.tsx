"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { endSession } from '@/db/eventTracking';
import { resetAllProgress } from '@/db/models/userProgress';

interface UserContextType {
  user: {
    userId: string;
    username: string | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    aiChatTutorIsEnabled: boolean;
    onboardingCompleted: boolean;
    onboardingSkipped: boolean;
    tutorIntroCompleted: boolean;
  } | null;
  userId: string | null;
  username: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  aiChatTutorIsEnabled: boolean;
  onboardingCompleted: boolean;
  onboardingSkipped: boolean;
  tutorIntroCompleted: boolean;
  isLoadingUserData: boolean;
  login: (username: string, userId: string) => void;
  logout: () => Promise<void>;
  toggleAiGroup: () => Promise<void>; // Admin only: Toggle between Group A/B
  resetProgress: () => Promise<{ success: boolean; error?: string }>; // Admin only: Reset all progress
  refetchUserData: () => Promise<void>; // Refetch user data from Firebase
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [aiChatTutorIsEnabled, setAiChatTutorIsEnabled] = useState<boolean>(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [onboardingSkipped, setOnboardingSkipped] = useState<boolean>(false);
  const [tutorIntroCompleted, setTutorIntroCompleted] = useState<boolean>(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const initializeUser = async () => {
      // // console.log('=== USER CONTEXT INITIALIZATION DEBUG ===');
      setIsLoadingUserData(true);

      const storedUserId = localStorage.getItem('bootcamp_user_id');
      const storedUsername = localStorage.getItem('bootcamp_username');
      // // console.log('Stored user data from localStorage:', { storedUserId, storedUsername });

      if (storedUserId && storedUsername) {
        // // console.log('Setting user context with stored data...');
        setUserId(storedUserId);
        setUsername(storedUsername);
        setIsLoggedIn(true);

        // Check if the user is an admin (in a real app, this would be from a server)
        const isAdminUser = storedUsername === 'admin';
        // // console.log('UserContext: Checking admin status for', storedUsername, isAdminUser);
        setIsAdmin(isAdminUser);

        // Load user data from Firebase using cleanUsername as document ID
        try {
          const cleanUsername = storedUsername.trim().toLowerCase().replace(/\s+/g, '-');
          const userRef = doc(db, 'users', cleanUsername);
          const userSnap = await getDoc(userRef);

          // // console.log(`📖 Loading user data from Firebase with cleanUsername: ${cleanUsername}`);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            const hasAIAccess = userData?.aiChatTutorIsEnabled ?? false;
            const isOnboardingCompleted = userData?.onboardingCompleted ?? false;
            const isOnboardingSkipped = userData?.onboardingSkipped ?? false;
            const isTutorIntroCompleted = userData?.tutorIntroCompleted ?? false;

            setAiChatTutorIsEnabled(hasAIAccess);
            setOnboardingCompleted(isOnboardingCompleted);
            setOnboardingSkipped(isOnboardingSkipped);
            setTutorIntroCompleted(isTutorIntroCompleted);

            // console.log(`🤖 User data loaded from Firebase:`, {
            //   cleanUsername,
            //   hasAIAccess,
            //   isOnboardingCompleted,
            //   isOnboardingSkipped,
            //   isTutorIntroCompleted
            // });
          } else {
            // // console.log(`⚠️ No user document found for cleanUsername: ${cleanUsername}`);
          }
        } catch (error) {
          console.error('Error loading user data from Firebase:', error);
          // Default to false if error
          setAiChatTutorIsEnabled(false);
          setOnboardingCompleted(false);
          setOnboardingSkipped(false);
          setTutorIntroCompleted(false);
        }

        // // console.log('✅ User context initialized successfully:', { userId: storedUserId, username: storedUsername, isLoggedIn: true });
      } else {
        // // console.log('❌ No stored user data found, user not logged in');
      }

      setIsLoadingUserData(false);
    };

    initializeUser();
  }, []);

  // Login function
  const login = async (username: string, userId: string) => {
    // Check if the user is an admin (in a real app, this would be from a server)
    const isAdminUser = username.toLowerCase() === 'admin';
    // // console.log('UserContext: Login as', username, 'with ID:', userId, 'isAdmin:', isAdminUser);

    // Set loading state while we fetch Firebase data
    setIsLoadingUserData(true);

    // Save to state and localStorage
    // // console.log('🔄 UserContext: Updating state...');
    setUserId(userId);
    setUsername(username);
    setIsLoggedIn(true);
    setIsAdmin(isAdminUser);
    localStorage.setItem('bootcamp_user_id', userId);
    localStorage.setItem('bootcamp_username', username);

    // Load user data from Firebase using cleanUsername as document ID
    try {
      const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '-');
      const userRef = doc(db, 'users', cleanUsername);
      const userSnap = await getDoc(userRef);

      // // console.log(`📖 Loading user data on login with cleanUsername: ${cleanUsername}`);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const hasAIAccess = userData?.aiChatTutorIsEnabled ?? false;
        const isOnboardingCompleted = userData?.onboardingCompleted ?? false;
        const isOnboardingSkipped = userData?.onboardingSkipped ?? false;
        const isTutorIntroCompleted = userData?.tutorIntroCompleted ?? false;

        setAiChatTutorIsEnabled(hasAIAccess);
        setOnboardingCompleted(isOnboardingCompleted);
        setOnboardingSkipped(isOnboardingSkipped);
        setTutorIntroCompleted(isTutorIntroCompleted);

        // console.log(`🤖 User data loaded on login:`, {
        //   cleanUsername,
        //   hasAIAccess,
        //   isOnboardingCompleted,
        //   isOnboardingSkipped,
        //   isTutorIntroCompleted
        // });
      } else {
        // // console.log(`⚠️ No user document found for cleanUsername: ${cleanUsername}, using defaults`);
        // Default to false for new users
        setAiChatTutorIsEnabled(false);
        setOnboardingCompleted(false);
        setOnboardingSkipped(false);
        setTutorIntroCompleted(false);
      }
    } catch (error) {
      console.error('Error loading user data on login:', error);
      setAiChatTutorIsEnabled(false);
      setOnboardingCompleted(false);
      setOnboardingSkipped(false);
      setTutorIntroCompleted(false);
    }

    // Mark loading as complete
    setIsLoadingUserData(false);
    // // console.log('✅ UserContext: State updated and saved to localStorage');
  };

  // Logout function
  const logout = async () => {
    // End session tracking before clearing state
    if (userId) {
      try {
        await endSession(userId);
        // // console.log('✅ Session ended for user:', userId);
      } catch (error) {
        console.error('❌ Error ending session:', error);
        // Continue with logout even if tracking fails
      }
    }

    setUserId(null);
    setUsername(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setAiChatTutorIsEnabled(false);
    setOnboardingCompleted(false);
    setOnboardingSkipped(false);
    setTutorIntroCompleted(false);
    localStorage.removeItem('bootcamp_user_id');
    localStorage.removeItem('bootcamp_username');
  };

  // Admin only: Toggle between Group A (no AI) and Group B (with AI)
  const toggleAiGroup = async () => {
    if (!isAdmin || !username) {
      console.warn('toggleAiGroup: Only admins can toggle groups');
      return;
    }

    const newValue = !aiChatTutorIsEnabled;

    try {
      const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '-');
      const userRef = doc(db, 'users', cleanUsername);

      await setDoc(userRef, {
        aiChatTutorIsEnabled: newValue,
        updatedAt: Date.now()
      }, { merge: true });

      setAiChatTutorIsEnabled(newValue);
      console.log(`🔄 Admin toggled group: ${newValue ? 'Group B (WITH AI)' : 'Group A (WITHOUT AI)'}`);
    } catch (error) {
      console.error('Error toggling AI group:', error);
    }
  };

  // Admin only: Reset all progress (courses, drills, chat)
  const resetProgress = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !username) {
      console.warn('resetProgress: Only admins can reset progress');
      return { success: false, error: 'Only admins can reset progress' };
    }

    try {
      const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '-');
      const result = await resetAllProgress(cleanUsername);

      if (result.success) {
        console.log(`🗑️ Admin reset all progress for: ${cleanUsername}`);
      }

      return result;
    } catch (error) {
      console.error('Error resetting progress:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  // Refetch user data from Firebase (useful after modal updates)
  const refetchUserData = async () => {
    if (!username) return;

    try {
      const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '-');
      const userRef = doc(db, 'users', cleanUsername);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setAiChatTutorIsEnabled(userData?.aiChatTutorIsEnabled ?? false);
        setOnboardingCompleted(userData?.onboardingCompleted ?? false);
        setOnboardingSkipped(userData?.onboardingSkipped ?? false);
        setTutorIntroCompleted(userData?.tutorIntroCompleted ?? false);
      }
    } catch (error) {
      console.error('Error refetching user data:', error);
    }
  };

  const user = userId ? { userId, username, isLoggedIn, isAdmin, aiChatTutorIsEnabled, onboardingCompleted, onboardingSkipped, tutorIntroCompleted } : null;

  // console.log('🔄 UserContext: Creating context value...', {
  //   userId,
  //   username,
  //   isLoggedIn,
  //   isAdmin,
  //   aiChatTutorIsEnabled,
  //   onboardingCompleted,
  //   onboardingSkipped,
  //   user
  // });

  const value = {
    user,
    userId,
    username,
    isLoggedIn,
    isAdmin,
    aiChatTutorIsEnabled,
    onboardingCompleted,
    onboardingSkipped,
    tutorIntroCompleted,
    isLoadingUserData,
    login,
    logout,
    toggleAiGroup,
    resetProgress,
    refetchUserData
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
