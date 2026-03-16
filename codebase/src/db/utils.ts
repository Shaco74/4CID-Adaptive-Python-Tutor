import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

type UserConfig = {
  name?: string;
  progress?: any;
  createdAt?: string;
  [key: string]: any;
};

const usersCollection = collection(db, 'users');

// 🧠 1. Get config for one user
export async function getUserConfig(userId: string): Promise<(UserConfig & { courses?: Record<string, any> }) | null> {
  const ref = doc(usersCollection, userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const userData = snap.data() as UserConfig;

  // Hole die Subcollection "courses"
  const coursesRef = collection(db, 'users', userId, 'courses');
  const coursesSnap = await getDocs(coursesRef);

  const coursesData: Record<string, any> = {};
  coursesSnap.forEach(courseDoc => {
    coursesData[courseDoc.id] = courseDoc.data();
  });

  return {
    ...userData,
    courses: coursesData
  };
}

// 👥 2. Get all user IDs
export async function getAllUsers(): Promise<string[]> {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => doc.id);
}

// 📦 3. Get all user configs
export async function getAllUserConfigs(): Promise<
  { userId: string; data: UserConfig & { courses?: Record<string, any> } }[]
> {
  const snapshot = await getDocs(usersCollection);

  const configs = await Promise.all(snapshot.docs.map(async (docSnap) => {
    const userId = docSnap.id;
    const userData = docSnap.data() as UserConfig;

    // Hole die Kurse aus der Subcollection
    const coursesRef = collection(db, 'users', userId, 'courses');
    const coursesSnap = await getDocs(coursesRef);

    const coursesData: Record<string, any> = {};
    coursesSnap.forEach(courseDoc => {
      coursesData[courseDoc.id] = courseDoc.data();
    });

    return {
      userId,
      data: {
        ...userData,
        courses: coursesData
      }
    };
  }));

  return configs;
}

// ➕ 4. Add new user config (overwrite if exists)
export async function addUserConfig(userId: string, data: UserConfig): Promise<void> {
  const ref = doc(usersCollection, userId);
  await setDoc(ref, {
    ...data,
    createdAt: new Date().toISOString()
  });
}

// 🛠️ 5. Modify (merge) existing user config
export async function modifyUserConfig(userId: string, updates: Partial<UserConfig>): Promise<void> {
  const ref = doc(usersCollection, userId);
  await updateDoc(ref, updates);
}

// 📚 Kurs-Typ (kannst du anpassen)
type CourseData = {
  courseId: string;
  completedSteps: number[];
  finished: boolean;
  updatedAt: number;
};

// ➕ Kurs hinzufügen oder überschreiben
export async function addCourseForUser(userId: string, course: CourseData): Promise<void> {
  const courseRef = doc(db, 'users', userId, 'courses', course.courseId);
  await setDoc(courseRef, {
    ...course,
    updatedAt: Date.now(),
  });
}

// 🛠 Kursdaten aktualisieren (merge)
export async function updateCourseForUser(userId: string, courseId: string, updates: Partial<CourseData>): Promise<void> {
  const courseRef = doc(db, 'users', userId, 'courses', courseId);
  await updateDoc(courseRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function addCompletedStep(userId: string, courseId: string, step: number): Promise<void> {
  const courseRef = doc(db, 'users', userId, 'courses', courseId);
  const snap = await getDoc(courseRef);

  if (!snap.exists()) {
    // Kurs existiert nicht - erstelle ihn mit dem ersten Step
    await setDoc(courseRef, {
      courseId,
      completedSteps: [step],
      finished: false,
      updatedAt: Date.now(),
    });
  } else {
    // Kurs existiert bereits - füge den Step hinzu
    const courseData = snap.data();
    const existingSteps: number[] = Array.isArray(courseData?.completedSteps) ? courseData.completedSteps : [];

    // Füge den neuen Schritt hinzu, ohne Duplikate
    const updatedSteps = Array.from(new Set([...existingSteps, step])).sort((a, b) => a - b);

    await updateDoc(courseRef, {
      completedSteps: updatedSteps,
      updatedAt: Date.now()
    });
  }
}

// 📖 Einzelnen Kurs lesen
export async function getCourseForUser(userId: string, courseId: string): Promise<CourseData | null> {
  const courseRef = doc(db, 'users', userId, 'courses', courseId);
  const snap = await getDoc(courseRef);
  return snap.exists() ? (snap.data() as CourseData) : null;
}

// 📚 Alle Kurse eines Nutzers lesen
export async function getAllCoursesForUser(userId: string): Promise<CourseData[]> {
  const coursesRef = collection(db, 'users', userId, 'courses');
  const snapshot = await getDocs(coursesRef);
  return snapshot.docs.map(doc => doc.data() as CourseData);
}
