"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import {
  MultilineInput,
  RatingSlider,
  LikertMatrix,
  SemanticDifferential,
  NPSScore,
  SelectDropdown,
  MultipleChoice,
} from "@/components/evaluation";
import { logEvaluationSubmitted } from "@/db/eventTracking";
import { useUser } from "@/context/UserContext";
import { useTranslations, useLocale } from "next-intl";

export default function EvaluationPage() {
  const router = useRouter();
  const { userId, aiChatTutorIsEnabled } = useUser();
  const t = useTranslations("evaluation");
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Refs for scrolling to incomplete fields
  const ageGroupRef = useRef<HTMLDivElement>(null);
  const employmentRef = useRef<HTMLDivElement>(null);
  const itFieldRef = useRef<HTMLDivElement>(null);
  const programmingSkillsRef = useRef<HTMLDivElement>(null);
  const selfEfficacyRef = useRef<HTMLDivElement>(null);
  const susRef = useRef<HTMLDivElement>(null);
  const ueqRef = useRef<HTMLDivElement>(null);
  const aiUsefulnessRef = useRef<HTMLDivElement>(null);
  const aiTrustRef = useRef<HTMLDivElement>(null);
  const npsRef = useRef<HTMLDivElement>(null);
  const openFeedbackRef = useRef<HTMLDivElement>(null);

  // SECTION: Demographics & Expertise Control
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [employmentStatus, setEmploymentStatus] = useState<string>("");
  const [isITField, setIsITField] = useState<string>("");
  const [programmingKnowledge, setProgrammingKnowledge] = useState<number | null>(null);
  const [selfEfficacy, setSelfEfficacy] = useState<Record<string, number>>({});

  // SECTION: Cognitive Load Measurement (Post-Task)
  const [mentalEffort, setMentalEffort] = useState(5);
  const [frustration, setFrustration] = useState(50);

  // SECTION: Usability & User Experience (General Platform)
  const [susValues, setSusValues] = useState<Record<string, number>>({});
  const [ueqValues, setUeqValues] = useState<Record<string, number>>({});

  // SECTION: AI Specific Evaluation (Conditional)
  const [aiUsefulness, setAiUsefulness] = useState<Record<string, number>>({});
  const [aiTrust, setAiTrust] = useState<Record<string, number>>({});

  // SECTION: Qualitative Feedback & NPS
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [openFeedback, setOpenFeedback] = useState("");

  useEffect(() => {
    document.title = t("pageTitle");
  }, [t]);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add a brief highlight effect
      ref.current.style.outline = "3px solid #E53E3E";
      ref.current.style.outlineOffset = "4px";
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.outline = "none";
        }
      }, 3000);
    }
  };

  const validateForm = (): boolean => {
    // Section 1: Demographics
    if (!ageGroup) {
      setValidationError(t("validation.ageGroup"));
      scrollToRef(ageGroupRef);
      return false;
    }
    if (!employmentStatus) {
      setValidationError(t("validation.employment"));
      scrollToRef(employmentRef);
      return false;
    }
    if (!isITField) {
      setValidationError(t("validation.itField"));
      scrollToRef(itFieldRef);
      return false;
    }
    if (programmingKnowledge === null) {
      setValidationError(t("validation.programmingSkills"));
      scrollToRef(programmingSkillsRef);
      return false;
    }
    // Self-Efficacy: 3 items required
    const selfEfficacyIds = ["self_eff_1", "self_eff_2", "self_eff_3"];
    if (selfEfficacyIds.some((id) => selfEfficacy[id] === undefined)) {
      setValidationError(t("validation.selfEfficacy"));
      scrollToRef(selfEfficacyRef);
      return false;
    }

    // Section 3: SUS (10 items)
    const susIds = Array.from({ length: 10 }, (_, i) => `sus_${i + 1}`);
    if (susIds.some((id) => susValues[id] === undefined)) {
      setValidationError(t("validation.sus"));
      scrollToRef(susRef);
      return false;
    }

    // Section 3: UEQ (8 items)
    const ueqIds = Array.from({ length: 8 }, (_, i) => `ueq_${i + 1}`);
    if (ueqIds.some((id) => ueqValues[id] === undefined)) {
      setValidationError(t("validation.ueq"));
      scrollToRef(ueqRef);
      return false;
    }

    // Section 4: AI (only if AI group)
    if (aiChatTutorIsEnabled) {
      const aiUsefulnessIds = ["ai_useful_1", "ai_useful_2", "ai_useful_3"];
      if (aiUsefulnessIds.some((id) => aiUsefulness[id] === undefined)) {
        setValidationError(t("validation.aiUsefulness"));
        scrollToRef(aiUsefulnessRef);
        return false;
      }
      const aiTrustIds = ["ai_trust_1", "ai_trust_2", "ai_trust_3"];
      if (aiTrustIds.some((id) => aiTrust[id] === undefined)) {
        setValidationError(t("validation.aiTrust"));
        scrollToRef(aiTrustRef);
        return false;
      }
    }

    // Section 5: NPS
    if (npsScore === null) {
      setValidationError(t("validation.nps"));
      scrollToRef(npsRef);
      return false;
    }

    // Section 5: Open Feedback (required)
    if (!openFeedback.trim()) {
      setValidationError(t("validation.openFeedback"));
      scrollToRef(openFeedbackRef);
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmitEvaluation = async () => {
    if (!userId) {
      console.error("No userId available for evaluation submission");
      router.push("/auf-wiedersehen");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const evaluationData = {
      locale,
      aiGroupEnabled: aiChatTutorIsEnabled,
      ageGroup,
      employmentStatus,
      isITField,
      programmingKnowledge,
      selfEfficacy,
      mentalEffort,
      frustration,
      susValues,
      ueqValues,
      ...(aiChatTutorIsEnabled && { aiUsefulness, aiTrust }),
      npsScore,
      openFeedback,
    };

    try {
      await logEvaluationSubmitted(userId, evaluationData);
      console.log("✅ Evaluation submitted successfully");
    } catch (error) {
      console.error("❌ Error submitting evaluation:", error);
      // Still redirect even if saving fails - don't block the user
    }

    router.push("/auf-wiedersehen");
  };

  return (
    <AuthGuard>
      <Container
        maxW="container.lg"
        py={16}
        bg={{ base: "gray.900", _light: "gray.50" }}
        minH="100vh"
      >
        <VStack gap={8} align="stretch">
          {/* Celebration Header */}
          <Box
            textAlign="center"
            py={8}
            px={6}
            bg={{ base: "green.800", _light: "green.50" }}
            borderRadius="xl"
            boxShadow="xl"
            borderWidth="2px"
            borderColor={{ base: "green.600", _light: "green.300" }}
          >
            <Text fontSize="6xl" mb={4}>
              {t("header.emoji")}
            </Text>
            <Heading
              as="h1"
              size="2xl"
              color={{ base: "white", _light: "gray.900" }}
              mb={4}
            >
              {t("header.title")}
            </Heading>
            <Text fontSize="xl" color={{ base: "green.200", _light: "green.800" }}>
              {t("header.subtitle")}
            </Text>
          </Box>

          {/* Thank You & Request Section */}
          <Box
            py={8}
            px={6}
            bg={{ base: "gray.800", _light: "white" }}
            borderRadius="lg"
            boxShadow="lg"
            borderWidth="1px"
            borderColor={{ base: "gray.700", _light: "gray.200" }}
          >
            <VStack gap={6} align="stretch">
              <Heading as="h2" size="lg" color={{ base: "white", _light: "gray.900" }}>
                {t("thankYou.title")}
              </Heading>

              <Text
                fontSize="lg"
                color={{ base: "gray.300", _light: "gray.700" }}
                lineHeight="tall"
              >
                {t("thankYou.paragraph1")}
              </Text>

              <Text
                fontSize="lg"
                color={{ base: "gray.300", _light: "gray.700" }}
                lineHeight="tall"
              >
                {t.rich("thankYou.paragraph2", {
                  strong: (chunks) => (
                    <Text as="span" fontWeight="bold" color={{ base: "blue.400", _light: "blue.600" }}>
                      {chunks}
                    </Text>
                  ),
                })}
              </Text>

              <Box
                py={4}
                px={6}
                bg={{ base: "blue.900", _light: "blue.50" }}
                borderRadius="md"
                borderLeftWidth="4px"
                borderLeftColor={{ base: "blue.400", _light: "blue.500" }}
              >
                <Text
                  fontSize="md"
                  color={{ base: "blue.200", _light: "blue.800" }}
                  fontWeight="medium"
                >
                  {t("thankYou.feedbackNote")}
                </Text>
                <Text fontSize="sm" color={{ base: "blue.300", _light: "blue.700" }} mt={2}>
                  {t("thankYou.feedbackDescription")}
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Evaluation Form */}
          <Box
            py={8}
            px={6}
            bg={{ base: "gray.800", _light: "white" }}
            borderRadius="lg"
            boxShadow="lg"
            borderWidth="1px"
            borderColor={{ base: "gray.700", _light: "gray.200" }}
          >
            <VStack gap={8} align="stretch">
              <Heading as="h3" size="lg" color={{ base: "white", _light: "gray.900" }}>
                {t("formTitle")}
              </Heading>

              {/* ===== SECTION 1: Demographics & Expertise Control ===== */}
              <Box
                p={6}
                bg={{ base: "gray.900", _light: "gray.50" }}
                borderRadius="md"
                borderWidth="1px"
                borderColor={{ base: "gray.700", _light: "gray.200" }}
              >
                <Heading
                  as="h4"
                  size="md"
                  color={{ base: "blue.300", _light: "blue.700" }}
                  mb={6}
                >
                  {t("section1.title")}
                </Heading>

                <VStack gap={6} align="stretch">
                  {/* FIELD 1.1: Age Group */}
                  <Box ref={ageGroupRef}>
                    <SelectDropdown
                      label={t("section1.age.label")}
                      value={ageGroup}
                      onChange={setAgeGroup}
                      options={[
                        { value: "under_18", label: t("section1.age.under18") },
                        { value: "18_24", label: t("section1.age.18to24") },
                        { value: "25_34", label: t("section1.age.25to34") },
                        { value: "35_44", label: t("section1.age.35to44") },
                        { value: "45_54", label: t("section1.age.45to54") },
                        { value: "55_plus", label: t("section1.age.55plus") },
                      ]}
                      required
                    />
                  </Box>

                  {/* FIELD 1.2: Employment Status */}
                  <Box ref={employmentRef}>
                    <MultipleChoice
                      label={t("section1.employment.label")}
                      value={employmentStatus}
                      onChange={setEmploymentStatus}
                      options={[
                        { value: "schueler", label: t("section1.employment.student") },
                        { value: "azubi", label: t("section1.employment.apprentice") },
                        { value: "student", label: t("section1.employment.university") },
                        { value: "berufstaetig", label: t("section1.employment.employed") },
                        { value: "arbeitssuchend", label: t("section1.employment.seeking") },
                        { value: "sonstiges", label: t("section1.employment.other") },
                      ]}
                      required
                    />
                  </Box>

                  {/* FIELD 1.3: IT/Software Field */}
                  <Box ref={itFieldRef}>
                    <MultipleChoice
                      label={t("section1.itField.label")}
                      description={t("section1.itField.description")}
                      value={isITField}
                      onChange={setIsITField}
                      options={[
                        { value: "ja", label: t("section1.itField.yes") },
                        { value: "nein", label: t("section1.itField.no") },
                      ]}
                      required
                    />
                  </Box>

                  {/* INSTRUMENT: Self-Reported Expertise */}
                  <Box ref={programmingSkillsRef}>
                    <RatingSlider
                      label={t("section1.programmingSkills.label")}
                      value={programmingKnowledge || 1}
                      onChange={setProgrammingKnowledge}
                      min={1}
                      max={5}
                      stepLabels={[
                        t("section1.programmingSkills.level1"),
                        t("section1.programmingSkills.level2"),
                        t("section1.programmingSkills.level3"),
                        t("section1.programmingSkills.level4"),
                        t("section1.programmingSkills.level5"),
                      ]}
                      required
                    />
                  </Box>

                  {/* INSTRUMENT: Programming Self-Efficacy Scale */}
                  <Box ref={selfEfficacyRef}>
                    <LikertMatrix
                      label={t("section1.selfEfficacy.label")}
                      description={t("section1.selfEfficacy.description")}
                      items={[
                        { id: "self_eff_1", statement: t("section1.selfEfficacy.item1") },
                        { id: "self_eff_2", statement: t("section1.selfEfficacy.item2") },
                        { id: "self_eff_3", statement: t("section1.selfEfficacy.item3") },
                      ]}
                      values={selfEfficacy}
                      onChange={setSelfEfficacy}
                      scale={{
                        min: 1,
                        max: 7,
                        minLabel: t("section1.selfEfficacy.scaleMin"),
                        maxLabel: t("section1.selfEfficacy.scaleMax"),
                      }}
                      required
                    />
                  </Box>
                </VStack>
              </Box>

              {/* ===== SECTION 2: Cognitive Load Measurement ===== */}
              <Box
                p={6}
                bg={{ base: "gray.900", _light: "gray.50" }}
                borderRadius="md"
                borderWidth="1px"
                borderColor={{ base: "gray.700", _light: "gray.200" }}
              >
                <Heading
                  as="h4"
                  size="md"
                  color={{ base: "blue.300", _light: "blue.700" }}
                  mb={6}
                >
                  {t("section2.title")}
                </Heading>

                <VStack gap={6} align="stretch">
                  {/* INSTRUMENT: Paas Mental Effort Scale */}
                  <RatingSlider
                    label={t("section2.mentalEffort.label")}
                    description={t("section2.mentalEffort.description")}
                    value={mentalEffort}
                    onChange={setMentalEffort}
                    min={1}
                    max={9}
                    leftLabel={t("section2.mentalEffort.scaleMin")}
                    rightLabel={t("section2.mentalEffort.scaleMax")}
                    required
                  />

                  {/* INSTRUMENT: NASA-TLX Frustration */}
                  <RatingSlider
                    label={t("section2.frustration.label")}
                    description={t("section2.frustration.description")}
                    value={frustration}
                    onChange={setFrustration}
                    min={0}
                    max={100}
                    leftLabel={t("section2.frustration.scaleMin")}
                    rightLabel={t("section2.frustration.scaleMax")}
                    required
                  />
                </VStack>
              </Box>

              {/* ===== SECTION 3: Usability & User Experience ===== */}
              <Box
                p={6}
                bg={{ base: "gray.900", _light: "gray.50" }}
                borderRadius="md"
                borderWidth="1px"
                borderColor={{ base: "gray.700", _light: "gray.200" }}
              >
                <Heading
                  as="h4"
                  size="md"
                  color={{ base: "blue.300", _light: "blue.700" }}
                  mb={6}
                >
                  {t("section3.title")}
                </Heading>

                <VStack gap={6} align="stretch">
                  {/* INSTRUMENT: System Usability Scale (SUS) */}
                  <Box ref={susRef}>
                    <LikertMatrix
                      label={t("section3.sus.label")}
                      description={t("section3.sus.description")}
                      items={[
                        { id: "sus_1", statement: t("section3.sus.item1") },
                        { id: "sus_2", statement: t("section3.sus.item2") },
                        { id: "sus_3", statement: t("section3.sus.item3") },
                        { id: "sus_4", statement: t("section3.sus.item4") },
                        { id: "sus_5", statement: t("section3.sus.item5") },
                        { id: "sus_6", statement: t("section3.sus.item6") },
                        { id: "sus_7", statement: t("section3.sus.item7") },
                        { id: "sus_8", statement: t("section3.sus.item8") },
                        { id: "sus_9", statement: t("section3.sus.item9") },
                        { id: "sus_10", statement: t("section3.sus.item10") },
                      ]}
                      values={susValues}
                      onChange={setSusValues}
                      scale={{
                        min: 1,
                        max: 5,
                        minLabel: t("section3.sus.scaleMin"),
                        maxLabel: t("section3.sus.scaleMax"),
                      }}
                      required
                    />
                  </Box>

                  {/* INSTRUMENT: UEQ-S */}
                  <Box ref={ueqRef}>
                    <SemanticDifferential
                      label={t("section3.ueq.label")}
                      description={t("section3.ueq.description")}
                      pairs={[
                        { left: t("section3.ueq.pair1.left"), right: t("section3.ueq.pair1.right"), value: "ueq_1" },
                        { left: t("section3.ueq.pair2.left"), right: t("section3.ueq.pair2.right"), value: "ueq_2" },
                        { left: t("section3.ueq.pair3.left"), right: t("section3.ueq.pair3.right"), value: "ueq_3" },
                        { left: t("section3.ueq.pair4.left"), right: t("section3.ueq.pair4.right"), value: "ueq_4" },
                        { left: t("section3.ueq.pair5.left"), right: t("section3.ueq.pair5.right"), value: "ueq_5" },
                        { left: t("section3.ueq.pair6.left"), right: t("section3.ueq.pair6.right"), value: "ueq_6" },
                        { left: t("section3.ueq.pair7.left"), right: t("section3.ueq.pair7.right"), value: "ueq_7" },
                        { left: t("section3.ueq.pair8.left"), right: t("section3.ueq.pair8.right"), value: "ueq_8" },
                      ]}
                      values={ueqValues}
                      onChange={setUeqValues}
                      required
                    />
                  </Box>
                </VStack>
              </Box>

              {/* ===== SECTION 4: AI Specific Evaluation (only for AI group) ===== */}
              {aiChatTutorIsEnabled && (
                <Box
                  p={6}
                  bg={{ base: "purple.900", _light: "purple.50" }}
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor={{ base: "purple.600", _light: "purple.300" }}
                  style={{
                    animation: "slideDown 0.3s ease-out",
                  }}
                >
                  <Heading
                    as="h4"
                    size="md"
                    color={{ base: "purple.200", _light: "purple.800" }}
                    mb={6}
                  >
                    {t("section4.title")}
                  </Heading>

                  <VStack gap={6} align="stretch">
                    {/* INSTRUMENT: TAM - Perceived Usefulness */}
                    <Box ref={aiUsefulnessRef}>
                      <LikertMatrix
                        label={t("section4.usefulness.label")}
                        description={t("section4.usefulness.description")}
                        items={[
                          { id: "ai_useful_1", statement: t("section4.usefulness.item1") },
                          { id: "ai_useful_2", statement: t("section4.usefulness.item2") },
                          { id: "ai_useful_3", statement: t("section4.usefulness.item3") },
                        ]}
                        values={aiUsefulness}
                        onChange={setAiUsefulness}
                        scale={{
                          min: 1,
                          max: 7,
                          minLabel: t("section4.usefulness.scaleMin"),
                          maxLabel: t("section4.usefulness.scaleMax"),
                        }}
                        required
                      />
                    </Box>

                    {/* INSTRUMENT: Trust in Automation */}
                    <Box ref={aiTrustRef}>
                      <LikertMatrix
                        label={t("section4.trust.label")}
                        description={t("section4.trust.description")}
                        items={[
                          { id: "ai_trust_1", statement: t("section4.trust.item1") },
                          { id: "ai_trust_2", statement: t("section4.trust.item2") },
                          { id: "ai_trust_3", statement: t("section4.trust.item3") },
                        ]}
                        values={aiTrust}
                        onChange={setAiTrust}
                        scale={{
                          min: 1,
                          max: 7,
                          minLabel: t("section4.trust.scaleMin"),
                          maxLabel: t("section4.trust.scaleMax"),
                        }}
                        required
                      />
                    </Box>
                  </VStack>
                </Box>
              )}

              {/* ===== SECTION 5: Qualitative Feedback & NPS ===== */}
              <Box
                p={6}
                bg={{ base: "gray.900", _light: "gray.50" }}
                borderRadius="md"
                borderWidth="1px"
                borderColor={{ base: "gray.700", _light: "gray.200" }}
              >
                <Heading
                  as="h4"
                  size="md"
                  color={{ base: "blue.300", _light: "blue.700" }}
                  mb={6}
                >
                  {t("section5.title")}
                </Heading>

                <VStack gap={6} align="stretch">
                  {/* INSTRUMENT: NPS */}
                  <Box ref={npsRef}>
                    <NPSScore
                      label={t("section5.nps.label")}
                      description={t("section5.nps.description")}
                      value={npsScore}
                      onChange={setNpsScore}
                      labelUnlikely={t("section5.nps.unlikely")}
                      labelVeryLikely={t("section5.nps.veryLikely")}
                      required
                    />
                  </Box>

                  {/* Qualitative Feedback */}
                  <Box ref={openFeedbackRef}>
                    <MultilineInput
                      label={t("section5.openFeedback.label")}
                      description={t("section5.openFeedback.description")}
                      value={openFeedback}
                      onChange={setOpenFeedback}
                      rows={15}
                      maxLength={10000}
                      placeholder={t("section5.openFeedback.placeholder")}
                      required
                    />
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Validation Error Message */}
          {validationError && (
            <Box
              p={4}
              bg={{ base: "red.900", _light: "red.50" }}
              borderRadius="md"
              borderWidth="2px"
              borderColor={{ base: "red.500", _light: "red.300" }}
            >
              <Text
                color={{ base: "red.200", _light: "red.700" }}
                fontWeight="bold"
                textAlign="center"
              >
                {validationError}
              </Text>
            </Box>
          )}

          {/* Submit Button */}
          <Flex justify="center" pt={4}>
            <Button
              size="lg"
              colorScheme="green"
              bg="green.500"
              color="white"
              fontSize="lg"
              fontWeight="bold"
              px={12}
              py={6}
              onClick={handleSubmitEvaluation}
              disabled={isSubmitting}
              _hover={{
                bg: "green.600",
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
            >
              {isSubmitting ? t("submit.loading") : t("submit.button")}
            </Button>
          </Flex>
        </VStack>
      </Container>
    </AuthGuard>
  );
}
