import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC33hykDFnrpFrLcDr6e_UUBMXqWR-Md0Q",
  authDomain: "safe-browse-352e3.firebaseapp.com",
  projectId: "safe-browse-352e3",
  storageBucket: "safe-browse-352e3.firebasestorage.app",
  messagingSenderId: "266897899894",
  appId: "1:266897899894:web:121324aefcedb171d1ba57"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
