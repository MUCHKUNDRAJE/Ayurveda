import { Bell, Search, ChevronDown } from "lucide-react"
import { useLocation } from "react-router-dom"

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard", sub: "Welcome back, Arjun 👋" },
  "/assessment": { title: "Health Assessment", sub: "Complete your wellness evaluation" },
  "/dosha": { title: "Dosha Analysis", sub: "Your Ayurvedic constitution" },
  "/remedies": { title: "Herbal Remedies", sub: "Nature's healing wisdom" },
  "/doctors": { title: "Consult a Doctor", sub: "Expert Ayurvedic practitioners" },
  "/history": { title: "Wellness History", sub: "Track your health journey" },
  "/profile": { title: "My Profile", sub: "Manage your account" },
}

export default function Navbar() {
  const { pathname } = useLocation()


  return (
    <header
      style={{
        height: 68,
        background: "white",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Left: title */}
      <div>
        {/* <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "black", margin: 0, lineHeight: 1.2 }}>
          {info.title}
        </h1>
        <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0, marginTop: 2 }}>{info.sub}</p> */}
      </div>

      {/* Right: search + notif + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 10, padding: "7px 14px",
          color: "#6b7280", fontSize: "0.8rem"
        }}>
          <Search size={14} />
          <span>Search…</span>
        </div>

        {/* Notification */}
        <button style={{
          width: 36, height: 36,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative", color: "#9ca3af"
        }}>
          <Bell size={16} />
          <span style={{
            position: "absolute", top: 7, right: 7,
            width: 7, height: 7,
            background: "#4CAF50",
            borderRadius: "50%",
            border: "1.5px solid #0f0f0f"
          }} />
        </button>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg,#1B5E20,#4CAF50)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.85rem", fontWeight: 700, color: "white"
          }}>A</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "black", lineHeight: 1 }}>Arjun</span>
            <span style={{ fontSize: "0.65rem", color: "#4CAF50", marginTop: 1 }}>Vata Type</span>
          </div>
          <ChevronDown size={14} style={{ color: "#6b7280" }} />
        </div>
      </div>
    </header>
  )
}
