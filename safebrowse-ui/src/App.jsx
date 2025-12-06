import { useState, useEffect } from "react";
import "./App.css";
import { db, auth } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Login from "./Login";

const STEPS = [
  "Child Profile",
  "Guided Rules",
  "Family Values",
  "Adaptive Control",
  "Notifications",
  "Parent Copilot",
  "Summary",
];

export default function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  // NEW: Logged in parent + multiple profiles support
  const [user, setUser] = useState(null);
  const [childName, setChildName] = useState("child_1");

  const [form, setForm] = useState({
    age: "",
    grade: "",
    learningStage: "average",
    temperament: "curious",
    deviceUse: "mixed",
    chatWithStrangers: "no",
    filteringStrictness: "balanced",
    familyMode: "curious",
    autoLoosen: true,
    responsibilityAlerts: true,
    teenMode: true,
    notifMatureContent: "silent",
    notifBullying: "notify",
    notifSelfHarm: "block",
    notifStranger: "block",
    tipsFrequency: "daily",
  });

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // SAVE CONFIG (Per User + Child)
  async function saveConfiguration() {
    try {
      await setDoc(doc(db, "users", user.uid, "children", childName), form);
      alert(`🎉 Settings saved for ${childName}!`);
    } catch (err) {
      console.error("❌ Save Error:", err);
      alert("❌ Failed to save.");
    }
  }

  // LOAD CONFIG
  async function loadConfiguration() {
    if (!user) return;

    try {
      const snap = await getDoc(doc(db, "users", user.uid, "children", childName));

      if (snap.exists()) {
        setForm(snap.data());
        console.log("Loaded:", snap.data());
      } else {
        console.log("No saved settings for", childName);
      }
    } catch (err) {
      console.error("❌ Load Error:", err);
    }

    setLoading(false);
  }

  // Reload when logged in or profile changes
  useEffect(() => {
    if (user) loadConfiguration();
  }, [user, childName]);

  // If not logged in → show login screen
  if (!user) return <Login onLogin={(u) => setUser(u)} />;

  // Loading State UI
  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "20vh" }}>
        Loading your child settings... ⏳
      </h2>
    );
  }

  return (
    <div className="app-root">
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1>SafeBrowse 🧸</h1>
            <p className="app-subtitle">
              Personalize digital safety for your child — based on values, age, and readiness.
            </p>
          </div>

          {/* Child Selector */}
          <div style={{ marginTop: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Active Profile: </label>
            <select value={childName} onChange={(e) => setChildName(e.target.value)}>
              <option value="child_1">Child 1</option>
              <option value="child_2">Child 2</option>
              <option value="child_3">Child 3</option>
            </select>
          </div>

          <div className="step-indicator">
            <span className="step-label">Setup Progress</span>
            <div className="step-bar">
              <div className="step-bar-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
            <span className="step-counter">{step + 1} / {STEPS.length}</span>
          </div>
        </header>

        <main className="app-main">
          {/* Sidebar Navigation */}
          <nav className="sidebar">
            {STEPS.map((label, i) => (
              <button key={label} className={`sidebar-step ${i === step ? "sidebar-step-active" : ""}`} onClick={() => setStep(i)}>
                <span className="sidebar-step-index">{i + 1}</span> {label}
              </button>
            ))}
          </nav>

          {/* Wizard Content */}
          <section className="content">
            {step === 0 && <ChildProfileStep form={form} updateForm={updateForm} />}
            {step === 1 && <GuidedRulesStep form={form} updateForm={updateForm} />}
            {step === 2 && <FamilyValuesStep form={form} updateForm={updateForm} />}
            {step === 3 && <AdaptiveControlStep form={form} updateForm={updateForm} />}
            {step === 4 && <NotificationsStep form={form} updateForm={updateForm} />}
            {step === 5 && <ParentCopilotStep form={form} updateForm={updateForm} />}
            {step === 6 && <SummaryStep form={form} />}

            <footer className="nav-footer">
              <button className="btn ghost" disabled={step === 0} onClick={prevStep}>⬅ Back</button>

              {step < STEPS.length - 1 ? (
                <button className="btn primary" onClick={nextStep}>Next ➜</button>
              ) : (
                <button className="btn primary" onClick={saveConfiguration}>💾 Save & Finish</button>
              )}
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ------------------- COMPONENTS BELOW ------------------- */

function Card({ icon, title, description, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <div>
          <h2>{title}</h2>
          <p className="card-description">{description}</p>
        </div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

/* -------- FORM STEP COMPONENTS -------- */

function ChildProfileStep({ form, updateForm }) {
  return (
    <Card icon="🧸" title="Child Profile Setup" description="Tell us about your child">
      <div className="grid-two">
        <Input label="Age" field="age" form={form} updateForm={updateForm} />
        <Input label="Grade" field="grade" form={form} updateForm={updateForm} />
      </div>

      <div className="grid-three">
        <Select label="Learning Stage" field="learningStage" options={{ slow:"Slow",average:"Average",advanced:"Advanced"}} form={form} updateForm={updateForm} />
        <Select label="Temperament" field="temperament" options={{ shy:"Shy",curious:"Curious","risk-taker":"Risk Taker",sensitive:"Sensitive"}} form={form} updateForm={updateForm} />
        <Select label="Device Use" field="deviceUse" options={{ school:"School",entertainment:"Entertainment",mixed:"Mixed"}} form={form} updateForm={updateForm} />
      </div>
    </Card>
  );
}

function GuidedRulesStep({ form, updateForm }) {
  return (
    <Card icon="⚙️" title="Guided Rules" description="Define how strict browsing should be.">
      <Choice label="Chat with strangers?" field="chatWithStrangers" form={form} updateForm={updateForm}
        options={{ no:"⛔ No", monitored:"👀 Monitored", yes:"✅ Yes" }}
      />
      <Choice label="Filtering strictness" field="filteringStrictness" form={form} updateForm={updateForm}
        options={{ soft:"🚦 Soft", balanced:"🚧 Balanced", strict:"🔒 Strict" }}
      />
    </Card>
  );
}

function FamilyValuesStep({ form, updateForm }) {
  return (
    <Card icon="👨‍👩‍👧" title="Family Values Mode" description="How should SafeBrowse behave?">
      <div className="mode-grid">
        {[
          ["curious", "💡 Curious", "Safe exploration"],
          ["gentle", "🕊 Gentle", "Avoid heavy themes"],
          ["gamer", "🎮 Gamer", "Monitor toxicity"],
          ["study", "📚 Study", "Blocks distractions"],
          ["custom", "⚙ Custom", "Fine tune everything"],
        ].map(([value, label]) => (
          <button key={value} className={`mode-card ${form.familyMode === value ? "mode-card-active" : ""}`} onClick={() => updateForm("familyMode", value)}>
            {label}
          </button>
        ))}
      </div>
    </Card>
  );
}

function AdaptiveControlStep({ form, updateForm }) {
  return (
    <Card icon="📈" title="Adaptive Controls" description="SafeBrowse grows as your child matures.">
      {[
        ["autoLoosen","Automatically loosen restrictions"],
        ["responsibilityAlerts","Notify when child behaves well"],
        ["teenMode","Suggest teen-friendly mode when ready"]
      ].map(([field,label]) => (
        <Toggle key={field} label={label} value={form[field]} onChange={(v)=>updateForm(field,v)} />
      ))}
    </Card>
  );
}

function NotificationsStep({ form, updateForm }) {
  return (
    <Card icon="📬" title="Notifications" description="Choose how parents are alerted">
      {[
        ["notifMatureContent","Mature content"],
        ["notifBullying","Cyberbullying"],
        ["notifSelfHarm","Self-harm content"],
        ["notifStranger","Stranger messaging"],
      ].map(([field,label])=>(
        <Choice label={label} field={field} form={form} updateForm={updateForm}
          options={{ silent:"😶 Silent", notify:"🔔 Notify", block:"⛔ Block" }}
        />
      ))}
    </Card>
  );
}

function ParentCopilotStep({ form, updateForm }) {
  return (
    <Card icon="🧠" title="Parent Copilot" description="Get emotional guidance">
      <Choice label="Insights frequency" field="tipsFrequency" form={form} updateForm={updateForm}
        options={{ never:"🚫 Never", weekly:"📅 Weekly", daily:"🌞 Daily" }}
      />
    </Card>
  );
}

function SummaryStep({ form }) {
  return (
    <Card icon="✅" title="Summary" description="Final configuration">
      <pre className="summary-json">{JSON.stringify(form, null, 2)}</pre>
    </Card>
  );
}

/* --------- Small Reusable UI Inputs --------- */

function Input({ label, field, form, updateForm }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input value={form[field]} onChange={(e)=>updateForm(field,e.target.value)} />
    </div>
  );
}

function Select({ label, field, form, updateForm, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={form[field]} onChange={(e)=>updateForm(field,e.target.value)}>
        {Object.entries(options).map(([val,text])=>(
          <option key={val} value={val}>{text}</option>
        ))}
      </select>
    </div>
  );
}

function Choice({ label, field, form, updateForm, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="pill-row">
        {Object.entries(options).map(([value,text])=>(
          <button key={value} className={`pill ${form[field]===value?"pill-active":""}`} onClick={()=>updateForm(field,value)}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="toggle-row">
      {label}
      <button className={`toggle ${value?"toggle-on":"toggle-off"}`} onClick={()=>onChange(!value)}>
        <span className="toggle-thumb"/>
      </button>
    </div>
  );
}
