"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getUserMetrics } from "./getUserMetrics";
import { getAllEvaluations } from "./getEvaluations";

/**
 * Liefert eine CSV-Zeichenkette mit aggregierten Kennzahlen über alle Nutzer.
 *
 * - Gesamtzahl Nutzer
 * - Anzahl ausgefüllter Evaluationen
 * - Durchschnittliche Kurszeit (aller evaluierten Nutzer)
 * - Anzahl Nutzer ohne Evaluation, aber mit >=2 Schritten
 * - Anzahl Nutzer ohne Schritte
 * - Durchschnittliche Hilfegesuche pro Nutzer
 * - Durchschnittliche Sessions pro Nutzer
 * - Durchschnittliche abgeschlossene Schritte pro Nutzer
 *
 * Das CSV hat zwei Spalten: metric,value und kann in der Admin-Seite zum Export
 * angeboten werden.
 */
export async function getAggregateMetrics(): Promise<string> {
  // Nutzerliste
  const usersSnap = await getDocs(collection(db, "users"));
  const evalEntries = await getAllEvaluations();
  const evalIds = new Set<string>(evalEntries.map((e) => e.oderId));

  let totalUsers = 0;
  let evalCount = 0;
  let sumCourseTimeEval = 0;
  let countCourseTimeEval = 0;
  let countNoEvalBut2 = 0;
  let countNoSteps = 0;
  let totHelp = 0;
  let totSessions = 0;
  let totSteps = 0;

  for (const doc of usersSnap.docs) {
    const userId = doc.id;
    totalUsers++;
    const metrics = await getUserMetrics(userId);
    if (metrics) {
      const hasEval = evalIds.has(userId);
      if (hasEval) {
        evalCount++;
        sumCourseTimeEval += metrics.stats.totalLearningTimeSeconds;
        countCourseTimeEval++;
      } else {
        if (metrics.stats.totalStepsCompleted >= 2) {
          countNoEvalBut2++;
        }
      }
      if (metrics.stats.totalStepsCompleted === 0) {
        countNoSteps++;
      }
      totHelp += metrics.stats.totalHelpRequests;
      totSessions += metrics.stats.totalSessions;
      totSteps += metrics.stats.totalStepsCompleted;
    } else {
      // fehlende Metriken interpretieren wir als keine Schritte
      countNoSteps++;
    }
  }

  const avgCourseTimeEval =
    countCourseTimeEval > 0 ? sumCourseTimeEval / countCourseTimeEval : 0;
  const avgHelp = totalUsers > 0 ? totHelp / totalUsers : 0;
  const avgSessions = totalUsers > 0 ? totSessions / totalUsers : 0;
  const avgSteps = totalUsers > 0 ? totSteps / totalUsers : 0;

  const lines: string[] = [];
  lines.push("metric,value");
  lines.push(`totalUsers,${totalUsers}`);
  lines.push(`evalUsers,${evalCount}`);
  lines.push(`avgCourseTimeEvalUsers,${avgCourseTimeEval}`);
  lines.push(`nonEvalButAtLeast2Steps,${countNoEvalBut2}`);
  lines.push(`noSteps,${countNoSteps}`);
  lines.push(`avgHelpRequestsPerUser,${avgHelp}`);
  lines.push(`avgSessionsPerUser,${avgSessions}`);
  lines.push(`avgStepsPerUser,${avgSteps}`);

  return lines.join("\n");
}
