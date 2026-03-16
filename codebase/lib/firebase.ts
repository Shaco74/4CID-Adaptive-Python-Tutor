// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Firestore mit Offline Persistence initialisieren
// Cached Writes lokal in IndexedDB und synct automatisch wenn wieder online
// Verhindert Datenverlust bei kurzzeitigem Verbindungsabbruch
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({})
  })
});

export { db };
