import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUpkR5Yqow6NRBuNha4zkQk263U6EXABY",
  authDomain: "fir-course-c97fc.firebaseapp.com",
  projectId: "fir-course-c97fc",
  storageBucket: "fir-course-c97fc.appspot.com",
  messagingSenderId: "845989478624",
  appId: "1:845989478624:web:08b9a1be9355cc8e929085",
  measurementId: "G-T0FG7LTWH0",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
