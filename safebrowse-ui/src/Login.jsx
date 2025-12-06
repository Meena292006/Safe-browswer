import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

export default function Login({ onLogin }) {
  async function login() {
    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>SafeBrowse 🧸</h1>
      <p>Protect your child online</p>

      <button className="btn primary" onClick={login}>
        Sign in with Google
      </button>
    </div>
  );
}
