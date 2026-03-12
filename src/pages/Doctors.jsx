import { useState } from "react"
import { Star, Clock, MapPin, Calendar, CheckCircle, Video, Search } from "lucide-react"

const DOCTORS = [
  {
    name: "Dr. Priya Sharma",
    spec: "Panchakarma & Detox",
    exp: "14 years",
    location: "Mumbai, Maharashtra",
    rating: 4.9, reviews: 312,
    fee: "₹800",
    dosha: "Vata specialist",
    available: true,
    initials: "PS",
    color: "linear-gradient(135deg,#1B5E20,#4CAF50)",
    nextSlot: "Today, 3:00 PM",
    langs: ["Hindi", "English", "Marathi"],
    tags: ["Stress Management", "Detox", "Digestive Health"]
  },
  {
    name: "Dr. Rajesh Nair",
    spec: "Ayurvedic Nutrition",
    exp: "11 years",
    location: "Bangalore, Karnataka",
    rating: 4.8, reviews: 241,
    fee: "₹600",
    dosha: "Pitta specialist",
    available: true,
    initials: "RN",
    color: "linear-gradient(135deg,#1565c0,#1976d2)",
    nextSlot: "Tomorrow, 10:00 AM",
    langs: ["Kannada", "English", "Tamil"],
    tags: ["Nutrition", "Weight Management", "Diabetes"]
  },
  {
    name: "Dr. Anita Bose",
    spec: "Women's Ayurveda",
    exp: "9 years",
    location: "Kolkata, West Bengal",
    rating: 4.7, reviews: 189,
    fee: "₹700",
    dosha: "Kapha specialist",
    available: false,
    initials: "AB",
    color: "linear-gradient(135deg,#6a1b9a,#7b1fa2)",
    nextSlot: "Wed, 2:00 PM",
    langs: ["Bengali", "Hindi", "English"],
    tags: ["Women's Health", "PCOD", "Hormonal Balance"]
  },
  {
    name: "Dr. Suresh Patel",
    spec: "Orthopedic Ayurveda",
    exp: "16 years",
    location: "Ahmedabad, Gujarat",
    rating: 4.9, reviews: 428,
    fee: "₹900",
    dosha: "Vata-Pitta specialist",
    available: true,
    initials: "SP",
    color: "linear-gradient(135deg,#e65100,#f57c00)",
    nextSlot: "Today, 5:30 PM",
    langs: ["Gujarati", "Hindi", "English"],
    tags: ["Joint Pain", "Arthritis", "Spine Health"]
  },
  {
    name: "Dr. Meera Iyer",
    spec: "Skin & Hair Ayurveda",
    exp: "8 years",
    location: "Chennai, Tamil Nadu",
    rating: 4.8, reviews: 203,
    fee: "₹650",
    dosha: "Pitta specialist",
    available: true,
    initials: "MI",
    color: "linear-gradient(135deg,#ad1457,#c2185b)",
    nextSlot: "Tomorrow, 11:00 AM",
    langs: ["Tamil", "English"],
    tags: ["Skin Disorders", "Hair Loss", "Anti-aging"]
  },
  {
    name: "Dr. Vikram Singh",
    spec: "Mental Wellness & Yoga",
    exp: "12 years",
    location: "Delhi, NCR",
    rating: 4.6, reviews: 156,
    fee: "₹750",
    dosha: "Vata specialist",
    available: false,
    initials: "VS",
    color: "linear-gradient(135deg,#1a237e,#283593)",
    nextSlot: "Thu, 9:00 AM",
    langs: ["Hindi", "English", "Punjabi"],
    tags: ["Anxiety", "Depression", "Sleep Disorders"]
  },
]

export default function Doctors() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [booked, setBooked] = useState(null)

  const filtered = DOCTORS.filter(d =>
    (filter === "All" || (filter === "Available" && d.available) || d.spec.includes(filter)) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Search bar */}
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 14px" }}>
          <Search size={15} style={{ color: "#6b7280" }} />
          <input
            placeholder="Search doctors by name or specialization…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: "none", border: "none", outline: "none", color: "#f5f5f5", fontSize: "0.875rem", width: "100%", fontFamily: "'Geist Variable', sans-serif" }}
          />
        </div>
        {["All", "Available"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 16px", borderRadius: 10, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
            background: filter === f ? "rgba(76,175,80,0.15)" : "transparent",
            color: filter === f ? "#4CAF50" : "#6b7280",
            border: `1px solid ${filter === f ? "rgba(76,175,80,0.3)" : "rgba(255,255,255,0.07)"}`,
            transition: "all 0.2s",
          }}>{f}</button>
        ))}
      </div>

      {/* Booked confirmation */}
      {booked && (
        <div style={{
          background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.2)",
          borderRadius: 12, padding: "14px 18px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 10,
        }} className="animate-fade-in">
          <CheckCircle size={18} style={{ color: "#4CAF50" }} />
          <span style={{ color: "#d1d5db", fontSize: "0.875rem" }}>
            Appointment booked with <strong style={{ color: "#f5f5f5" }}>{booked}</strong>. Check your email for confirmation.
          </span>
          <button onClick={() => setBooked(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "1rem" }}>×</button>
        </div>
      )}

      {/* Doctor grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {filtered.map((doc) => (
          <div key={doc.name} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ height: 4, background: doc.color }} />
            <div style={{ padding: "20px 22px" }}>
              {/* Header */}
              <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: doc.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", fontWeight: 700, color: "white", flexShrink: 0,
                  fontFamily: "'Playfair Display', serif",
                }}>
                  {doc.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f5f5f5", margin: "0 0 2px", fontFamily: "'Playfair Display', serif" }}>{doc.name}</h3>
                      <p style={{ fontSize: "0.78rem", color: "#9ca3af", margin: "0 0 4px" }}>{doc.spec}</p>
                    </div>
                    <div style={{
                      padding: "3px 10px", borderRadius: 100, fontSize: "0.65rem", fontWeight: 700,
                      background: doc.available ? "rgba(76,175,80,0.1)" : "rgba(255,255,255,0.05)",
                      color: doc.available ? "#4CAF50" : "#6b7280",
                      border: `1px solid ${doc.available ? "rgba(76,175,80,0.25)" : "rgba(255,255,255,0.08)"}`,
                    }}>
                      {doc.available ? "● Online" : "○ Offline"}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={12} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f5f5f5" }}>{doc.rating}</span>
                    <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>({doc.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                {doc.tags.map(t => (
                  <span key={t} style={{ fontSize: "0.65rem", padding: "2px 9px", borderRadius: 100, background: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.07)" }}>{t}</span>
                ))}
              </div>

              {/* Info row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[
                  [Clock, `${doc.exp} exp`, "#9ca3af"],
                  [MapPin, doc.location, "#9ca3af"],
                  [Calendar, doc.nextSlot, "#4CAF50"],
                  [Video, doc.dosha, "#60a5fa"],
                ].map(([Icon, text, color], i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <Icon size={12} style={{ color, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.74rem", color }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f5f5f5", fontFamily: "'Playfair Display', serif" }}>{doc.fee}</span>
                  <span style={{ fontSize: "0.72rem", color: "#6b7280" }}> / session</span>
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: "8px 18px", fontSize: "0.8rem" }}
                  onClick={() => setBooked(doc.name)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
