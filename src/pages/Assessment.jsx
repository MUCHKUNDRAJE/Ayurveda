import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight, ChevronLeft, Check, User, Heart, Leaf, Brain, MapPin } from "lucide-react"

const STEPS = [
  { id: 1, label: "Patient Details", icon: User },
  { id: 2, label: "Background", icon: MapPin },
  { id: 3, label: "Medical Issues", icon: Heart },
  { id: 4, label: "Other Health", icon: Leaf },
  { id: 5, label: "Awareness", icon: Brain },
]

const VILLAGES = [
  "Nildoha","Digdoha","Junewani","Mandavghorad","Isasani","Amgao","Devli",
  "Waddhamana","Nagalwadi","Kinhi","Khadki","Metaumari","Mondha","Raipur",
  "Salaidabha","Sukali","Yerangao","Kotewada","Pipaldhara"
]

const MEDICINE_CONDITIONS = [
  "Diabetes","Hypertension","Asthama","Heart disease","Paralysis",
  "Breathlessness / Weakness","Skin Disease","Obesity","Acidity / Hyper Acidity",
  "Arthritis / Knee pain / Back pain","Thyroid"
]
const SURGERY_CONDITIONS = [
  "Urine Disorder","Hernia","Hydrocele","Cyst","Kidney Stone",
  "Piles / Haemorrhoids","Fistula","Corn","Diabetic Wounds / Venous Ulcers"
]
const GYNECOLOGY = [
  "Menstrual Disorder","Abnormal vaginal bleeding","Uterine Prolapse",
  "Infertility","White Discharge","Cyst in a breast","PCOD","ANC"
]
const PEDIATRICS = [
  "Allergic Rhinitis","Malnourish Children","Difficulty in Speech",
  "Convulsions","Not gaining weight","Cerebral Palsy","Obesity in Children","Mentally Deficient"
]
const ENT = [
  "Diminished Vision","Discharge from eye","Squint","Pterygium",
  "Ear discharge","DNS","Migraine"
]
const AWARENESS_SOURCES = [
  "Flex boards / Posters","Newspaper","Social Media","Health Camp",
  "Referred by Doctor","Friends / Family","I have not heard about it"
]

function Label({ children, required }) {
  return (
    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#d1d5db", marginBottom: 7, display: "block" }}>
      {children} {required && <span style={{ color: "#ef4444" }}>*</span>}
    </label>
  )
}

function Field({ children }) {
  return <div style={{ marginBottom: 18 }}>{children}</div>
}

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
      {options.map(opt => (
        <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#d1d5db", fontSize: "0.875rem" }}>
          <input type="radio" className="radio-custom" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} />
          {opt}
        </label>
      ))}
    </div>
  )
}

function CheckGroup({ options, values, onChange }) {
  const toggle = (opt) => {
    if (values.includes(opt)) onChange(values.filter(v => v !== opt))
    else onChange([...values, opt])
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
      {options.map(opt => (
        <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#d1d5db", fontSize: "0.825rem" }}>
          <input type="checkbox" className="checkbox-custom" checked={values.includes(opt)} onChange={() => toggle(opt)} />
          {opt}
        </label>
      ))}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#4CAF50", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, marginTop: 20, paddingBottom: 8, borderBottom: "1px solid rgba(76,175,80,0.15)" }}>
      {children}
    </div>
  )
}

export default function Assessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    // Step 1 - Patient Details
    patientName: "", age: "", gender: "", mobile: "", education: "", occupation: "",
    // Step 2 - Background
    email: "", date: "", rollNumber: "", studentPhone: "", studentEmail: "", village: "", ward: "",
    // Step 3 - Medical conditions
    medicineConditions: [], surgeryConditions: [],
    // Step 4 - Gynecology, Pediatrics, ENT
    gynecology: [], pediatrics: [], ent: [], otherIssues: "",
    // Step 5 - Awareness
    heardAbout: "", awarenessSource: [],
  })

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const setVal = (field, val) => setForm(f => ({ ...f, [field]: val }))
  const setArr = (field) => (arr) => setForm(f => ({ ...f, [field]: arr }))

  const pct = Math.round((step / STEPS.length) * 100)

  const handleNext = () => {
    if (step < STEPS.length) setStep(s => s + 1)
    else {
      setSubmitted(true)
      setTimeout(() => navigate("/dosha"), 2000)
    }
  }

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 20 }}>
        <div style={{
          width: 72, height: 72,
          background: "linear-gradient(135deg,#1B5E20,#4CAF50)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Check size={34} color="white" />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#f5f5f5", margin: 0 }}>Assessment Submitted!</h2>
        <p style={{ color: "#9ca3af", margin: 0 }}>Analyzing your Dosha profile… Redirecting.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Progress header */}
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 26px", marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Step {step} of {STEPS.length}</span>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#4CAF50" }}>{pct}% complete</span>
        </div>
        <div className="progress-bar" style={{ marginBottom: 16 }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        {/* Step pills */}
        <div style={{ display: "flex", gap: 6 }}>
          {STEPS.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                cursor: id < step ? "pointer" : "default",
                opacity: id > step ? 0.45 : 1,
              }}
              onClick={() => id < step && setStep(id)}
            >
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: id < step ? "#2E7D32" : id === step ? "linear-gradient(135deg,#2E7D32,#4CAF50)" : "rgba(255,255,255,0.06)",
                border: id === step ? "2px solid #4CAF50" : "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease",
              }}>
                {id < step
                  ? <Check size={14} color="white" />
                  : <Icon size={14} color={id === step ? "white" : "#6b7280"} />
                }
              </div>
              <span style={{ fontSize: "0.65rem", color: id === step ? "#4CAF50" : "#6b7280", fontWeight: id === step ? 700 : 400, textAlign: "center", lineHeight: 1.2 }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "28px 30px", marginBottom: 20 }}>
        
        {/* STEP 1: Patient Details */}
        {step === 1 && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#f5f5f5", margin: "0 0 4px" }}>Patient Information</h3>
            <p style={{ color: "#6b7280", fontSize: "0.825rem", margin: "0 0 22px" }}>Primary health details for your wellness profile.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field>
                <Label required>Patient Full Name</Label>
                <input className="input-dark" placeholder="Enter full name" value={form.patientName} onChange={set("patientName")} />
              </Field>
              <Field>
                <Label required>Age</Label>
                <input className="input-dark" type="number" placeholder="e.g. 32" value={form.age} onChange={set("age")} />
              </Field>
            </div>

            <Field>
              <Label required>Mobile Number</Label>
              <input className="input-dark" type="tel" placeholder="10-digit mobile number" value={form.mobile} onChange={set("mobile")} />
            </Field>

            <Field>
              <Label required>Gender</Label>
              <RadioGroup name="gender" options={["Female","Male","Transgender"]} value={form.gender} onChange={v => setVal("gender", v)} />
            </Field>

            <Field>
              <Label required>Education Level</Label>
              <RadioGroup name="education" options={["Illiterate","Upto 10th standard","HSC","Graduate","Postgraduate and above"]} value={form.education} onChange={v => setVal("education", v)} />
            </Field>

            <Field>
              <Label required>Occupation</Label>
              <RadioGroup name="occupation" options={["Student","Homemaker","Private Job","Government Job","Business / Self Employed","Retired","Unemployed"]} value={form.occupation} onChange={v => setVal("occupation", v)} />
            </Field>
          </div>
        )}

        {/* STEP 2: Background */}
        {step === 2 && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#f5f5f5", margin: "0 0 4px" }}>Location & Registration</h3>
            <p style={{ color: "#6b7280", fontSize: "0.825rem", margin: "0 0 22px" }}>Location and student registration information.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field>
                <Label required>Email Address</Label>
                <input className="input-dark" type="email" placeholder="patient@email.com" value={form.email} onChange={set("email")} />
              </Field>
              <Field>
                <Label required>Date</Label>
                <input className="input-dark" type="date" value={form.date} onChange={set("date")} style={{ colorScheme: "dark" }} />
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field>
                <Label>Roll Number (e.g. 2023001)</Label>
                <input className="input-dark" placeholder="2023001" value={form.rollNumber} onChange={set("rollNumber")} />
              </Field>
              <Field>
                <Label>Student Phone Number</Label>
                <input className="input-dark" type="tel" placeholder="Student contact" value={form.studentPhone} onChange={set("studentPhone")} />
              </Field>
            </div>

            <Field>
              <Label>Student Email Address</Label>
              <input className="input-dark" type="email" placeholder="student@college.edu" value={form.studentEmail} onChange={set("studentEmail")} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field>
                <Label required>Village Name</Label>
                <select className="select-dark" value={form.village} onChange={set("village")}>
                  <option value="">Select village…</option>
                  {VILLAGES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>
              <Field>
                <Label required>Ward / Area</Label>
                <input className="input-dark" placeholder="Ward or area name" value={form.ward} onChange={set("ward")} />
              </Field>
            </div>
          </div>
        )}

        {/* STEP 3: Medical Conditions */}
        {step === 3 && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#f5f5f5", margin: "0 0 4px" }}>Medical Conditions</h3>
            <p style={{ color: "#6b7280", fontSize: "0.825rem", margin: "0 0 22px" }}>Select all conditions that apply. Multiple selections allowed.</p>

            <SectionTitle>Medicine / Panchakarma</SectionTitle>
            <CheckGroup options={MEDICINE_CONDITIONS} values={form.medicineConditions} onChange={setArr("medicineConditions")} />

            <SectionTitle>Surgery Related</SectionTitle>
            <CheckGroup options={SURGERY_CONDITIONS} values={form.surgeryConditions} onChange={setArr("surgeryConditions")} />
          </div>
        )}

        {/* STEP 4: Other Health Issues */}
        {step === 4 && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#f5f5f5", margin: "0 0 4px" }}>Specialized Health Issues</h3>
            <p style={{ color: "#6b7280", fontSize: "0.825rem", margin: "0 0 22px" }}>Select any relevant specialized conditions.</p>

            <SectionTitle>Gynecology</SectionTitle>
            <CheckGroup options={GYNECOLOGY} values={form.gynecology} onChange={setArr("gynecology")} />

            <SectionTitle>Pediatrics</SectionTitle>
            <CheckGroup options={PEDIATRICS} values={form.pediatrics} onChange={setArr("pediatrics")} />

            <SectionTitle>Ophthalmology & ENT</SectionTitle>
            <CheckGroup options={ENT} values={form.ent} onChange={setArr("ent")} />

            <div style={{ marginTop: 20 }}>
              <Label>Any Other Health Issues</Label>
              <textarea
                className="input-dark"
                placeholder="Describe any other health concerns…"
                value={form.otherIssues}
                onChange={set("otherIssues")}
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>
        )}

        {/* STEP 5: Awareness */}
        {step === 5 && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#f5f5f5", margin: "0 0 4px" }}>Awareness & Source</h3>
            <p style={{ color: "#6b7280", fontSize: "0.825rem", margin: "0 0 22px" }}>How did you learn about Datta Meghe Ayurved Medical College & Hospital?</p>

            <Field>
              <Label required>Have you heard about DMAMCHRC?</Label>
              <RadioGroup name="heardAbout" options={["Yes","No"]} value={form.heardAbout} onChange={v => setVal("heardAbout", v)} />
            </Field>

            <Field>
              <Label required>How did you hear about us? (Select all that apply)</Label>
              <CheckGroup options={AWARENESS_SOURCES} values={form.awarenessSource} onChange={setArr("awarenessSource")} />
            </Field>

            {/* Summary */}
            <div style={{
              background: "rgba(76,175,80,0.06)",
              border: "1px solid rgba(76,175,80,0.15)",
              borderRadius: 12,
              padding: "16px 20px",
              marginTop: 20,
            }}>
              <div style={{ fontSize: "0.75rem", color: "#4CAF50", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Assessment Summary
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
                {[
                  ["Patient", form.patientName || "—"],
                  ["Age", form.age || "—"],
                  ["Gender", form.gender || "—"],
                  ["Village", form.village || "—"],
                  ["Conditions", [...form.medicineConditions, ...form.surgeryConditions].length || 0],
                ].map(([k, v]) => (
                  <div key={k} style={{ fontSize: "0.8rem" }}>
                    <span style={{ color: "#6b7280" }}>{k}: </span>
                    <span style={{ color: "#d1d5db", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="btn-ghost"
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate("/dashboard")}
          style={{ minWidth: 120 }}
        >
          <ChevronLeft size={16} /> {step > 1 ? "Back" : "Dashboard"}
        </button>
        <button className="btn-primary" onClick={handleNext} style={{ minWidth: 160 }}>
          {step === STEPS.length ? "Submit Assessment" : "Continue"}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
