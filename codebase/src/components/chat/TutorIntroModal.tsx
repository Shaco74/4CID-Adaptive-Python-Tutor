'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Heading,
  Separator,
} from '@chakra-ui/react';
import { HiPaperAirplane } from 'react-icons/hi2';
import { MdSmartToy, MdArrowForward } from 'react-icons/md';
import { useUser } from '@/context/UserContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { chatBotResponseAction } from '@/actions/openaiChatActionV3';
import StructuredContentRenderer from './StructuredContentRenderer';
import { useLocale, useTranslations } from 'next-intl';

interface StructuredContentItem {
  type: 'text' | 'admonition' | 'codeblock';
  content: string;
  title?: string | null;
  admonition_type?: 'info' | 'warning' | 'error' | 'success' | 'note' | null;
  language?: 'python' | null;
}

interface StructuredResponse {
  content: StructuredContentItem[];
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  structured?: StructuredResponse;
}

interface TutorIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Spezielle System-Nachricht für die Tutor-Einführung (Deutsch)
const INTRO_SYSTEM_MESSAGE_DE = `Du bist ein freundlicher und motivierender KI-Lernassistent für ein Python-Bootcamp.

🎯 **DEINE AUFGABE:**
Der Nutzer stellt sich gerade vor und teilt seinen Erfahrungsstand mit dir. Deine Aufgabe ist es:
1. Ihn herzlich zu begrüßen und seine Vorstellung anzuerkennen
2. Basierend auf seinem Erfahrungsstand passend zu reagieren
3. Ihm Mut zu machen und ihn auf den Kurs einzustimmen
4. Optional einen ersten kleinen Tipp oder interessanten Fakt über Python zu teilen

**WICHTIGE RICHTLINIEN:**
- Sei warm, freundlich und motivierend
- Verwende gelegentlich Emojis, aber übertreibe nicht
- Passe deine Sprache dem Niveau des Nutzers an
- Bei Anfängern: Betone, dass Python perfekt zum Einstieg ist
- Bei Fortgeschrittenen: Zeige dass du auch anspruchsvollere Fragen beantworten kannst
- Halte deine Antwort nicht zu lang (max 150-200 Wörter)
- Erwähne, dass du während des gesamten Kurses zur Verfügung stehst

**KONTEXT:**
Dies ist das erste Gespräch mit dem Nutzer. Die Informationen die er teilt, helfen dir später im Kurs, besser auf sein Niveau einzugehen.`;

// Spezielle System-Nachricht für die Tutor-Einführung (English)
const INTRO_SYSTEM_MESSAGE_EN = `You are a friendly and motivating AI learning assistant for a Python bootcamp.

🎯 **YOUR TASK:**
The user is introducing themselves and sharing their experience level with you. Your task is to:
1. Warmly greet them and acknowledge their introduction
2. Respond appropriately based on their experience level
3. Encourage them and get them excited about the course
4. Optionally share a first small tip or interesting fact about Python

**IMPORTANT GUIDELINES:**
- Be warm, friendly, and motivating
- Use emojis occasionally, but don't overdo it
- Adapt your language to the user's level
- For beginners: Emphasize that Python is perfect for getting started
- For advanced users: Show that you can handle more challenging questions
- Keep your answer not too long (max 150-200 words)
- Mention that you'll be available throughout the entire course

**CONTEXT:**
This is the first conversation with the user. The information they share will help you better adapt to their level later in the course.`;

function getIntroSystemMessage(locale: string): string {
  return locale === 'en' ? INTRO_SYSTEM_MESSAGE_EN : INTRO_SYSTEM_MESSAGE_DE;
}

export function TutorIntroModal({ isOpen, onClose }: TutorIntroModalProps) {
  const { user, username, refetchUserData } = useUser();
  const locale = useLocale();
  const t = useTranslations('chat.introModal');
  const tChat = useTranslations('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);
  const [hasReceivedResponse, setHasReceivedResponse] = useState(false);
  const [initialMessageSaved, setInitialMessageSaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Firebase persistence - save messages to chatHistory (same format as ChatDrawer)
  const saveChatMessageToFirebase = async (message: Message, responseId?: string) => {
    if (!user?.username) return;

    try {
      const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
      const userRef = doc(db, 'users', cleanUsername);
      const messageKey = `${message.timestamp.getTime()}_${message.isUser ? 'user' : 'ai'}`;

      const chatEntry = {
        timestamp: message.timestamp,
        isUser: message.isUser,
        message: message.text,
        responseId: responseId || null,
        structured: message.structured || null,
        source: 'tutor_intro' // Markiere als TutorIntro-Nachricht
      };

      await setDoc(userRef, {
        chatHistory: {
          [messageKey]: chatEntry
        },
        lastChatActivity: new Date()
      }, { merge: true });

    } catch (error) {
      console.error('Error saving chat message to Firebase:', error);
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const greetingText = t('greeting', { username: username ? ` ${username}` : '' });
      const initialMessage: Message = {
        id: '1',
        text: greetingText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([initialMessage]);
      setInputValue('');
      setPreviousResponseId(null);
      setHasReceivedResponse(false);
      setInitialMessageSaved(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, username]);

  // Save initial message to Firebase (only once when modal opens)
  useEffect(() => {
    if (isOpen && messages.length === 1 && !initialMessageSaved && user?.username) {
      saveChatMessageToFirebase(messages[0]);
      setInitialMessageSaved(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, messages, initialMessageSaved, user?.username]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Speichere User-Nachricht in Firebase
      await saveChatMessageToFirebase(userMessage);

      // Erstelle den Prompt mit dem Intro-Kontext
      const userContextLabel = locale === 'en' ? 'USER CONTEXT' : 'NUTZER-KONTEXT';
      const nameLabel = locale === 'en' ? 'Name' : 'Name';
      const situationLabel = locale === 'en' ? 'Situation' : 'Situation';
      const situationText = locale === 'en'
        ? 'First contact - Tutor introduction after onboarding'
        : 'Erster Kontakt - Tutor-Einführung nach dem Onboarding';
      const introText = locale === 'en'
        ? 'The user is introducing themselves'
        : 'Der Nutzer stellt sich vor';
      const learnerText = locale === 'en' ? 'Learner' : 'Lernender';

      const introContext = `${getIntroSystemMessage(locale)}

=== ${userContextLabel} ===
${nameLabel}: ${username || learnerText}
${situationLabel}: ${situationText}
===

${introText}:
"${userMessage.text}"`;

      const response = await chatBotResponseAction({
        prompt: introContext,
        previous_response_id: previousResponseId || undefined,
        username: username || undefined,
        locale: locale,
      });

      if (response.chatId) {
        setPreviousResponseId(response.chatId);

        // Speichere die Conversation-ID und activeResponseId in Firebase
        if (user?.username) {
          const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
          const userRef = doc(db, 'users', cleanUsername);
          await setDoc(userRef, {
            tutorIntroConversationId: response.chatId,
            activeResponseId: response.chatId, // Für ChatDrawer Fortsetzung
            updatedAt: Date.now(),
          }, { merge: true });
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        timestamp: new Date(),
        structured: response.structured,
      };

      setMessages(prev => [...prev, aiMessage]);
      setHasReceivedResponse(true);

      // Speichere AI-Nachricht in Firebase
      await saveChatMessageToFirebase(aiMessage, response.chatId);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('errorMessage'),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleComplete = async () => {
    if (!user?.username) return;

    try {
      const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
      const userRef = doc(db, 'users', cleanUsername);
      await setDoc(userRef, {
        tutorIntroCompleted: true,
        tutorIntroCompletedAt: Date.now(),
        // Setze die activeResponseId, damit der normale Chat fortgesetzt werden kann
        activeResponseId: previousResponseId,
        updatedAt: Date.now(),
      }, { merge: true });

      await refetchUserData();
      onClose();
    } catch (error) {
      console.error('Error completing tutor intro:', error);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.85)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="gray.800"
        borderRadius="2xl"
        maxW="700px"
        w="100%"
        h="80vh"
        maxH="700px"
        display="flex"
        flexDirection="column"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        border="1px solid"
        borderColor="gray.600"
        overflow="hidden"
      >
        {/* Header */}
        <Box
          p={4}
          borderBottom="1px solid"
          borderColor="gray.600"
          bg="gray.750"
        >
          <HStack gap={3} justify="center">
            <Box
              p={2}
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              borderRadius="lg"
            >
              <MdSmartToy size={24} color="white" />
            </Box>
            <VStack gap={0} align="start">
              <Heading size="md" color="white">
                {t('title')}
              </Heading>
              <Text color="purple.300" fontSize="xs">
                {t('subtitle')}
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Messages Area */}
        <Box
          flex="1"
          p={4}
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#4A5568',
              borderRadius: '3px',
            },
          }}
        >
          <VStack gap={4} align="stretch">
            {messages.map((message) => (
              <Box
                key={message.id}
                alignSelf={message.isUser ? 'flex-end' : 'flex-start'}
                maxW="85%"
              >
                {!message.isUser && (
                  <HStack gap={2} mb={1}>
                    <Box p={1} bg="purple.600" borderRadius="md">
                      <MdSmartToy size={14} color="white" />
                    </Box>
                    <Text color="purple.300" fontSize="xs" fontWeight="medium">
                      {tChat('assistantLabel')}
                    </Text>
                  </HStack>
                )}
                <Box
                  bg={message.isUser ? 'blue.500' : 'gray.700'}
                  color="white"
                  px={4}
                  py={3}
                  borderRadius="xl"
                  borderBottomRightRadius={message.isUser ? 'sm' : 'xl'}
                  borderTopLeftRadius={message.isUser ? 'xl' : 'sm'}
                >
                  {!message.isUser && message.structured ? (
                    <StructuredContentRenderer structured={message.structured} />
                  ) : (
                    <Text fontSize="sm" lineHeight="1.6" whiteSpace="pre-wrap">
                      {message.text}
                    </Text>
                  )}
                </Box>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  mt={1}
                  textAlign={message.isUser ? 'right' : 'left'}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </Box>
            ))}
            {isLoading && (
              <Box alignSelf="flex-start" maxW="80%">
                <HStack gap={2} mb={1}>
                  <Box p={1} bg="purple.600" borderRadius="md">
                    <MdSmartToy size={14} color="white" />
                  </Box>
                  <Text color="purple.300" fontSize="xs" fontWeight="medium">
                    {tChat('assistantLabel')}
                  </Text>
                </HStack>
                <Box
                  bg="gray.700"
                  px={4}
                  py={3}
                  borderRadius="xl"
                  borderTopLeftRadius="sm"
                >
                  <Text fontSize="sm" color="gray.400">
                    {tChat('thinking')}
                  </Text>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        <Separator borderColor="gray.600" />

        {/* Action Buttons - Show after first AI response */}
        {hasReceivedResponse && (
          <Box p={3} bg="gray.750" borderBottom="1px solid" borderColor="gray.600">
            <VStack gap={2}>
              <Text color="green.300" fontSize="sm" fontWeight="medium">
                {t('continue')}
              </Text>
              <HStack gap={2} flexWrap="wrap" justify="center">
                <Button
                  size="sm"
                  bg="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                  color="white"
                  onClick={handleComplete}
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(72, 187, 120, 0.4)',
                  }}
                >
                  <HStack gap={2}>
                    <MdArrowForward />
                    <span>{t('startCourse')}</span>
                  </HStack>
                </Button>
                <Text color="gray.500" fontSize="xs">
                  {t('orContinueChat')}
                </Text>
              </HStack>
            </VStack>
          </Box>
        )}

        {/* Input Area */}
        <Box
          p={4}
          bg="gray.700"
        >
          <HStack gap={2}>
            <Input
              placeholder={t('inputPlaceholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              size="md"
              borderRadius="full"
              bg="gray.600"
              borderColor="gray.500"
              color="white"
              _placeholder={{ color: 'gray.400' }}
              _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)' }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="md"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              borderRadius="full"
              minW="auto"
              px={4}
              _hover={{
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              }}
            >
              <HiPaperAirplane size={18} />
            </Button>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
