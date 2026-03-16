"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Separator,
  IconButton,
} from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
} from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { HiPaperAirplane, HiXMark } from "react-icons/hi2";
import { RotateCcw } from "lucide-react";
import { MdSmartToy } from "react-icons/md";
import { chatBotResponseAction } from "../../actions/openaiChatActionV3";
import { db } from "../../../lib/firebase";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import StructuredContentRenderer from "./StructuredContentRenderer";
import type { CourseContextType } from "../../context/CourseContext";
import { saveHelpRequest, calculateHintLevel } from "../../db/helpRequestTracking";
import { logHelpRequest } from "../../db/eventTracking";
import { useUser } from "@/context/UserContext";
import { useLocale, useTranslations } from "next-intl";

interface StructuredContentItem {
  type: "text" | "admonition" | "codeblock";
  content: string;
  title?: string | null;
  admonition_type?: "info" | "warning" | "error" | "success" | "note" | null;
  language?: "python" | null;
}

interface StructuredResponse {
  content: StructuredContentItem[];
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  role?: "system" | "user" | "assistant";
  structured?: StructuredResponse;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    userId: string;
    username: string | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
  } | null;
  courseContext: CourseContextType | null;
}

export default function ChatDrawer({ isOpen, onOpenChange, user, courseContext }: ChatDrawerProps) {
  const { refetchUserData } = useUser();
  const locale = useLocale();
  const t = useTranslations("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);
  const [isUserContextReady, setIsUserContextReady] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track when user context is ready to avoid hydration issues
  useEffect(() => {
    // // console.log('=== CHAT DRAWER USER CONTEXT CHECK (VIA PROPS) ===');
    // // console.log('User object via props:', user);
    // // console.log('User ready check:', { hasUser: !!user, userId: user?.userId, username: user?.username });

    // Mark as ready once we have checked user context (even if user is null)
    setIsUserContextReady(true);
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Scroll when drawer opens
  useEffect(() => {
    if (isOpen) {
      // Kleine Verzögerung um sicherzustellen dass DOM gerendert ist
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, scrollToBottom]);

  // Firebase persistence functions
  const saveResponseIdToFirebase = async (responseId: string) => {
    // // console.log("=== SAVE RESPONSE ID TO FIREBASE DEBUG ===");
    // // console.log("User context in function:", { userId: user?.userId, username: user?.username });
    // // console.log("Response ID to save:", responseId);
    
    if (!user?.username) {
      // // console.log('No user ID, skipping Firebase response ID save');
      return;
    }
    
    try {
      // Use cleaned username as document ID
      const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
      // // console.log("Creating Firebase user ref for username:", cleanUsername);
      const userRef = doc(db, 'users', cleanUsername);
      // // console.log("Firebase userRef created, calling setDoc...");
      
      await setDoc(userRef, {
        activeResponseId: responseId,
        lastChatActivity: new Date()
      }, { merge: true });
      
      // // console.log('✅ Response ID saved to Firebase:', responseId, 'for username:', cleanUsername);
    } catch (error) {
      console.error('❌ Error saving response ID to Firebase:', error);
    }
  };

  const saveChatMessageToFirebase = async (message: Message, responseId?: string) => {
    // // console.log("=== SAVE CHAT MESSAGE TO FIREBASE DEBUG ===");
    // // console.log("User context in function:", { userId: user?.userId, username: user?.username });
    // // console.log("Message to save:", { text: message.text, isUser: message.isUser, responseId });
    
    if (!user?.username) {
      // // console.log('No user ID, skipping Firebase save');
      return;
    }
    
    try {
      // Use cleaned username as document ID
      const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
      // // console.log("Creating Firebase user ref for username:", cleanUsername);
      const userRef = doc(db, 'users', cleanUsername);
      const messageKey = `${message.timestamp.getTime()}_${message.isUser ? 'user' : 'ai'}`;
      // // console.log("Generated message key:", messageKey);
      
      const chatEntry = {
        timestamp: message.timestamp,
        isUser: message.isUser,
        message: message.text,
        responseId: responseId || null,
        structured: message.structured || null
      };
      // // console.log("Chat entry to save:", chatEntry);
      
      // // console.log("Calling setDoc with merge...");
      // Use setDoc with merge to ensure document exists
      await setDoc(userRef, {
        chatHistory: {
          [messageKey]: chatEntry
        },
        lastChatActivity: new Date()
      }, { merge: true });
      
      // // console.log('✅ Chat message saved to Firebase:', messageKey, 'for username:', cleanUsername);
    } catch (error) {
      console.error('❌ Error saving chat message to Firebase:', error);
    }
  };

  const loadResponseIdFromFirebase = async () => {
    if (!user?.username) return null;

    try {
      const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
      const userRef = doc(db, 'users', cleanUsername);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        return data.activeResponseId || null;
      }
    } catch (error) {
      console.error('Error loading response ID from Firebase:', error);
    }

    return null;
  };

  const loadChatHistoryFromFirebase = async () => {
    if (!user?.username) return null;

    try {
      const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
      const userRef = doc(db, 'users', cleanUsername);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const chatHistory = data.chatHistory;

        if (!chatHistory || Object.keys(chatHistory).length === 0) {
          // // console.log('No chat history found in Firebase for user:', cleanUsername);
          return null;
        }

        // // console.log('Loading chat history from Firebase for user:', cleanUsername);
        // // console.log('Chat history keys:', Object.keys(chatHistory));

        // Konvertiere Firebase chatHistory in Message[] Format
        const messages: Message[] = Object.entries(chatHistory).map(([key, entry]: [string, any]) => {
          // Timestamp kann Firebase Timestamp oder Date sein
          let timestamp: Date;
          if (entry.timestamp?.toDate) {
            timestamp = entry.timestamp.toDate();
          } else if (entry.timestamp instanceof Date) {
            timestamp = entry.timestamp;
          } else {
            // Fallback: Parse from key (format: timestamp_user/ai)
            const timestampFromKey = parseInt(key.split('_')[0]);
            timestamp = new Date(timestampFromKey);
          }

          return {
            id: key,
            text: entry.message,
            isUser: entry.isUser,
            timestamp: timestamp,
            role: entry.isUser ? "user" : "assistant",
            structured: entry.structured || undefined
          };
        });

        // Sortiere nach Timestamp (älteste zuerst)
        messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        // // console.log('Loaded and sorted messages from Firebase:', messages.length);

        // Extrahiere Response-ID aus letzter AI-Message
        let lastResponseId = null;
        for (let i = messages.length - 1; i >= 0; i--) {
          if (!messages[i].isUser) {
            // Finde die entsprechende Firebase Entry für Response-ID
            const messageKey = messages[i].id;
            if (chatHistory[messageKey]?.responseId) {
              lastResponseId = chatHistory[messageKey].responseId;
              // // console.log('Extracted response ID from last AI message:', lastResponseId);
              break;
            }
          }
        }

        return {
          messages,
          responseId: lastResponseId
        };
      }
    } catch (error) {
      console.error('Error loading chat history from Firebase:', error);
    }

    return null;
  };

  // Chat Persistence - Load when drawer opens or user changes
  useEffect(() => {
    const loadChatData = async () => {
      if (!isOpen) return; // Only load when drawer is open

      if (user?.username) {
        // Versuche Firebase zu laden (chatHistory + responseId in einem Call)
        const firebaseData = await loadChatHistoryFromFirebase();

        if (firebaseData && firebaseData.messages.length > 0) {
          // ✅ Firebase hat Daten - verwende diese
          setMessages(firebaseData.messages);
          if (firebaseData.responseId) {
            setPreviousResponseId(firebaseData.responseId);
          } else {
            // Fallback: Versuche activeResponseId zu laden
            const savedResponseId = await loadResponseIdFromFirebase();
            if (savedResponseId) {
              setPreviousResponseId(savedResponseId);
            }
          }
        } else {
          // Firebase leer - Fallback zu LocalStorage
          const userChatKey = `chat-messages-${user.username}`;
          const savedMessages = localStorage.getItem(userChatKey);

          if (savedMessages) {
            try {
              const parsedMessages = JSON.parse(savedMessages);
              const messagesWithDates = parsedMessages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }));
              setMessages(messagesWithDates);

              // Load Response ID from Firebase activeResponseId
              const savedResponseId = await loadResponseIdFromFirebase();
              if (savedResponseId) {
                setPreviousResponseId(savedResponseId);
              }
            } catch (error) {
              console.error('Error parsing LocalStorage data:', error);
              // Fallback: Standard-Message
              setMessages([{
                id: "1",
                text: t("welcomeMessage"),
                isUser: false,
                timestamp: new Date(),
                role: "assistant",
              }]);
            }
          } else {
            // LocalStorage auch leer - Standard-Message
            setMessages([{
              id: "1",
              text: t("welcomeMessage"),
              isUser: false,
              timestamp: new Date(),
              role: "assistant",
            }]);
          }
        }
      } else {
        // Kein User - Fallback zu SessionStorage + LocalStorage
        const savedResponseId = sessionStorage.getItem('openai-response-id');
        if (savedResponseId) {
          setPreviousResponseId(savedResponseId);
        }

        // Standard-Message für nicht-eingeloggte User
        setMessages([{
          id: "1",
          text: t("welcomeMessage"),
          isUser: false,
          timestamp: new Date(),
          role: "assistant",
        }]);
      }
    };

    loadChatData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username, isOpen]);

  // Messages persistieren bei jeder Änderung - user-spezifisch
  useEffect(() => {
    if (messages.length > 0 && user?.username) {
      try {
        // Limit auf die letzten 50 Messages für Performance
        const messagesToSave = messages.slice(-50);
        const userChatKey = `chat-messages-${user.username}`;
        localStorage.setItem(userChatKey, JSON.stringify(messagesToSave));
        // // console.log('Chat-Geschichte für User', user.username, 'gespeichert:', messagesToSave.length, 'Nachrichten');
      } catch (error) {
        console.error('Fehler beim Speichern der Chat-Geschichte für User', user.username + ':', error);
      }
    }
  }, [messages, user?.username]);

  // Cleanup bei Logout (Chat Session löschen)
  const clearChatSession = async () => {
    sessionStorage.removeItem('openai-response-id');
    
    // Clear user-specific localStorage
    if (user?.username) {
      const userChatKey = `chat-messages-${user.username}`;
      localStorage.removeItem(userChatKey);
      // // console.log('LocalStorage cleared for user:', user.username);
    } else {
      // Fallback: clear generic key
      localStorage.removeItem('chat-messages');
    }
    
    // Clear Firebase data if user exists
    if (user?.username) {
      try {
        const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
        const userRef = doc(db, 'users', cleanUsername);
        await setDoc(userRef, {
          activeResponseId: null,
          chatHistory: {}
        }, { merge: true });
        // // console.log('Firebase chat data cleared for username:', cleanUsername);
      } catch (error) {
        console.error('Error clearing Firebase chat data:', error);
      }
    }
    
    setPreviousResponseId(null);
    setMessages([{
      id: "1",
      text: t("welcomeMessage"),
      isUser: false,
      timestamp: new Date(),
      role: "assistant",
    }]);
  };

  // Archive chat and start new session (for research data preservation)
  const archiveAndResetChat = async () => {
    if (!user?.username) {
      // No user - just clear session without archiving
      await clearChatSession();
      return;
    }

    setIsResetting(true);

    try {
      const cleanUsername = user.username.trim().toLowerCase().replace(/\s+/g, '-');
      const userRef = doc(db, 'users', cleanUsername);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const chatHistory = data.chatHistory;

        // Only archive if there are messages to archive
        if (chatHistory && Object.keys(chatHistory).length > 0) {
          // Generate session ID
          const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

          // Calculate metadata
          const messageKeys = Object.keys(chatHistory);
          const timestamps = messageKeys.map(key => parseInt(key.split('_')[0])).filter(t => !isNaN(t));
          const firstMessageAt = timestamps.length > 0 ? new Date(Math.min(...timestamps)) : new Date();
          const lastMessageAt = timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date();

          // Create archive entry in subcollection
          const archivedChatsRef = collection(db, 'users', cleanUsername, 'archivedChats');
          await addDoc(archivedChatsRef, {
            sessionId,
            archivedAt: new Date(),
            messageCount: messageKeys.length,
            firstMessageAt,
            lastMessageAt,
            resetReason: "manual",
            previousResponseId: previousResponseId || null,
            messages: chatHistory
          });

          console.log(`Chat archived with sessionId: ${sessionId}, ${messageKeys.length} messages`);
        }

        // Clear current chat data in Firebase and reset tutor intro
        await setDoc(userRef, {
          activeResponseId: null,
          chatHistory: {},
          tutorIntroCompleted: false, // Reset tutor intro so it shows again
          tutorIntroConversationId: null
        }, { merge: true });
      }

      // Clear local storage
      sessionStorage.removeItem('openai-response-id');
      const userChatKey = `chat-messages-${user.username}`;
      localStorage.removeItem(userChatKey);

      // Reset state
      setPreviousResponseId(null);
      setMessages([{
        id: "1",
        text: t("welcomeMessage"),
        isUser: false,
        timestamp: new Date(),
        role: "assistant",
      }]);

      // Note: Help request count resets automatically on step change

      // Refetch user data to trigger TutorIntroModal again
      await refetchUserData();

      // Close the chat drawer so TutorIntroModal can appear
      onOpenChange(false);

    } catch (error) {
      console.error('Error archiving chat:', error);
    } finally {
      setIsResetting(false);
      setIsResetDialogOpen(false);
    }
  };

  // Expose clearChatSession global für Logout
  useEffect(() => {
    (window as any).clearChatSession = clearChatSession;
    return () => {
      delete (window as any).clearChatSession;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // // console.log("=== CHAT MESSAGE SEND DEBUG START ===");
    // // console.log("User context:", { userId: user?.userId, username: user?.username });
    // // console.log("User context ready:", isUserContextReady);

    if (!isUserContextReady) {
      // // console.log("⚠️ User context not ready yet, proceeding without Firebase saves");
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      role: "user",
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Progressive Hint System: Increment Help Request Count
    let currentHintLevel = 1;
    if (courseContext?.incrementHelpRequest) {
      courseContext.incrementHelpRequest();
      // Hint-Level NACH Increment berechnen (ist jetzt +1)
      currentHintLevel = calculateHintLevel((courseContext.helpRequestCount || 0) + 1);
      // // console.log(`🎯 Help Request #${(courseContext.helpRequestCount || 0) + 1}, Hint-Level: ${currentHintLevel}`);
    }

    try {
      // // console.log("Sending to OpenAI API...");
      // // console.log("Course Context available:", !!courseContext);
      if (courseContext) {
        // console.log("Course Context details:", {
        //   courseId: courseContext.courseId,
        //   step: courseContext.step,
        //   taskTitle: courseContext.task?.title,
        //   hasCode: !!courseContext.code,
        //   hasConsole: !!courseContext.console,
        //   helpRequestCount: courseContext.helpRequestCount,
        //   hintLevel: currentHintLevel,
        // });
      }

      // V3 API - Nutze previous_response_id für Conversation Continuity + Course Context
      const response = await chatBotResponseAction({
        prompt: userMessage.text,
        previous_response_id: previousResponseId || undefined,
        courseContext: courseContext || undefined,
        username: user?.username || undefined,
        locale: locale,
      });
      // // console.log("OpenAI Response received:", { chatId: response.chatId, messageLength: response.message?.length });

      // Speichere Response ID für Fortsetzung (Firebase + Fallback)
      if (response.chatId) {
        setPreviousResponseId(response.chatId);
        
        // Save to Firebase if user exists and context is ready, otherwise fallback to sessionStorage
        if (isUserContextReady && user?.username) {
          // // console.log("User exists and context ready, saving response ID to Firebase...");
          await saveResponseIdToFirebase(response.chatId);
        } else {
          // // console.log("No user or context not ready, saving response ID to sessionStorage...");
          sessionStorage.setItem('openai-response-id', response.chatId);
        }
      } else {
        // // console.log("No chatId in response!");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        timestamp: new Date(),
        role: "assistant",
        structured: response.structured,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save both user and AI messages to Firebase for research
      if (isUserContextReady && user?.username) {
        // // console.log("User context ready, saving messages to Firebase...");
        // // console.log("Saving user message:", { text: userMessage.text, username: user.username });
        await saveChatMessageToFirebase(userMessage, response.chatId);
        // // console.log("Saving AI message:", { textLength: aiMessage.text?.length, username: user.username });
        await saveChatMessageToFirebase(aiMessage, response.chatId);
        // // console.log("Both messages saved successfully");
      } else {
        // // console.log("User context not ready or no user, skipping Firebase message save");
      }

      // Progressive Hint System: Save Help Request for Research
      if (
        isUserContextReady &&
        user?.userId &&
        courseContext?.courseId &&
        courseContext?.step
      ) {
        try {
          const requestNumber = (courseContext.helpRequestCount || 0) + 1;
          const stepNumber = Number(courseContext.step);
          const stepId = String(courseContext.step);

          await saveHelpRequest(
            user.userId,
            courseContext.courseId,
            courseContext.step,
            {
              hintLevel: currentHintLevel,
              userMessage: userMessage.text,
              aiResponse: response.message || "(structured response)",
              aiResponseId: response.chatId || null,
            }
          );

          await logHelpRequest(
            user.userId,
            courseContext.courseId,
            stepId,
            stepNumber,
            requestNumber,
            currentHintLevel,
            userMessage.text,
            response.message || "(structured response)",
            response.chatId || ""
          );

          // // console.log("✅ Help request tracked for research");
        } catch (error) {
          console.error("❌ Error tracking help request:", error);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      let errorText = t("error");

      if (error instanceof Error) {
        if (error.message.includes("API")) {
          errorText = t("errorApi");
        } else if (error.message.includes("OPENAI_API_KEY")) {
          errorText = t("errorApiKey");
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
        role: "assistant",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 320;
    const maxWidth = window.innerWidth * 0.8;
    
    setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.300"
        zIndex={999}
        onClick={() => onOpenChange(false)}
      />
      
      {/* Resizable Chat Panel */}
      <Box
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        width={`${width}px`}
        bg="gray.800"
        borderLeft="1px solid"
        borderColor="gray.600"
        boxShadow="xl"
        zIndex={1000}
        display="flex"
        flexDirection="column"
        color="white"
      >
        {/* Resize Handle */}
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          width="4px"
          cursor="col-resize"
          bg="transparent"
          _hover={{ bg: "blue.400" }}
          transition="background 0.2s"
          onMouseDown={handleMouseDown}
          ref={resizeRef}
        />
        
        {/* Header */}
        <HStack
          p={4}
          borderBottom="1px solid"
          borderColor="gray.600"
          justify="space-between"
          align="center"
          bg="gray.750"
        >
          <HStack gap={3}>
            <Box
              p={2}
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              borderRadius="lg"
              boxShadow="0 2px 8px rgba(102, 126, 234, 0.3)"
            >
              <MdSmartToy size={20} color="white" />
            </Box>
            <VStack gap={0} align="start">
              <Text fontSize="md" fontWeight="semibold" color="white">
                {t("title")}
              </Text>
              <Text fontSize="xs" color="purple.300">
                {t("subtitle")}
              </Text>
            </VStack>
          </HStack>
          <HStack gap={1}>
            <Tooltip content={t("resetChat")} positioning={{ placement: "bottom" }}>
              <IconButton
                aria-label={t("resetChat")}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{ bg: "gray.700" }}
                onClick={() => setIsResetDialogOpen(true)}
                disabled={isResetting || messages.length <= 1}
              >
                <RotateCcw size={16} />
              </IconButton>
            </Tooltip>
            <IconButton
              aria-label={t("closeChat")}
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: "gray.700" }}
              onClick={() => onOpenChange(false)}
            >
              <HiXMark size={20} />
            </IconButton>
          </HStack>
        </HStack>
        
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
                alignSelf={message.isUser ? "flex-end" : "flex-start"}
                maxW="85%"
              >
                {/* AI Message Label with Icon */}
                {!message.isUser && (
                  <HStack gap={2} mb={1}>
                    <Box p={1} bg="purple.600" borderRadius="md">
                      <MdSmartToy size={14} color="white" />
                    </Box>
                    <Text color="purple.300" fontSize="xs" fontWeight="medium">
                      {t("assistantLabel")}
                    </Text>
                  </HStack>
                )}
                <Box
                  bg={message.isUser ? "blue.500" : "gray.700"}
                  color="white"
                  px={4}
                  py={3}
                  borderRadius="xl"
                  borderBottomRightRadius={message.isUser ? "sm" : "xl"}
                  borderTopLeftRadius={message.isUser ? "xl" : "sm"}
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
                  textAlign={message.isUser ? "right" : "left"}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
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
                    {t("assistantLabel")}
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
                    {t("thinking")}
                  </Text>
                </Box>
              </Box>
            )}
            {/* Invisible element for auto-scroll */}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
        
        <Separator borderColor="gray.600" />

        {/* Input Area */}
        <Box
          p={4}
          bg="gray.700"
        >
          <HStack gap={2}>
            <Input
              placeholder={t("placeholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              size="md"
              borderRadius="full"
              bg="gray.600"
              borderColor="gray.500"
              color="white"
              _placeholder={{ color: "gray.400" }}
              _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px var(--chakra-colors-purple-400)" }}
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
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              }}
            >
              <HiPaperAirplane size={18} />
            </Button>
          </HStack>
        </Box>
      </Box>

      {/* Reset Confirmation Dialog */}
      <DialogRoot open={isResetDialogOpen} onOpenChange={(e) => setIsResetDialogOpen(e.open)}>
        <DialogContent bg="gray.800" color="white" borderColor="gray.600">
          <DialogHeader>
            <DialogTitle>{t("resetDialog.title")}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text>
              {t("resetDialog.message")}
              {user?.username ? t("resetDialog.messageLoggedIn") : ""}
            </Text>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsResetDialogOpen(false)}
              disabled={isResetting}
              color="white"
              _hover={{ bg: "gray.700" }}
            >
              {t("resetDialog.cancel")}
            </Button>
            <Button
              colorScheme="red"
              onClick={archiveAndResetChat}
              disabled={isResetting}
              ml={3}
            >
              {isResetting ? t("resetDialog.resetting") : t("resetDialog.confirm")}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger color="white" />
        </DialogContent>
      </DialogRoot>
    </>
  );
}