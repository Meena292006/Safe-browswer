import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC33hykDFnrpFrLcDr6e_UUBMXqWR-Md0Q",
  authDomain: "safe-browse-352e3.firebaseapp.com",
  projectId: "safe-browse-352e3",
  storageBucket: "safe-browse-352e3.firebasestorage.app",
  messagingSenderId: "266897899894",
  appId: "1:266897899894:web:121324aefcedb171d1ba57",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
