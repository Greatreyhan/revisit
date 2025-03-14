// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getDatabase } from "firebase/database"


const firebaseConfig = {
  apiKey: "AIzaSyB90SzPUcE2cFc0_ceUjQ0lEdU2e8McZHo",
  authDomain: "wsucompro.firebaseapp.com",
  databaseURL: "https://wsucompro-default-rtdb.firebaseio.com",
  projectId: "wsucompro",
  storageBucket: "wsucompro.appspot.com",
  messagingSenderId: "829238839828",
  appId: "1:829238839828:web:fc2ebfbaaaa0e93108f501",
  measurementId: "G-3RKL0XGG31"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_STORE = getStorage(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);