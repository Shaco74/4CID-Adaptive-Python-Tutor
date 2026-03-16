"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Textarea,
  Badge,
  Flex,
  Heading,
  Grid,
  GridItem,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { CheckCircle, XCircle, Brain, RefreshCw, Filter, Zap } from "lucide-react";
import {
  selectDrillWithAI,
  type AIDrillSelectionOutput,
} from "@/actions/aiDrillSelectionAction";
import {
  extractAllDrillInfos,
  filterDrillsByTopics,
  filterCompletedDrills,
  type DrillInfo,
  type UserContext,
} from "@/utils/drillInfoUtils";
import AuthGuard from "@/components/AuthGuard";

const AVAILABLE_TOPICS = [
  "print",
  "Variablen",
  "Datentypen",
  "Strings",
  "Listen",
  "Schleifen",
  "Bedingungen",
];

export default function AIDrillSelectionPage() {
  // All available drills
  const [allDrills, setAllDrills] = useState<DrillInfo[]>([]);
  const [filteredDrills, setFilteredDrills] = useState<DrillInfo[]>([]);

  // Filter controls
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["print"]);
  const [excludeCompleted, setExcludeCompleted] = useState(true);

  // User context
  const [userContext, setUserContext] = useState<UserContext>({
    completedDrillIds: [],
    currentStep: 1,
    currentCourse: "bmi-calculator",
    topics: ["print"],
    errorHistory: [],
    performanceScore: 75,
  });

  // Custom prompt
  const [customPrompt, setCustomPrompt] = useState("");

  // AI Response
  const [aiResponse, setAiResponse] = useState<AIDrillSelectionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load all drills on mount
  useEffect(() => {
    const drills = extractAllDrillInfos();
    setAllDrills(drills);
    setFilteredDrills(drills);
  }, []);

  // Filter drills when filters change
  useEffect(() => {
    let filtered = allDrills;

    // Filter by topics
    if (selectedTopics.length > 0) {
      filtered = filterDrillsByTopics(filtered, selectedTopics);
    }

    // Exclude completed
    if (excludeCompleted && userContext.completedDrillIds.length > 0) {
      filtered = filterCompletedDrills(filtered, userContext.completedDrillIds);
    }

    setFilteredDrills(filtered);
  }, [allDrills, selectedTopics, excludeCompleted, userContext.completedDrillIds]);

  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  // Add/remove completed drill
  const toggleCompletedDrill = (drillId: string) => {
    setUserContext(prev => ({
      ...prev,
      completedDrillIds: prev.completedDrillIds.includes(drillId)
        ? prev.completedDrillIds.filter(id => id !== drillId)
        : [...prev.completedDrillIds, drillId]
    }));
  };

  // Call AI
  const handleSelectDrill = async () => {
    setIsLoading(true);
    setAiResponse(null);

    try {
      const result = await selectDrillWithAI({
        availableDrills: filteredDrills,
        userContext: {
          ...userContext,
          topics: selectedTopics,
        },
        customPrompt: customPrompt || undefined,
      });

      setAiResponse(result);
    } catch (error: any) {
      setAiResponse({
        success: false,
        error: error.message,
        metadata: { model: "error", responseTime: 0 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard requireAdmin={true}>
    <Box bg="gray.900" minH="100vh" color="white" py={8}>
      <Container maxW="1600px">
        <VStack gap={6} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center">
            <VStack align="start" gap={1}>
              <Heading size="lg" display="flex" alignItems="center" gap={2}>
                <Brain size={28} />
                AI Drill Selection Demo
              </Heading>
              <Text color="gray.400">
                Teste die KI-gesteuerte Drill-Auswahl mit verschiedenen Kontexten
              </Text>
            </VStack>
            <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
              Admin Demo
            </Badge>
          </Flex>

          <Grid templateColumns="1fr 1fr" gap={6}>
            {/* Left Column: Controls & Context */}
            <GridItem>
              <VStack gap={4} align="stretch">
                {/* Topic Filter */}
                <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                  <Text fontWeight="bold" mb={3} display="flex" alignItems="center" gap={2}>
                    <Filter size={16} />
                    Topic Filter
                  </Text>
                  <Flex gap={2} flexWrap="wrap">
                    {AVAILABLE_TOPICS.map(topic => (
                      <Button
                        key={topic}
                        size="sm"
                        variant={selectedTopics.includes(topic) ? "solid" : "outline"}
                        colorScheme={selectedTopics.includes(topic) ? "blue" : "gray"}
                        onClick={() => toggleTopic(topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                  </Flex>
                </Box>

                {/* User Context Editor */}
                <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                  <Text fontWeight="bold" mb={3}>User Context</Text>
                  <VStack gap={3} align="stretch">
                    <HStack>
                      <Text fontSize="sm" w="120px">Kurs:</Text>
                      <Input
                        size="sm"
                        value={userContext.currentCourse}
                        onChange={e => setUserContext(prev => ({ ...prev, currentCourse: e.target.value }))}
                        bg="gray.700"
                      />
                    </HStack>
                    <HStack>
                      <Text fontSize="sm" w="120px">Step:</Text>
                      <Input
                        size="sm"
                        type="number"
                        value={userContext.currentStep}
                        onChange={e => setUserContext(prev => ({ ...prev, currentStep: parseInt(e.target.value) || 1 }))}
                        bg="gray.700"
                        w="80px"
                      />
                    </HStack>
                    <HStack>
                      <Text fontSize="sm" w="120px">Performance:</Text>
                      <Input
                        size="sm"
                        type="number"
                        value={userContext.performanceScore}
                        onChange={e => setUserContext(prev => ({ ...prev, performanceScore: parseInt(e.target.value) || 0 }))}
                        bg="gray.700"
                        w="80px"
                      />
                      <Text fontSize="sm" color="gray.500">/100</Text>
                    </HStack>
                  </VStack>
                </Box>

                {/* Custom Prompt */}
                <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                  <Text fontWeight="bold" mb={3}>Custom Prompt (optional)</Text>
                  <Textarea
                    value={customPrompt}
                    onChange={e => setCustomPrompt(e.target.value)}
                    placeholder="Zusätzliche Anweisungen für die AI, z.B. 'Bevorzuge Code-Aufgaben' oder 'Wähle etwas Leichtes'"
                    bg="gray.700"
                    rows={3}
                  />
                </Box>

                {/* Run Button */}
                <Button
                  colorScheme="green"
                  size="lg"
                  onClick={handleSelectDrill}
                  disabled={isLoading || filteredDrills.length === 0}
                >
                  <HStack gap={2}>
                    {isLoading ? <Spinner size="sm" /> : <Zap size={18} />}
                    <Text>{isLoading ? "AI wählt aus..." : "Drill auswählen lassen"}</Text>
                  </HStack>
                </Button>
              </VStack>
            </GridItem>

            {/* Right Column: Available Drills */}
            <GridItem>
              <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700" maxH="500px" overflowY="auto">
                <Flex justify="space-between" align="center" mb={3}>
                  <Text fontWeight="bold">
                    Verfügbare Drills ({filteredDrills.length})
                  </Text>
                  <HStack>
                    <Button
                      size="xs"
                      variant={excludeCompleted ? "solid" : "outline"}
                      colorScheme="orange"
                      onClick={() => setExcludeCompleted(!excludeCompleted)}
                    >
                      {excludeCompleted ? "Completed ausgeblendet" : "Alle anzeigen"}
                    </Button>
                  </HStack>
                </Flex>
                <VStack gap={2} align="stretch">
                  {filteredDrills.map(drill => {
                    const isCompleted = userContext.completedDrillIds.includes(drill.id);
                    const isSelected = aiResponse?.response?.selectedDrillId === drill.id;
                    const isAlternative = aiResponse?.response?.alternativeIds?.includes(drill.id);

                    return (
                      <Box
                        key={drill.id}
                        p={3}
                        bg={isSelected ? "green.900" : isAlternative ? "blue.900" : "gray.700"}
                        borderRadius="md"
                        border="2px solid"
                        borderColor={isSelected ? "green.500" : isAlternative ? "blue.500" : "transparent"}
                        cursor="pointer"
                        onClick={() => toggleCompletedDrill(drill.id)}
                        opacity={isCompleted ? 0.5 : 1}
                        _hover={{ bg: isSelected ? "green.800" : isAlternative ? "blue.800" : "gray.600" }}
                      >
                        <Flex justify="space-between" align="start">
                          <VStack align="start" gap={1}>
                            <HStack>
                              <Badge colorScheme={drill.type === "mcq" ? "purple" : "teal"} size="sm">
                                {drill.type.toUpperCase()}
                              </Badge>
                              {drill.questionType && (
                                <Badge colorScheme="gray" size="sm">
                                  {drill.questionType}
                                </Badge>
                              )}
                              <Badge colorScheme="blue" size="sm">
                                {drill.topic}
                              </Badge>
                              {isSelected && (
                                <Badge colorScheme="green" size="sm">
                                  SELECTED
                                </Badge>
                              )}
                              {isAlternative && (
                                <Badge colorScheme="blue" size="sm">
                                  ALT
                                </Badge>
                              )}
                            </HStack>
                            <Text fontSize="xs" color="gray.400" fontFamily="mono">
                              {drill.id}
                            </Text>
                            <Text fontSize="sm" color="gray.300" lineClamp={2}>
                              {drill.question}
                            </Text>
                          </VStack>
                          {isCompleted && (
                            <CheckCircle size={16} color="#48BB78" />
                          )}
                        </Flex>
                      </Box>
                    );
                  })}
                </VStack>
              </Box>
            </GridItem>
          </Grid>

          {/* AI Response Section */}
          {aiResponse && (
            <Box bg="gray.800" p={6} borderRadius="lg" border="1px solid" borderColor={aiResponse.success ? "green.600" : "red.600"}>
              <Flex justify="space-between" align="center" mb={4}>
                <HStack>
                  {aiResponse.success ? (
                    <CheckCircle size={24} color="#48BB78" />
                  ) : (
                    <XCircle size={24} color="#F56565" />
                  )}
                  <Heading size="md">
                    {aiResponse.success ? "AI Auswahl erfolgreich" : "Fehler bei der Auswahl"}
                  </Heading>
                </HStack>
                <HStack>
                  <Badge colorScheme="gray">
                    {aiResponse.metadata.responseTime}ms
                  </Badge>
                  {aiResponse.metadata.tokensUsed && (
                    <Badge colorScheme="purple">
                      {aiResponse.metadata.tokensUsed} tokens
                    </Badge>
                  )}
                </HStack>
              </Flex>

              {aiResponse.success && aiResponse.response ? (
                <Grid templateColumns="1fr 1fr" gap={6}>
                  {/* Selection Result */}
                  <Box>
                    <Text fontWeight="bold" mb={2}>Ausgewählter Drill:</Text>
                    <Box bg="green.900" p={4} borderRadius="md" border="1px solid" borderColor="green.600">
                      <Text fontFamily="mono" fontSize="lg" fontWeight="bold">
                        {aiResponse.response.selectedDrillId}
                      </Text>
                      <HStack mt={2}>
                        <Badge colorScheme={
                          aiResponse.response.confidence === "high" ? "green" :
                          aiResponse.response.confidence === "medium" ? "yellow" : "red"
                        }>
                          Konfidenz: {aiResponse.response.confidence}
                        </Badge>
                      </HStack>
                    </Box>

                    {aiResponse.response.alternativeIds && aiResponse.response.alternativeIds.length > 0 && (
                      <Box mt={4}>
                        <Text fontWeight="bold" mb={2}>Alternativen:</Text>
                        <VStack align="stretch" gap={1}>
                          {aiResponse.response.alternativeIds.map(id => (
                            <Box key={id} bg="blue.900" p={2} borderRadius="md">
                              <Text fontFamily="mono" fontSize="sm">{id}</Text>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </Box>

                  {/* Reasoning */}
                  <Box>
                    <Text fontWeight="bold" mb={2}>Begründung:</Text>
                    <Box bg="gray.700" p={4} borderRadius="md">
                      <Text>{aiResponse.response.reasoning}</Text>
                    </Box>
                  </Box>
                </Grid>
              ) : (
                <Box bg="red.900" p={4} borderRadius="md">
                  <Text color="red.200">{aiResponse.error}</Text>
                </Box>
              )}

              {/* Raw Response (collapsible) */}
              <Box mt={4}>
                <details>
                  <summary style={{ cursor: "pointer", color: "#A0AEC0" }}>
                    Raw Response anzeigen
                  </summary>
                  <Box bg="gray.900" p={4} borderRadius="md" mt={2} overflowX="auto">
                    <pre style={{ fontSize: "12px", whiteSpace: "pre-wrap" }}>
                      {JSON.stringify(aiResponse.metadata.rawResponse, null, 2)}
                    </pre>
                  </Box>
                </details>
              </Box>
            </Box>
          )}

          {/* Completed Drills Section */}
          {userContext.completedDrillIds.length > 0 && (
            <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
              <Text fontWeight="bold" mb={2}>
                Bereits abgeschlossen ({userContext.completedDrillIds.length}):
              </Text>
              <Flex gap={2} flexWrap="wrap">
                {userContext.completedDrillIds.map(id => (
                  <Badge
                    key={id}
                    colorScheme="green"
                    cursor="pointer"
                    onClick={() => toggleCompletedDrill(id)}
                    _hover={{ opacity: 0.7 }}
                  >
                    {id} ×
                  </Badge>
                ))}
              </Flex>
              <Text fontSize="xs" color="gray.500" mt={2}>
                Klicke auf einen Drill in der Liste oben, um ihn als completed zu markieren
              </Text>
            </Box>
          )}

          {/* Stats */}
          <Flex gap={4} flexWrap="wrap">
            <Badge colorScheme="blue" px={3} py={1}>
              Total Drills: {allDrills.length}
            </Badge>
            <Badge colorScheme="green" px={3} py={1}>
              Gefiltert: {filteredDrills.length}
            </Badge>
            <Badge colorScheme="orange" px={3} py={1}>
              Completed: {userContext.completedDrillIds.length}
            </Badge>
            <Badge colorScheme="purple" px={3} py={1}>
              Topics: {selectedTopics.join(", ") || "Alle"}
            </Badge>
          </Flex>
        </VStack>
      </Container>
    </Box>
    </AuthGuard>
  );
}
