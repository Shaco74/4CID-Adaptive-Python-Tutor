/**
 * Migration Script: Legacy Data -> Event-Sourcing
 *
 * Konvertiert bestehende User-Daten von redundanter Struktur zu Event-Sourcing.
 *
 * ALT:
 *   users/{userId}/courses/{courseId}
 *     - completedSteps: [1, 2, 3]
 *     - steps/{stepId}
 *       - helpRequests: []
 *       - completedAt: Timestamp
 *
 * NEU:
 *   users/{userId}/events/{eventId}
 *     - type, timestamp, sessionId, courseId, stepId, data
 *
 * Usage:
 *   node --loader ts-node/esm src/scripts/migrateToEventSourcing.ts <userId>
 */

import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

import {
  logEvent,
  startSession,
  endSession,
} from "../db/eventTracking";

import type {
  CourseAccessEvent,
  StepCompleteEvent,
  HelpRequestEvent,
  NoteAddedEvent,
} from "@/types/eventTypes";

interface MigrationStats {
  userId: string;
  coursesProcessed: number;
  stepsProcessed: number;
  helpRequestsProcessed: number;
  notesProcessed: number;
  eventsCreated: number;
  errors: string[];
}

/**
 * Migriert einen einzelnen User zu Event-Sourcing
 */
export async function migrateUserToEventSourcing(
  userId: string,
  dryRun: boolean = false
): Promise<MigrationStats> {
  // // console.log(`\n🔄 Starting migration for user: ${userId}`);
  // // console.log(`📋 Mode: ${dryRun ? "DRY RUN" : "LIVE MIGRATION"}`);

  const stats: MigrationStats = {
    userId,
    coursesProcessed: 0,
    stepsProcessed: 0,
    helpRequestsProcessed: 0,
    notesProcessed: 0,
    eventsCreated: 0,
    errors: [],
  };

  try {
    // 1. Migrate User Notes
    await migrateUserNotes(userId, stats, dryRun);

    // 2. Migrate Courses and Steps
    await migrateCoursesAndSteps(userId, stats, dryRun);

    // // console.log("\n✅ Migration completed successfully!");
    // // console.log(`📊 Stats:`, stats);

    return stats;
  } catch (error) {
    console.error("❌ Migration failed:", error);
    stats.errors.push(`Fatal error: ${error}`);
    throw error;
  }
}

/**
 * Migriert User-Notes zu note_added Events
 */
async function migrateUserNotes(
  userId: string,
  stats: MigrationStats,
  dryRun: boolean
): Promise<void> {
  // // console.log("\n📝 Migrating user notes...");

  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // // console.log("⚠️  User document not found");
      return;
    }

    const userData = userDoc.data();
    const notes = userData.notes || [];

    if (notes.length === 0) {
      // // console.log("ℹ️  No notes to migrate");
      return;
    }

    // Create synthetic session for notes
    const sessionId = dryRun
      ? "migration-session-notes"
      : await startSession(userId);

    for (const [index, note] of notes.entries()) {
      if (!dryRun) {
        const event: Omit<NoteAddedEvent, "id"> = {
          userId,
          timestamp: userData.updatedAt || Timestamp.now(),
          sessionId,
          type: "note_added",
          data: {
            note,
            noteLength: note.length,
          },
        };

        await logEvent(event);
        stats.eventsCreated++;
      }

      stats.notesProcessed++;
      // // console.log(`  ✓ Note ${index + 1}/${notes.length}`);
    }

    if (!dryRun) {
      await endSession(userId);
    }

    // // console.log(`✅ Migrated ${notes.length} notes`);
  } catch (error) {
    console.error("❌ Error migrating notes:", error);
    stats.errors.push(`Notes migration error: ${error}`);
  }
}

/**
 * Migriert Courses und Steps zu Events
 */
async function migrateCoursesAndSteps(
  userId: string,
  stats: MigrationStats,
  dryRun: boolean
): Promise<void> {
  // // console.log("\n📚 Migrating courses and steps...");

  try {
    const coursesRef = collection(db, "users", userId, "courses");
    const coursesSnap = await getDocs(coursesRef);

    if (coursesSnap.empty) {
      // // console.log("ℹ️  No courses to migrate");
      return;
    }

    for (const courseDoc of coursesSnap.docs) {
      const courseId = courseDoc.id;
      const courseData = courseDoc.data();

      // // console.log(`\n  📖 Processing course: ${courseId}`);

      // Create synthetic session for this course
      const sessionId = dryRun
        ? `migration-session-${courseId}`
        : await startSession(userId);

      // 1. Create course_access event
      if (!dryRun) {
        const courseAccessEvent: Omit<CourseAccessEvent, "id"> = {
          userId,
          timestamp: courseData.updatedAt || Timestamp.now(),
          sessionId,
          type: "course_access",
          courseId,
          data: {
            isFirstAccess: true,
            previousProgress: 0,
          },
        };

        await logEvent(courseAccessEvent);
        stats.eventsCreated++;
      }

      // 2. Process all steps in this course
      const stepsRef = collection(db, "users", userId, "courses", courseId, "steps");
      const stepsSnap = await getDocs(stepsRef);

      // Sort steps by ID (step number)
      const sortedSteps = stepsSnap.docs.sort((a, b) => {
        const aNum = parseInt(a.id);
        const bNum = parseInt(b.id);
        return aNum - bNum;
      });

      for (const stepDoc of sortedSteps) {
        const stepId = stepDoc.id;
        const stepData = stepDoc.data();
        const stepNumber = parseInt(stepId);

        // // console.log(`    ⚙️  Processing step ${stepNumber}...`);

        // 2a. Migrate help requests for this step
        if (stepData.helpRequests && Array.isArray(stepData.helpRequests)) {
          for (const [index, request] of stepData.helpRequests.entries()) {
            if (!dryRun) {
              const requestTimestamp = request.timestamp?.seconds
                ? Timestamp.fromMillis(request.timestamp.seconds * 1000)
                : Timestamp.now();

              const helpRequestEvent: Omit<HelpRequestEvent, "id"> = {
                userId,
                timestamp: requestTimestamp,
                sessionId,
                type: "help_request",
                courseId,
                stepId,
                data: {
                  stepNumber,
                  requestNumber: request.requestNumber || index + 1,
                  hintLevel: request.hintLevel,
                  userMessage: request.userMessage,
                  aiResponse: request.aiResponse,
                  aiResponseId: request.aiResponseId || `migrated-${index}`,
                },
              };

              await logEvent(helpRequestEvent);
              stats.eventsCreated++;
            }

            stats.helpRequestsProcessed++;
          }
        }

        // 2b. Migrate step completion
        if (stepData.completedAt) {
          if (!dryRun) {
            const completedTimestamp = stepData.completedAt?.seconds
              ? Timestamp.fromMillis(stepData.completedAt.seconds * 1000)
              : Timestamp.now();

            const stepCompleteEvent: Omit<StepCompleteEvent, "id"> = {
              userId,
              timestamp: completedTimestamp,
              sessionId,
              type: "step_complete",
              courseId,
              stepId,
              data: {
                stepNumber,
                durationSeconds: stepData.durationSeconds || 0,
                totalHelpRequests: stepData.totalHelpRequests || 0,
                averageHintLevel: stepData.averageHintLevel || 0,
                codeExecutions: stepData.codeExecutions || 0,
                finalCode: stepData.finalCode || "",
                isRetry: false, // Migrated data - unknown if retry
              },
            };

            await logEvent(stepCompleteEvent);
            stats.eventsCreated++;
          }

          stats.stepsProcessed++;
        }

        // console.log(
        //   `      ✓ Step ${stepNumber}: ${stepData.helpRequests?.length || 0} help requests, ${stepData.completedAt ? "completed" : "not completed"}`
        // );
      }

      if (!dryRun) {
        await endSession(userId);
      }

      stats.coursesProcessed++;
      // // console.log(`  ✅ Course ${courseId} migrated`);
    }

    // // console.log(`\n✅ Migrated ${stats.coursesProcessed} courses`);
  } catch (error) {
    console.error("❌ Error migrating courses:", error);
    stats.errors.push(`Courses migration error: ${error}`);
  }
}

/**
 * Migriert alle User in der Datenbank
 */
export async function migrateAllUsers(dryRun: boolean = false): Promise<void> {
  // // console.log("\n🚀 Starting batch migration for all users...\n");

  try {
    const usersRef = collection(db, "users");
    const usersSnap = await getDocs(usersRef);

    // // console.log(`📊 Found ${usersSnap.size} users to migrate\n`);

    const allStats: MigrationStats[] = [];

    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;

      try {
        const stats = await migrateUserToEventSourcing(userId, dryRun);
        allStats.push(stats);
      } catch (error) {
        console.error(`❌ Failed to migrate user ${userId}:`, error);
      }

      // // console.log("\n" + "=".repeat(80) + "\n");
    }

    // Print summary
    // // console.log("\n📊 MIGRATION SUMMARY");
    // // console.log("=".repeat(80));

    const totals = allStats.reduce(
      (acc, stats) => ({
        users: acc.users + 1,
        courses: acc.courses + stats.coursesProcessed,
        steps: acc.steps + stats.stepsProcessed,
        helpRequests: acc.helpRequests + stats.helpRequestsProcessed,
        notes: acc.notes + stats.notesProcessed,
        events: acc.events + stats.eventsCreated,
        errors: acc.errors + stats.errors.length,
      }),
      { users: 0, courses: 0, steps: 0, helpRequests: 0, notes: 0, events: 0, errors: 0 }
    );

    // // console.log(`Users migrated:         ${totals.users}`);
    // // console.log(`Courses processed:      ${totals.courses}`);
    // // console.log(`Steps processed:        ${totals.steps}`);
    // // console.log(`Help requests:          ${totals.helpRequests}`);
    // // console.log(`Notes:                  ${totals.notes}`);
    // // console.log(`Total events created:   ${totals.events}`);
    // // console.log(`Errors:                 ${totals.errors}`);

    if (totals.errors > 0) {
      // // console.log("\n⚠️  Some errors occurred during migration:");
      allStats.forEach((stats) => {
        if (stats.errors.length > 0) {
          // // console.log(`  ${stats.userId}:`, stats.errors);
        }
      });
    }
  } catch (error) {
    console.error("❌ Batch migration failed:", error);
    throw error;
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

if (require.main === module) {
  const args = process.argv.slice(2);
  const userId = args[0];
  const dryRun = args.includes("--dry-run");

  if (!userId) {
    // // console.log("\n📖 Usage:");
    // // console.log("  Migrate single user:");
    // // console.log("    ts-node migrateToEventSourcing.ts <userId> [--dry-run]");
    // // console.log("\n  Migrate all users:");
    // // console.log("    ts-node migrateToEventSourcing.ts --all [--dry-run]");
    process.exit(1);
  }

  if (userId === "--all") {
    migrateAllUsers(dryRun)
      .then(() => {
        // // console.log("\n✅ All migrations completed!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("\n❌ Migration failed:", error);
        process.exit(1);
      });
  } else {
    migrateUserToEventSourcing(userId, dryRun)
      .then(() => {
        // // console.log("\n✅ Migration completed!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("\n❌ Migration failed:", error);
        process.exit(1);
      });
  }
}
