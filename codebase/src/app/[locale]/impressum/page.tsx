'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Separator,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { FC } from 'react';
import NextLink from 'next/link';
import { ArrowLeft } from 'lucide-react';

const ImpressumPage: FC = () => {
  return (
    <Container maxW="4xl" py={{ base: '8', md: '16' }} px={{ base: '4', sm: '8' }}>
      {/* Back to Login Link */}
      <ChakraLink asChild mb={8} display="inline-flex" alignItems="center" gap={2} color="blue.400" _hover={{ color: 'blue.300' }}>
        <NextLink href="/login">
          <ArrowLeft size={18} />
          Zurück zum Login / Back to Login
        </NextLink>
      </ChakraLink>

      {/* German Version */}
      <Box
        py="8"
        px={{ base: '4', sm: '10' }}
        bg="var(--bgAnthrazitDark)"
        boxShadow="xl"
        borderRadius="xl"
        color="white"
        mb={8}
      >
        <VStack align="stretch" gap={6}>
          <Heading size="2xl" textAlign="center" mb={4}>
            Impressum
          </Heading>

          <Box>
            <Heading size="lg" mb={3}>
              Angaben gemäß § 5 TMG
            </Heading>
            <Box pl={4} borderLeft="2px solid" borderColor="blue.400" py={2}>
              <Text color="white" fontWeight="semibold">Kacper Cömlek</Text>
              <Text color="gray.300">FH Aachen - University of Applied Sciences</Text>
              <Text color="gray.300">Bachelorarbeit im Studiengang Informatik</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="lg" mb={3}>
              Kontakt
            </Heading>
            <Text color="gray.300" lineHeight="tall">
              E-Mail: <ChakraLink href="mailto:kacper.coemlek@alumni.fh-aachen.de" color="blue.300" _hover={{ color: 'blue.200' }}>kacper.coemlek@alumni.fh-aachen.de</ChakraLink>
            </Text>
          </Box>

          <Box>
            <Heading size="lg" mb={3}>
              Verantwortlich für den Inhalt
            </Heading>
            <Text color="gray.300" lineHeight="tall">
              Kacper Cömlek (Anschrift wie oben)
            </Text>
          </Box>

          <Box>
            <Heading size="lg" mb={3}>
              Hinweis zur Nutzung
            </Heading>
            <Text color="gray.300" lineHeight="tall">
              Diese Webseite wurde im Rahmen einer wissenschaftlichen Bachelorarbeit an der FH Aachen erstellt.
              Sie dient ausschließlich Forschungszwecken und wird nicht kommerziell betrieben.
            </Text>
          </Box>

          <Box>
            <Heading size="lg" mb={3}>
              Haftungsausschluss
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={3}>
              <Text as="span" fontWeight="semibold" color="white">Haftung für Inhalte:</Text>{' '}
              Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
              und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
            </Text>
            <Text color="gray.300" lineHeight="tall">
              <Text as="span" fontWeight="semibold" color="white">Haftung für Links:</Text>{' '}
              Diese Webseite enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
            </Text>
          </Box>
        </VStack>
      </Box>

      <Separator borderColor="gray.600" />

      {/* English Version */}
      <Box
        py="8"
        px={{ base: '4', sm: '10' }}
        bg="var(--bgAnthrazitDark)"
        boxShadow="xl"
        borderRadius="xl"
        color="white"
        mt={8}
      >
        <VStack align="stretch" gap={6}>
          <Heading size="2xl" textAlign="center" mb={4}>
            Legal Notice
          </Heading>

          <Box>
            <Heading size="lg" mb={3}>
              Information according to § 5 TMG
            </Heading>
            <Box pl={4} borderLeft="2px solid" borderColor="blue.400" py={2}>
              <Text color="white" fontWeight="semibold">Kacper Cömlek</Text>
              <Text color="gray.300">FH Aachen - University of Applied Sciences</Text>
              <Text color="gray.300">Bachelor Thesis in Computer Science</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="lg" mb={3}>
              Contact
            </Heading>
            <Text color="gray.300" lineHeight="tall">
              Email: <ChakraLink href="mailto:kacper.coemlek@alumni.fh-aachen.de" color="blue.300" _hover={{ color: 'blue.200' }}>kacper.coemlek@alumni.fh-aachen.de</ChakraLink>
            </Text>
          </Box>

          <Box>
            <Heading size="lg" mb={3}>
              Responsible for Content
            </Heading>
            <Text color="gray.300" lineHeight="tall">
              Kacper Cömlek (address as above)
            </Text>
          </Box>

          <Box>
            <Heading size="lg" mb={3}>
              Usage Notice
            </Heading>
            <Text color="gray.300" lineHeight="tall">
              This website was created as part of a scientific bachelor thesis at FH Aachen University of Applied Sciences.
              It serves exclusively research purposes and is not operated commercially.
            </Text>
          </Box>

          <Box>
            <Heading size="lg" mb={3}>
              Disclaimer
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={3}>
              <Text as="span" fontWeight="semibold" color="white">Liability for Content:</Text>{' '}
              The contents of these pages were created with the greatest care. However, no guarantee can be given
              for the correctness, completeness and timeliness of the content.
            </Text>
            <Text color="gray.300" lineHeight="tall">
              <Text as="span" fontWeight="semibold" color="white">Liability for Links:</Text>{' '}
              This website contains links to external third-party websites over whose content we have no influence.
              The respective provider is always responsible for the content of the linked pages.
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Back to Login Link at bottom */}
      <Box textAlign="center" mt={8}>
        <ChakraLink asChild display="inline-flex" alignItems="center" gap={2} color="blue.400" _hover={{ color: 'blue.300' }}>
          <NextLink href="/login">
            <ArrowLeft size={18} />
            Zurück zum Login / Back to Login
          </NextLink>
        </ChakraLink>
      </Box>
    </Container>
  );
};

export default ImpressumPage;
