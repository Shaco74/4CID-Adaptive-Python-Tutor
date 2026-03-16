"use client";
/**
 * DrillMCQuestionV2 - Multiple Choice Question für Drills (V2)
 *
 * Änderungen gegenüber V1:
 * - Bei falscher Antwort: "Nochmal versuchen" Button um erneut zu antworten
 * - Buttons werden nur bei korrekter Antwort dauerhaft disabled
 * - Antwortoptionen werden randomisiert (initial und bei "Nochmal versuchen")
 */

import { useState, useMemo, useCallback } from "react";
import { Box, VStack, HStack, Text, Button } from "@chakra-ui/react";
import { Check, X, RotateCcw } from "lucide-react";
import type { DrillMCQuestion } from "@/types/courseTypes";
import { useTranslations } from "next-intl";

interface DrillMCQuestionV2Props {
  question: DrillMCQuestion;
  onAnswer: (correct: boolean) => void;
  onComplete?: (result: { correct: boolean; attempts: number }) => void;
  // Callback für detailliertes Attempt-Tracking (Forschungsdaten)
  onAttempt?: (data: {
    attemptNumber: number;
    correct: boolean;
    selectedAnswer: string;
    timeToAnswerMs: number;
  }) => void;
}

/**
 * Fisher-Yates Shuffle für zufällige Reihenfolge
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function DrillMCQuestionV2({ question, onAnswer, onComplete, onAttempt }: DrillMCQuestionV2Props) {
  const t = useTranslations('drill');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  // Shuffle-Key: Ändert sich bei jedem Retry, um neue Randomisierung zu triggern
  const [shuffleKey, setShuffleKey] = useState(0);
  // Startzeit für Time-to-Answer Tracking
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Randomisierte Optionen - neu gemischt bei shuffleKey-Änderung
  const shuffledOptions = useMemo(() => {
    return shuffleArray(question.options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.options, shuffleKey]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    onAnswer(correct);

    // Track individual attempt for research data
    if (onAttempt) {
      const timeToAnswerMs = Date.now() - questionStartTime;
      onAttempt({
        attemptNumber: newAttempts,
        correct,
        selectedAnswer: answer,
        timeToAnswerMs,
      });
    }

    // Nur bei korrekter Antwort onComplete aufrufen
    if (correct && onComplete) {
      onComplete({ correct: true, attempts: newAttempts });
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    // Neue Randomisierung der Antworten
    setShuffleKey(prev => prev + 1);
    // Reset timer for next attempt
    setQuestionStartTime(Date.now());
  };

  const renderQuestionHeader = () => {
    const typeLabels: Record<string, string> = {
      "multiple-choice": t('types.multipleChoice'),
      "spot-the-error": t('types.spotTheError'),
      "predict-output": t('types.predictOutput'),
      "fill-the-blank": t('types.fillTheBlank')
    };

    return (
      <HStack justify="space-between" mb={4}>
        <Text fontSize="sm" color="gray.400" fontWeight="medium">
          {typeLabels[question.type]}
        </Text>
        {attempts > 0 && (
          <Text fontSize="sm" color="gray.500">
            {t('attempt', { count: attempts })}
          </Text>
        )}
      </HStack>
    );
  };

  const renderCode = () => {
    if (question.type === "multiple-choice") return null;
    if (!("code" in question) || !question.code) return null;

    return (
      <Box
        bg="gray.900"
        p={4}
        borderRadius="md"
        mb={4}
        border="1px solid"
        borderColor="gray.700"
        fontFamily="mono"
      >
        <Text
          as="pre"
          fontSize="sm"
          whiteSpace="pre-wrap"
          color="green.300"
          m={0}
        >
          {question.code}
        </Text>
      </Box>
    );
  };

  const getButtonColor = (option: string) => {
    if (!showResult) return "gray";
    if (option === question.correctAnswer) return "green";
    if (option === selectedAnswer && option !== question.correctAnswer) return "red";
    return "gray";
  };

  return (
    <Box
      bg="gray.800"
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.700"
    >
      <VStack align="stretch" gap={4}>
        {renderQuestionHeader()}

        <Text fontSize="lg" fontWeight="medium" color="white">
          {question.question}
        </Text>

        {renderCode()}

        <VStack align="stretch" gap={3}>
          {shuffledOptions.map((option, index) => (
            <Button
              key={`${shuffleKey}-${index}`}  // Key enthält shuffleKey für korrektes Re-Rendering
              onClick={() => handleAnswer(option)}
              disabled={showResult}  // Disabled während Feedback angezeigt wird
              colorPalette={getButtonColor(option)}
              variant="ghost"
              size="lg"
              justifyContent="flex-start"
              textAlign="left"
              h="auto"
              py={4}
              bg="gray.900"
              _hover={{ bg: showResult ? "gray.900" : "gray.700" }}
              border="1px solid"
              px={4}
              whiteSpace="pre-line"
              wordBreak="break-word"
            >
              {option}
              {showResult && option === question.correctAnswer && <Check size={20} />}
              {showResult && option === selectedAnswer && option !== question.correctAnswer && <X size={20} />}
            </Button>
          ))}
        </VStack>

        {/* Feedback Box */}
        {showResult && (
          <Box
            mt={4}
            p={4}
            bg={isCorrect ? "green.900" : "red.900"}
            borderRadius="md"
            border="1px solid"
            borderColor={isCorrect ? "green.700" : "red.700"}
          >
            <VStack align="stretch" gap={3}>
              <HStack gap={2}>
                {isCorrect ? (
                  <Check size={20} color="#22c55e" />
                ) : (
                  <X size={20} color="#ef4444" />
                )}
                <Text fontWeight="bold" color="white">
                  {isCorrect ? t('correct') : t('notQuite')}
                </Text>
              </HStack>

              {/* Erklärung nur bei korrekter Antwort oder nach mehreren Versuchen */}
              {question.explanation && (isCorrect || attempts >= 2) && (
                <Text fontSize="sm" color="gray.300">
                  {question.explanation}
                </Text>
              )}

              {/* Nochmal versuchen Button bei falscher Antwort */}
              {!isCorrect && (
                <Button
                  onClick={handleRetry}
                  colorScheme="blue"
                  size="md"
                  mt={2}
                >
                  <HStack gap={2}>
                    <RotateCcw size={16} />
                    <Text>{t('tryAgain')}</Text>
                  </HStack>
                </Button>
              )}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
