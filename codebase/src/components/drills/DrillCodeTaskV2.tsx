"use client";
/**
 * DrillCodeTaskV2 - Code-Aufgabe für Drills (V2)
 *
 * Änderungen gegenüber V1:
 * - Kein "Lösung anzeigen" Button
 * - Kein "Tipp" Button
 * - Whitespace-tolerante Validierung (normalizeCodeForComparison)
 */

import { useState } from "react";
import { Box, VStack, Text, Button, HStack, Code } from "@chakra-ui/react";
import { Check, X } from "lucide-react";
import Editor from "@monaco-editor/react";
import usePythonRunner from "@/util/hooks/usePythonRunner";
import { runPythonCode } from "@/util/runPythonCode";
import { validateCodeSnippets } from "@/util/validateSolution";
import { useTranslations } from "next-intl";

/**
 * Minimal interface für Drill Code Tasks.
 * Nur die für die Validierung notwendigen Felder.
 */
interface DrillCodeTaskInput {
  id?: string;
  prompt: string;
  starterCode: string;
  solutionString: string;
  solutionCode?: string[];
}

interface DrillCodeTaskV2Props {
  task: DrillCodeTaskInput;
  onSubmit: (correct: boolean) => void;
  onComplete?: (result: { correct: boolean; attempts: number }) => void;
  // Callback für detailliertes Attempt-Tracking (Forschungsdaten)
  onAttempt?: (data: {
    attemptNumber: number;
    correct: boolean;
    userCode: string;
    output: string;
    timeToAnswerMs: number;
  }) => void;
}

/**
 * Normalisiert Output für Whitespace-toleranten Vergleich.
 * Entfernt Leerzeichen um Klammern, Kommas etc.
 */
function normalizeOutput(output: string): string {
  return output
    .replace(/\s*\(\s*/g, '(')   // print( x ) → print(x)
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s*,\s*/g, ',')    // [1 , 2] → [1,2]
    .replace(/\s*:\s*/g, ':')    // { "a" : 1 } → {"a":1}
    .replace(/\s*\[\s*/g, '[')
    .replace(/\s*\]\s*/g, ']')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}');
}

export function DrillCodeTaskV2({ task, onSubmit, onComplete, onAttempt }: DrillCodeTaskV2Props) {
  const t = useTranslations('drill');
  const [code, setCode] = useState(task.starterCode);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  // Startzeit für Time-to-Answer Tracking
  const [taskStartTime] = useState<number>(Date.now());

  const { pyodide } = usePythonRunner();

  const handleCheck = async () => {
    if (!pyodide) {
      setOutput(t('code.interpreterLoading'));
      return;
    }

    setIsRunning(true);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Run the code
    const codeResult = await runPythonCode(pyodide, code, setOutput);
    const hasError = codeResult.includes("Error") || codeResult.includes("Traceback") || codeResult.includes("Exception");

    // If there's an error, it's incorrect
    if (hasError) {
      setResult("incorrect");
      setIsRunning(false);
      onSubmit(false);
      if (onAttempt) {
        onAttempt({
          attemptNumber: newAttempts,
          correct: false,
          userCode: code,
          output: codeResult,
          timeToAnswerMs: Date.now() - taskStartTime,
        });
      }
      if (onComplete) {
        onComplete({ correct: false, attempts: newAttempts });
      }
      return;
    }

    let isCorrect = true;

    // Check 1: solutionCode (optional) - Code snippets must be present
    // Nutzt validateCodeSnippets für Whitespace-tolerante Prüfung
    if (task.solutionCode && task.solutionCode.length > 0) {
      const codeCheck = validateCodeSnippets(code, task.solutionCode);
      if (!codeCheck.passed) {
        isCorrect = false;
        setOutput(`❌ ${t('code.codeMustContain', { snippet: codeCheck.failedSnippet || '' })}`);
      }
    }

    // Check 2: solutionString (required) - Output validation mit Whitespace-Toleranz
    if (isCorrect && task.solutionString) {
      const normalizedActual = normalizeOutput(codeResult.trim().replace(/\r\n/g, '\n'));
      const normalizedExpected = normalizeOutput(task.solutionString.trim().replace(/\r\n/g, '\n'));

      // Split by lines and check
      const outputLines = normalizedActual.split('\n').map(line => line.trim());
      const expectedLines = normalizedExpected.split('\n').map(line => line.trim());

      // Check if ALL expected lines are present in output
      let isMatch = false;

      // Strategy 1: Exact match (after normalization)
      if (normalizedActual === normalizedExpected) {
        isMatch = true;
      }
      // Strategy 2: Check if expected output appears as complete lines
      else if (expectedLines.every(expLine => outputLines.includes(expLine))) {
        isMatch = true;
      }

      if (!isMatch) {
        isCorrect = false;
      }
    }

    setResult(isCorrect ? "correct" : "incorrect");
    setIsRunning(false);
    onSubmit(isCorrect);

    // Track individual attempt for research data
    if (onAttempt) {
      onAttempt({
        attemptNumber: newAttempts,
        correct: isCorrect,
        userCode: code,
        output: codeResult,
        timeToAnswerMs: Date.now() - taskStartTime,
      });
    }

    if (onComplete) {
      onComplete({ correct: isCorrect, attempts: newAttempts });
    }
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
        <Text fontSize="sm" color="gray.400" fontWeight="medium">
          {t('code.title')}
        </Text>

        <Text fontSize="lg" fontWeight="medium" color="white">
          {task.prompt}
        </Text>

        <Box
          border="1px solid"
          borderColor="gray.700"
          borderRadius="md"
          overflow="hidden"
        >
          <Editor
            height="200px"
            defaultLanguage="python"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </Box>

        {/* Console Output */}
        {output && (
          <Box
            p={4}
            bg="gray.900"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.700"
            fontFamily="'JetBrains Mono', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace"
          >
            <Text fontSize="sm" color="gray.400" mb={2} fontWeight="medium">
              {t('code.output')}
            </Text>
            <Code
              display="block"
              fontSize="sm"
              color={output.includes("Error") ? "red.300" : "green.300"}
              whiteSpace="pre-wrap"
              bg="transparent"
            >
              {output}
            </Code>
          </Box>
        )}

        {/* Result Feedback */}
        {result && (
          <Box
            p={4}
            bg={result === "correct" ? "green.900" : "red.900"}
            borderRadius="md"
            border="1px solid"
            borderColor={result === "correct" ? "green.700" : "red.700"}
          >
            <HStack gap={2}>
              {result === "correct" ? (
                <Check size={20} color="#22c55e" />
              ) : (
                <X size={20} color="#ef4444" />
              )}
              <Text fontWeight="bold" color="white">
                {result === "correct" ? t('code.perfect') : t('code.notQuiteRight')}
              </Text>
            </HStack>
          </Box>
        )}

        <Button
          colorScheme="blue"
          onClick={handleCheck}
          disabled={isRunning}
          w="full"
        >
          {isRunning ? t('codeRunning') : t('checkSolution')}
        </Button>
      </VStack>
    </Box>
  );
}
