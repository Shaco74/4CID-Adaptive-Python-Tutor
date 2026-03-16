'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { MdLoop, MdQuiz, MdCode, MdCheckCircle, MdAutorenew } from 'react-icons/md';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface OnboardingStep4Props {
  aiEnabled?: boolean;
}

export function OnboardingStep4({ aiEnabled = false }: OnboardingStep4Props) {
  const t = useTranslations('onboarding.step4');

  return (
    <Box>
      <VStack gap={8} align="stretch">
        {/* Introduction */}
        <Box textAlign="center" py={6}>
          <Heading size="2xl" mb={4}
          bgImage="linear-gradient(to right, #F6AD55, #ED8936)"
            bgClip="text"
            color="transparent">
            {t('title')}
          </Heading>
          <Text fontSize="lg" color={{ base: "gray.300", _light: "gray.600" }} maxW="2xl" mx="auto">
            {t('intro')}
          </Text>
        </Box>

        {/* What are Drills */}
        <VStack gap={6}>
          <Heading size="lg" mb={4}>
            {t('whatAreDrills')}
          </Heading>

          <Box bg={{ base: "gray.800", _light: "orange.50" }} border="1px solid" borderColor={{ base: "orange.500", _light: "orange.300" }} w="full" p={6} borderRadius="lg">
            <HStack gap={4} align="start">
              <Box bg="orange.500" p={2} borderRadius="md" mb={2}>
                <MdLoop size={24} color="white" />
              </Box>
              <Box flex={1}>
                <Heading size="md" color={{ base: "orange.400", _light: "orange.600" }} mb={2}>
                  {t('partTaskPractice.title')}
                </Heading>
                <Text color={{ base: "gray.300", _light: "gray.700" }}>
                  {t('partTaskPractice.description')}
                </Text>
              </Box>
            </HStack>
          </Box>

          {/* Drill Structure */}
          <Box w="full">
            <Heading size="lg" mb={4} textAlign="center">
              {t('howDrillsWork')}
            </Heading>

            <VStack gap={4}>
              {/* Part 1: MCQ */}
              <Box bg={{ base: "gray.800", _light: "blue.50" }} border="1px solid" borderColor={{ base: "blue.500", _light: "blue.300" }} w="full" p={6} borderRadius="lg">
                <HStack gap={4} align="start">
                  <Box bg="blue.500" p={2} borderRadius="md">
                    <MdQuiz size={24} color="white" />
                  </Box>
                  <Box flex={1}>
                    <HStack mb={2} gap={3} align="center">
                      <Heading size="md" color={{ base: "blue.400", _light: "blue.600" }}>
                        {t('part1.title')}
                      </Heading>
                      <Text fontSize="xs" bg={{ base: "blue.900", _light: "blue.100" }} color={{ base: "blue.200", _light: "blue.800" }} px={2} py={1} borderRadius="md">
                        {t('part1.tag')}
                      </Text>
                    </HStack>
                    <Text color={{ base: "gray.300", _light: "gray.700" }} mb={3}>
                      {t('part1.description')}
                    </Text>
                    <VStack align="start" gap={1} ml={4} mb={4}>
                      <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>• <strong>{t('part1.questionTypes.concept')}</strong></Text>
                      <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>• <strong>{t('part1.questionTypes.predictOutput')}</strong></Text>
                      <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>• <strong>{t('part1.questionTypes.findError')}</strong></Text>
                      <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>• <strong>{t('part1.questionTypes.fillBlank')}</strong></Text>
                    </VStack>
                    {/* MCQ Screenshot */}
                    <Box borderRadius="md" overflow="hidden" border="1px solid" borderColor={{ base: "gray.600", _light: "gray.300" }}>
                      <Image
                        src="/onboarding/drill-multiple-choice.png"
                        alt={t('part1.screenshotAlt')}
                        width={600}
                        height={400}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </Box>
                  </Box>
                </HStack>
              </Box>

              {/* Part 2: Code */}
              <Box bg={{ base: "gray.800", _light: "green.50" }} border="1px solid" borderColor={{ base: "green.500", _light: "green.300" }} w="full" p={6} borderRadius="lg">
                <HStack gap={4} align="start">
                  <Box bg="green.500" p={2} borderRadius="md">
                    <MdCode size={24} color="white" />
                  </Box>
                  <Box flex={1}>
                    <HStack mb={2} gap={3} align="center">
                      <Heading size="md" color={{ base: "green.400", _light: "green.600" }}>
                        {t('part2.title')}
                      </Heading>
                      <Text fontSize="xs" bg={{ base: "green.900", _light: "green.100" }} color={{ base: "green.200", _light: "green.800" }} px={2} py={1} borderRadius="md">
                        {t('part2.tag')}
                      </Text>
                    </HStack>
                    <Text color={{ base: "gray.300", _light: "gray.700" }} mb={4}>
                      {t('part2.description')}
                    </Text>
                    {/* Code Task Screenshot */}
                    <Box borderRadius="md" overflow="hidden" border="1px solid" borderColor={{ base: "gray.600", _light: "gray.300" }}>
                      <Image
                        src="/onboarding/drill-code-aufgabe.png"
                        alt={t('part2.screenshotAlt')}
                        width={600}
                        height={500}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </Box>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>

          {/* When do Drills appear */}
          <Box bg={{ base: "gray.800", _light: "purple.50" }} border="1px solid" borderColor={{ base: "purple.500", _light: "purple.300" }} w="full" p={6} borderRadius="lg">
            <HStack gap={4} align="start">
              <Box bg="purple.500" p={2} borderRadius="md">
                <MdAutorenew size={24} color="white" />
              </Box>
              <Box flex={1}>
                <Heading size="md" color={{ base: "purple.400", _light: "purple.600" }} mb={2}>
                  {t('whenDrillsAppear.title')}
                </Heading>
                <Text color={{ base: "gray.300", _light: "gray.700" }}>
                  {t('whenDrillsAppear.description')}
                </Text>
              </Box>
            </HStack>
          </Box>
        </VStack>

        {/* Tips */}
        <Box bg={{ base: "green.900", _light: "green.50" }} border="2px solid" borderColor={{ base: "green.400", _light: "green.300" }} p={6} borderRadius="xl">
          <VStack gap={4}>
            <HStack gap={3}>
              <MdCheckCircle size={28} color="#48BB78" />
              <Heading size="md" color={{ base: "green.200", _light: "green.700" }}>
                {t('tips.title')}
              </Heading>
            </HStack>
            <VStack align="start" gap={2} w="full">
              <Text color={{ base: "green.100", _light: "green.800" }} fontSize="sm">
                <strong>{t('tips.noFear.title')}</strong> {t('tips.noFear.description')}
              </Text>
              <Text color={{ base: "green.100", _light: "green.800" }} fontSize="sm">
                <strong>{t('tips.shortSweet.title')}</strong> {t('tips.shortSweet.description')}
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Ready Section */}
        <Box textAlign="center" p={6} bg="gradient-to-r" bgGradient="linear(to-r, orange.900, yellow.900)" borderRadius="lg">
          <Heading size="md" mb={3} color="white">
            {t('readyTitle')}
          </Heading>
          <Text color="gray.300">
            {t('readyDescription')}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
