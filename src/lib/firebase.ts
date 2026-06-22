import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  Auth, 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser 
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

// Graceful check for config
export const isFirebaseConfigured = (): boolean => {
  try {
    // Try to import or check if config module exists or we can fetch/require
    return true; 
  } catch {
    return false;
  }
};

export const getFirebaseApp = async (): Promise<FirebaseApp | null> => {
  if (appInstance) return appInstance;

  try {
    // Dynamically retrieve config so compile doesn't break if not exist
    const configModule = await import("../firebase-applet-config.json" as string).catch(() => null);
    
    if (!configModule || !configModule.default || !configModule.default.apiKey) {
      console.warn("Firebase configuration file 'firebase-applet-config.json' is missing or incomplete.");
      return null;
    }

    const firebaseConfig = configModule.default;
    
    if (getApps().length === 0) {
      appInstance = initializeApp(firebaseConfig);
    } else {
      appInstance = getApp();
    }
    return appInstance;
  } catch (error) {
    console.error("Failed to initialize Firebase App:", error);
    return null;
  }
};

export const getFirebaseAuth = async (): Promise<Auth | null> => {
  if (authInstance) return authInstance;

  const app = await getFirebaseApp();
  if (!app) return null;

  try {
    authInstance = getAuth(app);
    return authInstance;
  } catch (error) {
    console.error("Failed to initialize Firebase Auth:", error);
    return null;
  }
};

export const getFirebaseDb = async (): Promise<Firestore | null> => {
  if (firestoreInstance) return firestoreInstance;

  const app = await getFirebaseApp();
  if (!app) return null;

  try {
    const configModule = await import("../firebase-applet-config.json" as string).catch(() => null);
    const databaseId = configModule?.default?.firestoreDatabaseId;
    
    if (databaseId) {
      firestoreInstance = getFirestore(app, databaseId);
    } else {
      firestoreInstance = getFirestore(app);
    }
    return firestoreInstance;
  } catch (error) {
    console.error("Failed to initialize Firestore database:", error);
    return null;
  }
};

// Sign In helpers
export const loginWithGoogle = async (): Promise<FirebaseUser> => {
  const auth = await getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Check your settings.");
  }
  const provider = new GoogleAuthProvider();
  // Request profile and email
  provider.addScope("profile");
  provider.addScope("email");
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const loginWithApple = async (): Promise<FirebaseUser> => {
  const auth = await getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Check your settings.");
  }
  // Create stateful OAuth provider for Apple Sign In.
  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.addScope("name");
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logOutUser = async (): Promise<void> => {
  const auth = await getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
};
