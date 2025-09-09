
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_DEMO_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_DEMO_PROJECT.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://YOUR_DEMO_PROJECT.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_DEMO_PROJECT",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_DEMO_PROJECT.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_DEMO_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_DEMO_APP_ID",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "YOUR_DEMO_MEASUREMENT_ID"
};

// Debug Firebase configuration
console.log('Firebase Config Status:', {
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
  authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
  projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
  appId: firebaseConfig.appId ? 'Set' : 'Missing'
});

// Check if we're using demo values
const isUsingDemoConfig = firebaseConfig.apiKey === "demo-key";
if (isUsingDemoConfig) {
  console.warn('⚠️ Using demo Firebase configuration. Please set up your Firebase project and add environment variables.');
}

// Initialize Firebase
let app: any, auth: any, db: any;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  // Create fallback objects to prevent app crashes
  app = null;
  auth = null;
  db = null;
}
const storage = app ? getStorage(app) : null;

let messaging;
try {
  if (typeof window !== 'undefined' && app) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.error('Failed to initialize Firebase Messaging:', error);
}

export { app, auth, db, storage, messaging };
