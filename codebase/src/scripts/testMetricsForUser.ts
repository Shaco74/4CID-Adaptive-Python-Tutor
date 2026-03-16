/**
 * Test-Script: Trigger alle Metrics-Events für einen User
 *
 * Zweck: Testet das komplette Metrics-System mit realistischen Daten
 * Usage: Von Browser Console oder als Server Action aufrufen
 */

import { saveHelpRequest, markStepCompleted } from "@/db/helpRequestTracking";
import { completeStep, updateLastAccessed, addNote } from "@/db/models/userProgress";

/**
 * Generiert Test-Events für einen User
 * Simuliert realistische Lern-Journey
 */
export async function generateTestEventsForUser(userId: string) {
  // // console.log(`🧪 Generating test events for user: ${userId}`);

  try {
    // === BMI Calculator Course ===
    const courseId = "bmi-calculator";

    // Step 1: print() Basics
    // // console.log("📍 Step 1: print() basics");
    await updateLastAccessed(userId, courseId);
    await new Promise(resolve => setTimeout(resolve, 500));

    // User asks for help (Level 1 - Verständnisfrage)
    await saveHelpRequest(userId, courseId, 1, {
      hintLevel: 1,
      userMessage: "Was macht print() genau?",
      aiResponse: "print() ist eine Funktion, die Text in der Konsole ausgibt. Was möchtest du darüber wissen?",
      aiResponseId: "test-resp-001",
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // User completes step 1
    await completeStep(userId, courseId, 1);
    await markStepCompleted(userId, courseId, 1);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Variables
    // // console.log("📍 Step 2: Variables");
    await updateLastAccessed(userId, courseId);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Multiple help requests (escalating hint levels)
    await saveHelpRequest(userId, courseId, 2, {
      hintLevel: 1,
      userMessage: "Wie erstelle ich eine Variable?",
      aiResponse: "Variablen speichern Werte. Denk an einen Behälter mit einem Namen. Was möchtest du speichern?",
      aiResponseId: "test-resp-002",
    });
    await new Promise(resolve => setTimeout(resolve, 1500));

    await saveHelpRequest(userId, courseId, 2, {
      hintLevel: 2,
      userMessage: "Ich verstehe es nicht, zeig mir ein Beispiel",
      aiResponse: "In Python weist du Werte so zu: name = wert. Überlege, welchen Namen und Wert du brauchst.",
      aiResponseId: "test-resp-003",
    });
    await new Promise(resolve => setTimeout(resolve, 1500));

    await saveHelpRequest(userId, courseId, 2, {
      hintLevel: 3,
      userMessage: "Ich komme immer noch nicht weiter",
      aiResponse: "Hier ein allgemeines Beispiel:\n\nalter = 25\nname = 'Max'\n\nDie Syntax ist: variablenname = wert",
      aiResponseId: "test-resp-004",
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // User completes step 2
    await completeStep(userId, courseId, 2);
    await markStepCompleted(userId, courseId, 2);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: BMI Calculation
    // // console.log("📍 Step 3: BMI Calculation");
    await updateLastAccessed(userId, courseId);
    await new Promise(resolve => setTimeout(resolve, 2000));

    await saveHelpRequest(userId, courseId, 3, {
      hintLevel: 1,
      userMessage: "Wie berechne ich den BMI?",
      aiResponse: "BMI ist eine mathematische Formel. Kennst du die Formel schon?",
      aiResponseId: "test-resp-005",
    });
    await new Promise(resolve => setTimeout(resolve, 1500));

    await saveHelpRequest(userId, courseId, 3, {
      hintLevel: 2,
      userMessage: "Nein, welche Formel?",
      aiResponse: "BMI = Gewicht geteilt durch (Größe mal Größe). In Python nutzt du / für Division und * für Multiplikation.",
      aiResponseId: "test-resp-006",
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await completeStep(userId, courseId, 3);
    await markStepCompleted(userId, courseId, 3);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // === Interest Calculator Course ===
    const interestCourseId = "interest-calculator";

    // // console.log("📍 Interest Calculator - Step 1");
    await updateLastAccessed(userId, interestCourseId);
    await new Promise(resolve => setTimeout(resolve, 1500));

    await saveHelpRequest(userId, interestCourseId, 1, {
      hintLevel: 1,
      userMessage: "Was sind f-Strings?",
      aiResponse: "f-Strings sind eine moderne Art, Variablen in Text einzufügen. Hast du schon die alte Methode mit + gelernt?",
      aiResponseId: "test-resp-007",
    });
    await new Promise(resolve => setTimeout(resolve, 1500));

    await completeStep(userId, interestCourseId, 1);
    await markStepCompleted(userId, interestCourseId, 1);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // // console.log("📍 Interest Calculator - Step 2: For-Loops");
    await updateLastAccessed(userId, interestCourseId);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Struggling with loops (multiple requests)
    await saveHelpRequest(userId, interestCourseId, 2, {
      hintLevel: 1,
      userMessage: "Wie funktionieren for-Schleifen?",
      aiResponse: "Schleifen wiederholen Code automatisch. Warum ist das nützlich für Zinsberechnung?",
      aiResponseId: "test-resp-008",
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    await saveHelpRequest(userId, interestCourseId, 2, {
      hintLevel: 2,
      userMessage: "Um den Code mehrmals auszuführen?",
      aiResponse: "Genau! In Python nutzt du: for variable in range(anzahl). Was möchtest du wiederholen?",
      aiResponseId: "test-resp-009",
    });
    await new Promise(resolve => setTimeout(resolve, 1500));

    await saveHelpRequest(userId, interestCourseId, 2, {
      hintLevel: 3,
      userMessage: "Zeig mir bitte ein Beispiel",
      aiResponse: "Allgemeines Beispiel:\n\nfor i in range(5):\n    print(i)\n\nDas gibt 0, 1, 2, 3, 4 aus. Wie viele Jahre willst du berechnen?",
      aiResponseId: "test-resp-010",
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await saveHelpRequest(userId, interestCourseId, 2, {
      hintLevel: 4,
      userMessage: "Ich verstehe es immer noch nicht",
      aiResponse: "Hier eine Struktur für dich:\n\nfor jahr in range(1, anzahl_jahre + 1):\n    betrag = betrag * (1 + zinssatz/100)\n    # Dein Code hier\n\nFülle die Lücken aus mit deinen Variablen.",
      aiResponseId: "test-resp-011",
    });
    await new Promise(resolve => setTimeout(resolve, 3000));

    await completeStep(userId, interestCourseId, 2);
    await markStepCompleted(userId, interestCourseId, 2);

    // === Add Notes ===
    // // console.log("📝 Adding notes");
    await addNote(userId, "for-Schleifen sind schwierig, aber ich habe es geschafft!");
    await new Promise(resolve => setTimeout(resolve, 500));
    await addNote(userId, "BMI-Formel: weight / (height * height)");
    await new Promise(resolve => setTimeout(resolve, 500));
    await addNote(userId, "f-Strings sind besser als str() + '+'");

    // // console.log("✅ All test events generated successfully!");
    // // console.log("\n📊 Summary:");
    // // console.log("- BMI Calculator: 3 steps completed");
    // // console.log("- Interest Calculator: 2 steps completed");
    // // console.log("- Help Requests: 11 total");
    // // console.log("- Notes: 3 added");
    // // console.log("- Hint Levels: 1-4 demonstrated");

    return {
      success: true,
      summary: {
        coursesAccessed: 2,
        stepsCompleted: 5,
        helpRequests: 11,
        notesAdded: 3,
        avgHintLevel: 2.2,
      }
    };

  } catch (error) {
    console.error("❌ Error generating test events:", error);
    throw error;
  }
}

/**
 * Test mit verschiedenen Szenarien
 */
export async function generateAdvancedTestScenarios(userId: string) {
  // // console.log(`🧪 Advanced test scenarios for: ${userId}`);

  // Scenario 1: User gibt schnell auf (Level 5 Request)
  await saveHelpRequest(userId, "bmi-calculator", 10, {
    hintLevel: 5,
    userMessage: "Ich gebe auf, zeig mir die komplette Lösung",
    aiResponse: "Nach 5 Versuchen bekommst du die Lösung:\n\nweight = 77\nheight = 1.79\nbmi = weight / (height * height)\nprint(f'Dein BMI: {bmi}')",
    aiResponseId: "test-resp-level5",
  });

  // Scenario 2: User schafft es ohne Hilfe
  await updateLastAccessed(userId, "bmi-calculator");
  await completeStep(userId, "bmi-calculator", 11);
  await markStepCompleted(userId, "bmi-calculator", 11);

  // Scenario 3: Viele kleine Help Requests
  for (let i = 0; i < 5; i++) {
    await saveHelpRequest(userId, "bmi-calculator", 12, {
      hintLevel: Math.min(i + 1, 5),
      userMessage: `Help request #${i + 1}`,
      aiResponse: `Response for level ${Math.min(i + 1, 5)}`,
      aiResponseId: `test-resp-multi-${i}`,
    });
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // // console.log("✅ Advanced scenarios generated!");
}
