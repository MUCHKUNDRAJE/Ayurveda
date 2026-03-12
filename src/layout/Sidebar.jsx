import { NavLink, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, ClipboardList, Leaf, Stethoscope,
  UserCircle, History, FlaskConical, LogOut, Sparkles
} from "lucide-react"

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/report", icon: ClipboardList, label: "Report" },

]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        background: "white",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 12px",
        gap: 8,
        height: "100vh",
        position: "sticky",
        top: 0,
        overflow: "hidden",
      }}
    
      
    >
      {/* Logo */}
      <div  style={{ padding: "0 4px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg,#1B5E20,#4CAF50)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <div style={{  fontWeight: 700, fontSize: "1.1rem", color: "black", lineHeight: 1 }}>Ayurveda</div>
            <div style={{ fontSize: "0.65rem", color: "#4CAF50", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Wellness Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: "0.65rem", color: "#4b5563", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 14px", marginBottom: 4 }}>
          MAIN MENU
        </div>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom: logout */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12, marginTop: 8 }}>
        <button
          onClick={() => navigate("/login")}
          className="sidebar-link"
          style={{ width: "100%", background: "none", border: "none" }}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
