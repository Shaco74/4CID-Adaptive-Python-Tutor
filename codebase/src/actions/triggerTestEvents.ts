/**
 * Test Event Generator V2 - Event-Sourcing Version
 *
 * Simuliert eine realistische User-Journey:
 * - User meldet sich an (1 Session)
 * - Macht BMI Calculator Kurs komplett durch
 * - Dann Interest Calculator Kurs komplett durch
 * - Jeden Step nur EINMAL
 * - 1-2 Code Executions pro Step
 * - Help Requests nur manchmal (nicht bei jedem Step)
 */

"use server";

import {
  startSession,
  endSession,
  logCourseAccess,
  logStepStart,
  logStepComplete,
  logHelpRequest,
  logCodeExecution,
  logChapterComplete,
} from "../db/eventTracking";

interface TestEventSummary {
  success: boolean;
  message: string;
  summary?: {
    sessions: number;
    courses: number;
    stepsCompleted: number;
    helpRequests: number;
    codeExecutions: number;
  };
}

/**
 * Generiert realistische Test-Events für einen User
 * Simuliert: 1 Session, 2 Kurse komplett (BMI + Interest Calculator)
 */
export async function triggerTestEvents(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _verbose: boolean = false
): Promise<TestEventSummary> {
  try {
    // // console.log(`\n🚀 Generating test events for user: ${userId}`);
    // // console.log("📋 Simulating: 1 Session, 2 Complete Courses\n");

    let totalSteps = 0;
    let totalHelpRequests = 0;
    let totalCodeExecutions = 0;

    // ========================================================================
    // SESSION START: User meldet sich an
    // ========================================================================
    // // console.log("🔐 User logs in...");
    await startSession(userId);

    // ========================================================================
    // KURS 1: BMI CALCULATOR (8 Steps)
    // ========================================================================
    // // console.log("\n📚 Course 1: BMI Calculator");
    await logCourseAccess(userId, "bmi-calculator", true);

    // Step 1: Print Basics
    // // console.log("  📝 Step 1: Print Basics");
    await logStepStart(userId, "bmi-calculator", "1", 1, "Print Basics");
    await logCodeExecution(userId, "bmi-calculator", "1", 1, 'print("Hello")', true);
    totalCodeExecutions++;
    await logStepComplete(userId, "bmi-calculator", "1", 1, 120, 0, 0, 1, 'print("BMI Calculator")');
    totalSteps++;

    // Step 2: Variables
    // // console.log("  📝 Step 2: Variables");
    await logStepStart(userId, "bmi-calculator", "2", 2, "Variables");
    await logCodeExecution(userId, "bmi-calculator", "2", 2, "name = John", false, "SyntaxError: name 'John' is not defined");
    await logCodeExecution(userId, "bmi-calculator", "2", 2, 'name = "John"', true);
    totalCodeExecutions += 2;
    await logHelpRequest(
      userId,
      "bmi-calculator",
      "2",
      2,
      1,
      2,
      "Warum brauche ich Anführungszeichen?",
      "Strings müssen in Anführungszeichen stehen: 'text' oder \"text\"",
      "resp-bmi-2-1"
    );
    totalHelpRequests++;
    await logStepComplete(userId, "bmi-calculator", "2", 2, 180, 1, 2, 2, 'name = "Max"\nprint(name)');
    totalSteps++;

    // Step 3: User Input
    // // console.log("  📝 Step 3: User Input");
    await logStepStart(userId, "bmi-calculator", "3", 3, "User Input");
    await logCodeExecution(userId, "bmi-calculator", "3", 3, "name = input('Name: ')", true);
    totalCodeExecutions++;
    await logStepComplete(userId, "bmi-calculator", "3", 3, 150, 0, 0, 1, "name = input('Name: ')\nprint(name)");
    totalSteps++;

    // Step 4: Calculations
    // // console.log("  📝 Step 4: Calculations");
    await logStepStart(userId, "bmi-calculator", "4", 4, "Calculations");
    await logCodeExecution(userId, "bmi-calculator", "4", 4, "bmi = 70 / 1.75", true);
    await logCodeExecution(userId, "bmi-calculator", "4", 4, "bmi = weight / (height ** 2)", true);
    totalCodeExecutions += 2;
    await logHelpRequest(
      userId,
      "bmi-calculator",
      "4",
      4,
      1,
      3,
      "Wie rechne ich BMI aus?",
      "BMI = gewicht / (größe ** 2). Beispiel: 70 / (1.75 ** 2)",
      "resp-bmi-4-1"
    );
    totalHelpRequests++;
    await logStepComplete(userId, "bmi-calculator", "4", 4, 240, 1, 3, 2, "weight = 70\nheight = 1.75\nbmi = weight / (height ** 2)");
    totalSteps++;

    // Step 5: Type Conversion
    // // console.log("  📝 Step 5: Type Conversion");
    await logStepStart(userId, "bmi-calculator", "5", 5, "Type Conversion");
    await logCodeExecution(userId, "bmi-calculator", "5", 5, "weight = float(input('Gewicht: '))", true);
    totalCodeExecutions++;
    await logStepComplete(userId, "bmi-calculator", "5", 5, 200, 0, 0, 1, "weight = float(input('Gewicht: '))\nheight = float(input('Größe: '))");
    totalSteps++;

    // Step 6: Conditionals
    // // console.log("  📝 Step 6: Conditionals (If/Else)");
    await logStepStart(userId, "bmi-calculator", "6", 6, "If/Else");
    await logCodeExecution(userId, "bmi-calculator", "6", 6, "if bmi < 18.5:\n  print('Untergewicht')", true);
    await logCodeExecution(userId, "bmi-calculator", "6", 6, "if bmi < 18.5:\n  print('Untergewicht')\nelse:\n  print('Normal')", true);
    totalCodeExecutions += 2;
    await logHelpRequest(
      userId,
      "bmi-calculator",
      "6",
      6,
      1,
      4,
      "Wie funktioniert elif?",
      "elif prüft weitere Bedingungen: if x < 10: ... elif x < 20: ... else: ...",
      "resp-bmi-6-1"
    );
    totalHelpRequests++;
    await logStepComplete(
      userId,
      "bmi-calculator",
      "6",
      6,
      300,
      1,
      4,
      2,
      "if bmi < 18.5:\n  print('Untergewicht')\nelif bmi < 25:\n  print('Normal')\nelse:\n  print('Übergewicht')"
    );
    totalSteps++;

    // Step 7: For Loops
    // // console.log("  📝 Step 7: For Loops");
    await logStepStart(userId, "bmi-calculator", "7", 7, "For Loops");
    await logCodeExecution(userId, "bmi-calculator", "7", 7, "for i in range(3):\n  print(i)", true);
    totalCodeExecutions++;
    await logStepComplete(userId, "bmi-calculator", "7", 7, 180, 0, 0, 1, "for i in range(3):\n  print(f'Versuch {i+1}')");
    totalSteps++;

    // Step 8: While Loops
    // // console.log("  📝 Step 8: While Loops");
    await logStepStart(userId, "bmi-calculator", "8", 8, "While Loops");
    await logCodeExecution(userId, "bmi-calculator", "8", 8, "count = 0\nwhile count < 3:\n  print(count)\n  count += 1", true);
    totalCodeExecutions++;
    await logHelpRequest(
      userId,
      "bmi-calculator",
      "8",
      8,
      1,
      2,
      "Wann while statt for?",
      "while: Wenn Anzahl unbekannt (z.B. bis User 'quit' eingibt). for: Anzahl bekannt.",
      "resp-bmi-8-1"
    );
    totalHelpRequests++;
    await logStepComplete(
      userId,
      "bmi-calculator",
      "8",
      8,
      220,
      1,
      2,
      1,
      "valid = False\nwhile not valid:\n  bmi = float(input('BMI: '))\n  if bmi > 0:\n    valid = True"
    );
    totalSteps++;

    // BMI Kurs abgeschlossen
    await logChapterComplete(userId, "bmi-calculator", "chapter-1", 1590, 4, 2.75);
    // // console.log("  ✅ BMI Calculator completed!");

    // ========================================================================
    // KURS 2: INTEREST CALCULATOR (4 Steps)
    // ========================================================================
    // // console.log("\n📚 Course 2: Interest Calculator");
    await logCourseAccess(userId, "interest-calculator", true);

    // Step 1: Lists Basics
    // // console.log("  📝 Step 1: Lists Basics");
    await logStepStart(userId, "interest-calculator", "1", 1, "Lists Basics");
    await logCodeExecution(userId, "interest-calculator", "1", 1, "amounts = [100, 200, 300]", true);
    await logCodeExecution(userId, "interest-calculator", "1", 1, "print(amounts[0])", true);
    totalCodeExecutions += 2;
    await logHelpRequest(
      userId,
      "interest-calculator",
      "1",
      1,
      1,
      2,
      "Fangen Listen bei 0 oder 1 an?",
      "Listen starten bei Index 0. [10, 20, 30] -> Index 0:10, 1:20, 2:30",
      "resp-int-1-1"
    );
    totalHelpRequests++;
    await logStepComplete(
      userId,
      "interest-calculator",
      "1",
      1,
      200,
      1,
      2,
      2,
      "amounts = [1000, 1500, 2000]\nprint(amounts[0])"
    );
    totalSteps++;

    // Step 2: List Methods
    // // console.log("  📝 Step 2: List Methods");
    await logStepStart(userId, "interest-calculator", "2", 2, "List Methods");
    await logCodeExecution(userId, "interest-calculator", "2", 2, "amounts.append(1000)", true);
    totalCodeExecutions++;
    await logStepComplete(
      userId,
      "interest-calculator",
      "2",
      2,
      180,
      0,
      0,
      1,
      "amounts = []\namounts.append(1000)\namounts.append(1500)"
    );
    totalSteps++;

    // Step 3: For Loop with Lists
    // // console.log("  📝 Step 3: For Loop with Lists");
    await logStepStart(userId, "interest-calculator", "3", 3, "For Loop with Lists");
    await logCodeExecution(
      userId,
      "interest-calculator",
      "3",
      3,
      "for amount in amounts:\n  print(amount)",
      true
    );
    totalCodeExecutions++;
    await logStepComplete(
      userId,
      "interest-calculator",
      "3",
      3,
      160,
      0,
      0,
      1,
      "for amount in amounts:\n  interest = amount * 0.03\n  print(interest)"
    );
    totalSteps++;

    // Step 4: Interest Calculation
    // // console.log("  📝 Step 4: Interest Calculation");
    await logStepStart(userId, "interest-calculator", "4", 4, "Interest Calculation");
    await logCodeExecution(
      userId,
      "interest-calculator",
      "4",
      4,
      "for amount in amounts:\n  interest = amount * 0.03\n  total = amount + interest\n  print(total)",
      true
    );
    totalCodeExecutions++;
    await logHelpRequest(
      userId,
      "interest-calculator",
      "4",
      4,
      1,
      3,
      "Wie rechne ich Zinsen?",
      "Zinsen = Betrag * Zinssatz. Gesamtbetrag = Betrag + Zinsen",
      "resp-int-4-1"
    );
    totalHelpRequests++;
    await logStepComplete(
      userId,
      "interest-calculator",
      "4",
      4,
      250,
      1,
      3,
      1,
      "rate = 0.03\nfor amount in amounts:\n  interest = amount * rate\n  total = amount + interest\n  print(f'{amount} -> {total}')"
    );
    totalSteps++;

    // Interest Calculator Kurs abgeschlossen
    await logChapterComplete(userId, "interest-calculator", "chapter-1", 790, 2, 2.5);
    // // console.log("  ✅ Interest Calculator completed!");

    // ========================================================================
    // SESSION END: User beendet die Lern-Session
    // ========================================================================
    // // console.log("\n🏁 User completes learning session");
    await endSession(userId);

    // ========================================================================
    // SUMMARY
    // ========================================================================

    const summary = {
      sessions: 1,
      courses: 2,
      stepsCompleted: totalSteps,
      helpRequests: totalHelpRequests,
      codeExecutions: totalCodeExecutions,
    };

    // // console.log("\n✅ Test events generated successfully!");
    // // console.log("📊 Summary:");
    // // console.log(`   - Sessions: ${summary.sessions}`);
    // // console.log(`   - Courses Completed: ${summary.courses}`);
    // // console.log(`   - Steps Completed: ${summary.stepsCompleted}`);
    // // console.log(`   - Help Requests: ${summary.helpRequests}`);
    // // console.log(`   - Code Executions: ${summary.codeExecutions}`);

    return {
      success: true,
      message: "Test events generated successfully",
      summary,
    };
  } catch (error) {
    console.error("❌ Error generating test events:", error);
    return {
      success: false,
      message: `Error: ${error}`,
    };
  }
}
