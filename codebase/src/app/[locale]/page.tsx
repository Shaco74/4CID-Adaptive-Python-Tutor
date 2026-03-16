"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Flex } from "@chakra-ui/react";
import HeroSection from "@/components/home/HeroSection";
import CourseSection from "@/components/home/CourseSection";
import AuthGuard from "@/components/AuthGuard";
import ChatSystem from "@/components/chat/ChatSystem";
import { TutorIntroModal } from "@/components/chat/TutorIntroModal";
import { useUser } from "@/context/UserContext";
import { useCourseProgress } from "@/context/CourseProgressContext";

export default function HomePage() {
  const router = useRouter();
  const { user, onboardingCompleted, onboardingSkipped, tutorIntroCompleted, aiChatTutorIsEnabled, isLoadingUserData } = useUser();
  const { refetchProgress } = useCourseProgress();
  const [showTutorIntro, setShowTutorIntro] = useState(false);

  // Refresh progress data when homepage mounts to ensure latest state is shown
  useEffect(() => {
    document.title = "Python Bootcamp - Home";
    refetchProgress();
  }, [refetchProgress]);

  // Redirect to onboarding if user hasn't completed or skipped it
  // Wait for user data to load before redirecting
  useEffect(() => {
    // console.log("🏠 HomePage redirect check:", {
    //   isLoadingUserData,
    //   hasUser: !!user,
    //   onboardingCompleted,
    //   onboardingSkipped,
    //   shouldRedirect: !isLoadingUserData && user && !onboardingCompleted && !onboardingSkipped
    // });

    if (!isLoadingUserData && user && !onboardingCompleted && !onboardingSkipped) {
      // // console.log("🚀 Redirecting to onboarding: User has not completed or skipped onboarding");
      router.push('/onboarding');
    } else if (!isLoadingUserData && user && (onboardingCompleted || onboardingSkipped)) {
      // // console.log("✅ User has completed or skipped onboarding, staying on homepage");
    }
  }, [user, onboardingCompleted, onboardingSkipped, isLoadingUserData, router]);

  // Show tutor intro modal for AI users who completed/skipped onboarding but haven't done tutor intro
  useEffect(() => {
    if (
      !isLoadingUserData &&
      user &&
      aiChatTutorIsEnabled &&
      (onboardingCompleted || onboardingSkipped) &&
      !tutorIntroCompleted
    ) {
      setShowTutorIntro(true);
    }
  }, [user, aiChatTutorIsEnabled, onboardingCompleted, onboardingSkipped, tutorIntroCompleted, isLoadingUserData]);

  // console.log("=== HOME PAGE USER CONTEXT DEBUG ===");
  // console.log("HomePage user context:", {
  //   userId: user?.userId,
  //   username: user?.username,
  //   isLoggedIn: user?.isLoggedIn,
  //   onboardingCompleted,
  //   onboardingSkipped
  // });

  return (
    <AuthGuard>
      <Container maxW="container.xl" py={10} bg={{ base: "gray.900", _light: "gray.50" }} pb={24}>
        <Flex direction="column" align="center" textAlign="center" gap={8}>
          <HeroSection />
          <CourseSection />
        </Flex>
      </Container>
      <ChatSystem />
      <TutorIntroModal
        isOpen={showTutorIntro}
        onClose={() => setShowTutorIntro(false)}
      />
    </AuthGuard>
  );
}

