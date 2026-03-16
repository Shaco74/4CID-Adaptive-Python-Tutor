import { CourseTask } from '@/types/courseTypes';
import { showStepSuccessToast } from '@/util/hooks/useStandardToaster';
import type { ErrorType } from '@/types/learningProfile';
import type { Locale } from '@/courses/getCourseData';

/**
 * Normalisiert Code für Whitespace-toleranten Vergleich.
 * - Ersetzt ' durch " (Quote-Normalisierung)
 * - Entfernt Leerzeichen um =, (, ), ,
 * - Entfernt Leerzeichen um arithmetische Operatoren (+, -, *, /, //, %, **)
 *
 * WICHTIG: Whitespace innerhalb von Strings wird NICHT verändert!
 * Das ermöglicht korrekte Validierung von: print("Dein BMI: " + str(bmi))
 *
 * Beispiele:
 * - "print( weight )" → "print(weight)"
 * - "weight = 77" → "weight=77"
 * - "a + b" → "a+b"
 * - 'print("Hi")' → 'print("Hi")'
 */
function normalizeCodeForComparison(code: string): string {
  // Schritt 1: Extrahiere und ersetze String-Literale durch Platzhalter
  const stringLiterals: string[] = [];
  let codeWithPlaceholders = code.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, (match) => {
    stringLiterals.push(match);
    return `__STRING_${stringLiterals.length - 1}__`;
  });

  // Schritt 2: Normalisiere den Code (ohne die String-Inhalte)
  codeWithPlaceholders = codeWithPlaceholders
    .replace(/'/g, '"')           // Quote-Normalisierung (für nicht-String quotes)
    .replace(/\s*\(\s*/g, '(')    // print( x ) → print(x)
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s*=\s*/g, '=')     // x = 5 → x=5
    .replace(/\s*,\s*/g, ',')     // f(a , b) → f(a,b)
    .replace(/\s*\+\s*/g, '+')    // a + b → a+b
    .replace(/\s*-\s*/g, '-')     // a - b → a-b
    .replace(/\s*\*\*\s*/g, '**') // a ** b → a**b (muss vor * kommen)
    .replace(/\s*\/\/\s*/g, '//')  // a // b → a//b (muss vor / kommen)
    .replace(/\s*\*\s*/g, '*')    // a * b → a*b
    .replace(/\s*\/\s*/g, '/')    // a / b → a/b
    .replace(/\s*%\s*/g, '%');    // a % b → a%b

  // Schritt 3: Setze String-Literale wieder ein (mit normalisierter Quote)
  stringLiterals.forEach((literal, i) => {
    // Normalisiere nur die äußeren Quotes zu "
    const normalizedLiteral = literal.startsWith("'")
      ? '"' + literal.slice(1, -1) + '"'
      : literal;
    codeWithPlaceholders = codeWithPlaceholders.replace(`__STRING_${i}__`, normalizedLiteral);
  });

  return codeWithPlaceholders;
}

/**
 * Prüft ob alle erforderlichen Code-Snippets im User-Code vorhanden sind.
 * Nutzt Whitespace-tolerante Normalisierung.
 *
 * @returns Object mit passed (boolean) und failedSnippet (falls fehlgeschlagen)
 */
export function validateCodeSnippets(
  userCode: string,
  requiredSnippets: string[]
): { passed: boolean; failedSnippet?: string } {
  const normalizedCode = normalizeCodeForComparison(userCode);

  for (const snippet of requiredSnippets) {
    const normalizedSnippet = normalizeCodeForComparison(snippet);

    // Prüfe beide Varianten: normalisiert UND original
    if (!normalizedCode.includes(normalizedSnippet) && !userCode.includes(snippet)) {
      return { passed: false, failedSnippet: snippet };
    }
  }

  return { passed: true };
}

/**
 * Ergebnis einer Solution-Validierung mit Tracking-Informationen
 */
export interface ValidationResult {
  /** Ob die Lösung valide ist */
  isValid: boolean;
  /** Ob ein Fehler aufgetreten ist (Error, Traceback, etc.) */
  hasError: boolean;
  /** Falls Fehler: Der Fehlertyp */
  errorType?: ErrorType;
  /** Die Ausgabe des Codes */
  output: string;
  /** Falls solutionCode-Check fehlgeschlagen: Das fehlende Snippet */
  failedSnippet?: string;
}

/**
 * Callbacks für Learning Profile Tracking
 */
export interface ValidationTrackingCallbacks {
  /** Wird aufgerufen wenn die Lösung korrekt ist */
  onCorrect?: (topic: string) => void;
  /** Wird aufgerufen wenn die Lösung falsch ist (aber ohne Python-Fehler) */
  onIncorrect?: (topic: string) => void;
  /** Wird aufgerufen wenn ein Python-Fehler aufgetreten ist */
  onError?: (errorType: ErrorType, errorMessage: string, topic: string) => void;
}

/**
 * Validates if the code output contains any of the solution strings for a given task.
 *
 * @param output - The output string from running the Python code
 * @param task - The course task containing solution strings to check against
 * @param setIsValidSolution - A state setter function to update the validation status
 * @param showToast - Whether to show a success toast when the solution is valid (default: true)
 * @param setShowConfetti - Optional state setter to trigger confetti animation
 * @param onOpenTutorialDrawer - Optional callback to open the tutorial drawer
 * @param locale - The locale for toast messages (default: 'de')
 *
 * @returns A boolean indicating whether the solution is valid
 *
 * @example
 * ```typescript
 * const output = "Hello, World!";
 * const task = { solutionStrings: ["Hello, World!"] };
 * const setIsValidSolution = (isValid) => // console.log(`Solution is ${isValid ? 'valid' : 'invalid'}`);
 *
 * const isValid = validateSolution(output, task, setIsValidSolution);
 * // isValid will be true, and a success toast will be shown
 * ```
 */
export function validateSolution(
  output: string,
  task: CourseTask | null,
  setIsValidSolution: React.Dispatch<React.SetStateAction<boolean>>,
  showToast: boolean = true,
  setShowConfetti?: React.Dispatch<React.SetStateAction<boolean>>,
  onOpenTutorialDrawer?: () => void,
  locale: Locale = 'de'
): boolean {
  // Check if output contains any errors
  const hasError =
    output.includes("Error") ||
    output.includes("Traceback") ||
    output.includes("Exception");

  // If there's an error, the solution is invalid
  if (hasError) {
    setIsValidSolution(false);
    return false;
  }

  // If there are no solution strings, consider the solution as valid
  if (!task?.solutionString || task.solutionString.length === 0) {
    setIsValidSolution(true);
    return true;
  }

  if (task.solutionString instanceof Array) {
    // every entry in the array should be include in the output
    const isValid = task.solutionString.every((solutionString) => output.includes(solutionString));

    // Update the validation state
    setIsValidSolution(isValid);

    // Show success toast if the solution is valid and showToast is true
    if (isValid && showToast) {
      showStepSuccessToast(task.step, locale);

      // Trigger confetti animation if the solution is valid and setShowConfetti is provided
      if (setShowConfetti) {
        setShowConfetti(true);
      }

      // Open the tutorial drawer if the solution is valid and onOpenTutorialDrawer is provided
      if (onOpenTutorialDrawer) {
        // Small delay to let the user see the success message first
        setTimeout(() => {
          onOpenTutorialDrawer();
        }, 1000);
      }
    }

    return isValid;
  } else {
    // Check if the output contains any of the solution strings
    const isValid = output.includes(task.solutionString);

    // Update the validation state
    setIsValidSolution(isValid);

    // Show success toast if the solution is valid and showToast is true
    if (isValid && showToast) {
      showStepSuccessToast(task.step, locale);

      // Trigger confetti animation if the solution is valid and setShowConfetti is provided
      if (setShowConfetti) {
        setShowConfetti(true);

        // Reset confetti after a delay
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }

      // Open the tutorial drawer if the solution is valid and onOpenTutorialDrawer is provided
      if (onOpenTutorialDrawer) {
        // Small delay to let the user see the success message first
        setTimeout(() => {
          onOpenTutorialDrawer();
        }, 1000);
      }
    }

    return isValid;
  }
}

/**
 * Checks if a task requires solution validation.
 *
 * @param task - The course task to check
 *
 * @returns A boolean indicating whether the task requires solution validation
 *
 * @example
 * ```typescript
 * const task = { solutionStrings: ["Hello, World!"] };
 * const requiresValidation = requiresSolutionValidation(task);
 * // requiresValidation will be true
 * ```
 */
export function requiresSolutionValidation(task: CourseTask | null): boolean {
  return Boolean(task?.solutionString);
}

/**
 * Klassifiziert einen Fehler basierend auf dem Output
 */
function classifyErrorFromOutput(output: string): ErrorType {
  const lowerOutput = output.toLowerCase();

  if (
    lowerOutput.includes("syntaxerror") ||
    lowerOutput.includes("indentationerror")
  ) {
    return "syntax";
  }

  if (
    lowerOutput.includes("nameerror") ||
    lowerOutput.includes("typeerror") ||
    lowerOutput.includes("valueerror") ||
    lowerOutput.includes("indexerror") ||
    lowerOutput.includes("keyerror")
  ) {
    return "runtime";
  }

  if (lowerOutput.includes("assertionerror")) {
    return "logic";
  }

  return "runtime";
}

/**
 * Validiert eine Lösung mit detailliertem Ergebnis und optionalem Tracking
 *
 * Diese Funktion erweitert validateSolution() um:
 * - Detailliertes ValidationResult
 * - Optionale Tracking-Callbacks für Learning Profile Updates
 * - solutionCode-Prüfung (Anti-Cheat)
 *
 * @param output - Die Ausgabe der Code-Ausführung
 * @param userCode - Der User-Code (für solutionCode-Prüfung)
 * @param task - Die aktuelle Kursaufgabe
 * @param topic - Das aktuelle Topic (für Tracking)
 * @param callbacks - Optionale Callbacks für Tracking
 * @returns ValidationResult mit allen Details
 */
export function validateSolutionWithTracking(
  output: string,
  userCode: string,
  task: CourseTask | null,
  topic: string,
  callbacks?: ValidationTrackingCallbacks
): ValidationResult {
  // Check for errors
  const hasError =
    output.includes("Error") ||
    output.includes("Traceback") ||
    output.includes("Exception");

  if (hasError) {
    const errorType = classifyErrorFromOutput(output);

    // Extrahiere Fehlermeldung (letzte Zeile oft am wichtigsten)
    const lines = output.split("\n").filter((line) => line.trim());
    const errorMessage = lines[lines.length - 1] || output;

    console.log(`🔴 [validateSolution] Error detected:`, { errorType, topic });

    // Tracking callback für Fehler
    callbacks?.onError?.(errorType, errorMessage, topic);

    return {
      isValid: false,
      hasError: true,
      errorType,
      output,
    };
  }

  // Check 1: solutionCode (Anti-Cheat) - Prüfe ob erforderliche Code-Patterns vorhanden sind
  if (task?.solutionCode && task.solutionCode.length > 0) {
    const codeCheck = validateCodeSnippets(userCode, task.solutionCode);
    if (!codeCheck.passed) {
      console.log(`🟡 [validateSolution] solutionCode check failed:`, codeCheck.failedSnippet);
      callbacks?.onIncorrect?.(topic);
      return {
        isValid: false,
        hasError: false,
        output,
        failedSnippet: codeCheck.failedSnippet,
      };
    }
  }

  // No solution strings = valid (but solutionCode was already checked)
  if (!task?.solutionString || task.solutionString.length === 0) {
    console.log(`🟢 [validateSolution] No solution required, marking valid`);
    callbacks?.onCorrect?.(topic);
    return {
      isValid: true,
      hasError: false,
      output,
    };
  }

  // Check 2: solutionString - Prüfe ob erwartete Ausgabe im Output vorkommt
  let isValid: boolean;
  if (task.solutionString instanceof Array) {
    isValid = task.solutionString.every((solutionString) =>
      output.includes(solutionString)
    );
  } else {
    isValid = output.includes(task.solutionString);
  }

  if (isValid) {
    console.log(`🟢 [validateSolution] Solution correct for topic: ${topic}`);
    callbacks?.onCorrect?.(topic);
  } else {
    console.log(`🟡 [validateSolution] Solution incorrect for topic: ${topic}`);
    callbacks?.onIncorrect?.(topic);
  }

  return {
    isValid,
    hasError: false,
    output,
  };
}

/**
 * Extrahiert das aktuelle Topic aus einer CourseTask
 * Fallback auf "unknown" wenn nicht verfügbar
 */
export function getTaskTopic(task: CourseTask | null): string {
  // CourseTask hat möglicherweise ein topics Array oder topic String
  // Je nach Datenstruktur anpassen
  if (!task) return "unknown";

  // Prüfe verschiedene mögliche Eigenschaften
  if ("topic" in task && typeof (task as any).topic === "string") {
    return (task as any).topic;
  }

  if ("topics" in task && Array.isArray((task as any).topics)) {
    return (task as any).topics[0] || "unknown";
  }

  return "unknown";
}
