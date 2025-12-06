// Load firebase modules
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyC33hykDFnrpFrLcDr6e_UUBMXqWR-Md0Q",
  authDomain: "safe-browse-352e3.firebaseapp.com",
  projectId: "safe-browse-352e3",
  storageBucket: "safe-browse-352e3.firebasestorage.app",
  messagingSenderId: "266897899894",
  appId: "1:266897899894:web:121324aefcedb171d1ba57"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let rules = null;

async function loadRules() {
  const docRef = db.collection("users").doc("TEST_PARENT").collection("children").doc("child_1");
  const snap = await docRef.get();

  if (snap.exists) {
    rules = snap.data();
    console.log("Loaded rules:", rules);
  }
}

// Run once at startup
loadRules();
