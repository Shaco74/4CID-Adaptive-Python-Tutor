'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { MdSmartToy, MdMessage, MdLightbulb } from 'react-icons/md';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function OnboardingStep3() {
  const t = useTranslations('onboarding.step3');

  return (
    <Box>
      <VStack gap={8} align="stretch">
        {/* Introduction */}
        <Box textAlign="center" py={6}>
          <Heading size="2xl" mb={4}
          bgImage="linear-gradient(to right, #63B3ED, #9F7AEA)"
            bgClip="text"
            color="transparent">
            {t('title')}
          </Heading>
          <Text fontSize="lg" color={{ base: "gray.300", _light: "gray.600" }} maxW="2xl" mx="auto" mb={6}>
            {t('intro')}
          </Text>

          {/* Chat Button Location Image */}
          <Box
            borderRadius="lg"
            overflow="hidden"
            border="2px solid"
            borderColor={{ base: "purple.500", _light: "purple.300" }}
            boxShadow="xl"
            mx="auto"
            maxW="100%"
          >
            <Image
              src="/onboarding/chat-button.png"
              alt={t('chatButtonAlt')}
              width={1200}
              height={675}
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          </Box>
          <Text fontSize="sm" color={{ base: "gray.500", _light: "gray.500" }} mt={2}>
            {t('chatButtonCaption')}
          </Text>
        </Box>

        {/* AI Features */}
        <VStack gap={6}>
          <Heading size="lg" mb={4}>
            {t('featuresTitle')}
          </Heading>

          {/* Chat Demo - Real Screenshot */}
          <Box bg={{ base: "gray.800", _light: "purple.50" }} p={6} borderRadius="lg" border="1px solid" borderColor={{ base: "purple.500", _light: "purple.300" }} w="full">
            <VStack gap={4} align="stretch">
              <HStack gap={3}>
                <Box bg="purple.500" p={2} borderRadius="full">
                  <MdSmartToy size={20} color="white" />
                </Box>
                <Text fontWeight="bold" color={{ base: "purple.300", _light: "purple.700" }}>
                  {t('aiAssistant')}
                </Text>
                <Text fontSize="xs" bg={{ base: "purple.900", _light: "purple.100" }} color={{ base: "purple.200", _light: "purple.800" }} px={2} py={1} borderRadius="md">
                  {t('exampleConversation')}
                </Text>
              </HStack>

              {/* Real Chat Screenshot */}
              <Box borderRadius="md" overflow="hidden" border="1px solid" borderColor={{ base: "gray.600", _light: "gray.300" }} style={{display: 'flex', justifyContent: 'center'}}>
                <Image
                  src="/onboarding/chat-beispiel.png"
                  alt={t('chatExampleAlt')}
                  width={500}
                  height={500}
                />
              </Box>
              <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }} textAlign="center">
                {t('chatExampleCaption')}
              </Text>
            </VStack>
          </Box>

          {/* How to Use Tips */}
          <Box w="full">
            <Heading size="lg" mb={4} textAlign="center">
              {t('tipsTitle')}
            </Heading>

            <VStack gap={4}>
              {/* Tip 1 */}
              <HStack w="full" p={4} bg={{ base: "gray.800", _light: "blue.50" }} borderRadius="md" border="1px solid" borderColor={{ base: "blue.500", _light: "blue.300" }}>
                <Box bg="blue.500" p={2} borderRadius="md">
                  <MdMessage size={20} color="white" />
                </Box>
                <Box flex={1}>
                  <Text fontWeight="bold" color={{ base: "blue.400", _light: "blue.600" }} mb={1}>
                    {t('tip1.title')}
                  </Text>
                  <Text fontSize="sm" color={{ base: "gray.300", _light: "gray.700" }}>
                    {t('tip1.description')}
                  </Text>
                </Box>
              </HStack>

              {/* Tip 2 */}
              <HStack w="full" p={4} bg={{ base: "gray.800", _light: "purple.50" }} borderRadius="md" border="1px solid" borderColor={{ base: "purple.500", _light: "purple.300" }}>
                <Box bg="purple.500" p={2} borderRadius="md">
                  <MdSmartToy size={20} color="white" />
                </Box>
                <Box flex={1}>
                  <Text fontWeight="bold" color={{ base: "purple.400", _light: "purple.600" }} mb={1}>
                    {t('tip2.title')}
                  </Text>
                  <Text fontSize="sm" color={{ base: "gray.300", _light: "gray.700" }}>
                    {t('tip2.description')}
                  </Text>
                </Box>
              </HStack>

              {/* Tip 3 */}
              <HStack w="full" p={4} bg={{ base: "gray.800", _light: "green.50" }} borderRadius="md" border="1px solid" borderColor={{ base: "green.500", _light: "green.300" }}>
                <Box bg="green.500" p={2} borderRadius="md">
                  <MdLightbulb size={20} color="white" />
                </Box>
                <Box flex={1}>
                  <Text fontWeight="bold" color={{ base: "green.400", _light: "green.600" }} mb={1}>
                    {t('tip3.title')}
                  </Text>
                  <Text fontSize="sm" color={{ base: "gray.300", _light: "gray.700" }}>
                    {t('tip3.description')}
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </Box>
        </VStack>

        {/* Try Now Section */}
        <Box textAlign="center" p={6} bg="gradient-to-r" bgGradient="linear(to-r, purple.900, blue.900)" borderRadius="lg">
          <Heading size="md" mb={3} color="white">
            {t('readyTitle')}
          </Heading>
          <Text color="gray.300" mb={4}>
            {t('readyDescription')}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
