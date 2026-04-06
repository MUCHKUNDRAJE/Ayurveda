import { Bell, Search, ChevronDown } from "lucide-react"
import { useLocation } from "react-router-dom"

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard", sub: "Welcome back, Admin 👋" },
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
    

        {/* Notification */}
        <button style={{
          width: 36, height: 36,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative", color: "#9ca3af"
        }}>
        
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
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "black", lineHeight: 1 }}>Admin</span>
         
          </div>

        </div>
      </div>
    </header>
  )
}
