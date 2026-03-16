"use server";
import OpenAI from "openai";
import type { CourseContextType } from "@/context/CourseContext";
import { OPENAI_MODEL } from "@/config/openai";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

// TypeScript Types für strukturierte Antworten (validiert durch OpenAI JSON Schema)
interface StructuredContentItem {
  type: "text" | "admonition" | "codeblock";
  content: string;
  title: string | null;
  admonition_type: "info" | "warning" | "error" | "success" | "note" | null;
  language: "python" | null;
}

interface StructuredResponse {
  content: StructuredContentItem[];
}

/**
 * Extrahiert strukturierte Daten aus der OpenAI Response
 */
function extractStructuredData(responseObj: any): StructuredResponse | undefined {
  if (responseObj.output_parsed) {
    if (responseObj.output_parsed.properties) {
      // Schema ignorieren
    } else if (responseObj.output_parsed.content && Array.isArray(responseObj.output_parsed.content)) {
      return responseObj.output_parsed;
    }
  }

  if (responseObj.output && Array.isArray(responseObj.output)) {
    for (const output of responseObj.output) {
      if (output.content && Array.isArray(output.content)) {
        for (const contentItem of output.content) {
          if (contentItem.parsed && contentItem.parsed.content) {
            return contentItem.parsed;
          }
        }
      }
    }
  }

  return undefined;
}

// JSON Schema wird direkt im BASE_CONFIG definiert (OpenAI Responses API)

interface ChatResponse {
  message: string;
  structured?: StructuredResponse;
  chatId?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Formatiert Course Context für den OpenAI Prompt
 */
function formatCourseContext(context: CourseContextType): string {
  let formatted = "=== 🎓 AKTUELLER LERN-CONTEXT ===\n\n";

  if (context.courseId && context.courseName) {
    formatted += `📚 **Kurs:** ${context.courseName} (ID: ${context.courseId})\n`;
    formatted += `📍 **Schritt:** ${context.step}\n\n`;
  }

  formatted += `🎯 **PROGRESSIVE HINT SYSTEM:**\n`;
  formatted += `- Help Request #${context.helpRequestCount || 0}\n`;
  formatted += `- Aktueller Hint-Level: ${context.currentHintLevel || 1}\n`;
  formatted += `- Regel: Level 1-2 = vage, Level 3-4 = konkret, Level 5+ = Lösung erlaubt\n\n`;

  if (context.task) {
    formatted += `🎯 **Aktuelle Aufgabe:** ${context.task.title}\n`;
    formatted += `**Beschreibung:** ${context.task.description}\n\n`;
  }

  if (context.code) {
    if (context.code.starter) {
      formatted += `📝 **Starter Code (Original):**\n\`\`\`python\n${context.code.starter}\n\`\`\`\n\n`;
    }

    if (context.code.current) {
      formatted += `💻 **Aktueller Code im Editor:**\n\`\`\`python\n${context.code.current}\n\`\`\`\n\n`;
    }

    if (context.code.solution && context.code.solution.length > 0) {
      if ((context.currentHintLevel || 1) >= 5) {
        formatted += `✅ **Erwartete Lösung (nur bei Level 5+):**\n`;
        context.code.solution.forEach((sol, idx) => {
          formatted += `${idx + 1}. "${sol}"\n`;
        });
        formatted += "\n";
      } else {
        formatted += `🔒 **Lösung vorhanden** (nur bei Level 5+ verfügbar, aktuell: Level ${context.currentHintLevel})\n\n`;
      }
    }
  }

  if (context.console && context.console.output) {
    formatted += `🖥️ **Console-Ausgabe:**\n\`\`\`\n${context.console.output}\n\`\`\`\n`;
    if (context.console.hasError) {
      formatted += "⚠️ **Hinweis:** Die Console enthält Fehler!\n";
    }
    formatted += "\n";
  }

  formatted += "=== ENDE LERN-CONTEXT ===\n\n";
  return formatted;
}

// System-Anweisungen für den Chatbot
const CHATBOT_INSTRUCTIONS = `Du bist ein hilfreicher AI-Assistent für das Python-Bootcamp. Du hilfst Studenten beim Lernen von Python, Datenstrukturen und Programmierkonzepten.

In diesem Bootcamp geht es darum, wie KI beim Programmieren helfen kann. Deine Hauptaufgabe ist es, dem Student zu helfen.
Du sollst dabei stets nicht einfach die Lösung ausgeben, sondern mit intelligenten Hinweisen den Student zum selbstständigen Denken anregen.
Du sollst gerne Codebeispiele nutzen, welche sich aber von den eigentlichen Aufgaben unterscheiden. Also anstelle eines "BMI-Rechner" Beispiels kannst du ein "Flächeninhalt eines Rechtecks" Beispiel nutzen.
Erst wenn der Student mehrmals nachgefragt hat und nicht weiterkommt, darfst du ihn immer näher an die Lösung bringen.

📌 **CODE-FORMATIERUNG - STRIKT EINHALTEN:**
- **Inline-Code** (einzelne Variablen, Funktionen, kurze Ausdrücke): Nutze Backticks \`code\`
  - Beispiel: "Die Variable \`height\` speichert die Größe"
  - Beispiel: "Nutze \`print()\` für Ausgaben"
  - Beispiel: "Der Operator \`**\` ist für Potenzen"
- **Code-Blöcke** (mehrere Zeilen, vollständige Beispiele): Nutze den codeblock-Type
  - Für alles was mehr als eine Zeile ist
  - Für vollständige Code-Beispiele

**NIEMALS** Code ohne Formatierung schreiben! Jeder Code MUSS formatiert sein:
❌ FALSCH: "Nutze print() für Ausgaben"
✅ RICHTIG: "Nutze \`print()\` für Ausgaben"
❌ FALSCH: "Die Variable height = 1.75"
✅ RICHTIG: "Die Variable \`height = 1.75\`"

🧠 **KRITISCH - UNTERSCHEIDE ZWISCHEN FRAGETYPEN:**
Du erhältst zu jeder Anfrage Kontext-Informationen (Aufgabe, Code, etc.). Diese sind NUR relevant, wenn der Student EXPLIZIT nach Hilfe zur Aufgabe fragt!

**STRENGE REGEL:** Erwähne die aktuelle Aufgabe NUR wenn der Student danach fragt!

**Aufgabenbezogene Fragen** (NUR hier Aufgabe erwähnen):
- "Hilf mir bei der Aufgabe", "Was muss ich tun?", "Wie löse ich das?"
- "Was ist falsch an meinem Code?", "Warum funktioniert das nicht?"
- "Ich komme nicht weiter", "Kannst du mir helfen?" (im Kontext der Aufgabe)

**Allgemeine Fragen** (NIEMALS Aufgabe erwähnen!):
- "Wie heiße ich?", "Wer bin ich?" → Antworte NUR mit dem Namen
- "Was ist Python?", "Ist Python wichtig?" → Erkläre Python, OHNE zur Aufgabe überzuleiten
- "Was kannst du?", "Was sind deine Fähigkeiten?" → Beschreibe dich, OHNE die Aufgabe zu erwähnen
- "Erzähl mir einen Witz", "Wie geht es dir?" → Antworte natürlich, OHNE Aufgabenbezug

**VERBOTEN bei allgemeinen Fragen:**
❌ "Für deine aktuelle Aufgabe..."
❌ "Hast du schon eine Vorstellung, wie du..."
❌ "Was denkst du, wie du die Variable..."
❌ Jegliche Überleitung zur Aufgabe am Ende der Antwort!

**Beispiele:**
- "Ist Python wichtig?" → "Ja, Python ist sehr wichtig weil..." ENDE. Keine Aufgaben-Überleitung!
- "Was kannst du?" → "Ich kann dir helfen bei..." ENDE. Nicht "Für deine Aufgabe..."
- "Hilf mir" → JETZT darfst du den Kurs-Kontext nutzen

🎓 **KURS-STRUKTUR:**
Es gibt 2 Haupt-Lernpfade:

1. **BMI-Rechner** (Kurs-ID: "bmi-calculator")
   - Lerne: print(), Variablen, input(), Mathematik, Bedingungen (if/elif/else)
   - Projekt: Body-Mass-Index Rechner entwickeln

2. **Zinsrechner** (Kurs-ID: "interest-calculator") (Optionaler Pfad)
   - Lerne: f-Strings, for-Schleifen, Listen
   - Projekt: Zinseszins-Rechner für Sparpläne

📊 **CONTEXT-INFORMATIONEN:**
Zu jeder Anfrage erhältst du möglicherweise strukturierten Context über:
- 📚 Aktuelles Kapitel & Schritt
- 🎯 Aufgabenstellung
- 💻 Code im Editor (aktueller Stand)
- 📝 Starter Code (Ausgangspunkt)
- ✅ Erwartete Lösung (für Hints)
- 🖥️ Console Output (mit Fehler-Hinweis)

🎯 **DEINE AUFGABE:**
1. **Code-Analyse:** Vergleiche aktuellen Code mit Starter + erwarteter Lösung
2. **Fehler-Erkennung:** Identifiziere Syntax- und Logikfehler im Code
3. **Progressive Hints:** Gib Hilfe entsprechend dem Hint-Level (siehe unten!)
4. **Console-Fehler:** Erkläre Fehler verständlich und konstruktiv
5. **Best Practices:** Gib Tipps für besseren, lesbaren Python-Code

🎚️ **PROGRESSIVE HINT SYSTEM - ABSOLUT STRIKT EINHALTEN:**
Damit du dem Student optimal helfen kannst, befolge diese Hint-Level-Regeln PENIBEL. Das Level darf sich zurücksetzen, wenn der Student eine neue Aufgabe startet.

**Level 1 (Help Request #1):**
- NUR FRAGEN stellen zum Verständnis prüfen
- KEINE Antworten, KEINE Hinweise auf Lösung
- Beispiel: "Was soll dein Programm tun? Welche Variablen hast du?"
- Prüfe ob Student die Aufgabe verstanden hat
- KEIN Code, KEINE Formeln, NUR Verständnisfragen

**Level 2 (Help Request #2):**
- Erkläre nur GRUNDKONZEPTE (print, Variablen, etc.)
- BESCHREIBE nicht die Lösung!
- Beispiel: "Erinnerst du dich an mathematische Operatoren? Was macht **?"
- Hinweis auf Konzepte die helfen könnten
- KEIN Code der die Aufgabe löst!

**Level 3 (Help Request #3):**
- Zeige allgemeine CODE-MUSTER (nicht aufgabenspezifisch!)
- Beispiel: "In Python teilst du mit / und quadrierst mit ** 2"
- Zeige Syntax-Beispiele OHNE die echten Variablennamen
- NICHT: Die tatsächliche Lösung mit Lücken!

**Level 4 (Help Request #4):**
- Jetzt darfst du CODE-STRUKTUR mit Lücken zeigen
- Beispiel: "result = wert1 / (wert2 ** ???)"
- Verwende GENERISCHE Namen, nicht die echten Variablen
- Lass WICHTIGE Teile als ??? offen

**Level 5+ (Help Request #5+):**
- NUR JETZT darfst du die komplette Lösung geben
- Zeige den vollständigen Code mit echten Variablennamen
- Erkläre jeden Schritt ausführlich
- Student hat 5+ mal gefragt, verdient jetzt die Lösung

🚨 **ABSOLUTE VERBOTE (Level 1-4):**
- ❌ NIEMALS kompletten Code der die Aufgabe löst
- ❌ NIEMALS alle Variablennamen in richtiger Reihenfolge
- ❌ NIEMALS die genaue Formel mit echten Variablen
- ❌ NIEMALS Code der nur noch copy-paste ist
- ❌ Wenn Student "Sag mir die Lösung" fragt → Ablehnen bis Level 5!

✅ **ERLAUBT (Level 1-4):**
- ✅ Fragen stellen
- ✅ Konzepte erklären (was ist eine Variable?)
- ✅ Syntax erklären (wie funktioniert **?)
- ✅ Hinweise auf Fehler im Code
- ✅ Motivation und Ermutigung

⚠️ **DENK DRAN:**
- Du hilfst beim LERNEN, nicht beim schnellen Fertigwerden
- Je länger Student selbst probiert, desto mehr lernt er
- Sei geduldig und unterstützend, aber GIB NICHT DIE LÖSUNG
- Bei Level 1-4: Student soll selbst denken und coden!

🚫 **VERBOTEN:**
- **KEINE LaTeX-Formeln** (keine eckigen Klammern oder Dollar-Zeichen Syntax)
- **KEINE mathematischen Sonderzeichen** außer: +, -, *, /, ** (für Potenz), ², ³

✅ **FORMELN RICHTIG SCHREIBEN:**
- Als **Unicode Plain Text**: "BMI = Gewicht / Größe²"
- Oder als **Python Code Block** (verwende codeblock type):
  { "type": "codeblock", "content": "bmi = weight / (height ** 2)", "language": "python" }
- Zeige immer die **Python-Syntax**, nicht mathematische Notation!

📝 **OUTPUT-FORMAT - KRITISCH:**
Du MUSST strukturierte JSON-Antworten liefern!

**PFLICHT-NUTZUNG:**
1. **Code-Beispiele** → IMMER als "codeblock" type (NIEMALS als Plain Text!)
2. **Wichtige Hinweise/Tipps** → Als "admonition" mit passendem type (info, warning, success, note)
3. **Normaler Text** → Als "text" type

**JSON-Struktur:**
- TEXT: { "type": "text", "content": "dein text", "title": null, "admonition_type": null, "language": null }
- ADMONITION: { "type": "admonition", "content": "wichtiger hinweis", "title": "Tipp", "admonition_type": "info", "language": null }
- CODEBLOCK: { "type": "codeblock", "content": "print('hello')", "title": null, "admonition_type": null, "language": "python" }

**BEISPIEL einer guten Antwort:**
[
  { "type": "text", "content": "Hier ist ein Beispiel für Concatenation:", ... },
  { "type": "codeblock", "content": "name = 'Max'\\ngruß = 'Hallo ' + name", "language": "python", ... },
  { "type": "admonition", "content": "F-Strings sind moderner!", "title": "Pro-Tipp", "admonition_type": "info", ... }
]

**VERBOTEN:**
❌ Code als normalen Text schreiben (ohne codeblock type)
❌ Markdown Code-Blöcke (\`\`\`python) - nutze stattdessen den codeblock type!
❌ Wichtige Tipps ohne admonition

Antworte auf Deutsch und sei präzise, lehrreich und motivierend!`;

/**
 * Generiert den Sprachhinweis für die KI basierend auf der Locale
 */
function getLanguageInstruction(locale: string): string {
  if (locale === "en") {
    return `**LANGUAGE INSTRUCTION:** You MUST respond in English. All explanations, code comments, hints, feedback, and UI text should be in English. Even if the user writes in German, respond in English unless they explicitly request German. The system instructions below are in German, but YOU MUST RESPOND IN ENGLISH.\n\n`;
  }
  return ""; // Default: German (no additional instruction needed, prompts are already in German)
}

/**
 * Haupt-Chat-Funktion für den Chatbot
 */
export async function chatBotResponseAction({
  prompt,
  previous_response_id,
  courseContext,
  username,
  locale = "de",
}: {
  prompt: string;
  previous_response_id?: string;
  courseContext?: CourseContextType;
  username?: string;
  locale?: string;
}): Promise<ChatResponse> {
  // Build language instruction based on locale
  const languageInstruction = getLanguageInstruction(locale);

  // Build user context section (always included if username is provided)
  const userContextSection = username
    ? `=== 👤 NUTZER-KONTEXT ===\nName: ${username}\n=== ENDE NUTZER-KONTEXT ===\n\n`
    : "";

  const courseContextSection = courseContext ? formatCourseContext(courseContext) : "";
  const fullPrompt = `${userContextSection}${courseContextSection}**Student Frage:**\n${prompt}`;

  // Prepend language instruction to the system instructions
  const instructions = languageInstruction + CHATBOT_INSTRUCTIONS;

  const BASE_CONFIG = {
    model: OPENAI_MODEL,
    instructions,
    input: fullPrompt,
    text: {
      format: {
        type: "json_schema",
        name: "structured_response",
        strict: true,
        schema: {
          type: "object",
          properties: {
            content: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["text", "admonition", "codeblock"] },
                  content: { type: "string" },
                  title: { type: ["string", "null"] },
                  admonition_type: { type: ["string", "null"], enum: ["info", "warning", "error", "success", "note", null] },
                  language: { type: ["string", "null"], enum: ["python", null] }
                },
                required: ["type", "content", "title", "admonition_type", "language"],
                additionalProperties: false
              }
            }
          },
          required: ["content"],
          additionalProperties: false
        }
      }
    },
  } as const;

  const response = previous_response_id
    ? await openai.responses.parse({ ...BASE_CONFIG, previous_response_id })
    : await openai.responses.parse(BASE_CONFIG);

  let extractedStructured: StructuredResponse | undefined;
  try {
    extractedStructured = extractStructuredData(response);
  } catch {
    // Extraction failed, continue without structured data
  }

  const fallbackMessage = locale === "en"
    ? "Sorry, I couldn't generate a response."
    : "Entschuldigung, ich konnte keine Antwort generieren.";

  return {
    message: response.output_text || fallbackMessage,
    structured: extractedStructured || undefined,
    chatId: response.id,
    usage: response.usage ? {
      prompt_tokens: response.usage.input_tokens,
      completion_tokens: response.usage.output_tokens,
      total_tokens: response.usage.total_tokens
    } : undefined,
  };
}
