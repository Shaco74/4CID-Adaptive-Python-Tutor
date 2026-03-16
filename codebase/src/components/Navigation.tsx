'use client';

import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Menu,
  Avatar,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { useCourseProgress } from '@/context/CourseProgressContext';
import { coursesData } from '@/courses/coursesData';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useMemo } from 'react';
import { MdBugReport } from 'react-icons/md';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Navigation() {
  const { isLoggedIn, user, username, logout, isAdmin, aiChatTutorIsEnabled, toggleAiGroup, resetProgress } = useUser();
  const { allProgress, refetchProgress } = useCourseProgress();
  const router = useRouter();
  const t = useTranslations('navigation');

  // Check if all REQUIRED (non-optional) courses are completed
  const allCoursesCompleted = useMemo(() => {
    if (!isLoggedIn) return false;
    const requiredCourses = coursesData.filter(course => !course.optional);
    return requiredCourses.every(course => {
      const progress = allProgress.find(p => p.courseId === course.id);
      if (!progress) return false;
      return progress.completedSteps.length === course.steps && course.steps > 0;
    });
  }, [allProgress, isLoggedIn]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleCourseCompletion = () => {
    router.push('/evaluation');
  };

  const handleRepeatOnboarding = async () => {
    if (!user?.username) return;

    try {
      // Reset onboarding status in Firebase
      const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
      const userRef = doc(db, 'users', cleanUsername);
      await setDoc(userRef, {
        onboardingCompleted: false,
        updatedAt: Date.now()
      }, { merge: true });

      // // console.log('Onboarding reset for user:', cleanUsername);
      router.push('/onboarding');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      // Continue anyway - offline support
      router.push('/onboarding');
    }
  };

  const handleResetProgress = async () => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      `⚠️ ${t('resetProgress.title')}\n\n${t('resetProgress.description')}\n\n` +
      'This action cannot be undone!'
    );

    if (!confirmed) return;

    const result = await resetProgress();
    if (result.success) {
      await refetchProgress();
      alert(`✅ ${t('resetProgress.success')}`);
      router.push('/');
    } else {
      alert(`❌ ${t('resetProgress.error', { message: result.error || 'Unknown error' })}`);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <Box
      bg={{ base: "gray.800", _light: "white" }}
      px={4}
      py={2}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={{ base: "gray.700", _light: "gray.200" }}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack alignItems={'center'}>
          <Link href="/" passHref>
            <Flex alignItems="center">
              <Box position="relative" height="30px" width="30px" mr={2}>
                <Image
                  src="/python-logo.png"
                  alt="Python Bootcamp Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              <Box fontWeight="bold" fontSize="xl" color={{ base: "white", _light: "gray.900" }}>
                Python Bootcamp
              </Box>
            </Flex>
          </Link>
        </HStack>

        <HStack gap={2}>
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Show completion button when all courses are finished */}
          {allCoursesCompleted && (
            <Button
              size="sm"
              colorScheme="green"
              bg="green.500"
              color="white"
              fontWeight="bold"
              onClick={handleCourseCompletion}
              _hover={{
                bg: "green.600",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s"
            >
              🎉 {t('completeCourse')}
            </Button>
          )}

          {/* Bug Report Button */}
          {isLoggedIn && (
            <Link href="/report-bug" passHref>
              <Button
                size="sm"
                variant="outline"
                borderColor={{ base: "gray.600", _light: "gray.300" }}
                color={{ base: "gray.400", _light: "gray.500" }}
                _hover={{
                  color: { base: "red.400", _light: "red.500" },
                  bg: { base: "gray.700", _light: "gray.100" },
                  borderColor: { base: "gray.500", _light: "gray.400" },
                }}
              >
                <MdBugReport size={18} />
                {t('reportBug')}
              </Button>
            </Link>
          )}

          {isLoggedIn ? (
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  rounded={'full'}
                  asChild
                  cursor={'pointer'}
                  minW={0}
                >
                  <HStack>
                    <Avatar.Root size={'sm'} bg="blue.500" color="white">
                      <Avatar.Fallback>
                        {username ? getInitials(username) : '?'}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <Text>{username || user?.userId}</Text>
                  </HStack>
                </Button>
              </Menu.Trigger>
              <Menu.Positioner
                zIndex={10000}
                css={{
                  position: 'fixed !important',
                  zIndex: 10000
                }}
              >
                <Menu.Content
                  bg={{ base: "gray.600", _light: "white" }}
                  borderColor={{ base: "gray.700", _light: "gray.200" }}
                  color={{ base: "white", _light: "gray.900" }}
                  boxShadow={{ base: "lg", _light: "0 4px 12px rgba(0,0,0,0.15)" }}
                  zIndex={10000}
                  css={{
                    zIndex: 10000
                  }}
                >
                  <Menu.Item
                    value="dashboard"
                    asChild
                    color={{ base: "white", _light: "gray.900" }}
                    _hover={{
                      bg: { base: "gray.700", _light: "gray.100" },
                      color: { base: "white", _light: "gray.900" }
                    }}
                  >
                    <Link href="/">{t('home')}</Link>
                  </Menu.Item>
                  <Menu.Separator borderColor={"gray.700"} height={0.5} />
                  <Menu.Item
                    value="onboarding"
                    onClick={handleRepeatOnboarding}
                    color={{ base: "white", _light: "gray.900" }}
                    _hover={{
                      bg: { base: "gray.700", _light: "gray.100" },
                      color: { base: "white", _light: "gray.900" }
                    }}
                  >
                    {t('repeatOnboarding')}
                  </Menu.Item>
                  {isAdmin && (
                    <>
                      <Menu.Separator borderColor={"gray.700"} height={0.5} />

                      {/* Admin Group Toggle */}
                      <Menu.Item
                        value="toggle-group"
                        onClick={toggleAiGroup}
                        color={{ base: aiChatTutorIsEnabled ? "purple.300" : "orange.300", _light: aiChatTutorIsEnabled ? "purple.600" : "orange.600" }}
                        _hover={{
                          bg: { base: "gray.700", _light: "gray.100" },
                        }}
                      >
                        {aiChatTutorIsEnabled ? t('admin.groupB') : t('admin.groupA')} → {t('admin.switch')}
                      </Menu.Item>

                      <Menu.Item
                        value="admin"
                        asChild
                        color={{ base: "white", _light: "gray.900" }}
                        _hover={{
                          bg: { base: "gray.700", _light: "gray.100" },
                          color: { base: "white", _light: "gray.900" }
                        }}
                      >
                        <Link href="/admin">{t('admin.dashboard')}</Link>
                      </Menu.Item>

                      {/* Admin Progress Reset */}
                      <Menu.Item
                        value="reset-progress"
                        onClick={handleResetProgress}
                        color={{ base: "red.300", _light: "red.600" }}
                        _hover={{
                          bg: { base: "gray.700", _light: "gray.100" },
                        }}
                      >
                        🗑️ {t('admin.resetProgress')}
                      </Menu.Item>
                    </>
                  )}
                  <Menu.Separator borderColor={"gray.700"} height={0.5} />
                  <Menu.Item
                    value="logout"
                    onClick={handleLogout}
                    color={{ base: "white", _light: "gray.900" }}
                    _hover={{
                      bg: { base: "gray.700", _light: "gray.100" },
                      color: { base: "white", _light: "gray.900" }
                    }}
                  >
                    {t('logout')}
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          ) : (
            <Button
              colorScheme={'blue'}
              onClick={handleLogin}
            >
              {t('login')}
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
