// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
 const firebaseConfig = {
  apiKey:  import.meta.env.VITE_API_KEY_ENV,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN_ENV ,
  projectId: import.meta.env.VITE_PROJECT_ID_ENV,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET_ENV,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID_ENV,
  appId: import.meta.env.VITE_APP_ID_ENV,

  // Real time Database
  databaseURL: import.meta.env.VITE_DATABASE_NAME
}; 

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Real time Database
import { getDatabase } from 'firebase/database';
export const database = getDatabase(app);