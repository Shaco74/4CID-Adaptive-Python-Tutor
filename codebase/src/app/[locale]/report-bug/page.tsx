'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Code,
  Textarea,
  Input,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import { MdContentCopy, MdCheck, MdEmail, MdBugReport } from 'react-icons/md';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function ReportBugPage() {
  const { user, username, aiChatTutorIsEnabled } = useUser();
  const [copied, setCopied] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [description, setDescription] = useState('');
  const t = useTranslations('reportBug');
  const locale = useLocale();

  const metadata = useMemo(() => {
    const notLoggedIn = t('metadata.notLoggedIn');
    const unknown = t('metadata.unknown');
    const data = {
      userId: user?.userId || notLoggedIn,
      username: username || notLoggedIn,
      gruppe: aiChatTutorIsEnabled ? t('metadata.groupB') : t('metadata.groupA'),
      browser: typeof window !== 'undefined' ? navigator.userAgent : unknown,
      bildschirm: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : unknown,
      zeitstempel: new Date().toLocaleString(locale === 'de' ? 'de-DE' : 'en-US'),
      url: typeof window !== 'undefined' ? window.location.href : unknown,
    };
    return data;
  }, [user, username, aiChatTutorIsEnabled, t, locale]);

  const metadataText = useMemo(() => {
    return `${t('template.metadataHeader')}
${t('metadata.userId')}: ${metadata.userId}
${t('metadata.username')}: ${metadata.username}
${t('metadata.group')}: ${metadata.gruppe}
Browser: ${metadata.browser}
${t('metadata.screen')}: ${metadata.bildschirm}
${t('metadata.timestamp')}: ${metadata.zeitstempel}
URL: ${metadata.url}
=============================`;
  }, [metadata, t]);

  const handleCopyMetadata = async () => {
    try {
      await navigator.clipboard.writeText(metadataText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const bugReportTemplate = `${t('template.hello')},

${t('template.intro')}

${t('template.description')}
${description || t('template.descriptionPlaceholder')}

${t('template.steps')}
1.
2.
3.

${t('template.expected')}


${t('template.actual')}


${metadataText}`;

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(bugReportTemplate);
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const emailAddress = 'kacper.coemlek@alumni.fh-aachen.de';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const emailSubject = encodeURIComponent(t('email.subject'));
  const emailBody = encodeURIComponent(bugReportTemplate);

  const mailtoLink = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <Box minH="100vh" bg={{ base: "gray.900", _light: "gray.50" }} py={8}>
      <Container maxW="container.md">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <VStack gap={4} textAlign="center">
            <Box
              p={4}
              bg={{ base: "red.900", _light: "red.100" }}
              borderRadius="full"
            >
              <MdBugReport size={48} color="#E53E3E" />
            </Box>
            <Heading
              size="2xl"
              color={{ base: "white", _light: "gray.900" }}
            >
              {t('title')}
            </Heading>
            <Text color={{ base: "gray.400", _light: "gray.600" }} maxW="lg">
              {t('subtitle')}
            </Text>
          </VStack>

          {/* Description Input */}
          <Box
            bg={{ base: "gray.800", _light: "white" }}
            p={6}
            borderRadius="xl"
            border="1px solid"
            borderColor={{ base: "gray.700", _light: "gray.200" }}
          >
            <VStack gap={4} align="stretch">
              <Heading size="md" color={{ base: "white", _light: "gray.900" }}>
                {t('describeProblem')}
              </Heading>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('placeholder')}
                bg={{ base: "gray.700", _light: "gray.50" }}
                color={{ base: "white", _light: "gray.900" }}
                border="1px solid"
                borderColor={{ base: "gray.600", _light: "gray.300" }}
                _placeholder={{ color: { base: "gray.400", _light: "gray.500" } }}
                rows={4}
                resize="vertical"
              />
            </VStack>
          </Box>

          {/* Metadata Section */}
          <Box
            bg={{ base: "gray.800", _light: "white" }}
            p={6}
            borderRadius="xl"
            border="1px solid"
            borderColor={{ base: "gray.700", _light: "gray.200" }}
          >
            <VStack gap={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md" color={{ base: "white", _light: "gray.900" }}>
                  {t('metadata.title')}
                </Heading>
                <Button
                  size="sm"
                  colorScheme={copied ? "green" : "blue"}
                  onClick={handleCopyMetadata}
                >
                  <HStack gap={2}>
                    {copied ? <MdCheck /> : <MdContentCopy />}
                    <span>{copied ? t('copy.copied') : t('copy.button')}</span>
                  </HStack>
                </Button>
              </HStack>

              <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>
                {t('metadata.subtitle')}
              </Text>

              <Box
                bg={{ base: "gray.900", _light: "gray.100" }}
                p={4}
                borderRadius="md"
                fontFamily="mono"
                fontSize="sm"
                overflowX="auto"
              >
                <VStack align="stretch" gap={2}>
                  <HStack>
                    <Text color={{ base: "gray.500", _light: "gray.500" }} minW="100px">{t('metadata.userId')}:</Text>
                    <Code bg="transparent" color={{ base: "blue.300", _light: "blue.600" }}>{metadata.userId}</Code>
                  </HStack>
                  <HStack>
                    <Text color={{ base: "gray.500", _light: "gray.500" }} minW="100px">{t('metadata.username')}:</Text>
                    <Code bg="transparent" color={{ base: "green.300", _light: "green.600" }}>{metadata.username}</Code>
                  </HStack>
                  <HStack>
                    <Text color={{ base: "gray.500", _light: "gray.500" }} minW="100px">{t('metadata.group')}:</Text>
                    <Code bg="transparent" color={{ base: "purple.300", _light: "purple.600" }}>{metadata.gruppe}</Code>
                  </HStack>
                  <HStack>
                    <Text color={{ base: "gray.500", _light: "gray.500" }} minW="100px">{t('metadata.screen')}:</Text>
                    <Code bg="transparent" color={{ base: "orange.300", _light: "orange.600" }}>{metadata.bildschirm}</Code>
                  </HStack>
                  <HStack>
                    <Text color={{ base: "gray.500", _light: "gray.500" }} minW="100px">{t('metadata.timestamp')}:</Text>
                    <Code bg="transparent" color={{ base: "gray.300", _light: "gray.700" }}>{metadata.zeitstempel}</Code>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Email Button */}
          <Box
            bg={{ base: "blue.900", _light: "blue.50" }}
            p={6}
            borderRadius="xl"
            border="2px solid"
            borderColor={{ base: "blue.500", _light: "blue.300" }}
          >
            <VStack gap={4}>
              <Heading size="md" color={{ base: "blue.200", _light: "blue.700" }}>
                {t('email.title')}
              </Heading>
              <Text color={{ base: "blue.100", _light: "blue.600" }} textAlign="center">
                {t('email.subtitle')}
              </Text>
              <Button
                asChild
                size="lg"
                colorScheme="blue"
                px={8}
              >
                <a href={mailtoLink}>
                  <HStack gap={2}>
                    <MdEmail />
                    <span>{t('email.button')}</span>
                  </HStack>
                </a>
              </Button>
            </VStack>
          </Box>

          {/* Copy Options */}
          <Box
            bg={{ base: "gray.800", _light: "white" }}
            p={6}
            borderRadius="xl"
            border="1px solid"
            borderColor={{ base: "gray.700", _light: "gray.200" }}
          >
            <VStack gap={4} align="stretch">
              <Heading size="md" color={{ base: "white", _light: "gray.900" }}>
                {t('copy.title')}
              </Heading>

              {/* Email Address with Copy */}
              <Box>
                <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }} mb={2}>
                  {t('copy.emailLabel')}
                </Text>
                <HStack>
                  <Input
                    value={emailAddress}
                    readOnly
                    bg={{ base: "gray.700", _light: "gray.100" }}
                    color={{ base: "white", _light: "gray.900" }}
                    border="1px solid"
                    borderColor={{ base: "gray.600", _light: "gray.300" }}
                    fontFamily="mono"
                    fontSize="sm"
                  />
                  <Button
                    size="md"
                    colorScheme={copiedEmail ? "green" : "gray"}
                    onClick={handleCopyEmail}
                    minW="120px"
                  >
                    <HStack gap={2}>
                      {copiedEmail ? <MdCheck /> : <MdContentCopy />}
                      <span>{copiedEmail ? t('copy.copied') : t('copy.button')}</span>
                    </HStack>
                  </Button>
                </HStack>
              </Box>

              {/* Bug Report Template Copy */}
              <Box>
                <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }} mb={2}>
                  {t('copy.templateLabel')}
                </Text>
                <Button
                  size="md"
                  colorScheme={copiedTemplate ? "green" : "purple"}
                  onClick={handleCopyTemplate}
                  w="full"
                >
                  <HStack gap={2}>
                    {copiedTemplate ? <MdCheck /> : <MdContentCopy />}
                    <span>{copiedTemplate ? t('copy.templateCopied') : t('copy.templateButton')}</span>
                  </HStack>
                </Button>
              </Box>
            </VStack>
          </Box>

          {/* Back Link */}
          <Box textAlign="center">
            <Link href="/" passHref>
              <Button variant="ghost" color={{ base: "gray.400", _light: "gray.600" }}>
                {t('backToHome')}
              </Button>
            </Link>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
