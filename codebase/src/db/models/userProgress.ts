import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDocs,
  collection,
  deleteDoc,
  deleteField,
} from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';

export interface CourseProgress {
  courseId: string;
  completedSteps: number[];
  updatedAt: number;
}

export interface UserProgress {
  id: string;
  createdAt: number;
  updatedAt: number;
  notes?: string[];
}

// 🔁 create or update basic user document
async function ensureUserDoc(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  const now = Date.now();
  if (!snap.exists()) {
    await setDoc(userRef, {
      id: userId,
      createdAt: now,
      updatedAt: now,
      notes: [],
    });
  }
}

// ✅ Add or update a course step
export async function completeStep(userId: string, courseId: string, stepId: number) {
  try {
    await ensureUserDoc(userId);
    const courseRef = doc(db, 'users', userId, 'courses', courseId);
    const now = Date.now();
    const snap = await getDoc(courseRef);

    if (!snap.exists()) {
      await setDoc(courseRef, {
        courseId,
        completedSteps: [stepId],
        finished: false,
        updatedAt: now,
      });
    } else {
      const course = snap.data() as CourseProgress;
      const completed = new Set(course.completedSteps);
      completed.add(stepId);

      await updateDoc(courseRef, {
        completedSteps: Array.from(completed).sort((a, b) => a - b),
        updatedAt: now,
      });
    }
  } catch (err) {
    console.error('Failed to complete step:', err);
    return NextResponse.json({ error: 'Failed to write user data' }, { status: 500 });
  }
}

// 🔁 update only last accessed step
export async function updateLastAccessed(userId: string, courseId: string) {
  try {
    await ensureUserDoc(userId);
    const courseRef = doc(db, 'users', userId, 'courses', courseId);
    const snap = await getDoc(courseRef);
    const now = Date.now();

    if (!snap.exists()) {
      await setDoc(courseRef, {
        courseId,
        completedSteps: [],
        finished: false,
        updatedAt: now,
      });
    } else {
      await updateDoc(courseRef, {
        updatedAt: now,
      });
    }
  } catch (err) {
    console.error('Failed to update last step:', err);
    return NextResponse.json({ error: 'Failed to write user data' }, { status: 500 });
  }
}

// 📖 get progress for one course
export async function getProgressForCourse(userId: string, courseId: string): Promise<CourseProgress | null> {
  const courseRef = doc(db, 'users', userId, 'courses', courseId);
  const snap = await getDoc(courseRef);
  return snap.exists() ? (snap.data() as CourseProgress) : null;
}

// 📖 get progress for all courses of one user
export async function getAllProgressForUser(userId: string): Promise<CourseProgress[]> {
  const coursesRef = collection(db, 'users', userId, 'courses');
  const snapshot = await getDocs(coursesRef);

  const progressList: CourseProgress[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    progressList.push(data as CourseProgress);
  });

  return progressList;
}


// ➕ add a note
export async function addNote(userId: string, note: string) {
  try {
    await ensureUserDoc(userId);
    const userRef = doc(db, 'users', userId);
    const now = Date.now();
    await updateDoc(userRef, {
      notes: arrayUnion(note),
      updatedAt: now,
    });
  } catch (err) {
    console.error('Failed to add note:', err);
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}

// 🗑️ Reset all progress for a user (Admin function)
// Deletes: courses subcollection, drill tracking fields, chat data
export async function resetAllProgress(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }

    // 1. Delete all documents in courses subcollection
    const coursesRef = collection(db, 'users', userId, 'courses');
    const coursesSnapshot = await getDocs(coursesRef);
    const deletePromises: Promise<void>[] = [];

    coursesSnapshot.forEach((courseDoc) => {
      deletePromises.push(deleteDoc(doc(db, 'users', userId, 'courses', courseDoc.id)));
    });

    // 2. Delete all documents in archivedChats subcollection
    const archivedChatsRef = collection(db, 'users', userId, 'archivedChats');
    const archivedChatsSnapshot = await getDocs(archivedChatsRef);

    archivedChatsSnapshot.forEach((chatDoc) => {
      deletePromises.push(deleteDoc(doc(db, 'users', userId, 'archivedChats', chatDoc.id)));
    });

    await Promise.all(deletePromises);

    // 3. Clear drill and chat fields on user document
    await updateDoc(userRef, {
      completedDrillIds: [],
      drillSessions: deleteField(),
      drilledSteps: [],
      drillAttemptCounts: deleteField(),
      activeResponseId: deleteField(),
      chatHistory: deleteField(),
      currentChatSessionId: deleteField(),
      updatedAt: Date.now(),
    });

    console.log(`[userProgress] Reset all progress for user: ${userId}`);
    return { success: true };
  } catch (err) {
    console.error('Failed to reset progress:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
