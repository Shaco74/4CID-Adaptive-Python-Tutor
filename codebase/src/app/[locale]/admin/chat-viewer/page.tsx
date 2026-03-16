"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Spinner,
  Badge,
  Separator,
} from "@chakra-ui/react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AuthGuard from "@/components/AuthGuard";
import { AdminHeader } from "../components/AdminHeader";
import { AdminNav } from "../components/AdminNav";
import { UserSelector } from "../components/UserSelector";
import { getAllUsers } from "@/db/utils";
import StructuredContentRenderer from "@/components/chat/StructuredContentRenderer";

interface TaskContext {
  courseId?: string;
  stepId?: string;
  stepNumber?: number;
  requestNumber?: number;
  hintLevel?: number;
  eventTimestamp?: Date;
}

interface ChatMessage {
  id: string;
  timestamp: Date;
  isUser: boolean;
  message: string;
  responseId?: string | null;
  structured?: {
    content: Array<{
      type: "text" | "admonition" | "codeblock";
      content: string;
      title?: string | null;
      admonition_type?: "info" | "warning" | "error" | "success" | "note" | null;
      language?: "python" | null;
    }>;
  } | null;
  taskContext?: TaskContext | null;
}

interface ArchivedChat {
  sessionId: string;
  archivedAt: Date;
  messageCount: number;
  firstMessageAt: Date;
  lastMessageAt: Date;
  resetReason: string;
  messages: Record<string, ChatMessage>;
}

interface UserChatData {
  activeChat: ChatMessage[];
  archivedChats: ArchivedChat[];
  activeResponseId?: string | null;
  responseContextById: Record<string, TaskContext>;
}

const toDateSafe = (raw: any): Date | null => {
  if (!raw) return null;
  if (raw?.toDate) return raw.toDate();
  if (raw instanceof Date) return raw;
  if (typeof raw === "string" || typeof raw === "number") {
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const formatTaskContext = (ctx?: TaskContext | null): string | null => {
  if (!ctx) return null;
  const stepLabel =
    ctx.stepNumber !== undefined
      ? `Step ${ctx.stepNumber}`
      : ctx.stepId
        ? `Step ${ctx.stepId}`
        : "Step ?";
  const courseLabel = ctx.courseId ? ctx.courseId : "ohne Kurs";
  const reqLabel =
    ctx.requestNumber !== undefined ? ` · Anfrage #${ctx.requestNumber}` : "";
  return `${courseLabel} · ${stepLabel}${reqLabel}`;
};

const extractResponseIdsFromHistory = (chatHistory?: Record<string, any>): Set<string> => {
  const ids = new Set<string>();
  if (!chatHistory || typeof chatHistory !== "object") return ids;
  Object.values(chatHistory).forEach((entry: any) => {
    const rid = String(entry?.responseId || "").trim();
    if (rid) ids.add(rid);
  });
  return ids;
};

const AdminChatViewerPage = () => {
  const [userIds, setUserIds] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatData, setChatData] = useState<UserChatData | null>(null);
  const [selectedSession, setSelectedSession] = useState<"active" | string>("active");

  useEffect(() => {
    document.title = "Python Bootcamp - Admin Chat Viewer";
  }, []);

  // Load all users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getAllUsers();
        setUserIds(users);
        if (users.length > 0) {
          setSelectedUserId((prev) => prev || users[0]);
        }
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };
    loadUsers();
  }, []);

  // Load chat data when user changes
  const loadChatData = useCallback(async (userId: string) => {
    if (!userId) return;

    setIsLoading(true);
    setChatData(null);
    setSelectedSession("active");

    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      const result: UserChatData = {
        activeChat: [],
        archivedChats: [],
        activeResponseId: null,
        responseContextById: {},
      };

      if (userDoc.exists()) {
        const data = userDoc.data();

        const addContext = (
          target: Record<string, TaskContext>,
          responseId: string,
          nextCtx: TaskContext
        ) => {
          const existing = target[responseId];
          if (!existing) {
            target[responseId] = nextCtx;
            return;
          }
          const existingTs = existing.eventTimestamp?.getTime() || 0;
          const nextTs = nextCtx.eventTimestamp?.getTime() || 0;
          if (nextTs > existingTs) {
            target[responseId] = nextCtx;
          }
        };

        const collectContextsForUser = async (
          candidateId: string,
          wantedResponseIds: Set<string>,
          target: Record<string, TaskContext>
        ) => {
          // 1) Event-Sourcing help_request
          const eventsRef = collection(db, "users", candidateId, "events");
          const eventsSnapshot = await getDocs(eventsRef);
          eventsSnapshot.forEach((eventDoc) => {
            const eventData: any = eventDoc.data();
            if (eventData?.type !== "help_request") return;

            const responseId = String(eventData?.data?.aiResponseId || "").trim();
            if (!responseId || !wantedResponseIds.has(responseId)) return;

            addContext(target, responseId, {
              courseId: eventData?.courseId,
              stepId: eventData?.stepId,
              stepNumber:
                typeof eventData?.data?.stepNumber === "number"
                  ? eventData.data.stepNumber
                  : undefined,
              requestNumber:
                typeof eventData?.data?.requestNumber === "number"
                  ? eventData.data.requestNumber
                  : undefined,
              hintLevel:
                typeof eventData?.data?.hintLevel === "number"
                  ? eventData.data.hintLevel
                  : undefined,
              eventTimestamp: toDateSafe(eventData?.timestamp) || undefined,
            });
          });

          // 2) Kurs-Tracking helpRequests in users/{id}/courses/*/steps/*
          const coursesRef = collection(db, "users", candidateId, "courses");
          const coursesSnapshot = await getDocs(coursesRef);

          for (const courseDoc of coursesSnapshot.docs) {
            const courseId = courseDoc.id;
            const stepsRef = collection(db, "users", candidateId, "courses", courseId, "steps");
            const stepsSnapshot = await getDocs(stepsRef);

            stepsSnapshot.forEach((stepDoc) => {
              const stepData: any = stepDoc.data();
              const helpRequests = Array.isArray(stepData?.helpRequests)
                ? stepData.helpRequests
                : [];

              helpRequests.forEach((hr: any) => {
                const responseId = String(hr?.aiResponseId || "").trim();
                if (!responseId || !wantedResponseIds.has(responseId)) return;

                const numericStep =
                  typeof hr?.step === "number"
                    ? hr.step
                    : Number.isFinite(Number(stepDoc.id))
                      ? Number(stepDoc.id)
                      : undefined;

                addContext(target, responseId, {
                  courseId: hr?.courseId || courseId,
                  stepId: hr?.step !== undefined ? String(hr.step) : stepDoc.id,
                  stepNumber: numericStep,
                  requestNumber:
                    typeof hr?.requestNumber === "number"
                      ? hr.requestNumber
                      : undefined,
                  hintLevel:
                    typeof hr?.hintLevel === "number" ? hr.hintLevel : undefined,
                  eventTimestamp: toDateSafe(hr?.timestamp) || undefined,
                });
              });
            });
          }
        };

        const archivedRef = collection(db, "users", userId, "archivedChats");
        const archivedSnapshot = await getDocs(archivedRef);

        const wantedResponseIds = extractResponseIdsFromHistory(data.chatHistory);
        archivedSnapshot.forEach((archiveDoc) => {
          const archiveData = archiveDoc.data();
          const archiveIds = extractResponseIdsFromHistory(archiveData?.messages);
          archiveIds.forEach((rid) => wantedResponseIds.add(rid));
        });

        const candidateEventUserIds = Array.from(
          new Set(
            [
              userId,
              typeof data.userId === "string" ? data.userId : null,
              typeof data.uid === "string" ? data.uid : null,
            ].filter((v): v is string => Boolean(v && v.trim()))
          )
        );

        const responseContextById: Record<string, TaskContext> = {};

        // 1) Kontext aus naheliegenden User-Dokumenten laden.
        for (const candidateId of candidateEventUserIds) {
          await collectContextsForUser(candidateId, wantedResponseIds, responseContextById);
        }

        // 2) Fallback: Wenn IDs fehlen, global ueber alle User scannen (Admin-Ansicht, daher ok).
        const unresolved = Array.from(wantedResponseIds).filter(
          (rid) => !responseContextById[rid]
        );
        if (unresolved.length > 0 && userIds.length > 0) {
          const unresolvedSet = new Set(unresolved);
          for (const anyUserId of userIds) {
            await collectContextsForUser(anyUserId, unresolvedSet, responseContextById);
            const left = Array.from(unresolvedSet).filter((rid) => !responseContextById[rid]);
            if (left.length === 0) break;
          }
        }

        result.responseContextById = responseContextById;

        // Get active response ID
        result.activeResponseId = data.activeResponseId || null;

        // Parse active chat history
        if (data.chatHistory && typeof data.chatHistory === "object") {
          result.activeChat = parseMessages(
            data.chatHistory,
            result.responseContextById
          );
        }

        archivedSnapshot.forEach((doc) => {
          const archiveData = doc.data();
          const archived: ArchivedChat = {
            sessionId: archiveData.sessionId || doc.id,
            archivedAt: archiveData.archivedAt?.toDate?.() || new Date(),
            messageCount: archiveData.messageCount || 0,
            firstMessageAt: archiveData.firstMessageAt?.toDate?.() || new Date(),
            lastMessageAt: archiveData.lastMessageAt?.toDate?.() || new Date(),
            resetReason: archiveData.resetReason || "unknown",
            messages: archiveData.messages || {},
          };
          result.archivedChats.push(archived);
        });

        // Sort archived chats by date (newest first)
        result.archivedChats.sort(
          (a, b) => b.archivedAt.getTime() - a.archivedAt.getTime()
        );
      }

      setChatData(result);
    } catch (error) {
      console.error("Error loading chat data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userIds]);

  useEffect(() => {
    if (selectedUserId) {
      loadChatData(selectedUserId);
    }
  }, [selectedUserId, loadChatData]);

  // Parse Firebase chat history into sorted messages
  const parseMessages = (
    chatHistory: Record<string, any>,
    responseContextById: Record<string, TaskContext> = {}
  ): ChatMessage[] => {
    const messages: ChatMessage[] = Object.entries(chatHistory).map(
      ([key, entry]: [string, any]) => {
        let timestamp: Date;
        if (entry.timestamp?.toDate) {
          timestamp = entry.timestamp.toDate();
        } else if (entry.timestamp instanceof Date) {
          timestamp = entry.timestamp;
        } else {
          const timestampFromKey = parseInt(key.split("_")[0]);
          timestamp = new Date(timestampFromKey);
        }

        return {
          id: key,
          timestamp,
          isUser: entry.isUser,
          message: entry.message,
          responseId: entry.responseId || null,
          structured: entry.structured || null,
          taskContext:
            entry.responseId && responseContextById[entry.responseId]
              ? responseContextById[entry.responseId]
              : null,
        };
      }
    );

    // Sort by timestamp (oldest first)
    messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return messages;
  };

  // Get currently displayed messages
  const getDisplayMessages = (): ChatMessage[] => {
    if (!chatData) return [];

    if (selectedSession === "active") {
      return chatData.activeChat;
    }

    const archived = chatData.archivedChats.find(
      (a) => a.sessionId === selectedSession
    );
    if (archived) {
      return parseMessages(archived.messages, chatData.responseContextById);
    }

    return [];
  };

  const displayMessages = getDisplayMessages();

  return (
    <AuthGuard requireAdmin={true}>
      <Box
        py="8"
        px={{ base: "4", sm: "10" }}
        bg="var(--bgAnthrazitDark)"
        boxShadow="xl"
        borderRadius="lg"
        color="white"
        minH="100vh"
      >
        <AdminHeader />
        <AdminNav />

        <VStack gap={6} align="stretch">
          {/* User Selection */}
          <Box>
            <UserSelector
              userIds={userIds}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              onShowAll={() => {}}
            />
          </Box>

          {/* Session Selector */}
          {chatData && (
            <HStack gap={2} wrap="wrap">
              <Badge
                colorPalette={selectedSession === "active" ? "green" : "gray"}
                cursor="pointer"
                px={3}
                py={1}
                onClick={() => setSelectedSession("active")}
                variant={selectedSession === "active" ? "solid" : "outline"}
              >
                Aktiver Chat ({chatData.activeChat.length} Nachrichten)
              </Badge>
              {chatData.archivedChats.map((archive) => (
                <Badge
                  key={archive.sessionId}
                  colorPalette={selectedSession === archive.sessionId ? "blue" : "gray"}
                  cursor="pointer"
                  px={3}
                  py={1}
                  onClick={() => setSelectedSession(archive.sessionId)}
                  variant={selectedSession === archive.sessionId ? "solid" : "outline"}
                >
                  Archiv {archive.archivedAt.toLocaleDateString("de-DE")} (
                  {archive.messageCount})
                </Badge>
              ))}
            </HStack>
          )}

          {/* Chat Display */}
          <Box
            bg="gray.800"
            borderRadius="lg"
            p={4}
            minH="500px"
            maxH="70vh"
            overflowY="auto"
          >
            {isLoading ? (
              <VStack justify="center" h="300px">
                <Spinner size="xl" color="blue.400" />
                <Text color="gray.400">Lade Chat-Daten...</Text>
              </VStack>
            ) : !chatData ? (
              <VStack justify="center" h="300px">
                <Text color="gray.400">Benutzer auswählen</Text>
              </VStack>
            ) : displayMessages.length === 0 ? (
              <VStack justify="center" h="300px">
                <Text color="gray.400">Keine Nachrichten gefunden</Text>
              </VStack>
            ) : (
              <VStack gap={4} align="stretch">
                {/* Session Info */}
                <Box
                  bg="gray.700"
                  p={3}
                  borderRadius="md"
                  mb={2}
                >
                  <HStack justify="space-between" wrap="wrap" gap={2}>
                    <Text fontSize="sm" color="gray.300">
                      <strong>Benutzer:</strong> {selectedUserId}
                    </Text>
                    <Text fontSize="sm" color="gray.300">
                      <strong>Nachrichten:</strong> {displayMessages.length}
                    </Text>
                    {selectedSession === "active" && chatData.activeResponseId && (
                      <Text fontSize="sm" color="gray.300">
                        <strong>Response ID:</strong>{" "}
                        {chatData.activeResponseId.substring(0, 20)}...
                      </Text>
                    )}
                  </HStack>
                </Box>

                <Separator />

                {/* Messages */}
                {displayMessages.map((msg, index) => (
                  <Box
                    key={msg.id}
                    alignSelf={msg.isUser ? "flex-end" : "flex-start"}
                    maxW="85%"
                    w="fit-content"
                  >
                    {/* Message Header */}
                    <HStack
                      justify={msg.isUser ? "flex-end" : "flex-start"}
                      mb={1}
                      gap={2}
                    >
                      <Badge
                        size="sm"
                        colorPalette={msg.isUser ? "blue" : "purple"}
                        variant="subtle"
                      >
                        {msg.isUser ? "User" : "AI"}
                      </Badge>
                      <Text fontSize="xs" color="gray.500">
                        {msg.timestamp.toLocaleString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        #{index + 1}
                      </Text>
                      {msg.taskContext && (
                        <Badge size="sm" colorPalette="teal" variant="subtle">
                          {formatTaskContext(msg.taskContext)}
                        </Badge>
                      )}
                    </HStack>

                    {/* Message Content */}
                    <Box
                      bg={msg.isUser ? "blue.600" : "gray.600"}
                      px={4}
                      py={3}
                      borderRadius="lg"
                      borderBottomRightRadius={msg.isUser ? "sm" : "lg"}
                      borderBottomLeftRadius={msg.isUser ? "lg" : "sm"}
                    >
                      {!msg.isUser && msg.structured ? (
                        <StructuredContentRenderer structured={msg.structured} />
                      ) : (
                        <Text
                          fontSize="sm"
                          whiteSpace="pre-wrap"
                          wordBreak="break-word"
                        >
                          {msg.message}
                        </Text>
                      )}
                    </Box>

                    {/* Response ID (for AI messages) */}
                    {!msg.isUser && msg.responseId && (
                      <Text
                        fontSize="xs"
                        color="gray.600"
                        mt={1}
                        fontFamily="mono"
                      >
                        ID: {msg.responseId.substring(0, 25)}...
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            )}
          </Box>

          {/* Stats */}
          {chatData && (
            <Box bg="gray.800" p={4} borderRadius="lg">
              <Heading size="sm" mb={3}>
                Statistiken
              </Heading>
              <HStack gap={6} wrap="wrap">
                <VStack align="start" gap={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="green.400">
                    {chatData.activeChat.length}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Aktive Nachrichten
                  </Text>
                </VStack>
                <VStack align="start" gap={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.400">
                    {chatData.archivedChats.length}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Archivierte Sessions
                  </Text>
                </VStack>
                <VStack align="start" gap={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.400">
                    {chatData.archivedChats.reduce(
                      (sum, a) => sum + a.messageCount,
                      0
                    ) + chatData.activeChat.length}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Nachrichten Gesamt
                  </Text>
                </VStack>
                <VStack align="start" gap={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.400">
                    {chatData.activeChat.filter((m) => m.isUser).length +
                      chatData.archivedChats.reduce(
                        (sum, a) =>
                          sum +
                          Object.values(a.messages).filter((m: any) => m.isUser)
                            .length,
                        0
                      )}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    User-Nachrichten
                  </Text>
                </VStack>
              </HStack>
            </Box>
          )}
        </VStack>
      </Box>
    </AuthGuard>
  );
};

export default AdminChatViewerPage;
