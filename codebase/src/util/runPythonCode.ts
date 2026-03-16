import type { ErrorType } from "@/types/learningProfile";

/**
 * Ergebnis einer Python-Code-Ausführung mit detaillierten Fehlerinformationen
 */
export interface PythonExecutionResult {
  /** Die Ausgabe oder Fehlermeldung */
  output: string;
  /** Ob die Ausführung erfolgreich war (kein Fehler) */
  success: boolean;
  /** Falls Fehler: Der klassifizierte Fehlertyp */
  errorType?: ErrorType;
  /** Falls Fehler: Die Fehlermeldung */
  errorMessage?: string;
  /** Der ausgeführte Code */
  code: string;
}

/**
 * Klassifiziert einen Python-Fehler nach Typ
 *
 * @param errorMessage - Die Fehlermeldung von Pyodide
 * @returns Der klassifizierte Fehlertyp
 */
export function classifyPythonError(errorMessage: string): ErrorType {
  const lowerMessage = errorMessage.toLowerCase();

  // Syntax-Fehler: Fehler beim Parsen des Codes
  if (
    lowerMessage.includes("syntaxerror") ||
    lowerMessage.includes("indentationerror") ||
    lowerMessage.includes("taberror") ||
    lowerMessage.includes("invalid syntax") ||
    lowerMessage.includes("unexpected indent")
  ) {
    return "syntax";
  }

  // Runtime-Fehler: Fehler während der Ausführung
  if (
    lowerMessage.includes("nameerror") ||
    lowerMessage.includes("typeerror") ||
    lowerMessage.includes("valueerror") ||
    lowerMessage.includes("indexerror") ||
    lowerMessage.includes("keyerror") ||
    lowerMessage.includes("attributeerror") ||
    lowerMessage.includes("zerodivisionerror") ||
    lowerMessage.includes("filenotfounderror") ||
    lowerMessage.includes("importerror") ||
    lowerMessage.includes("modulenotfounderror") ||
    lowerMessage.includes("recursionerror") ||
    lowerMessage.includes("memoryerror") ||
    lowerMessage.includes("overflowerror")
  ) {
    return "runtime";
  }

  // Logic-Fehler: Assertion-Fehler oder Test-Fehler
  if (
    lowerMessage.includes("assertionerror") ||
    lowerMessage.includes("assertion failed")
  ) {
    return "logic";
  }

  // Validation-Fehler: Output stimmt nicht mit erwarteter Lösung überein
  // (wird nicht direkt aus der Python-Fehlermeldung erkannt, sondern später)

  // Default: Runtime für unbekannte Python-Fehler
  return "runtime";
}

/**
 * Prüft ob ein Output eine Fehlermeldung enthält
 *
 * @param output - Die Ausgabe der Code-Ausführung
 * @returns true wenn ein Fehler erkannt wurde
 */
export function containsError(output: string): boolean {
  return (
    output.includes("Error") ||
    output.includes("Traceback") ||
    output.includes("Exception")
  );
}

/**
 * Extrahiert die relevante Fehlermeldung aus einer Python-Ausgabe
 *
 * @param output - Die vollständige Ausgabe
 * @returns Die extrahierte Fehlermeldung (letzte Zeile oder volle Ausgabe)
 */
export function extractErrorMessage(output: string): string {
  const lines = output.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return output;

  // Die letzte nicht-leere Zeile ist oft die wichtigste Fehlermeldung
  const lastLine = lines[lines.length - 1];

  // Wenn es ein bekannter Fehlertyp ist, gib nur diese Zeile zurück
  if (lastLine.includes("Error:") || lastLine.includes("Exception:")) {
    return lastLine;
  }

  // Ansonsten die letzten 3 Zeilen für mehr Kontext
  return lines.slice(-3).join("\n");
}

/** Maximale Anzahl an Schleifendurchläufen bevor Endlosschleife erkannt wird */
const MAX_LOOP_ITERATIONS = 100000;

/**
 * Instrumentiert Python-Code um Endlosschleifen zu erkennen.
 * Fügt einen Counter-Check in while- und for-Schleifen ein.
 */
function instrumentLoopProtection(code: string): string {
  const lines = code.split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();
    const indent = line.length - trimmed.length;
    const indentStr = line.substring(0, indent);

    // Erkenne while und for Schleifen
    if (trimmed.startsWith("while ") || trimmed.startsWith("for ")) {
      result.push(line);
      // Füge Counter-Check als erste Zeile im Loop-Body ein
      result.push(`${indentStr}    _loop_counter += 1`);
      result.push(`${indentStr}    if _loop_counter > ${MAX_LOOP_ITERATIONS}: raise RuntimeError("Endlosschleife erkannt! Dein Code hat über ${MAX_LOOP_ITERATIONS.toLocaleString()} Schleifendurchläufe. Prüfe deine Schleifenbedingung (z.B. 'while True' ohne break).")`);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

/**
 * Executes the provided Python code using Pyodide and captures its output.
 * Includes protection against infinite loops.
 *
 * @param pyodide - An object containing the `runPython` method to execute Python code.
 * @param code - The Python code to be executed.
 * @param setOutput - A React state setter function to update the output of the executed code.
 *
 * @returns A promise that resolves with the output string when the Python code execution is complete.
 */
export async function runPythonCode(
  pyodide: { runPython: (code: string) => Promise<string> },
  code: string,
  setOutput: React.Dispatch<React.SetStateAction<string>> | ((output: string) => void)
): Promise<string> {
  if (pyodide) {
    try {
      // Instrumentiere den Code um Endlosschleifen zu erkennen
      const instrumentedCode = instrumentLoopProtection(code);

      const wrappedCode = `
import sys
from io import StringIO

# Capture standard output
output = StringIO()
sys.stdout = output

# Loop-Schutz: Zähler für Schleifendurchläufe
_loop_counter = 0

try:
${instrumentedCode
  .split("\n")
  .map((line) => (line.trim() ? `    ${line}` : ""))
  .join("\n")}
finally:
    sys.stdout = sys.__stdout__

output.getvalue()
`;

      const result = await pyodide.runPython(wrappedCode);
      setOutput(result || "");
      return result || "";
    } catch (error: any) {
      const errorMessage = `Error: ${error.message}`;
      setOutput(errorMessage);
      console.error("Error while running Python code:", error);
      return errorMessage;
    }
  } else {
    const loadingMessage = "Pyodide is still loading...";
    setOutput(loadingMessage);
    return loadingMessage;
  }
}

/**
 * Führt Python-Code aus und gibt detaillierte Ergebnisse zurück
 *
 * Diese Funktion ist eine Erweiterung von runPythonCode, die zusätzlich
 * Fehlerklassifizierung und detaillierte Metadaten liefert.
 *
 * @param pyodide - Pyodide-Instanz mit runPython Methode
 * @param code - Der auszuführende Python-Code
 * @param setOutput - State-Setter für die Ausgabe (optional)
 * @returns Detailliertes Ergebnis mit Fehlerklassifizierung
 */
export async function runPythonCodeWithDetails(
  pyodide: { runPython: (code: string) => Promise<string> } | null,
  code: string,
  setOutput?: React.Dispatch<React.SetStateAction<string>> | ((output: string) => void)
): Promise<PythonExecutionResult> {
  if (!pyodide) {
    const output = "Pyodide is still loading...";
    setOutput?.(output);
    return {
      output,
      success: false,
      code,
    };
  }

  try {
    // Instrumentiere den Code um Endlosschleifen zu erkennen
    const instrumentedCode = instrumentLoopProtection(code);

    const wrappedCode = `
import sys
from io import StringIO

# Capture standard output
output = StringIO()
sys.stdout = output

# Loop-Schutz: Zähler für Schleifendurchläufe
_loop_counter = 0

try:
${instrumentedCode
  .split("\n")
  .map((line) => (line.trim() ? `    ${line}` : ""))
  .join("\n")}
finally:
    sys.stdout = sys.__stdout__

output.getvalue()
`;

    const result = await pyodide.runPython(wrappedCode);
    const output = result || "";
    setOutput?.(output);

    // Prüfe ob die Ausgabe selbst Fehler enthält (z.B. von einem inneren try/except)
    if (containsError(output)) {
      const errorType = classifyPythonError(output);
      const errorMessage = extractErrorMessage(output);

      console.log(`🔴 [runPythonCode] Error in output:`, { errorType, errorMessage });

      return {
        output,
        success: false,
        errorType,
        errorMessage,
        code,
      };
    }

    console.log(`🟢 [runPythonCode] Code executed successfully`);

    return {
      output,
      success: true,
      code,
    };
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    const output = `Error: ${errorMessage}`;
    const errorType = classifyPythonError(errorMessage);

    setOutput?.(output);

    console.log(`🔴 [runPythonCode] Execution error:`, { errorType, errorMessage });

    return {
      output,
      success: false,
      errorType,
      errorMessage: extractErrorMessage(output),
      code,
    };
  }
}
