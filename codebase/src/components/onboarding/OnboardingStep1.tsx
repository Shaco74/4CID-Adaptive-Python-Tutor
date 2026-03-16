'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack
} from '@chakra-ui/react';
import { MdPsychology, MdCode, MdGpsFixed, MdGroup, MdBook, MdEmojiEvents, MdInfo } from 'react-icons/md';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface OnboardingStep1Props {
  aiEnabled?: boolean;
}

export function OnboardingStep1({ aiEnabled = false }: OnboardingStep1Props) {
  const t = useTranslations('onboarding.step1');

  return (
    <Box>
      <VStack gap={8} align="stretch">
        {/* Hero Section */}
        <Box textAlign="center" py={8}>
          <Heading
            size="3xl"
            mb={4}
            bgImage="linear-gradient(to right, #63B3ED, #9F7AEA)"
            bgClip="text"
            color="transparent"
          >
            {t('title')}
          </Heading>
          <Text fontSize="xl" color={{ base: "gray.300", _light: "gray.600" }} maxW="3xl" mx="auto" lineHeight="tall">
            {t('introBase')}
            {aiEnabled && (
              <>
                <br />
                <br />
                {t('introAI')}
              </>
            )}
          </Text>
        </Box>
        {/* Key Features */}
        <VStack gap={6}>
          <Heading size="xl" textAlign="center" mb={4} bgImage="linear-gradient(to right, #63B3ED, #9F7AEA)"
            bgClip="text"
            color="transparent">
            {t('whatMakesSpecial')}
          </Heading>

          <VStack gap={4} w="full">
            <Box bg={{ base: "gray.800", _light: "blue.50" }} border="1px solid" borderColor={{ base: "blue.500", _light: "blue.300" }} w="full" p={6} borderRadius="lg">
              <HStack gap={4} align="start">
                <MdGpsFixed size={24} color="#3182CE" />
                <Box>
                  <Heading size="md" color={{ base: "blue.400", _light: "blue.600" }} mb={2}>
                    {t('feature4cid.title')}
                  </Heading>
                  <Text color={{ base: "gray.300", _light: "gray.700" }}>
                    {t('feature4cid.description')}
                  </Text>
                </Box>
              </HStack>
            </Box>

            {aiEnabled && (
              <Box bg={{ base: "gray.800", _light: "purple.50" }} border="1px solid" borderColor={{ base: "purple.500", _light: "purple.300" }} w="full" p={6} borderRadius="lg">
                <HStack gap={4} align="start">
                  <MdPsychology size={24} color="#9F7AEA" />
                  <Box>
                    <Heading size="md" color={{ base: "purple.400", _light: "purple.600" }} mb={2}>
                      {t('featureAI.title')}
                    </Heading>
                    <Text color={{ base: "gray.300", _light: "gray.700" }}>
                      {t('featureAI.description')}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            )}

            <Box bg={{ base: "gray.800", _light: "green.50" }} border="1px solid" borderColor={{ base: "green.500", _light: "green.300" }} w="full" p={6} borderRadius="lg">
              <HStack gap={4} align="start">
                <MdCode size={24} color="#48BB78" />
                <Box>
                  <Heading size="md" color={{ base: "green.400", _light: "green.600" }} mb={2}>
                    {t('featureProjects.title')}
                  </Heading>
                  <Text color={{ base: "gray.300", _light: "gray.700" }}>
                    {t('featureProjects.description')}
                  </Text>
                </Box>
              </HStack>
            </Box>
          </VStack>
        </VStack>

        {/* Research Group Info - conditional based on group */}
        <Box
          bg={{ base: aiEnabled ? "purple.900" : "orange.900", _light: aiEnabled ? "purple.50" : "orange.50" }}
          border="2px solid"
          borderColor={{ base: aiEnabled ? "purple.500" : "orange.500", _light: aiEnabled ? "purple.400" : "orange.400" }}
          p={6}
          borderRadius="xl"
        >
          <HStack gap={4} align="start">
            <MdInfo size={28} color={aiEnabled ? "#9F7AEA" : "#ED8936"} style={{ flexShrink: 0, marginTop: '2px' }} />
            <Box>
              <Heading size="md" color={{ base: aiEnabled ? "purple.300" : "orange.300", _light: aiEnabled ? "purple.700" : "orange.700" }} mb={2}>
                {aiEnabled ? t('learningGroup.titleAI') : t('learningGroup.titleClassic')}
              </Heading>
              <Text color={{ base: aiEnabled ? "purple.100" : "orange.100", _light: aiEnabled ? "purple.800" : "orange.800" }} lineHeight="tall">
                {aiEnabled ? t('learningGroup.descriptionAI') : t('learningGroup.descriptionClassic')}
              </Text>
            </Box>
          </HStack>
        </Box>

        {/* Learning Path Preview */}
        <Box py={2}>
          <Heading size="lg" textAlign="center" mb={6} bgImage="linear-gradient(to right, #63B3ED, #9F7AEA)"
            bgClip="text"
            color="transparent">
            {t('learningJourney.title')}
          </Heading>
          <HStack justify="center" gap={6} flexWrap="wrap" mb={6}>
            <VStack gap={2}>
              <MdBook size={40} color="#3182CE" />
              <Text fontSize="sm" textAlign="center" color={{ base: "gray.400", _light: "gray.600" }}>
                {t('learningJourney.basics')}<br />
                <Text as="span" color={{ base: "white", _light: "gray.900" }} fontWeight="medium">{t('learningJourney.basicsDetail')}</Text>
              </Text>
            </VStack>
            <Text color={{ base: "gray.600", _light: "gray.400" }} fontSize="3xl">→</Text>
            <VStack gap={2}>
              <MdGroup size={40} color="#9F7AEA" />
              <Text fontSize="sm" textAlign="center" color={{ base: "gray.400", _light: "gray.600" }}>
                {t('learningJourney.dataStructures')}<br />
                <Text as="span" color={{ base: "white", _light: "gray.900" }} fontWeight="medium">{t('learningJourney.dataStructuresDetail')}</Text>
              </Text>
            </VStack>
            <Text color={{ base: "gray.600", _light: "gray.400" }} fontSize="3xl">→</Text>
            <VStack gap={2}>
              <MdEmojiEvents size={40} color="#F6AD55" />
              <Text fontSize="sm" textAlign="center" color={{ base: "gray.400", _light: "gray.600" }}>
                {t('learningJourney.projects')}<br />
                <Text as="span" color={{ base: "white", _light: "gray.900" }} fontWeight="medium">{t('learningJourney.projectsDetail')}</Text>
              </Text>
            </VStack>
          </HStack>

          {/* Course Overview Screenshot */}
          <Box
            borderRadius="lg"
            overflow="hidden"
            border="2px solid"
            borderColor={{ base: "gray.600", _light: "gray.300" }}
            boxShadow="xl"
            mx="auto"
            maxW="100%"
          >
            <Image
              src="/onboarding/home-kursuebersicht.png"
              alt={t('screenshotAlt')}
              width={1200}
              height={675}
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          </Box>
          <Text fontSize="sm" color={{ base: "gray.500", _light: "gray.500" }} mt={2} textAlign="center">
            {t('screenshotCaption')}
          </Text>
        </Box>

        {/* Research Note */}
        <Box bg={{ base: "blue.900", _light: "blue.50" }} border="2px solid" borderColor={{ base: "blue.400", _light: "blue.300" }} p={8} borderRadius="xl" mt={4}>
          <VStack gap={4}>
            <Heading size="xl" color={{ base: "blue.200", _light: "blue.700" }} textAlign="center">
              {t('research.title')}
            </Heading>
            <Text color={{ base: "blue.100", _light: "blue.700" }} textAlign="center" fontSize="lg" lineHeight="tall" maxW="2xl">
              {t('research.description')}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
