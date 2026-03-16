import { bmiCalculatorCourseData } from './bmiCalculatorCourseData';
import { interestCalculatorCourseData } from './interestCalculatorCourseData';

export interface CourseChapter {
  id: string;
  title: string;
  description: string;
  steps: number;
  path: string;
  optional?: boolean;
  prerequisiteCourseId?: string; // ID des Kurses, der abgeschlossen sein muss
}

export const coursesData: CourseChapter[] = [
  {
    id: 'bmi-calculator',
    title: 'BMI-Rechner',
    description: 'Entwickle einen Body-Mass-Index Rechner. Du lernst mathematische Operationen, Bedingungen und formatierte Ausgaben.',
    steps: bmiCalculatorCourseData.tasks.length,
    path: '/pfade/bmi-calculator'
    // Kein prerequisite - immer verfügbar
  },
  {
    id: 'interest-calculator',
    title: 'Zinsrechner',
    description: 'Erstelle einen Zinseszins-Rechner für Sparpläne. Du lernst for-Schleifen, Listen und f-Strings - alles ohne externe Module!',
    steps: interestCalculatorCourseData.tasks.length,
    path: '/pfade/interest-calculator',
    prerequisiteCourseId: 'bmi-calculator', // Wird erst freigeschaltet wenn BMI-Rechner komplett ist
    optional: true // Optional für die Evaluation - nur BMI-Rechner ist Pflicht
  }
];
