'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { OnboardingStep1 } from '@/components/onboarding/OnboardingStep1';
import { OnboardingStep2 } from '@/components/onboarding/OnboardingStep2';
import { OnboardingStep3 } from '@/components/onboarding/OnboardingStep3';
import { OnboardingStep4 } from '@/components/onboarding/OnboardingStep4';
import { useUser } from '@/context/UserContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logOnboardingStart, logOnboardingComplete } from '@/db/eventTracking';
import { useTranslations } from 'next-intl';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useUser();
  const router = useRouter();
  const onboardingStartTimeRef = useRef<Date>(new Date());
  const hasLoggedStart = useRef(false);
  const t = useTranslations('onboardingPage');

  // Gruppe B (KI aktiviert) bekommt alle 4 Steps, Gruppe A nur 3 (ohne KI-Chat Step)
  const aiEnabled = user?.aiChatTutorIsEnabled ?? false;
  const TOTAL_STEPS = aiEnabled ? 4 : 3;

  // Step-Mapping: Für Gruppe A wird Step 3 (KI-Chat) übersprungen
  // Gruppe A: 1 → Step1, 2 → Step2, 3 → Step4
  // Gruppe B: 1 → Step1, 2 → Step2, 3 → Step3, 4 → Step4
  const stepTitles = useMemo(() => {
    if (aiEnabled) {
      return t.raw('stepTitles.withAI') as string[];
    }
    return t.raw('stepTitles.withoutAI') as string[];
  }, [aiEnabled, t]);

  // Track onboarding start
  useEffect(() => {
    document.title = "Python Bootcamp - Intro";

    const trackOnboardingStart = async () => {
      if (user?.userId && !hasLoggedStart.current) {
        hasLoggedStart.current = true;
        onboardingStartTimeRef.current = new Date();

        // Check if this is the user's first time
        try {
          const cleanUsername = user.username?.trim().toLowerCase().replace(/\s+/g, '-') || user.userId;
          const userRef = doc(db, 'users', cleanUsername);
          const userDoc = await getDoc(userRef);
          const isFirstTime = !userDoc.exists() || !userDoc.data()?.onboardingCompleted;

          await logOnboardingStart(user.userId, isFirstTime);
          console.log(`[Onboarding] Started tracking for ${user.userId}, isFirstTime: ${isFirstTime}`);
        } catch (error) {
          console.error('[Onboarding] Error tracking start:', error);
        }
      }
    };

    trackOnboardingStart();
  }, [user]);

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!user?.username) return;

    try {
      // Track onboarding completion
      if (user.userId) {
        const durationSeconds = Math.floor((Date.now() - onboardingStartTimeRef.current.getTime()) / 1000);
        await logOnboardingComplete(user.userId, durationSeconds);
        console.log(`[Onboarding] Completed in ${durationSeconds}s for ${user.userId}`);
      }

      // Update user's onboarding status in Firebase using username as document ID
      const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
      const userRef = doc(db, 'users', cleanUsername);
      await setDoc(userRef, {
        onboardingCompleted: true,
        onboardingCompletedAt: Date.now(),
        updatedAt: Date.now()
      }, { merge: true });

      // // console.log('Onboarding completed for user:', cleanUsername);
      // Hard reload to update UserContext
      window.location.href = '/';
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Continue anyway - offline support
      window.location.href = '/';
    }
  };

  const handleSkipOnboarding = async () => {
    if (!user?.username) return;

    try {
      // Track onboarding skip (log as complete with skipped flag via duration = -1)
      if (user.userId) {
        const durationSeconds = Math.floor((Date.now() - onboardingStartTimeRef.current.getTime()) / 1000);
        // Log with negative duration to indicate skip (or we could add a separate event type)
        await logOnboardingComplete(user.userId, durationSeconds);
        console.log(`[Onboarding] Skipped after ${durationSeconds}s at step ${currentStep} for ${user.userId}`);
      }

      // Update user's skip status in Firebase
      const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
      const userRef = doc(db, 'users', cleanUsername);
      await setDoc(userRef, {
        onboardingSkipped: true,
        onboardingSkippedAt: Date.now(),
        onboardingSkippedAtStep: currentStep,
        updatedAt: Date.now()
      }, { merge: true });

      // // console.log('Onboarding skipped for user:', cleanUsername);
      // Hard reload to update UserContext
      window.location.href = '/';
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      // Continue anyway - offline support
      window.location.href = '/';
    }
  };

  const renderCurrentStep = () => {
    // Gruppe A: Step 3 (KI-Chat) wird übersprungen
    // Gruppe B: Alle 4 Steps
    if (aiEnabled) {
      // Gruppe B: Normaler Flow mit KI-Step
      switch (currentStep) {
        case 1:
          return <OnboardingStep1 aiEnabled={true} />;
        case 2:
          return <OnboardingStep2 />;
        case 3:
          return <OnboardingStep3 />;
        case 4:
          return <OnboardingStep4 aiEnabled={true} />;
        default:
          return <OnboardingStep1 aiEnabled={true} />;
      }
    } else {
      // Gruppe A: Ohne KI-Step (Step 3 überspringen)
      switch (currentStep) {
        case 1:
          return <OnboardingStep1 aiEnabled={false} />;
        case 2:
          return <OnboardingStep2 />;
        case 3:
          return <OnboardingStep4 aiEnabled={false} />; // Direkt zu Drill Tasks
        default:
          return <OnboardingStep1 aiEnabled={false} />;
      }
    }
  };

  return (
    <Box minHeight="100vh" bg={{ base: "gray.900", _light: "white" }} color={{ base: "white", _light: "gray.900" }}>
      <Container maxW="4xl" py={8}>
        {/* Progress Header */}
        <Box mb={8}>
          <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }} mb={2}>
            {t('stepOf', { current: currentStep, total: TOTAL_STEPS })}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            {stepTitles[currentStep - 1]}
          </Text>
          <Box bg={{ base: "gray.700", _light: "gray.200" }} h="8px" borderRadius="full" overflow="hidden">
            <Box
              bg="blue.500"
              h="full"
              w={`${(currentStep / TOTAL_STEPS) * 100}%`}
              borderRadius="full"
              transition="width 0.3s"
            />
          </Box>
        </Box>

        {/* Content Area */}
        <Box mb={8}>
          {renderCurrentStep()}
        </Box>

        {/* Navigation */}
        <Flex justify="space-between" align="center">
          <Button
            variant="ghost"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            color={{ base: currentStep === 1 ? 'gray.500' : 'white', _light: currentStep === 1 ? 'gray.400' : 'gray.900' }}
          >
            <MdChevronLeft size={20} />
            {t('back')}
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button
              colorScheme="blue"
              onClick={handleNextStep}
            >
              {t('next')}
              <MdChevronRight size={20} />
            </Button>
          ) : (
            <Button
              colorScheme="green"
              onClick={handleCompleteOnboarding}
            >
              {t('start')}
            </Button>
          )}
        </Flex>

        {/* Skip Option */}
        <Flex justify="center" mt={4}>
          <Button
            variant="ghost"
            size="sm"
            color={{ base: "gray.500", _light: "gray.600" }}
            onClick={handleSkipOnboarding}
          >
            {t('skip')}
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}