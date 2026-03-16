import { bmiCalculatorCourseDataEn } from './bmiCalculatorCourseData';
import { interestCalculatorCourseDataEn } from './interestCalculatorCourseData';

export interface CourseChapter {
  id: string;
  title: string;
  description: string;
  steps: number;
  path: string;
  optional?: boolean;
  prerequisiteCourseId?: string;
}

export const coursesDataEn: CourseChapter[] = [
  {
    id: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Build a Body Mass Index calculator. You\'ll learn math operations, conditionals, and formatted output.',
    steps: bmiCalculatorCourseDataEn.tasks.length,
    path: '/pfade/bmi-calculator'
  },
  {
    id: 'interest-calculator',
    title: 'Interest Calculator',
    description: 'Create a compound interest calculator for savings plans. You\'ll learn for-loops, lists, and f-strings - all without external modules!',
    steps: interestCalculatorCourseDataEn.tasks.length,
    path: '/pfade/interest-calculator',
    prerequisiteCourseId: 'bmi-calculator',
    optional: true
  }
];
