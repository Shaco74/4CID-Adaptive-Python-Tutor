// Standardized toaster functions with i18n support
// Pass locale parameter to get localized messages

import { toaster } from "@/components/ui/toaster";

type Locale = 'de' | 'en';

interface ToastOptions {
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

const messages = {
  de: {
    stepSuccess: {
      title: 'Fortschritt gespeichert',
      description: (step: number) => `Schritt ${step} abgeschlossen!`
    },
    progressError: {
      title: 'Fehler',
      description: 'Dein Fortschritt konnte nicht gespeichert werden.'
    },
    loginRequired: {
      title: 'Nicht angemeldet',
      description: 'Melde dich an, um deinen Fortschritt zu speichern.'
    },
    courseFinished: {
      title: 'Kurs abgeschlossen',
      description: (name: string) => `Du hast den Kurs "${name}" erfolgreich abgeschlossen!`
    },
    allStepsFinished: {
      title: 'Kurs abgeschlossen',
      description: 'Du hast alle Schritte dieses Kurses erfolgreich abgeschlossen!'
    },
    userNotFound: {
      title: 'Benutzer nicht gefunden',
      description: (id: string) => `Keine Daten für Benutzer-ID gefunden: ${id}`
    },
    adminSaveSuccess: {
      title: 'Änderungen gespeichert',
      description: 'Benutzerfortschrittsdaten wurden erfolgreich aktualisiert'
    },
    adminSaveError: {
      title: 'Fehler beim Speichern der Änderungen',
      description: 'Ungültiges JSON oder Datenbankfehler'
    },
    adminEmailMissing: {
      title: 'Fehlende Informationen',
      description: 'Bitte geben Sie Betreff und Nachricht an'
    },
    adminEmailSent: {
      title: 'E-Mail gesendet',
      description: 'Ihre E-Mail wurde erfolgreich gesendet'
    },
    adminEmailError: {
      title: 'Fehler beim Senden der E-Mail',
      description: 'Fehler beim Senden der E-Mail'
    },
    correctSolution: {
      title: '✅ Richtig!',
      description: 'Super gemacht! Deine Lösung ist korrekt.'
    },
    incorrectSolution: {
      title: '❌ Nicht ganz richtig',
      description: 'Die Ausgabe entspricht nicht der erwarteten Lösung. Versuch es nochmal!'
    },
    pythonError: {
      title: '⚠️ Python Fehler',
      description: (type?: string) => type ? `${type} - Überprüfe deinen Code!` : 'Es ist ein Fehler aufgetreten. Überprüfe deinen Code!'
    },
    hint: 'Hinweis'
  },
  en: {
    stepSuccess: {
      title: 'Progress saved',
      description: (step: number) => `Step ${step} completed!`
    },
    progressError: {
      title: 'Error',
      description: 'Your progress could not be saved.'
    },
    loginRequired: {
      title: 'Not logged in',
      description: 'Log in to save your progress.'
    },
    courseFinished: {
      title: 'Course completed',
      description: (name: string) => `You have successfully completed the course "${name}"!`
    },
    allStepsFinished: {
      title: 'Course completed',
      description: 'You have successfully completed all steps of this course!'
    },
    userNotFound: {
      title: 'User not found',
      description: (id: string) => `No data found for user ID: ${id}`
    },
    adminSaveSuccess: {
      title: 'Changes saved',
      description: 'User progress data has been successfully updated'
    },
    adminSaveError: {
      title: 'Error saving changes',
      description: 'Invalid JSON or database error'
    },
    adminEmailMissing: {
      title: 'Missing information',
      description: 'Please provide subject and message'
    },
    adminEmailSent: {
      title: 'Email sent',
      description: 'Your email has been sent successfully'
    },
    adminEmailError: {
      title: 'Error sending email',
      description: 'Error sending email'
    },
    correctSolution: {
      title: '✅ Correct!',
      description: 'Well done! Your solution is correct.'
    },
    incorrectSolution: {
      title: '❌ Not quite right',
      description: 'The output does not match the expected solution. Try again!'
    },
    pythonError: {
      title: '⚠️ Python Error',
      description: (type?: string) => type ? `${type} - Check your code!` : 'An error occurred. Check your code!'
    },
    hint: 'Note'
  }
};

function getLocale(locale?: string): Locale {
  return locale === 'en' ? 'en' : 'de';
}

export function showStepSuccessToast(currentStep: number, locale?: string) {
  const l = getLocale(locale);
  toaster.create({
    title: messages[l].stepSuccess.title,
    description: messages[l].stepSuccess.description(currentStep),
    type: 'success',
    duration: 3000,
  });
}

export function showProgressErrorToast(locale?: string) {
  const l = getLocale(locale);
  toaster.create({
    title: messages[l].progressError.title,
    description: messages[l].progressError.description,
    type: 'error',
    duration: 3000,
  });
}

export function showLoginRequiredToast(locale?: string) {
  const l = getLocale(locale);
  toaster.create({
    title: messages[l].loginRequired.title,
    description: messages[l].loginRequired.description,
    type: 'warning',
    duration: 5000,
  });
}

export function showCourseFinishedToast(courseName: string, locale?: string) {
  const l = getLocale(locale);
  toaster.create({
    title: messages[l].courseFinished.title,
    description: messages[l].courseFinished.description(courseName),
    type: 'success',
    duration: 5000,
  });
}

export function showAllStepsFinishedToast(locale?: string) {
  const l = getLocale(locale);
  toaster.create({
    title: messages[l].allStepsFinished.title,
    description: messages[l].allStepsFinished.description,
    type: 'success',
    duration: 5000,
  });
}

// ADMIN DASHBOARD TOASTS (German only - admin is always German)
export function showUserNotFoundToast(userId: string) {
  toaster.create({
    title: messages.de.userNotFound.title,
    description: messages.de.userNotFound.description(userId),
    type: 'warning',
    duration: 3000,
  });
}

export function showAdminSaveSuccessToast() {
  toaster.create({
    title: messages.de.adminSaveSuccess.title,
    description: messages.de.adminSaveSuccess.description,
    type: 'success',
    duration: 3000,
  });
}

export function showAdminSaveErrorToast(message?: string) {
  toaster.create({
    title: messages.de.adminSaveError.title,
    description: message || messages.de.adminSaveError.description,
    type: 'error',
    duration: 5000,
  });
}

export function showAdminEmailMissingToast() {
  toaster.create({
    title: messages.de.adminEmailMissing.title,
    description: messages.de.adminEmailMissing.description,
    type: 'warning',
    duration: 3000,
  });
}

export function showAdminEmailSentToast() {
  toaster.create({
    title: messages.de.adminEmailSent.title,
    description: messages.de.adminEmailSent.description,
    type: 'success',
    duration: 3000,
  });
}

export function showAdminEmailErrorToast(message?: string) {
  toaster.create({
    title: messages.de.adminEmailError.title,
    description: message || messages.de.adminEmailError.description,
    type: 'error',
    duration: 5000,
  });
}

export function showAdminDownloadErrorToast() {
  toaster.create({
    title: 'Error downloading JSON',
    description: 'The current data is not valid JSON',
    type: 'error',
    duration: 3000,
  });
}

export function showAdminListUsersToast(count: number) {
  toaster.create({
    title: 'Users Listed in Console',
    description: `Found ${count} users in database`,
    type: 'success',
    duration: 3000,
  });
}

export function showAdminListUsersErrorToast(message?: string) {
  toaster.create({
    title: 'Error Listing Users',
    description: message || 'Failed to list users',
    type: 'error',
    duration: 3000,
  });
}

export function showAdminListConfigsToast(charCount: number) {
  toaster.create({
    title: 'User Configs Listed in Console',
    description: `Retrieved ${charCount} characters of user config data`,
    type: 'success',
    duration: 3000,
  });
}

export function showAdminListConfigsErrorToast(message?: string) {
  toaster.create({
    title: 'Error Getting User Configs',
    description: message || 'Failed to get user configs',
    type: 'error',
    duration: 3000,
  });
}

// COURSE FEEDBACK TOASTS
export function showCorrectSolutionToast(message?: string, locale?: string) {
  const l = getLocale(locale);
  toaster.create({
    title: messages[l].correctSolution.title,
    description: message || messages[l].correctSolution.description,
    type: 'success',
    duration: 3000,
  });
}

// Legacy function for backwards compatibility
export function showCorrectSolutionToastEn(message?: string) {
  showCorrectSolutionToast(message, 'en');
}

export function showIncorrectSolutionToast(message?: string, locale?: string) {
  const l = getLocale(locale);
  toaster.create({
    title: messages[l].incorrectSolution.title,
    description: message || messages[l].incorrectSolution.description,
    type: 'error',
    duration: 4000,
  });
}

// Legacy function for backwards compatibility
export function showIncorrectSolutionToastEn(message?: string) {
  showIncorrectSolutionToast(message, 'en');
}

export function showPythonErrorToast(errorType?: string, locale?: string) {
  const l = getLocale(locale);
  toaster.create({
    title: messages[l].pythonError.title,
    description: messages[l].pythonError.description(errorType),
    type: 'warning',
    duration: 4000,
  });
}

// Legacy function for backwards compatibility
export function showPythonErrorToastEn(errorType?: string) {
  showPythonErrorToast(errorType, 'en');
}

// For rare custom cases
export function showCustomToast(opts: ToastOptions, locale?: string) {
  const l = getLocale(locale);
  toaster.create({
    title: opts.title || messages[l].hint,
    description: opts.description || '',
    type: opts.type || 'info',
    duration: opts.duration || 3000,
  });
}
