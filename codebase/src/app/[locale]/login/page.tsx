'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  Stack,
  Text,
  VStack,
  HStack,
  Flex,
  Link as ChakraLink,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC } from 'react';
import { FaPython } from 'react-icons/fa';
import { MdCode, MdSchool, MdLogin } from 'react-icons/md';
import { useUser } from '@/context/UserContext';
import { Toaster, toaster } from '@/components/ui/toaster';
import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { startSession } from '@/db/eventTracking';
import { useTranslations } from 'next-intl';

/**
 * Counts users by group for balanced assignment
 * Returns the number of users in Group A (without AI) and Group B (with AI)
 */
async function countUsersByGroup(): Promise<{ groupA: number; groupB: number }> {
  try {
    const usersRef = collection(db, 'users');

    // Query for Group A (aiChatTutorIsEnabled = false)
    const groupAQuery = query(usersRef, where('aiChatTutorIsEnabled', '==', false));
    const groupASnapshot = await getDocs(groupAQuery);
    const groupACount = groupASnapshot.size;

    // Query for Group B (aiChatTutorIsEnabled = true)
    const groupBQuery = query(usersRef, where('aiChatTutorIsEnabled', '==', true));
    const groupBSnapshot = await getDocs(groupBQuery);
    const groupBCount = groupBSnapshot.size;

    return { groupA: groupACount, groupB: groupBCount };
  } catch (error) {
    console.error('❌ Error counting users by group:', error);
    // Fallback: assign to Group A if counting fails
    return { groupA: 0, groupB: 0 };
  }
}

const LoginPage: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isLoggingInRef = useRef(false); // Track if we're in the login process
  const t = useTranslations('auth');

  const { login, isLoggedIn } = useUser();

  // Set page title
  useEffect(() => {
    document.title = "Python Bootcamp - Login";
  }, []);

  // Wenn bereits angemeldet, zum Dashboard weiterleiten
  // WICHTIG: Nur wenn wir nicht gerade im Login-Prozess sind
  useEffect(() => {
    if (isLoggedIn && !isLoading && !isLoggingInRef.current) {
      // // console.log('Login page: User already logged in, redirecting to dashboard');
      router.push('/');
    }
  }, [isLoggedIn, isLoading, router]);

  // Trim whitespace on blur for better UX
  const handleUsernameBlur = () => {
    setUsername(prev => prev.trim());
  };

  const handlePasswordBlur = () => {
    setPassword(prev => prev.trim());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim inputs before validation
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Update state with trimmed values
    setUsername(trimmedUsername);
    setPassword(trimmedPassword);

    if (!trimmedUsername) {
      toaster.create({
        title: t('errors.usernameRequired'),
        description: t('errors.usernameRequiredDesc'),
        type: 'error',
        duration: 3000,
      });
      return;
    }

    if (!trimmedPassword) {
      toaster.create({
        title: t('errors.passwordRequired'),
        description: t('errors.passwordRequiredDesc'),
        type: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    isLoggingInRef.current = true; // Mark that we're starting the login process

    try {
      // Validate password - check AI, non-AI, and balanced passwords
      const passwordWithAI = process.env.NEXT_PUBLIC_PASSWORD_WITH_AI;
      const passwordWithoutAI = process.env.NEXT_PUBLIC_PASSWORD_WITHOUT_AI;
      const passwordBalanced = process.env.NEXT_PUBLIC_PASSWORD_BALANCED;
      const passwordAdmin = process.env.NEXT_PUBLIC_PASSWORD_ADMIN;

      // Check if user is trying to login as admin
      const cleanUsernameCheck = trimmedUsername.toLowerCase();
      if (cleanUsernameCheck === 'admin') {
        // Admin requires special password
        if (trimmedPassword !== passwordAdmin) {
          toaster.create({
            title: t('errors.wrongPassword'),
            description: t('errors.adminPasswordRequired'),
            type: 'error',
            duration: 3000,
          });
          setIsLoading(false);
          isLoggingInRef.current = false;
          return;
        }
        // Admin password correct - continue with login (treat as balanced for group assignment)
      }

      let aiChatTutorIsEnabled: boolean | null = null; // null = needs balancing

      // For admin, skip regular password validation
      if (cleanUsernameCheck === 'admin' && trimmedPassword === passwordAdmin) {
        aiChatTutorIsEnabled = true; // Admin gets AI access
      } else if (trimmedPassword === passwordWithAI) {
        aiChatTutorIsEnabled = true;
      } else if (trimmedPassword === passwordWithoutAI) {
        aiChatTutorIsEnabled = false;
      } else if (trimmedPassword === passwordBalanced) {
        aiChatTutorIsEnabled = null; // Will be determined by balancing logic
      } else {
        toaster.create({
          title: t('errors.wrongPassword'),
          description: t('errors.wrongPasswordDesc'),
          type: 'error',
          duration: 3000,
        });
        setIsLoading(false);
        isLoggingInRef.current = false;
        return;
      }

      // Use username as unique document ID - VEREINFACHT!
      const cleanUsername = trimmedUsername.toLowerCase().replace(/\s+/g, '-');
      let isNewUser = false;
      let finalAiChatTutorIsEnabled: boolean;

      // Check if user exists in Firebase using username as document ID
      const userRef = doc(db, 'users', cleanUsername);
      const existingUserSnap = await getDoc(userRef);

      if (existingUserSnap.exists()) {
        // ✅ EXISTING USER - Keep their original group assignment
        // // console.log('✅ Existing user found:', cleanUsername);
        const userData = existingUserSnap.data();

        // Use existing group assignment (NEVER change it!)
        finalAiChatTutorIsEnabled = userData.aiChatTutorIsEnabled ?? false;

        // Only update lastLogin
        await setDoc(userRef, {
          lastLogin: Date.now()
        }, { merge: true });

        // // console.log(`🤖 Existing user keeps their group: ${finalAiChatTutorIsEnabled ? 'Group B (WITH AI)' : 'Group A (WITHOUT AI)'}`);
      } else {
        // 🆕 NEW USER - Assign group based on password or balancing
        isNewUser = true;
        // // console.log('🆕 Creating new user:', cleanUsername);

        if (aiChatTutorIsEnabled === null) {
          // BALANCED PASSWORD - Count existing users and assign to smaller group
          // // console.log('⚖️ Balanced password detected - counting groups...');

          const groupCounts = await countUsersByGroup();

          // Assign to the smaller group (or Group A if equal)
          finalAiChatTutorIsEnabled = groupCounts.groupB < groupCounts.groupA;

          // // console.log(`📊 Group counts: Group A = ${groupCounts.groupA}, Group B = ${groupCounts.groupB}`);
          // // console.log(`🎯 Assigned to ${finalAiChatTutorIsEnabled ? 'Group B (WITH AI)' : 'Group A (WITHOUT AI)'}`);
        } else {
          // SPECIFIC PASSWORD - Use the explicitly chosen group
          finalAiChatTutorIsEnabled = aiChatTutorIsEnabled;
          // // console.log(`🎯 Explicitly assigned to ${finalAiChatTutorIsEnabled ? 'Group B (WITH AI)' : 'Group A (WITHOUT AI)'}`);
        }
      }

      // Create user in Firebase (only for new users)
      if (isNewUser) {
        try {
          const timestamp = Date.now();
          await setDoc(userRef, {
            id: cleanUsername, // ✅ Konsistente ID = Document ID
            username: trimmedUsername, // Display name
            createdAt: timestamp,
            updatedAt: timestamp,
            loginMethod: 'password',
            lastLogin: timestamp,
            chatHistory: {},
            activeResponseId: null,
            onboardingCompleted: false,
            aiChatTutorIsEnabled: finalAiChatTutorIsEnabled
          });

          // // console.log('✅ User created in Firebase with ID:', cleanUsername);
          // // console.log(`🤖 AI Chat ${finalAiChatTutorIsEnabled ? 'ENABLED' : 'DISABLED'} for new user: ${cleanUsername}`);
        } catch (firebaseError) {
          console.error('❌ Error creating user in Firebase:', firebaseError);
          // Continue with login even if Firebase fails (offline support)
        }
      }

      // Login with username as userId - VEREINFACHT!
      await login(trimmedUsername, cleanUsername);

      // Start session tracking
      try {
        await startSession(cleanUsername);
        // // console.log('✅ Session tracking started for user:', cleanUsername);
      } catch (error) {
        console.error('❌ Error starting session tracking:', error);
        // Continue with login even if tracking fails
      }

      toaster.create({
        title: t('login.success'),
        description: t('login.welcome', { username: trimmedUsername }),
        type: 'success',
        duration: 3000,
      });

      // Check onboarding status and redirect accordingly
      try {
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const hasCompletedOnboarding = userData?.onboardingCompleted === true;

          if (hasCompletedOnboarding) {
            // // console.log('User has completed onboarding, redirecting to dashboard');
            router.push('/');
          } else {
            // // console.log('User has not completed onboarding, redirecting to onboarding');
            router.push('/onboarding');
          }
        } else {
          // New user, needs onboarding
          // // console.log('New user, redirecting to onboarding');
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Fallback to onboarding for new users
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Login error:', error);
      toaster.create({
        title: t('errors.loginError'),
        description: t('errors.loginErrorDesc'),
        type: 'error',
        duration: 3000,
      });
      isLoggingInRef.current = false; // Reset on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <Box
        minH="100vh"
        w="100%"
        position="relative"
        overflow="hidden"
        bg="linear-gradient(135deg, #1a365d 0%, #2a4365 50%, #2c5282 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={{ base: 8, md: 0 }}
      >
        {/* Animated Background Pattern */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.05}
          bgImage="radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)"
          bgSize="50px 50px"
        />

        {/* Decorative Python Icons */}
        <Box
          position="absolute"
          top="15%"
          left="8%"
          opacity={0.08}
          transform="rotate(-15deg)"
          display={{ base: 'none', lg: 'block' }}
        >
          <FaPython size={150} color="white" />
        </Box>
        <Box
          position="absolute"
          bottom="20%"
          right="8%"
          opacity={0.08}
          transform="rotate(15deg)"
          display={{ base: 'none', lg: 'block' }}
        >
          <MdCode size={120} color="white" />
        </Box>
        <Box
          position="absolute"
          top="60%"
          left="15%"
          opacity={0.05}
          transform="rotate(25deg)"
          display={{ base: 'none', xl: 'block' }}
        >
          <MdSchool size={80} color="white" />
        </Box>

        <Container maxW="8xl" position="relative" py={8}>
          <VStack gap={8}>
            {/* Two Column Layout */}
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              align="stretch"
              gap={10}
              w="100%"
            >
              {/* Left Column: Logo + Title + Video (60%) */}
              <Flex
                flex="1.4"
                direction="column"
                align="center"
                gap={6}
              >
                {/* Logo/Icon */}
                <Box
                  p={5}
                  bg="whiteAlpha.200"
                  borderRadius="2xl"
                  backdropFilter="blur(10px)"
                  boxShadow="0 8px 32px rgba(0,0,0,0.2)"
                >
                  <FaPython size={56} color="#FFD43B" />
                </Box>

                {/* Main Heading */}
                <VStack gap={2}>
                  <Heading
                    as="h1"
                    size="2xl"
                    textAlign="center"
                    fontWeight="extrabold"
                    letterSpacing="tight"
                    color="white"
                  >
                    Python Bootcamp
                  </Heading>
                  <Text
                    fontSize="md"
                    color="blue.200"
                    fontWeight="medium"
                    letterSpacing="wider"
                    textTransform="uppercase"
                  >
                    {t('login.title')}
                  </Text>
                </VStack>

                {/* Introduction Video */}
                <Box
                  w="100%"
                  borderRadius="xl"
                  overflow="hidden"
                  border="2px solid"
                  borderColor="whiteAlpha.200"
                  boxShadow="0 8px 32px rgba(0,0,0,0.3)"
                >
                  <Box
                    position="relative"
                    pb="56.25%"
                    h={0}
                  >
                    <iframe
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                      src="https://www.youtube.com/embed/AG6ZDTUPPWk?rel=0"
                      title="Python Bootcamp Einführung"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                </Box>
              </Flex>

              {/* Right Column: Instructions + Login Form (40%) */}
              <Flex
                flex="1"
                direction="column"
                gap={6}
                maxW={{ base: '100%', lg: '500px' }}
              >
                {/* Instructions Box */}
                <Box
                  p={6}
                  bg="rgba(0, 0, 0, 0.3)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                >
                  <VStack gap={3}>
                    <Text
                      fontSize="lg"
                      color="white"
                      textAlign="center"
                      fontWeight="semibold"
                    >
                      {t('login.instructionsLine1')}
                    </Text>
                    <Text
                      fontSize="md"
                      color="gray.300"
                      textAlign="center"
                      lineHeight="tall"
                    >
                      {t('login.instructionsLine2')}
                    </Text>
                    <Text
                      fontSize="md"
                      color="gray.400"
                      textAlign="center"
                      lineHeight="tall"
                    >
                      {t('login.instructionsLine3')}
                    </Text>
                  </VStack>
                </Box>

                {/* Login Form Card */}
                <Box
                  w="100%"
                  p={8}
                  bg="rgba(10, 20, 40, 0.85)"
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  backdropFilter="blur(10px)"
                  boxShadow="0 8px 32px rgba(0,0,0,0.4)"
                >
                  <form onSubmit={handleLogin}>
                    <Stack direction="column" gap={5}>
                      <Box>
                        <Text color="gray.300" fontSize="sm" mb={2} fontWeight="medium">
                          {t('login.username')}
                        </Text>
                        <Input
                          placeholder={t('login.usernamePlaceholder')}
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onBlur={handleUsernameBlur}
                          autoComplete="username"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          size="lg"
                          bg="rgba(0, 0, 0, 0.4)"
                          color="white"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          borderRadius="xl"
                          _placeholder={{ color: 'gray.500' }}
                          _hover={{ borderColor: 'whiteAlpha.400', bg: 'rgba(0, 0, 0, 0.5)' }}
                          _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #4299E1', bg: 'rgba(0, 0, 0, 0.5)' }}
                        />
                      </Box>

                      <Box>
                        <Text color="gray.300" fontSize="sm" mb={2} fontWeight="medium">
                          {t('login.password')}
                        </Text>
                        <Input
                          type="password"
                          placeholder={t('login.passwordPlaceholder')}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onBlur={handlePasswordBlur}
                          autoComplete="current-password"
                          size="lg"
                          bg="rgba(0, 0, 0, 0.4)"
                          color="white"
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          borderRadius="xl"
                          _placeholder={{ color: 'gray.500' }}
                          _hover={{ borderColor: 'whiteAlpha.400', bg: 'rgba(0, 0, 0, 0.5)' }}
                          _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #4299E1', bg: 'rgba(0, 0, 0, 0.5)' }}
                        />
                      </Box>

                      {/* Consent Text */}
                      <Box
                        p={4}
                        bg="rgba(0, 0, 0, 0.3)"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="whiteAlpha.100"
                      >
                        <Text fontSize="xs" color="gray.400" textAlign="center" lineHeight="tall">
                          {t.rich('login.consent', {
                            privacyLink: (chunks) => (
                              <ChakraLink asChild color="blue.300" _hover={{ color: 'blue.200', textDecoration: 'underline' }}>
                                <NextLink href="/datenschutz">{chunks}</NextLink>
                              </ChakraLink>
                            )
                          })}
                        </Text>
                      </Box>

                      <Button
                        type="submit"
                        size="lg"
                        width="full"
                        disabled={isLoading}
                        mt={2}
                        bg="white"
                        color="blue.700"
                        fontWeight="bold"
                        borderRadius="xl"
                        boxShadow="0 4px 20px rgba(0,0,0,0.2)"
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                          bg: 'gray.100'
                        }}
                        _active={{
                          transform: 'translateY(0)',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}
                        transition="all 0.2s ease"
                      >
                        <HStack gap={2}>
                          <MdLogin size={20} />
                          <span>{isLoading ? '...' : t('login.submit')}</span>
                        </HStack>
                      </Button>
                    </Stack>
                  </form>
                </Box>
              </Flex>
            </Flex>

            {/* Footer Links - Centered */}
            <HStack gap={4} justify="center" w="100%">
              <ChakraLink
                asChild
                color="blue.200"
                fontSize="sm"
                _hover={{ color: 'white', textDecoration: 'underline' }}
                transition="color 0.2s ease"
              >
                <NextLink href="/datenschutz">
                  {t('login.privacyLink')}
                </NextLink>
              </ChakraLink>
              <Text color="blue.200" fontSize="sm">•</Text>
              <ChakraLink
                asChild
                color="blue.200"
                fontSize="sm"
                _hover={{ color: 'white', textDecoration: 'underline' }}
                transition="color 0.2s ease"
              >
                <NextLink href="/impressum">
                  Impressum
                </NextLink>
              </ChakraLink>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;