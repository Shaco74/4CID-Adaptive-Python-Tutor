"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  Tabs,
} from "@chakra-ui/react";
import {
  User,
  Activity,
  Play,
  Search,
  Filter,
  MessageSquare,
  CheckCircle,
  PlayCircle,
  Code,
  LogIn,
  FileText,
  Target,
  Eye,
  EyeOff,
  Brain,
  TrendingUp,
  AlertTriangle,
  Scale,
  BookOpen,
  XCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { getUserMetrics, type UserMetricsData, type TimelineEvent } from "@/actions/getUserMetrics";
import { getAggregateMetrics } from "@/actions/getAggregateMetrics";
import { exportStudyCsv } from "@/actions/exportStudyCsv";
import StructuredContentRenderer from "@/components/chat/StructuredContentRenderer";
import { getUserConfig } from "@/db/utils"; // for chat history and other user doc fields
import { triggerTestEvents } from "@/actions/triggerTestEvents";
import { AdminNav } from "../components/AdminNav";
import { EnhancedTimeline } from "@/components/admin/timeline/EnhancedTimeline";
import { LearningProfileCharts } from "@/components/admin/charts/LearningProfileCharts";
import AuthGuard from "@/components/AuthGuard";
import { getAllUsers } from "@/db/utils";

// Event-Typ Konfiguration für Filter
const EVENT_FILTERS: {
  type: TimelineEvent["type"];
  label: string;
  color: string;
  icon: React.ReactNode;
  category: string;
}[] = [
    // Session & Navigation
    { type: "session_start", label: "Session", color: "teal", icon: <LogIn size={14} />, category: "session" },
    { type: "session_end", label: "Session Ende", color: "gray", icon: <LogIn size={14} />, category: "session" },
    { type: "course_access", label: "Kurs", color: "purple", icon: <Activity size={14} />, category: "navigation" },
    { type: "step_start", label: "Step Start", color: "cyan", icon: <PlayCircle size={14} />, category: "navigation" },
    { type: "step_complete", label: "Step Fertig", color: "green", icon: <CheckCircle size={14} />, category: "navigation" },
    { type: "step_snapshot", label: "Step Snapshot", color: "purple", icon: <Activity size={14} />, category: "navigation" },

    // Code & Hilfe
    { type: "code_execution", label: "Code", color: "orange", icon: <Code size={14} />, category: "code" },
    { type: "help_request", label: "Hilfe", color: "blue", icon: <MessageSquare size={14} />, category: "help" },
    { type: "note_added", label: "Notizen", color: "yellow", icon: <FileText size={14} />, category: "help" },

    // Drill Events
    { type: "drill_attempt", label: "Drill Versuch", color: "teal", icon: <Target size={14} />, category: "drill" },
    { type: "drill_shown", label: "Drill Angezeigt", color: "teal", icon: <Eye size={14} />, category: "drill" },
    { type: "drill_mcq_completed", label: "MCQ Fertig", color: "green", icon: <CheckCircle size={14} />, category: "drill" },
    { type: "drill_code_completed", label: "Code Fertig", color: "green", icon: <Code size={14} />, category: "drill" },
    { type: "drill_session_completed", label: "Drill Abgeschlossen", color: "green", icon: <Target size={14} />, category: "drill" },

    // Learning Profile Events
    { type: "learning_profile_initialized", label: "Profil Init", color: "purple", icon: <Brain size={14} />, category: "learning" },
    { type: "performance_score_update", label: "Score Update", color: "blue", icon: <TrendingUp size={14} />, category: "learning" },
    { type: "error_entry_added", label: "Fehler", color: "red", icon: <AlertTriangle size={14} />, category: "learning" },
    { type: "topic_weight_change", label: "Topic-Gewicht", color: "orange", icon: <Scale size={14} />, category: "learning" },
    { type: "topic_introduced", label: "Topic Neu", color: "cyan", icon: <BookOpen size={14} />, category: "learning" },
    { type: "incorrect_solution", label: "Falsche Lösung", color: "red", icon: <XCircle size={14} />, category: "learning" },

    // AI Events
    { type: "ai_drill_selection", label: "AI Auswahl", color: "pink", icon: <Sparkles size={14} />, category: "ai" },
  ];

// Kategorie-Konfiguration
const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  session: { label: "Session", color: "teal" },
  navigation: { label: "Navigation", color: "cyan" },
  code: { label: "Code", color: "orange" },
  help: { label: "Hilfe", color: "blue" },
  drill: { label: "Drills", color: "green" },
  learning: { label: "Learning Profile", color: "purple" },
  ai: { label: "AI", color: "pink" },
};

// simple message type copied from ChatDrawer for admin reports
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  role: "user" | "assistant";
  structured?: any;
  responseId?: string | null;
}

interface StepRecord {
  courseId?: string;
  stepNumber?: number;
  start?: string;
  end?: string;
  durationSeconds?: number;
  helpRequests: number;
  aiMessages: number;
  idle?: boolean; // true when duration is unrealistically long
}

export default function UserMetricsPageV2() {
  const [userId, setUserId] = useState("");
  const [userIds, setUserIds] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [metrics, setMetrics] = useState<UserMetricsData | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [onboardingDuration, setOnboardingDuration] = useState<number | null>(null);
  const [stepRecords, setStepRecords] = useState<StepRecord[]>([]);

  // modal/drawer states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEvalOpen, setIsEvalOpen] = useState(false);

  // helper to format seconds into mm:ss or s
  const formatDuration = (sec?: number) => {
    if (sec === undefined) return "";
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    if (mins > 0) return `${mins}m ${s}s`;
    return `${s}s`;
  };

  // evaluation events found in timeline
  const evaluationEvents = useMemo(() => {
    if (!metrics) return [];
    // evaluation_submitted is not part of the official union yet,
    // cast to any to bypass the type check
    return metrics.timeline.filter((e: any) => e.type === "evaluation_submitted");
  }, [metrics]);

  const aiMessageCount = useMemo(() => {
    return chatHistory.filter((m) => !m.isUser).length;
  }, [chatHistory]);

  const totalCourseTime = useMemo(() => {
    return stepRecords.reduce((sum, r) => sum + (r.durationSeconds || 0), 0);
  }, [stepRecords]);

  const [exportingStudyCsv, setExportingStudyCsv] = useState(false);

  const handleExportAggregate = async () => {
    try {
      const csv = await getAggregateMetrics();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aggregate-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting aggregate metrics", err);
    }
  };

  const handleExportStudyCsv = async () => {
    try {
      setExportingStudyCsv(true);

      const result = await exportStudyCsv("bmi-calculator");
      const dateLabel = new Date().toISOString().split("T")[0];

      for (const file of result.files) {
        const fileName = file.name.endsWith(".csv")
          ? `${file.name.replace(/\.csv$/, "")}-${dateLabel}.csv`
          : `${file.name}-${dateLabel}.csv`;
        const blob = new Blob([file.content], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }

      console.info(
        `Study export ready (unfiltered=${result.participantsCountUnfiltered}, filtered=${result.participantsCountFiltered})`
      );
    } catch (err) {
      console.error("Error exporting study CSV files", err);
    } finally {
      setExportingStudyCsv(false);
    }
  };



  const [loading, setLoading] = useState(false);
  const [triggeringEvents, setTriggeringEvents] = useState(false);
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set());
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());

  // Load all user IDs on mount
  useEffect(() => {
    const loadUserIds = async () => {
      try {
        setLoadingUsers(true);
        const users = await getAllUsers();
        setUserIds(users);
        // Select first user by default
        if (users.length > 0) {
          setUserId(users[0]);
        }
      } catch (error) {
        console.error("Error loading user IDs:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUserIds();
  }, []);

  // Gefilterte Events (nach Typ UND Kategorie)
  const filteredEvents = useMemo(() => {
    if (!metrics) return [];
    return metrics.timeline.filter((event) => {
      if (hiddenTypes.has(event.type)) return false;
      const filter = EVENT_FILTERS.find((f) => f.type === event.type);
      if (filter && hiddenCategories.has(filter.category)) return false;
      return true;
    });
  }, [metrics, hiddenTypes, hiddenCategories]);

  // counts per event type (for Events tab)
  const eventCounts = useMemo(() => {
    if (!metrics) return {} as Record<string, number>;
    const counts: Record<string, number> = {};
    metrics.timeline.forEach((e) => {
      counts[e.type] = (counts[e.type] || 0) + 1;
    });
    return counts;
  }, [metrics]);

  // Zusammenfassungs-Statistiken
  const summaryStats = useMemo(() => {
    if (!metrics) return null;
    const events = metrics.timeline;

    // Drill-Statistiken
    const drillShown = events.filter((e) => e.type === "drill_shown");
    const drillCompleted = events.filter((e) => e.type === "drill_session_completed");
    const mcqCompleted = events.filter((e) => e.type === "drill_mcq_completed");
    const codeCompleted = events.filter((e) => e.type === "drill_code_completed");

    // Extrahiere Drill-IDs
    const drillIds = new Set<string>();
    drillShown.forEach((e) => {
      if (e.data?.mcqDrillId) drillIds.add(e.data.mcqDrillId);
      if (e.data?.codeDrillId) drillIds.add(e.data.codeDrillId);
    });

    // Learning Profile
    const scoreUpdates = events.filter((e) => e.type === "performance_score_update");
    const topicChanges = events.filter((e) => e.type === "topic_weight_change");
    const errors = events.filter((e) => e.type === "error_entry_added" || e.type === "incorrect_solution");
    const snapshots = events.filter((e) => e.type === "step_snapshot");

    // Code & Help
    const codeExecutions = events.filter((e) => e.type === "code_execution");
    const helpRequests = events.filter((e) => e.type === "help_request");
    const stepsCompleted = events.filter((e) => e.type === "step_complete");

    return {
      totalEvents: events.length,
      drills: {
        shown: drillShown.length,
        completed: drillCompleted.length,
        mcqCompleted: mcqCompleted.length,
        codeCompleted: codeCompleted.length,
        uniqueDrillIds: drillIds.size,
        drillIdsList: Array.from(drillIds),
      },
      learning: {
        scoreUpdates: scoreUpdates.length,
        topicChanges: topicChanges.length,
        errors: errors.length,
        snapshots: snapshots.length,
      },
      activity: {
        codeExecutions: codeExecutions.length,
        helpRequests: helpRequests.length,
        stepsCompleted: stepsCompleted.length,
      },
    };
  }, [metrics]);

  // Toggle Event-Typ Sichtbarkeit
  const toggleEventType = (type: string) => {
    setHiddenTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  // Toggle Kategorie Sichtbarkeit
  const toggleCategory = (category: string) => {
    setHiddenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Alle anzeigen / alle ausblenden
  const showAll = () => {
    setHiddenTypes(new Set());
    setHiddenCategories(new Set());
  };
  const hideAll = () => {
    setHiddenTypes(new Set(EVENT_FILTERS.map((f) => f.type)));
    setHiddenCategories(new Set(Object.keys(CATEGORY_CONFIG)));
  };

  // Zähle Events pro Typ
  const getEventCount = (type: string) => {
    if (!metrics) return 0;
    return metrics.timeline.filter((e) => e.type === type).length;
  };

  // Zähle Events pro Kategorie
  const getCategoryCount = (category: string) => {
    if (!metrics) return 0;
    const typesInCategory = EVENT_FILTERS.filter((f) => f.category === category).map((f) => f.type);
    return metrics.timeline.filter((e) => typesInCategory.includes(e.type)).length;
  };

  useEffect(() => {
    document.title = "Python Bootcamp - User Timeline V2";
  }, []);

  // Der Chat-Verlauf wird separat aus dem Nutzerdokument geladen
  const loadChatHistory = async (userId: string) => {
    try {
      const userDoc = await getUserConfig(userId);
      if (userDoc && userDoc.chatHistory) {
        const messages: Message[] = Object.entries(userDoc.chatHistory).map(
          ([key, entry]: [string, any]) => {
            let timestamp: Date;
            if (entry.timestamp?.toDate) {
              timestamp = entry.timestamp.toDate();
            } else if (entry.timestamp instanceof Date) {
              timestamp = entry.timestamp;
            } else {
              const ts = parseInt(key.split("_")[0]);
              timestamp = new Date(ts);
            }
            return {
              id: key,
              text: entry.message,
              isUser: entry.isUser,
              timestamp,
              role: entry.isUser ? "user" : "assistant",
              structured: entry.structured || undefined,
            };
          }
        );
        messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        setChatHistory(messages);
      } else {
        setChatHistory([]);
      }
    } catch (error) {
      console.error("Error loading chat history for user", userId, error);
      setChatHistory([]);
    }
  };

  // Berechne Step-Timings sowie Onboarding-Dauer, wenn Metriken vorliegen
  const computeDerivedMetrics = (events: TimelineEvent[]) => {
    const records: Record<string, StepRecord> = {};
    let onboardStart: TimelineEvent | undefined;
    let onboardComplete: TimelineEvent | undefined;

    events.forEach((e) => {
      if (e.type === "step_start" && e.courseId && e.step !== undefined) {
        const key = `${e.courseId}-${e.step}`;
        records[key] = {
          courseId: e.courseId,
          stepNumber: e.step,
          start: e.timestamp,
          end: records[key]?.end,
          helpRequests: records[key]?.helpRequests || 0,
          aiMessages: records[key]?.aiMessages || 0,
          durationSeconds: undefined,
        };
      }
      if (e.type === "step_complete" && e.courseId && e.step !== undefined) {
        const key = `${e.courseId}-${e.step}`;
        records[key] = {
          courseId: e.courseId,
          stepNumber: e.step,
          start: records[key]?.start,
          end: e.timestamp,
          helpRequests: records[key]?.helpRequests || 0,
          aiMessages: records[key]?.aiMessages || 0,
          durationSeconds: undefined,
        };
      }
      if (e.type === "help_request" && e.courseId && e.step !== undefined) {
        const key = `${e.courseId}-${e.step}`;
        records[key] = records[key] || {
          courseId: e.courseId,
          stepNumber: e.step,
          helpRequests: 0,
          aiMessages: 0,
        };
        records[key].helpRequests = (records[key].helpRequests || 0) + 1;
      }

      if (e.type === "onboarding_start") onboardStart = e;
      if (e.type === "onboarding_complete") onboardComplete = e;
    });

    // compute durations and human-readable timestamps
    const MAX_STEP_SECONDS = 2 * 60 * 60; // 2 hours cap
    const array: StepRecord[] = Object.values(records).map((r) => {
      if (r.start && r.end) {
        const startDate = new Date(r.start);
        const endDate = new Date(r.end);
        r.start = startDate.toLocaleString();
        r.end = endDate.toLocaleString();
        const secs = (endDate.getTime() - startDate.getTime()) / 1000;
        if (secs > MAX_STEP_SECONDS) {
          r.idle = true;
          r.durationSeconds = undefined;
        } else {
          r.durationSeconds = secs;
        }
      } else if (r.start) {
        r.start = new Date(r.start).toLocaleString();
      }
      return r;
    });

    setStepRecords(array);

    if (onboardStart && onboardComplete) {
      const dur =
        (new Date(onboardComplete.timestamp).getTime() -
          new Date(onboardStart.timestamp).getTime()) /
        1000;
      setOnboardingDuration(dur);
    } else {
      setOnboardingDuration(null);
    }
  };



  const handleLoadMetrics = async () => {
    setLoading(true);
    try {
      const data = await getUserMetrics(userId);
      setMetrics(data);
      // load chat and derived metrics
      await loadChatHistory(userId);
      if (data?.timeline) {
        computeDerivedMetrics(data.timeline);
      }
    } catch (error) {
      console.error("Error loading metrics:", error);
    }
    setLoading(false);
  };

  const handleTriggerEvents = async () => {
    setTriggeringEvents(true);
    try {
      const result = await triggerTestEvents(userId, true);
      if (result.success) {
        alert(`Test events generated!\n\n${JSON.stringify(result.summary, null, 2)}`);
        await handleLoadMetrics();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error triggering events:", error);
    }
    setTriggeringEvents(false);
  };

  return (
    <AuthGuard requireAdmin={true}>
      <Box minH="100vh" bg="gray.900" py={8}>
        <Container maxW="container.xl">
          <VStack align="stretch" gap={8}>
            <AdminNav />

            {/* Header */}
            <VStack align="start" gap={4}>
              <HStack gap={3}>
                <Activity size={32} color="#3b82f6" />
                <Heading size="xl" color="white">
                  User Timeline
                </Heading>
                <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                  V2 Enhanced
                </Badge>
              </HStack>
              <Text color="gray.400" fontSize="lg">
                Visuelle Darstellung des kompletten User-Journey mit Zeitdeltas
              </Text>
            </VStack>

            {/* Controls */}
            <Box
              bg="gray.800"
              p={6}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.700"
            >
              <VStack align="stretch" gap={4}>
                <HStack gap={3}>
                  <User size={20} color="#9ca3af" />
                  <Text fontWeight="bold" color="white">
                    User ID
                  </Text>
                </HStack>

                <HStack gap={3} align="center">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!userId) return;
                      const idx = userIds.indexOf(userId);
                      if (idx > 0) {
                        const nextId = userIds[idx - 1];
                        setUserId(nextId);
                      }
                    }}
                    disabled={!userId || userIds.length === 0}
                    variant="outline"
                    colorScheme="gray"
                  >
                    ‹
                  </Button>
                  <Box w="250px">
                    <select
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      disabled={loadingUsers}
                      style={{
                        padding: '10px',
                        fontSize: '16px',
                        width: '100%',
                        borderRadius: '5px',
                        border: '1px solid #3182CE',
                        backgroundColor: '#1A202C',
                        color: 'white'
                      }}
                    >
                      <option value="">
                        {loadingUsers ? "Lädt Benutzer..." : "Benutzer auswählen"}
                      </option>
                      {userIds.map(id => (
                        <option key={id} value={id}>{id}</option>
                      ))}
                    </select>
                  </Box>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!userId) return;
                      const idx = userIds.indexOf(userId);
                      if (idx < userIds.length - 1) {
                        const nextId = userIds[idx + 1];
                        setUserId(nextId);
                      }
                    }}
                    disabled={!userId || userIds.length === 0}
                    variant="outline"
                    colorScheme="gray"
                  >
                    ›
                  </Button>
                  <Button
                    onClick={handleLoadMetrics}
                    disabled={loading || !userId}
                    colorScheme="blue"
                    minW="150px"
                  >
                    <Search size={20} />
                    {loading ? "Lädt..." : "Laden"}
                  </Button>
                </HStack>

                <HStack gap={3}>
                  <Button
                    onClick={handleTriggerEvents}
                    disabled={triggeringEvents}
                    colorScheme="green"
                    variant="outline"
                    size="sm"
                  >
                    <Play size={20} />
                    {triggeringEvents ? "Generiert..." : "Test-Events generieren"}
                  </Button>
                  <Text fontSize="sm" color="gray.500">
                    Erstellt alle Event-Typen zum Testen
                  </Text>
                </HStack>
              </VStack>
            </Box>

            {/* Summary Stats */}
            {/* tabbed sections */}
            <Tabs.Root defaultValue="uebersicht">
              <Tabs.List>
                <Tabs.Trigger value="uebersicht">Übersicht</Tabs.Trigger>
                <Tabs.Trigger value="events">Events</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="uebersicht">
                  {metrics && summaryStats && (
                    <Box
                bg="gray.800"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.700"
              >
                <VStack align="stretch" gap={4}>
                  <HStack gap={2}>
                    <Zap size={18} color="#f59e0b" />
                    <Text fontWeight="bold" color="white" fontSize="sm">
                      Zusammenfassung
                    </Text>
                    <Badge colorScheme="yellow" fontSize="xs">
                      {summaryStats.totalEvents} Events
                    </Badge>
                  </HStack>

                  <HStack gap={4} flexWrap="wrap">
                    {/* Activity Stats */}
                    <Box bg="gray.900" p={3} borderRadius="md" minW="150px">
                      <Text fontSize="xs" color="gray.500" mb={1}>Aktivität</Text>
                      <HStack gap={3}>
                        <VStack gap={0}>
                          <Text fontSize="lg" fontWeight="bold" color="green.400">{summaryStats.activity.stepsCompleted}</Text>
                          <Text fontSize="xs" color="gray.500">Steps</Text>
                        </VStack>
                        <VStack gap={0}>
                          <Text fontSize="lg" fontWeight="bold" color="orange.400">{summaryStats.activity.codeExecutions}</Text>
                          <Text fontSize="xs" color="gray.500">Code</Text>
                        </VStack>
                        <VStack gap={0}>
                          <Text fontSize="lg" fontWeight="bold" color="blue.400">{summaryStats.activity.helpRequests}</Text>
                          <Text fontSize="xs" color="gray.500">Hilfe</Text>
                        </VStack>
                        {aiMessageCount > 0 && (
                          <VStack gap={0}>
                            <Text fontSize="lg" fontWeight="bold" color="pink.400">{aiMessageCount}</Text>
                            <Text fontSize="xs" color="gray.500">AI msgs</Text>
                          </VStack>
                        )}
                      </HStack>
                    </Box>

                    {/* Drill Stats */}
                    <Box bg="gray.900" p={3} borderRadius="md" minW="180px">
                      <Text fontSize="xs" color="gray.500" mb={1}>Drills</Text>
                      <HStack gap={3}>
                        <VStack gap={0}>
                          <Text fontSize="lg" fontWeight="bold" color="teal.400">{summaryStats.drills.shown}</Text>
                          <Text fontSize="xs" color="gray.500">Gezeigt</Text>
                        </VStack>
                        <VStack gap={0}>
                          <Text fontSize="lg" fontWeight="bold" color="green.400">{summaryStats.drills.completed}</Text>
                          <Text fontSize="xs" color="gray.500">Fertig</Text>
                        </VStack>
                        <VStack gap={0}>
                          <Text fontSize="lg" fontWeight="bold" color="purple.400">{summaryStats.drills.uniqueDrillIds}</Text>
                          <Text fontSize="xs" color="gray.500">IDs</Text>
                        </VStack>
                      </HStack>
                    </Box>

                    {/* Learning Profile Stats */}
                    <Box bg="gray.900" p={3} borderRadius="md" minW="180px">
                      <Text fontSize="xs" color="gray.500" mb={1}>Learning Profile</Text>
                      <HStack gap={3}>
                        <VStack gap={0}>
                          <Text fontSize="lg" fontWeight="bold" color="red.400">{summaryStats.learning.errors}</Text>
                          <Text fontSize="xs" color="gray.500">Fehler</Text>
                        </VStack>
                        <VStack gap={0}>
                          <Text fontSize="lg" fontWeight="bold" color="orange.400">{summaryStats.learning.topicChanges}</Text>
                          <Text fontSize="xs" color="gray.500">Topics</Text>
                        </VStack>
                        <VStack gap={0}>
                          <Text fontSize="lg" fontWeight="bold" color="purple.400">{summaryStats.learning.snapshots}</Text>
                          <Text fontSize="xs" color="gray.500">Snapshots</Text>
                        </VStack>
                      </HStack>
                    </Box>
                  </HStack>

                  {/* Drill IDs anzeigen wenn vorhanden */}
                  {summaryStats.drills.drillIdsList.length > 0 && (
                    <Box bg="gray.900" p={3} borderRadius="md">
                      <Text fontSize="xs" color="gray.500" mb={2}>Drill-IDs (für Analyse welche Drills schwierig sind)</Text>
                      <HStack gap={2} flexWrap="wrap">
                        {summaryStats.drills.drillIdsList.map((id) => (
                          <Badge key={id} colorScheme="teal" fontSize="xs" variant="outline">
                            {id}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </Box>
            )}



            {/* Zusätzliche Kennzahlen und Detailansichten */}
            {totalCourseTime > 0 && (
              <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <Text color="white" fontSize="sm">
                  Gesamte Kurszeit: <b>{formatDuration(totalCourseTime)}</b>
                </Text>
              </Box>
            )} 

            {onboardingDuration !== null && (
              <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <Text color="white" fontSize="sm">
                  Onboarding-Dauer: <b>{onboardingDuration.toFixed(1)} Sekunden</b>
                </Text>
              </Box>
            )}

            {/* Chat-Button und Modal */}
            {chatHistory.length > 0 && (
              <Button size="sm" colorScheme="teal" onClick={() => setIsChatOpen(true)}>
                Chat-Verlauf anzeigen ({chatHistory.length})
              </Button>
            )}

            {/* Evaluation-Button */}
            {evaluationEvents.length > 0 && (
              <Button size="sm" colorScheme="green" ml={2} onClick={() => setIsEvalOpen(true)}>
                Evaluationsbogen ansehen ({evaluationEvents.length})
              </Button>
            )}

            {/* Aggregate Export */}
            <Button size="sm" colorScheme="purple" ml={2} onClick={handleExportAggregate}>
              CSV Aggr. export
            </Button>

            <Button
              size="sm"
              colorScheme="pink"
              ml={2}
              onClick={handleExportStudyCsv}
              disabled={exportingStudyCsv}
            >
              {exportingStudyCsv ? "Study CSV ..." : "Study CSV export"}
            </Button>


            {stepRecords.length > 0 && (
              <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <Heading size="md" color="white" mb={2}>
                  Step-Timings
                </Heading>
                <Box overflowX="auto">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ color: 'white', padding: '4px' }}>Kurs</th>
                        <th style={{ color: 'white', padding: '4px' }}>Step</th>
                        <th style={{ color: 'white', padding: '4px' }}>Start</th>
                        <th style={{ color: 'white', padding: '4px' }}>Ende</th>
                        <th style={{ color: 'white', padding: '4px' }}>Dauer</th>
                        <th style={{ color: 'white', padding: '4px' }}>Hilfegesuche</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stepRecords.map((r, idx) => (
                        <tr key={idx} style={{ background: r.helpRequests ? '#2a2a2a' : 'transparent' }}>
                          <td style={{ color: 'white', padding: '4px' }}>{r.courseId}</td>
                          <td style={{ color: 'white', padding: '4px' }}>{r.stepNumber}</td>
                          <td style={{ color: 'white', padding: '4px' }}>{r.start}</td>
                          <td style={{ color: 'white', padding: '4px' }}>{r.end}</td>
                          <td style={{ color: r.idle ? '#f59e0b' : 'white', padding: '4px' }}>
                            {r.idle ? '›2h' : formatDuration(r.durationSeconds)}
                          </td>
                          <td style={{ color: 'white', padding: '4px' }}>{r.helpRequests}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Box>
            )}
                  {/* Learning Profile Charts */}
                  {metrics && metrics.timeline.length > 0 && (
                    <LearningProfileCharts events={metrics.timeline} />
                  )}

                  {/* Filter */}
                </Tabs.Content>

                <Tabs.Content value="events">
                  {/* show event counts grouped by category */}
                  <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                    <Heading size="md" color="white" mb={2}>
                      Event-Zählung
                    </Heading>
                    {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => {
                      const types = EVENT_FILTERS.filter((f) => f.category === cat).map((f) => f.type);
                      const catTotal = types.reduce((sum, t) => sum + (eventCounts[t] || 0), 0);
                      if (catTotal === 0) return null;
                      return (
                        <Box key={cat} mb={3}>
                          <Text fontWeight="bold" color="white">{cfg.label}: {catTotal}</Text>
                          <VStack align="start" pl={4}>
                            {types.map((t) => (
                              <Text key={t} fontSize="sm" color="gray.400">
                                {t}: {eventCounts[t] || 0}
                              </Text>
                            ))}
                          </VStack>
                        </Box>
                      );
                    })}
                  </Box>

                  {/* timeline viewer with same filters */}
                  {metrics && (
                    <EnhancedTimeline userId={metrics.userId} events={filteredEvents} />
                  )}
                </Tabs.Content>
              </Tabs.Root>

            {/* Learning Profile Charts */}            {metrics && metrics.timeline.length > 0 && (
              <Box
                bg="gray.800"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.700"
              >
                <VStack align="stretch" gap={3}>
                  <HStack justify="space-between">
                    <HStack gap={2}>
                      <Filter size={18} color="#9ca3af" />
                      <Text fontWeight="bold" color="white" fontSize="sm">
                        Event-Filter
                      </Text>
                      <Badge colorScheme="gray" fontSize="xs">
                        {filteredEvents.length} / {metrics.timeline.length} Events
                      </Badge>
                    </HStack>
                    <HStack gap={2}>
                      <Button
                        size="xs"
                        variant="ghost"
                        color="gray.400"
                        onClick={showAll}
                        _hover={{ color: "white" }}
                      >
                        <Eye size={14} />
                        Alle
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        color="gray.400"
                        onClick={hideAll}
                        _hover={{ color: "white" }}
                      >
                        <EyeOff size={14} />
                        Keine
                      </Button>
                    </HStack>
                  </HStack>

                  {/* Kategorie-Filter */}
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={2}>Nach Kategorie:</Text>
                    <HStack gap={2} flexWrap="wrap">
                      {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
                        const count = getCategoryCount(category);
                        const isHidden = hiddenCategories.has(category);

                        if (count === 0) return null;

                        return (
                          <Button
                            key={category}
                            size="sm"
                            variant={isHidden ? "outline" : "solid"}
                            colorScheme={config.color}
                            opacity={isHidden ? 0.5 : 1}
                            onClick={() => toggleCategory(category)}
                            _hover={{ opacity: isHidden ? 0.7 : 0.9 }}
                          >
                            <HStack gap={1}>
                              <Text>{config.label}</Text>
                              <Badge
                                colorScheme={isHidden ? "gray" : config.color}
                                fontSize="xs"
                                ml={1}
                              >
                                {count}
                              </Badge>
                            </HStack>
                          </Button>
                        );
                      })}
                    </HStack>
                  </Box>

                  {/* Event-Typ Filter */}
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={2}>Nach Event-Typ:</Text>
                    <HStack gap={2} flexWrap="wrap">
                      {EVENT_FILTERS.map((filter) => {
                        const count = getEventCount(filter.type);
                        const isHidden = hiddenTypes.has(filter.type) || hiddenCategories.has(filter.category);

                        if (count === 0) return null;

                        return (
                          <Button
                            key={filter.type}
                            size="xs"
                            variant={isHidden ? "outline" : "solid"}
                            colorScheme={filter.color}
                            opacity={isHidden ? 0.4 : 1}
                            onClick={() => toggleEventType(filter.type)}
                            _hover={{ opacity: isHidden ? 0.6 : 0.9 }}
                            disabled={hiddenCategories.has(filter.category)}
                          >
                            <HStack gap={1}>
                              {filter.icon}
                              <Text>{filter.label}</Text>
                              <Badge
                                colorScheme={isHidden ? "gray" : filter.color}
                                fontSize="xs"
                              >
                                {count}
                              </Badge>
                            </HStack>
                          </Button>
                        );
                      })}
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            )}

            {/* Enhanced Timeline */}
            {metrics && (
              <EnhancedTimeline userId={metrics.userId} events={filteredEvents} />
            )}

            {/* Empty State */}
            {!metrics && !loading && (
              <Box
                py={12}
                textAlign="center"
                bg="gray.800"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.700"
              >
                <Activity size={48} color="#6b7280" style={{ margin: "0 auto 16px" }} />
                <Text color="gray.400" fontSize="lg">
                  User ID eingeben und &quot;Laden&quot; klicken
                </Text>
                <Text color="gray.500" fontSize="sm" mt={2}>
                  Die Timeline zeigt alle Events chronologisch mit Zeitabständen
                </Text>
              </Box>
            )}

            {/* Loading State */}
            {loading && (
              <Box
                py={12}
                textAlign="center"
                bg="gray.800"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.700"
              >
                <Text color="gray.400" fontSize="lg">
                  Lade Daten...
                </Text>
              </Box>
            )}
          </VStack>
        </Container>
      </Box>

      {/* Chat Overlay */}
      {isChatOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0,0,0,0.7)"
          zIndex="1000"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box bg="gray.900" w="90%" maxW="900px" h="80%" overflowY="auto" p={4} borderRadius="md">
            <HStack justify="space-between" mb={2}>
              <Heading size="md" color="white">Chat-Verlauf</Heading>
              <Button size="sm" onClick={() => setIsChatOpen(false)}>Schließen</Button>
            </HStack>
            <Box
              bg="gray.800"
              p={4}
              minH="300px"
              maxH="70vh"
              overflowY="auto"
            >
              {chatHistory.length === 0 ? (
                <VStack justify="center" h="300px">
                  <Text color="gray.400">Keine Nachrichten gefunden</Text>
                </VStack>
              ) : (
                <VStack gap={4} align="stretch">
                  {/* Messages */}
                  {chatHistory.map((msg, index) => (
                    <Box
                      key={msg.id}
                      alignSelf={msg.isUser ? "flex-end" : "flex-start"}
                      maxW="85%"
                      w="fit-content"
                    >
                      {/* Header */}
                      <HStack
                        justify={msg.isUser ? "flex-end" : "flex-start"}
                        mb={1}
                        gap={2}
                      >
                        <Badge size="sm" colorPalette={msg.isUser ? "blue" : "purple"} variant="subtle">
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
                      </HStack>

                      {/* Content */}
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
                            {msg.text}
                          </Text>
                        )}
                      </Box>

                      {/* Response ID */}
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
          </Box>
        </Box>
      )}

      {/* Evaluation Overlay */}
      {isEvalOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0,0,0,0.7)"
          zIndex="1000"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box bg="gray.900" w="90%" maxW="800px" h="80%" overflowY="auto" p={4} borderRadius="md">
            <HStack justify="space-between" mb={2}>
              <Heading size="md" color="white">Evaluationsbogen</Heading>
              <Button size="sm" onClick={() => setIsEvalOpen(false)}>Schließen</Button>
            </HStack>
            <VStack align="stretch" gap={4}>
              {evaluationEvents.map((e, idx) => (
                <Box key={idx} bg="gray.700" p={3} borderRadius="md">
                  <Text fontSize="xs" color="gray.400">
                    {new Date(e.timestamp).toLocaleString()}
                  </Text>
                  <Box mt={2}>
                    {Object.entries(e.data || {}).map(([k, v]) => {
                      // human readable label mapping
                      const labelMap: Record<string,string> = {
                        testWithAI: "Testgruppe",
                        usedAIHelp: "KI genutzt",
                        ageGroup: "Altersgruppe",
                        employmentStatus: "Beschäftigung",
                        isITField: "IT-Feld",
                        programmingKnowledge: "Programmierung Wissen",
                        mentalEffort: "Mentale Belastung",
                        frustration: "Frustration",
                        npsScore: "NPS Score",
                        openFeedback: "Offenes Feedback",
                        aiGroupEnabled: "KI-Gruppe aktiviert",
                        selfEfficacy: "Selbstwirksamkeit",
                        susValues: "SUS Werte",
                        ueqValues: "UEQ Werte",
                        aiUsefulness: "KI Nützlichkeit",
                        aiTrust: "KI Vertrauen",
                      };
                      const label = labelMap[k] || k;
                      return (
                        <HStack key={k} justify="space-between">
                          <Text fontSize="sm" color="gray.200" fontWeight="bold">{label}</Text>
                          <Text fontSize="sm" color="white">
                            {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                          </Text>
                        </HStack>
                      );
                    })}
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
      )}
    </AuthGuard>
  );
}
