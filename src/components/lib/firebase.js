import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWDVxmzi6SsYs-NEx49JbDZPj8vQ5P9dM",
  authDomain: "sayhello-e5e44.firebaseapp.com",
  projectId: "sayhello-e5e44",
  storageBucket: "sayhello-e5e44.appspot.com",
  messagingSenderId: "764127610637",
  appId: "1:764127610637:web:b45b9a080cd055e6639244",
  measurementId: "G-Y78HV1PEPM",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
