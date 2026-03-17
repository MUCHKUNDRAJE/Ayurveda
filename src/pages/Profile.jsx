import { useState } from "react"
import { Wind, Edit3, Check, Camera, Shield, Bell, Moon } from "lucide-react"

const STATS = [
  { label: "Assessments", value: "6", color: "#4CAF50" },
  { label: "Consultations", value: "3", color: "#60a5fa" },
  { label: "Streak Days", value: "14", color: "#f59e0b" },
  { label: "Health Score", value: "82", color: "#a78bfa" },
]

const HEALTH_METRICS = [
  { label: "Overall Wellness", value: 82, color: "#4CAF50" },
  { label: "Digestive Health", value: 68, color: "#f59e0b" },
  { label: "Mental Clarity", value: 74, color: "#60a5fa" },
  { label: "Sleep Quality", value: 61, color: "#a78bfa" },
  { label: "Energy Level", value: 79, color: "#34d399" },
]

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: "Admin",
    email: "admin@email.com",
    age: "28",
    phone: "+91 98765 43210",
    city: "Mumbai, Maharashtra",
    dosha: "Vata",
  })
  const [saved, setSaved] = useState(false)

  const save = () => {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {saved && (
        <div className="animate-fade-in" style={{ background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.2)", borderRadius: 12, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: "#4CAF50", fontSize: "0.875rem" }}>
          <Check size={15} /> Profile saved successfully!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
        {/* Left: Avatar card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "28px 20px", textAlign: "center" }}>
            {/* Avatar */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
              <div style={{
                width: 88, height: 88, borderRadius: "50%",
                background: "linear-gradient(135deg,#1B5E20,#4CAF50)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem", fontWeight: 700, color: "white",
                fontFamily: "'Playfair Display', serif",
                border: "3px solid rgba(76,175,80,0.3)",
              }}>A</div>
              <button style={{
                position: "absolute", bottom: 0, right: 0,
                width: 26, height: 26, borderRadius: "50%",
                background: "#2E7D32", border: "2px solid #1a1a1a",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
                <Camera size={12} color="white" />
              </button>
            </div>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#f5f5f5", margin: "0 0 4px" }}>{form.name}</h2>
            <p style={{ fontSize: "0.78rem", color: "#9ca3af", margin: "0 0 12px" }}>{form.email}</p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 100 }}>
              <Wind size={13} style={{ color: "#60a5fa" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#60a5fa" }}>Vata Dominant</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 18 }}>
              {STATS.map(({ label, value, color }) => (
                <div key={label} style={{ padding: "10px 8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color, fontFamily: "'Playfair Display', serif" }}>{value}</div>
                  <div style={{ fontSize: "0.65rem", color: "#6b7280", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings toggles */}
          <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Preferences</div>
            {[
              [Bell, "Notifications", true],
              [Moon, "Dark Mode", true],
              [Shield, "Privacy Mode", false],
            ].map(([Icon, label, on]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon size={15} style={{ color: "#6b7280" }} />
                  <span style={{ fontSize: "0.825rem", color: "#d1d5db" }}>{label}</span>
                </div>
                <div style={{
                  width: 36, height: 20, borderRadius: 100,
                  background: on ? "linear-gradient(90deg,#2E7D32,#4CAF50)" : "rgba(255,255,255,0.1)",
                  cursor: "pointer", position: "relative",
                }}>
                  <div style={{ position: "absolute", top: 3, left: on ? 18 : 3, width: 14, height: 14, borderRadius: "50%", background: "white", transition: "left 0.2s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info + metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile form */}
          <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#f5f5f5", margin: 0 }}>Personal Information</h3>
              {editing
                ? <button className="btn-primary" style={{ padding: "7px 16px", fontSize: "0.8rem" }} onClick={save}><Check size={14} /> Save</button>
                : <button className="btn-ghost" style={{ padding: "7px 16px", fontSize: "0.8rem" }} onClick={() => setEditing(true)}><Edit3 size={14} /> Edit</button>
              }
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              {[
                ["Full Name", "name", "text"],
                ["Age", "age", "number"],
                ["Email", "email", "email"],
                ["Phone", "phone", "tel"],
                ["City", "city", "text"],
                ["Dominant Dosha", "dosha", "text"],
              ].map(([label, field, type]) => (
                <div key={field} style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>{label}</label>
                  {editing
                    ? <input className="input-dark" type={type} value={form[field]} onChange={set(field)} />
                    : <p style={{ fontSize: "0.875rem", color: "#f5f5f5", margin: 0, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{form[field]}</p>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Health Metrics */}
          <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 26px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#f5f5f5", margin: "0 0 18px" }}>Health Metrics</h3>
            {HEALTH_METRICS.map(({ label, value, color }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.825rem", color: "#d1d5db" }}>{label}</span>
                  <span style={{ fontSize: "0.825rem", fontWeight: 700, color }}>{value}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${value}%`, background: `linear-gradient(90deg,${color}80,${color})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
