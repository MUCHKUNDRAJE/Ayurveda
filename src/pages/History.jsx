import { Wind, Flame, Droplets, FileText, TrendingUp, Calendar } from "lucide-react"

const RECORDS = [
  { id: 1, date: "Mar 10, 2026", dosha: "Vata 52% · Pitta 31%", dominant: "Vata", rec: "Ashwagandha, warm diet, grounding yoga", score: 82, change: "+5" },
  { id: 2, date: "Feb 14, 2026", dosha: "Vata 48% · Pitta 34%", dominant: "Vata", rec: "Triphala, oil massage, early bedtime", score: 77, change: "+8" },
  { id: 3, date: "Jan 22, 2026", dosha: "Pitta 41% · Vata 38%", dominant: "Pitta", rec: "Brahmi, coconut oil, cooling foods", score: 69, change: "+3" },
  { id: 4, date: "Dec 8, 2025", dosha: "Pitta 44% · Kapha 32%", dominant: "Pitta", rec: "Shatavari, reduce spice, meditation", score: 66, change: "-2" },
  { id: 5, date: "Nov 15, 2025", dosha: "Vata 50% · Pitta 29%", dominant: "Vata", rec: "Ashwagandha, sesame oil, warm milk", score: 68, change: "+11" },
  { id: 6, date: "Oct 3, 2025", dosha: "Kapha 46% · Vata 35%", dominant: "Kapha", rec: "Turmeric, light diet, morning exercise", score: 57, change: "—" },
]

const DOSHA_ICON = { Vata: Wind, Pitta: Flame, Kapha: Droplets }
const DOSHA_COLOR = { Vata: "#60a5fa", Pitta: "#f59e0b", Kapha: "#34d399" }

export default function History() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { icon: FileText, label: "Total Assessments", value: "6", color: "#4CAF50", bg: "rgba(76,175,80,0.1)" },
          { icon: TrendingUp, label: "Score Improvement", value: "+25pts", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
          { icon: Calendar, label: "Last Assessment", value: "Mar 10", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, background: bg, border: `1px solid ${color}25`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#f5f5f5", fontFamily: "'Playfair Display', serif" }}>{value}</div>
              <div style={{ fontSize: "0.74rem", color: "#9ca3af" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Score trend bar chart */}
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 26px", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#f5f5f5", margin: "0 0 20px" }}>Health Score Trend</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100 }}>
          {[...RECORDS].reverse().map(({ date, score, dominant }) => {
            const DIcon = DOSHA_ICON[dominant]
            const color = DOSHA_COLOR[dominant]
            return (
              <div key={date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#f5f5f5" }}>{score}</span>
                <div style={{
                  width: "100%",
                  height: `${score}%`,
                  background: `linear-gradient(to top,${color}30,${color}80)`,
                  border: `1px solid ${color}40`,
                  borderRadius: "6px 6px 0 0",
                  transition: "height 0.8s ease",
                }} />
                <DIcon size={11} style={{ color }} />
                <span style={{ fontSize: "0.6rem", color: "#4b5563", textAlign: "center" }}>{date.split(",")[0]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#f5f5f5", margin: 0 }}>Assessment History</h3>
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{RECORDS.length} records</span>
        </div>

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 80px 100px", gap: 0, padding: "10px 24px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {["Date", "Dosha Result", "Recommendation", "Score", ""].map(h => (
            <span key={h} style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {RECORDS.map(({ id, date, dosha, dominant, rec, score, change }, i) => {
          const DIcon = DOSHA_ICON[dominant]
          const color = DOSHA_COLOR[dominant]
          const changeColor = change.startsWith("+") ? "#4CAF50" : change === "—" ? "#6b7280" : "#ef4444"
          return (
            <div key={id} style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr 1fr 80px 100px",
              gap: 0,
              padding: "14px 24px",
              borderBottom: i < RECORDS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              alignItems: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{date}</span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <DIcon size={12} style={{ color }} />
                  <span style={{ fontSize: "0.8rem", color: "#d1d5db" }}>{dosha}</span>
                </div>
                <span style={{ fontSize: "0.68rem", color, fontWeight: 600 }}>{dominant} dominant</span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#9ca3af", lineHeight: 1.4 }}>{rec}</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "#f5f5f5", fontFamily: "'Playfair Display', serif" }}>{score}</span>
                <span style={{ fontSize: "0.68rem", color: changeColor, fontWeight: 600 }}>{change}</span>
              </div>
              <button style={{
                padding: "6px 14px",
                background: "rgba(76,175,80,0.08)",
                border: "1px solid rgba(76,175,80,0.2)",
                borderRadius: 8,
                color: "#4CAF50",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(76,175,80,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(76,175,80,0.08)"}
              >
                View Report
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
