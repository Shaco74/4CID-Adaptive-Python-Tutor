"use client";

import { Box, Button, Container, Flex, Heading, Text, HStack, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCourseProgress } from "@/context/CourseProgressContext";
import { getCoursesData, type Locale } from "@/courses/getCourseData";
import { FaPython } from "react-icons/fa";
import { MdCode, MdSchool, MdRocketLaunch } from "react-icons/md";
import { useTranslations, useLocale } from "next-intl";

export default function HeroSection() {
  const { allProgress } = useCourseProgress();
  const t = useTranslations("home.hero");
  const locale = useLocale() as Locale;
  const coursesData = useMemo(() => getCoursesData(locale), [locale]);

  // Check if all REQUIRED (non-optional) courses are completed
  const allCoursesCompleted = useMemo(() => {
    const requiredCourses = coursesData.filter(course => !course.optional);
    return requiredCourses.every(course => {
      const progress = allProgress.find(p => p.courseId === course.id);
      if (!progress) return false;
      return progress.completedSteps.length === course.steps && course.steps > 0;
    });
  }, [allProgress, coursesData]);

  const router = useRouter();

  const handleCourseCompletion = () => {
    router.push("/evaluation");
  };

  if (allCoursesCompleted) {
    return (
      <Box
        w="100%"
        py={16}
        px={4}
        mb={8}
        position="relative"
        overflow="hidden"
        bg="linear-gradient(135deg, #22543d 0%, #276749 50%, #2f855a 100%)"
        borderRadius="2xl"
        boxShadow="2xl"
      >
        {/* Celebration Background Pattern */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.1}
          bgImage="radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 40% 40%, white 1px, transparent 1px)"
          bgSize="60px 60px, 80px 80px, 40px 40px"
        />

        <Container maxW="container.lg" position="relative">
          <Flex direction="column" align="center" gap={8}>
            <Text fontSize="6xl">🎉</Text>

            <Heading
              as="h1"
              size="3xl"
              color="white"
              textAlign="center"
              textShadow="0 2px 10px rgba(0,0,0,0.3)"
            >
              {t("completedTitle")}
            </Heading>

            <Text
              fontSize="xl"
              color="green.100"
              textAlign="center"
              maxW="lg"
            >
              {t("completedSubtitle")}
            </Text>

            <Button
              size="lg"
              px={10}
              py={7}
              bg="white"
              color="green.700"
              fontSize="xl"
              fontWeight="bold"
              onClick={handleCourseCompletion}
              borderRadius="full"
              boxShadow="0 4px 20px rgba(0,0,0,0.2)"
              _hover={{
                transform: "translateY(-3px) scale(1.02)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)"
              }}
              transition="all 0.3s ease"
            >
              <MdRocketLaunch style={{ marginRight: '8px' }} />
              {t("completeCourse")}
            </Button>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      w="100%"
      py={16}
      px={4}
      mb={8}
      position="relative"
      overflow="hidden"
      bg="linear-gradient(135deg, #1a365d 0%, #2a4365 50%, #2c5282 100%)"
      borderRadius="2xl"
      boxShadow="2xl"
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
        top="20%"
        left="5%"
        opacity={0.08}
        transform="rotate(-15deg)"
        display={{ base: "none", md: "block" }}
      >
        <FaPython size={120} color="white" />
      </Box>
      <Box
        position="absolute"
        bottom="15%"
        right="5%"
        opacity={0.08}
        transform="rotate(15deg)"
        display={{ base: "none", md: "block" }}
      >
        <MdCode size={100} color="white" />
      </Box>

      <Container maxW="container.lg" position="relative">
        <Flex direction="column" align="center" gap={4}>
          {/* Logo/Icon */}
          <Box
            p={4}
            bg="whiteAlpha.200"
            borderRadius="2xl"
            backdropFilter="blur(10px)"
          >
            <FaPython size={48} color="#FFD43B" />
          </Box>

          {/* Main Heading */}
          <VStack gap={3}>
            <Heading
              as="h1"
              size="3xl"
              textAlign="center"
              fontWeight="extrabold"
              letterSpacing="tight"
            >
              {t("title")}
            </Heading>
            <Text
              fontSize="lg"
              color="blue.200"
              fontWeight="medium"
              letterSpacing="wider"
              textTransform="uppercase"
            >
              {t("subtitle")}
            </Text>
          </VStack>

          {/* Description */}
          <Text
            fontSize="xl"
            color="gray.300"
            textAlign="center"
            maxW="3xl"
          >
            {t("description")}
          </Text>

          {/* Feature Pills */}
          <HStack gap={4} flexWrap="wrap" justify="center">
            <FeaturePill icon={<MdCode />} text={t("feature1")} />
            <FeaturePill icon={<MdSchool />} text={t("feature2")} />
            <FeaturePill icon={<FaPython />} text={t("feature3")} />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <HStack
      px={4}
      py={2}
      bg="whiteAlpha.100"
      borderRadius="full"
      border="1px solid"
      borderColor="whiteAlpha.200"
      backdropFilter="blur(10px)"
    >
      <Box color="blue.300">{icon}</Box>
      <Text color="gray.200" fontSize="sm" fontWeight="medium">
        {text}
      </Text>
    </HStack>
  );
}
