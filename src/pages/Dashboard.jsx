import { useNavigate } from "react-router-dom"
import {
  ClipboardList, Leaf, Stethoscope, History,
  FlaskConical, TrendingUp, Zap, Heart, ArrowRight, Activity
} from "lucide-react"

const CARDS = [
  {
    icon: ClipboardList, label: "Start Assessment", desc: "Answer 5-step health questionnaire",
    to: "/assessment", gradient: "linear-gradient(135deg,#1B5E20,#2E7D32)", badge: "5 min"
  },
  {
    icon: FlaskConical, label: "Dosha Analysis", desc: "View your Ayurvedic constitution",
    to: "/dosha", gradient: "linear-gradient(135deg,#1a237e,#283593)", badge: "Updated"
  },
  {
    icon: Leaf, label: "Herbal Remedies", desc: "Personalized herb recommendations",
    to: "/remedies", gradient: "linear-gradient(135deg,#1B5E20,#388E3C)", badge: "28 herbs"
  },
  {
    icon: Stethoscope, label: "Consult Doctor", desc: "Book with Ayurvedic specialists",
    to: "/doctors", gradient: "linear-gradient(135deg,#4a1942,#6a1b9a)", badge: "12 online"
  },
  {
    icon: History, label: "Wellness History", desc: "Track your health progress",
    to: "/history", gradient: "linear-gradient(135deg,#1a3a1a,#2d5a2d)", badge: "6 records"
  },
]

const STATS = [
  { icon: Activity, label: "Health Score", value: "82", unit: "/100", color: "#4CAF50" },
  { icon: Heart, label: "Wellness Streak", value: "14", unit: "days", color: "#ef4444" },
  { icon: Zap, label: "Assessments", value: "6", unit: "done", color: "#f59e0b" },
  { icon: TrendingUp, label: "Improvement", value: "+12", unit: "%", color: "#60a5fa" },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg,#0d2e0d,#1a3a1a,#0f2f1a)",
        border: "1px solid rgba(76,175,80,0.15)",
        borderRadius: 20,
        padding: "36px 40px",
        marginBottom: 28,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", right: -60, top: -60,
          width: 220, height: 220,
          background: "radial-gradient(circle,rgba(76,175,80,0.12),transparent 70%)",
          borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute", right: 100, bottom: -40,
          width: 140, height: 140,
          background: "radial-gradient(circle,rgba(27,94,32,0.2),transparent 70%)",
          borderRadius: "50%"
        }} />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF50" }} />
            <span style={{ fontSize: "0.75rem", color: "#4CAF50", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Your AI Wellness Partner
            </span>
          </div>
          <h2 style={{  fontSize: "2rem", fontWeight: 700, color: "#f5f5f5", margin: "0 0 8px", lineHeight: 1.2 }}>
            Good Morning, <span style={{ color: "#4CAF50" }}>Arjun</span> 🌿
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem", margin: "0 0 24px", maxWidth: 480 }}>
            Your Dosha profile shows a <strong style={{ color: "#81C784" }}>Vata dominance</strong>. Today's focus: grounding practices and warm, nourishing foods.
          </p>
          <button className="btn-primary" onClick={() => navigate("/assessment")} style={{ fontSize: "0.875rem" }}>
            Continue Assessment <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {STATS.map(({ icon: Icon, label, value, unit, color }) => (
          <div key={label} style={{
            background:"white",
            border: "2px solid gary",
            borderRadius: 14,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }} className="shadow-xl">
            <div style={{
              width: 42, height: 42,
              background: `${color}18`,
              border: `1px solid ${color}30`,
              borderRadius: 12,
            
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }} >
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "black" }}>{value}</span>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{unit}</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f5f5f5", marginBottom: 16 }}>
          Quick Actions
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {CARDS.map(({ icon: Icon, label, desc, to, gradient, badge }) => (
            <div
              key={to}
              className="card-hover"
              onClick={() => navigate(to)}
              style={{
                background: "white",
                color:"black",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "22px",
                position: "relative",
                overflow: "hidden",
              }}
               className="shadow-2xl"
            >
              {/* Gradient accent top */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "white", borderRadius: "16px 16px 0 0" }} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44,
                  background: gradient,
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={20} color="white" />
                </div>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 600, padding: "3px 8px",
                  borderRadius: 100,
                  background: "white",
                  color: "#4CAF50",
                  border: "1px solid rgba(76,175,80,0.15)"
                }}>{badge}</span>
              </div>

              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "black", margin: "0 0 5px" }}>{label}</h4>
              <p style={{ fontSize: "0.78rem", color: "#6b7280", margin: "0 0 14px", lineHeight: 1.4 }}>{desc}</p>
              
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#4CAF50", fontSize: "0.78rem", fontWeight: 600 }}>
                Open <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Daily Tip */}
      <div style={{
        marginTop: 24,
        background: "#1a1a1a",
        border: "1px solid rgba(76,175,80,0.15)",
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}>
        <div style={{
          width: 48, height: 48,
          background: "linear-gradient(135deg,#1B5E20,#4CAF50)",
          borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Leaf size={22} color="white" />
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", color: "#4CAF50", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Daily Ayurvedic Tip</div>
          <p style={{ fontSize: "0.875rem", color: "#d1d5db", margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: "#f5f5f5" }}>Ashwagandha root</strong> taken with warm milk before bed balances Vata dosha and promotes deep, restful sleep. Consistency is key — try 14 days.
          </p>
        </div>
      </div>
    </div>
  )
}
