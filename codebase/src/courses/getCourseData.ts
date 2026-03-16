import { bmiCalculatorCourseData, getBmiCalculatorCourseTask } from './bmiCalculatorCourseData';
import { bmiCalculatorCourseDataEn, getBmiCalculatorCourseTaskEn } from './en/bmiCalculatorCourseData';
import { interestCalculatorCourseData, getInterestCalculatorCourseTask } from './interestCalculatorCourseData';
import { interestCalculatorCourseDataEn, getInterestCalculatorCourseTaskEn } from './en/interestCalculatorCourseData';
import { coursesData, type CourseChapter } from './coursesData';
import { coursesDataEn } from './en/coursesData';
import type { CourseData, CourseTask } from '@/types/courseTypes';

export type Locale = 'de' | 'en';

// Get course chapters list based on locale
export function getCoursesData(locale: Locale): CourseChapter[] {
  return locale === 'en' ? coursesDataEn : coursesData;
}

// Get full BMI course data based on locale
export function getBmiCourseData(locale: Locale): CourseData {
  return locale === 'en' ? bmiCalculatorCourseDataEn : bmiCalculatorCourseData;
}

// Get BMI course task for a specific step based on locale
export function getBmiCourseTask(step: number, locale: Locale): CourseTask | null {
  return locale === 'en'
    ? getBmiCalculatorCourseTaskEn(step) as CourseTask | null
    : getBmiCalculatorCourseTask(step) as CourseTask | null;
}

// Get Interest Calculator course data based on locale
export function getInterestCalculatorData(locale: Locale): CourseData {
  return locale === 'en' ? interestCalculatorCourseDataEn : interestCalculatorCourseData;
}

// Get Interest Calculator course task for a specific step based on locale
export function getInterestCalculatorTask(step: number, locale: Locale): CourseTask | null {
  return locale === 'en'
    ? getInterestCalculatorCourseTaskEn(step) as CourseTask | null
    : getInterestCalculatorCourseTask(step) as CourseTask | null;
}

// Generic function to get course data by course ID and locale
export function getCourseDataById(courseId: string, locale: Locale): CourseData | null {
  switch (courseId) {
    case 'bmi-calculator':
      return getBmiCourseData(locale);
    case 'interest-calculator':
      return getInterestCalculatorData(locale);
    default:
      return null;
  }
}

// Generic function to get course task by course ID, step, and locale
export function getCourseTaskById(courseId: string, step: number, locale: Locale): CourseTask | null {
  switch (courseId) {
    case 'bmi-calculator':
      return getBmiCourseTask(step, locale);
    case 'interest-calculator':
      return getInterestCalculatorTask(step, locale);
    default:
      return null;
  }
}
