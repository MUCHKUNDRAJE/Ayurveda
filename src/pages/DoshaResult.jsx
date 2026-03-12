import { useNavigate } from "react-router-dom"
import { Wind, Flame, Droplets, ArrowRight, CheckCircle } from "lucide-react"

const DOSHAS = [
  {
    name: "Vata", pct: 52, icon: Wind, color: "#60a5fa", glow: "rgba(96,165,250,0.2)",
    element: "Air & Space",
    traits: ["Creative & Quick-thinking", "Light & Enthusiastic", "Adaptable & Flexible"],
    imbalance: ["Anxiety & Restlessness", "Dry skin & Hair", "Poor circulation"],
    foods: "Warm, oily, heavy foods. Sweet, sour, salty tastes.",
    desc: "Vata governs movement, breathing, and nervous system. You are naturally creative and enthusiastic."
  },
  {
    name: "Pitta", pct: 31, icon: Flame, color: "#f59e0b", glow: "rgba(245,158,11,0.2)",
    element: "Fire & Water",
    traits: ["Intelligent & Focused", "Driven & Ambitious", "Strong digestion"],
    imbalance: ["Inflammation", "Anger & Irritability", "Acid reflux"],
    foods: "Cool, sweet, bitter, astringent foods. Avoid spicy.",
    desc: "Pitta governs digestion, metabolism, and transformation. You have strong leadership qualities."
  },
  {
    name: "Kapha", pct: 17, icon: Droplets, color: "#34d399", glow: "rgba(52,211,153,0.2)",
    element: "Earth & Water",
    traits: ["Calm & Nurturing", "Loyal & Patient", "Strong endurance"],
    imbalance: ["Weight gain", "Congestion", "Lethargy"],
    foods: "Light, dry, warm foods. Pungent, bitter, astringent tastes.",
    desc: "Kapha provides structure, lubrication, and stability. You have natural compassion and strength."
  },
]

function CircleChart({ pct, color, glow, size = 120 }) {
  const r = 44
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
      }}>
        <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f5f5f5", lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>{pct}%</span>
      </div>
    </div>
  )
}

export default function DoshaResult() {
  const navigate = useNavigate()
  const dominant = DOSHAS[0]

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Hero result banner */}
      <div style={{
        background: "linear-gradient(135deg,#0a1628,#111827,#0d2010)",
        border: "1px solid rgba(96,165,250,0.15)",
        borderRadius: 20,
        padding: "32px 36px",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 180, height: 180, background: "radial-gradient(circle,rgba(96,165,250,0.1),transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", left: 300, bottom: -30, width: 120, height: 120, background: "radial-gradient(circle,rgba(76,175,80,0.08),transparent 70%)", borderRadius: "50%" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 28, position: "relative" }}>
          <div style={{
            width: 72, height: 72,
            background: "linear-gradient(135deg,#1565c0,#1976d2)",
            borderRadius: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(96,165,250,0.2)",
            flexShrink: 0,
          }}>
            <Wind size={32} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#60a5fa", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              Your Dominant Dosha
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#f5f5f5", margin: "0 0 6px", fontWeight: 700 }}>
              Vata Constitution
            </h2>
            <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.875rem", maxWidth: 500, lineHeight: 1.5 }}>
              {dominant.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Dosha Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {DOSHAS.map(({ name, pct, icon: Icon, color, glow, element }) => (
          <div key={name} style={{
            background: "#1a1a1a",
            border: `1px solid rgba(255,255,255,0.06)`,
            borderRadius: 16,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            transition: "all 0.25s",
          }}>
            <CircleChart pct={pct} color={color} glow={glow} size={110} />
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
                <Icon size={15} style={{ color }} />
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "#f5f5f5", fontFamily: "'Playfair Display', serif" }}>{name}</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{element}</div>
            </div>
            {/* Mini bar */}
            <div style={{ width: "100%" }}>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color}99,${color})` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {DOSHAS.slice(0,2).map(({ name, color, traits, imbalance, foods }) => (
          <div key={name} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 24px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.07em" }}>{name} Profile</div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: "0.72rem", color: "#6b7280", marginBottom: 8, fontWeight: 600 }}>STRENGTHS</div>
              {traits.map(t => (
                <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <CheckCircle size={13} style={{ color: "#4CAF50", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: "#d1d5db" }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: "0.72rem", color: "#6b7280", marginBottom: 8, fontWeight: 600 }}>IMBALANCE SIGNS</div>
              {imbalance.map(t => (
                <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: "#d1d5db" }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: "10px 14px", background: "rgba(76,175,80,0.06)", border: "1px solid rgba(76,175,80,0.12)", borderRadius: 10 }}>
              <div style={{ fontSize: "0.7rem", color: "#4CAF50", fontWeight: 700, marginBottom: 4 }}>DIETARY GUIDANCE</div>
              <p style={{ fontSize: "0.78rem", color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>{foods}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-primary" onClick={() => navigate("/remedies")} style={{ flex: 1 }}>
          View Personalized Remedies <ArrowRight size={15} />
        </button>
        <button className="btn-ghost" onClick={() => navigate("/doctors")} style={{ flex: 1 }}>
          Consult an Expert
        </button>
      </div>
    </div>
  )
}
