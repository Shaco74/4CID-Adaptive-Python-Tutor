/**
 * Locale-aware drill data access
 *
 * All topics have full English translations with identical IDs for mapping.
 */

import { pythonDrillTasks } from './pythonDrillTasks';
import { printDrillsEn } from './en/pythonDrillTasksPrint';
import { variablenDrillsEn } from './en/pythonDrillTasksVariablen';
import { datentypenDrillsEn } from './en/pythonDrillTasksDatentypen';
import { stringsDrillsEn } from './en/pythonDrillTasksStrings';
import { listenDrillsEn } from './en/pythonDrillTasksListen';
import { schleifenDrillsEn } from './en/pythonDrillTasksSchleifen';
import { bedingungenDrillsEn } from './en/pythonDrillTasksBedingungen';
import type { DrillTask } from '@/types/courseTypes';

export type Locale = 'de' | 'en';

// Combine all English drill tasks
const combinedEnglishDrills: DrillTask[] = [
  ...printDrillsEn,           // print topic
  variablenDrillsEn,          // Variablen topic
  datentypenDrillsEn,         // Datentypen topic
  stringsDrillsEn,            // Strings topic
  listenDrillsEn,             // Listen topic
  schleifenDrillsEn,          // Schleifen topic
  bedingungenDrillsEn,        // Bedingungen topic
];

// Topics that have full English translations
const fullyTranslatedTopics = ['print', 'Variablen', 'Datentypen', 'Strings', 'Listen', 'Schleifen', 'Bedingungen'];

/**
 * Get all drill tasks for a given locale
 * Falls back to German for topics not yet translated
 */
export function getDrillTasks(locale: Locale): DrillTask[] {
  if (locale === 'de') {
    return pythonDrillTasks;
  }

  // For English: use translated drills where available, fallback to German
  const result: DrillTask[] = [];

  for (const germanDrill of pythonDrillTasks) {
    const englishDrill = combinedEnglishDrills.find(d => d.topic === germanDrill.topic);

    if (englishDrill) {
      result.push(englishDrill);
    } else {
      // Fallback to German content for untranslated topics
      result.push(germanDrill);
    }
  }

  return result;
}

/**
 * Get drill tasks for a specific topic
 */
export function getDrillsByTopic(topic: string, locale: Locale): DrillTask | undefined {
  const allDrills = getDrillTasks(locale);
  return allDrills.find(d => d.topic === topic);
}

/**
 * Check if a topic has full English translation
 */
export function isTopicTranslated(topic: string): boolean {
  return fullyTranslatedTopics.includes(topic);
}

/**
 * Get all available topics
 */
export function getAllTopics(): string[] {
  return pythonDrillTasks.map(d => d.topic);
}
