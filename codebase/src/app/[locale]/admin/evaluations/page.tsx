"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  Table,
  Grid,
  Spinner,
} from "@chakra-ui/react";
import {
  ClipboardList,
  RefreshCw,
  Users,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Brain,
  Sparkles,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AdminNav } from "../components/AdminNav";
import { getAllEvaluations } from "@/actions/getEvaluations";
import type { EvaluationEntry } from "@/actions/getEvaluationsTypes";
import {
  calculateSUSScore,
  calculateUEQScores,
  getNPSCategory,
} from "@/utils/evaluationHelpers";
import AuthGuard from "@/components/AuthGuard";

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<EvaluationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Python Bootcamp - Evaluationen";
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    setLoading(true);
    try {
      const data = await getAllEvaluations();
      setEvaluations(data);
    } catch (error) {
      console.error("Error loading evaluations:", error);
    }
    setLoading(false);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = () => {
    if (evaluations.length === 0) return;

    const headers = [
      "User ID",
      "Timestamp",
      "Test Group",
      "Used AI",
      "Age Group",
      "Employment",
      "IT Field",
      "Programming Knowledge",
      "Mental Effort",
      "Frustration",
      "SUS Score",
      "UEQ Pragmatic",
      "UEQ Hedonic",
      "UEQ Overall",
      "NPS Score",
      "NPS Category",
      "Open Feedback",
    ];

    const rows = evaluations.map((e) => {
      const sus = calculateSUSScore(e.data.susValues || {});
      const ueq = calculateUEQScores(e.data.ueqValues || {});
      const npsCategory = getNPSCategory(e.data.npsScore);

      return [
        e.oderId,
        e.timestamp,
        e.data.testWithAI ? "With AI" : "Without AI",
        e.data.usedAIHelp ? "Yes" : "No",
        e.data.ageGroup || "",
        e.data.employmentStatus || "",
        e.data.isITField || "",
        e.data.programmingKnowledge || "",
        e.data.mentalEffort || "",
        e.data.frustration || "",
        sus.toFixed(1),
        ueq.pragmaticQuality.toFixed(2),
        ueq.hedonicQuality.toFixed(2),
        ueq.overall.toFixed(2),
        e.data.npsScore ?? "",
        npsCategory,
        `"${(e.data.openFeedback || "").replace(/"/g, '""')}"`,
      ];
    });

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evaluations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate summary stats
  const stats = {
    total: evaluations.length,
    withAI: evaluations.filter((e) => e.data.testWithAI).length,
    withoutAI: evaluations.filter((e) => !e.data.testWithAI).length,
    usedAIHelp: evaluations.filter((e) => e.data.usedAIHelp).length,
    avgSUS:
      evaluations.length > 0
        ? evaluations.reduce((sum, e) => sum + calculateSUSScore(e.data.susValues || {}), 0) /
          evaluations.length
        : 0,
    avgNPS:
      evaluations.filter((e) => e.data.npsScore !== null).length > 0
        ? evaluations
            .filter((e) => e.data.npsScore !== null)
            .reduce((sum, e) => sum + (e.data.npsScore || 0), 0) /
          evaluations.filter((e) => e.data.npsScore !== null).length
        : 0,
    promoters: evaluations.filter((e) => getNPSCategory(e.data.npsScore) === "promoter").length,
    passives: evaluations.filter((e) => getNPSCategory(e.data.npsScore) === "passive").length,
    detractors: evaluations.filter((e) => getNPSCategory(e.data.npsScore) === "detractor").length,
  };

  const npsScore =
    stats.total > 0
      ? ((stats.promoters - stats.detractors) / stats.total) * 100
      : 0;

  return (
    <AuthGuard requireAdmin={true}>
      <Box minH="100vh" bg="gray.900" py={8}>
        <Container maxW="container.xl">
          <VStack align="stretch" gap={8}>
            <AdminNav />

            {/* Header */}
            <HStack justify="space-between" align="start">
            <VStack align="start" gap={2}>
              <HStack gap={3}>
                <ClipboardList size={32} color="#10b981" />
                <Heading size="xl" color="white">
                  Evaluationen
                </Heading>
                <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
                  {evaluations.length} Einträge
                </Badge>
              </HStack>
              <Text color="gray.400" fontSize="lg">
                Alle eingereichten Evaluationsbögen
              </Text>
            </VStack>

            <HStack gap={3}>
              <Button
                onClick={exportToCSV}
                colorScheme="green"
                variant="outline"
                size="sm"
                disabled={evaluations.length === 0}
              >
                <Download size={16} />
                CSV Export
              </Button>
              <Button onClick={loadEvaluations} colorScheme="blue" size="sm" disabled={loading}>
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Aktualisieren
              </Button>
            </HStack>
          </HStack>

          {/* Summary Stats */}
          <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            <Box bg="gray.800" p={5} borderRadius="lg" border="1px solid" borderColor="gray.700">
              <HStack gap={3} mb={2}>
                <Users size={20} color="#3b82f6" />
                <Text color="gray.400" fontSize="sm">
                  Teilnehmer
                </Text>
              </HStack>
              <Text color="white" fontSize="2xl" fontWeight="bold">
                {stats.total}
              </Text>
              <HStack gap={4} mt={2}>
                <HStack gap={1}>
                  <Sparkles size={14} color="#a855f7" />
                  <Text color="gray.400" fontSize="xs">
                    Mit KI: {stats.withAI}
                  </Text>
                </HStack>
                <HStack gap={1}>
                  <Brain size={14} color="#6b7280" />
                  <Text color="gray.400" fontSize="xs">
                    Ohne: {stats.withoutAI}
                  </Text>
                </HStack>
              </HStack>
            </Box>

            <Box bg="gray.800" p={5} borderRadius="lg" border="1px solid" borderColor="gray.700">
              <HStack gap={3} mb={2}>
                <ClipboardList size={20} color="#f59e0b" />
                <Text color="gray.400" fontSize="sm">
                  SUS Score (Ø)
                </Text>
              </HStack>
              <Text
                color={stats.avgSUS >= 68 ? "green.400" : stats.avgSUS >= 50 ? "yellow.400" : "red.400"}
                fontSize="2xl"
                fontWeight="bold"
              >
                {stats.avgSUS.toFixed(1)}
              </Text>
              <Text color="gray.500" fontSize="xs" mt={2}>
                {stats.avgSUS >= 80
                  ? "Exzellent"
                  : stats.avgSUS >= 68
                  ? "Gut"
                  : stats.avgSUS >= 50
                  ? "OK"
                  : "Verbesserungsbedarf"}
              </Text>
            </Box>

            <Box bg="gray.800" p={5} borderRadius="lg" border="1px solid" borderColor="gray.700">
              <HStack gap={3} mb={2}>
                <ThumbsUp size={20} color="#10b981" />
                <Text color="gray.400" fontSize="sm">
                  NPS Score
                </Text>
              </HStack>
              <Text
                color={npsScore >= 50 ? "green.400" : npsScore >= 0 ? "yellow.400" : "red.400"}
                fontSize="2xl"
                fontWeight="bold"
              >
                {npsScore.toFixed(0)}
              </Text>
              <HStack gap={3} mt={2}>
                <HStack gap={1}>
                  <ThumbsUp size={12} color="#10b981" />
                  <Text color="gray.400" fontSize="xs">
                    {stats.promoters}
                  </Text>
                </HStack>
                <HStack gap={1}>
                  <Minus size={12} color="#6b7280" />
                  <Text color="gray.400" fontSize="xs">
                    {stats.passives}
                  </Text>
                </HStack>
                <HStack gap={1}>
                  <ThumbsDown size={12} color="#ef4444" />
                  <Text color="gray.400" fontSize="xs">
                    {stats.detractors}
                  </Text>
                </HStack>
              </HStack>
            </Box>

            <Box bg="gray.800" p={5} borderRadius="lg" border="1px solid" borderColor="gray.700">
              <HStack gap={3} mb={2}>
                <Sparkles size={20} color="#a855f7" />
                <Text color="gray.400" fontSize="sm">
                  KI-Nutzung
                </Text>
              </HStack>
              <Text color="purple.400" fontSize="2xl" fontWeight="bold">
                {stats.usedAIHelp}
              </Text>
              <Text color="gray.500" fontSize="xs" mt={2}>
                von {stats.withAI} mit KI-Zugang (
                {stats.withAI > 0 ? ((stats.usedAIHelp / stats.withAI) * 100).toFixed(0) : 0}%)
              </Text>
            </Box>
          </Grid>

          {/* Loading State */}
          {loading && (
            <Box py={12} textAlign="center">
              <Spinner size="xl" color="blue.500" />
              <Text color="gray.400" mt={4}>
                Lade Evaluationen...
              </Text>
            </Box>
          )}

          {/* Empty State */}
          {!loading && evaluations.length === 0 && (
            <Box
              py={12}
              textAlign="center"
              bg="gray.800"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.700"
            >
              <ClipboardList size={48} color="#6b7280" style={{ margin: "0 auto 16px" }} />
              <Text color="gray.400" fontSize="lg">
                Noch keine Evaluationen eingereicht
              </Text>
            </Box>
          )}

          {/* Evaluations Table */}
          {!loading && evaluations.length > 0 && (
            <Box bg="gray.800" borderRadius="lg" border="1px solid" borderColor="gray.700" overflow="hidden">
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row bg="gray.900">
                    <Table.ColumnHeader color="gray.400" py={3} px={4}>
                      User
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.400" py={3} px={4}>
                      Datum
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.400" py={3} px={4}>
                      Gruppe
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.400" py={3} px={4}>
                      SUS
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.400" py={3} px={4}>
                      NPS
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.400" py={3} px={4}>
                      Mental Load
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.400" py={3} px={4}>
                      Details
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {evaluations.map((evaluation) => {
                    const susScore = calculateSUSScore(evaluation.data.susValues || {});
                    const ueq = calculateUEQScores(evaluation.data.ueqValues || {});
                    const npsCategory = getNPSCategory(evaluation.data.npsScore);
                    const isExpanded = expandedId === evaluation.id;

                    return (
                      <>
                        <Table.Row
                          key={evaluation.id}
                          _hover={{ bg: "gray.750" }}
                          cursor="pointer"
                          onClick={() => setExpandedId(isExpanded ? null : evaluation.id)}
                        >
                          <Table.Cell color="white" py={3} px={4} fontFamily="mono" fontSize="sm">
                            {evaluation.oderId}
                          </Table.Cell>
                          <Table.Cell color="gray.300" py={3} px={4} fontSize="sm">
                            {formatDate(evaluation.timestamp)}
                          </Table.Cell>
                          <Table.Cell py={3} px={4}>
                            <HStack gap={2}>
                              {evaluation.data.testWithAI ? (
                                <Badge colorScheme="purple" size="sm">
                                  <Sparkles size={12} />
                                  Mit KI
                                </Badge>
                              ) : (
                                <Badge colorScheme="gray" size="sm">
                                  Ohne KI
                                </Badge>
                              )}
                              {evaluation.data.usedAIHelp && (
                                <Badge colorScheme="green" size="sm">
                                  Genutzt
                                </Badge>
                              )}
                            </HStack>
                          </Table.Cell>
                          <Table.Cell py={3} px={4}>
                            <Badge
                              colorScheme={
                                susScore >= 68 ? "green" : susScore >= 50 ? "yellow" : "red"
                              }
                            >
                              {susScore.toFixed(0)}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell py={3} px={4}>
                            <HStack gap={1}>
                              {npsCategory === "promoter" && <ThumbsUp size={14} color="#10b981" />}
                              {npsCategory === "passive" && <Minus size={14} color="#6b7280" />}
                              {npsCategory === "detractor" && <ThumbsDown size={14} color="#ef4444" />}
                              <Text
                                color={
                                  npsCategory === "promoter"
                                    ? "green.400"
                                    : npsCategory === "detractor"
                                    ? "red.400"
                                    : "gray.400"
                                }
                              >
                                {evaluation.data.npsScore ?? "-"}
                              </Text>
                            </HStack>
                          </Table.Cell>
                          <Table.Cell py={3} px={4}>
                            <HStack gap={2}>
                              <Text color="gray.400" fontSize="sm">
                                Effort: {evaluation.data.mentalEffort}/9
                              </Text>
                              <Text color="gray.400" fontSize="sm">
                                Frust: {evaluation.data.frustration}%
                              </Text>
                            </HStack>
                          </Table.Cell>
                          <Table.Cell py={3} px={4}>
                            <Button size="xs" variant="ghost" color="gray.400">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </Button>
                          </Table.Cell>
                        </Table.Row>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <Table.Row key={`${evaluation.id}-details`} bg="gray.850">
                            <Table.Cell colSpan={7} py={4} px={6}>
                              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                                {/* Demographics */}
                                <Box>
                                  <Text color="gray.400" fontSize="xs" fontWeight="bold" mb={2}>
                                    DEMOGRAFIE
                                  </Text>
                                  <VStack align="start" gap={1}>
                                    <Text color="gray.300" fontSize="sm">
                                      Alter: {evaluation.data.ageGroup || "-"}
                                    </Text>
                                    <Text color="gray.300" fontSize="sm">
                                      Status: {evaluation.data.employmentStatus || "-"}
                                    </Text>
                                    <Text color="gray.300" fontSize="sm">
                                      IT-Feld: {evaluation.data.isITField || "-"}
                                    </Text>
                                    <Text color="gray.300" fontSize="sm">
                                      Prog-Kenntnisse: {evaluation.data.programmingKnowledge || "-"}/5
                                    </Text>
                                  </VStack>
                                </Box>

                                {/* UEQ Scores */}
                                <Box>
                                  <Text color="gray.400" fontSize="xs" fontWeight="bold" mb={2}>
                                    UEQ-S SCORES
                                  </Text>
                                  <VStack align="start" gap={1}>
                                    <HStack>
                                      <Text color="gray.400" fontSize="sm" w="100px">
                                        Pragmatisch:
                                      </Text>
                                      <Badge
                                        colorScheme={
                                          ueq.pragmaticQuality > 0.8
                                            ? "green"
                                            : ueq.pragmaticQuality > 0
                                            ? "yellow"
                                            : "red"
                                        }
                                      >
                                        {ueq.pragmaticQuality.toFixed(2)}
                                      </Badge>
                                    </HStack>
                                    <HStack>
                                      <Text color="gray.400" fontSize="sm" w="100px">
                                        Hedonisch:
                                      </Text>
                                      <Badge
                                        colorScheme={
                                          ueq.hedonicQuality > 0.8
                                            ? "green"
                                            : ueq.hedonicQuality > 0
                                            ? "yellow"
                                            : "red"
                                        }
                                      >
                                        {ueq.hedonicQuality.toFixed(2)}
                                      </Badge>
                                    </HStack>
                                    <HStack>
                                      <Text color="gray.400" fontSize="sm" w="100px">
                                        Gesamt:
                                      </Text>
                                      <Badge
                                        colorScheme={
                                          ueq.overall > 0.8 ? "green" : ueq.overall > 0 ? "yellow" : "red"
                                        }
                                      >
                                        {ueq.overall.toFixed(2)}
                                      </Badge>
                                    </HStack>
                                  </VStack>
                                </Box>

                                {/* AI Evaluation (if applicable) */}
                                {evaluation.data.usedAIHelp && evaluation.data.aiUsefulness && (
                                  <Box>
                                    <Text color="gray.400" fontSize="xs" fontWeight="bold" mb={2}>
                                      KI-BEWERTUNG
                                    </Text>
                                    <VStack align="start" gap={1}>
                                      {Object.entries(evaluation.data.aiUsefulness).map(([key, val]) => (
                                        <Text key={key} color="gray.300" fontSize="sm">
                                          {key}: {val}/7
                                        </Text>
                                      ))}
                                    </VStack>
                                  </Box>
                                )}

                                {/* Self-Efficacy */}
                                {!evaluation.data.usedAIHelp && evaluation.data.selfEfficacy && (
                                  <Box>
                                    <Text color="gray.400" fontSize="xs" fontWeight="bold" mb={2}>
                                      SELBSTWIRKSAMKEIT
                                    </Text>
                                    <VStack align="start" gap={1}>
                                      {Object.entries(evaluation.data.selfEfficacy).map(([key, val]) => (
                                        <Text key={key} color="gray.300" fontSize="sm">
                                          {key}: {val}/7
                                        </Text>
                                      ))}
                                    </VStack>
                                  </Box>
                                )}
                              </Grid>

                              {/* Open Feedback */}
                              {evaluation.data.openFeedback && (
                                <Box mt={4} pt={4} borderTop="1px solid" borderColor="gray.700">
                                  <Text color="gray.400" fontSize="xs" fontWeight="bold" mb={2}>
                                    OFFENES FEEDBACK
                                  </Text>
                                  <Text
                                    color="gray.300"
                                    fontSize="sm"
                                    fontStyle="italic"
                                    bg="gray.900"
                                    p={3}
                                    borderRadius="md"
                                  >
                                    &quot;{evaluation.data.openFeedback}&quot;
                                  </Text>
                                </Box>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        )}
                      </>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
          </VStack>
        </Container>
      </Box>
    </AuthGuard>
  );
}
