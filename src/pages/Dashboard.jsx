import React from 'react';
import { useNavigate } from "react-router-dom";
import {
  Leaf, Stethoscope, Zap, Heart, ArrowRight, 
  Activity, User, Clock, Star, TrendingUp
} from "lucide-react";
import Footer from '@/components/shared/Footer';

const Base_URL = import.meta.env.VITE_BACKEND_API_URL;

const STATS = [
  { icon: Activity, label: "Total Patient", value: "820+", unit: "Patients", color: "#4CAF50" },
  { icon: Heart, label: "Number of student", value: "340+", unit: "Students", color: "#ef4444" },
  { icon: Zap, label: "Medical Specialties", value: "10", unit: "", color: "#f59e0b" },
  { icon: TrendingUp, label: "Hospital Awareness", value: "43", unit: "%", color: "#60a5fa" },
];

const DEPARTMENTS = [
  {
    name: "Medicine / Panchakarma",
    gradient: "linear-gradient(135deg, #00b09b, #96c93d)",
    glow: "rgba(150, 201, 61, 0.2)",
    doctors: [
      { name: "Dr. Sandeep Kumar", time: "09:00 AM - 01:00 PM", status: "Available", room: "Cabin 101" },
      { name: "Dr. Anjali Deshmukh", time: "02:00 PM - 06:00 PM", status: "In Rounds", room: "Cabin 102" }
    ]
  },
  {
    name: "Surgery (Shalya)",
    gradient: "linear-gradient(135deg, #6a11cb, #2575fc)",
    glow: "rgba(37, 117, 252, 0.2)",
    doctors: [
      { name: "Dr. Vikram Singh", time: "09:00 AM - 12:00 PM", status: "In Surgery", room: "OT Block B1" },
      { name: "Dr. Amit Shah", time: "01:00 PM - 05:00 PM", status: "Available", room: "Cabin 204" }
    ]
  },
  {
    name: "Gynecology (Prasuti)",
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    glow: "rgba(245, 87, 108, 0.2)",
    doctors: [
      { name: "Dr. Meena Sharma", time: "09:00 AM - 02:00 PM", status: "Available", room: "Cabin 305" },
      { name: "Dr. Sunita Rao", time: "03:00 PM - 07:00 PM", status: "On Call", room: "Maternity" }
    ]
  },
  {
    name: "Pediatrics (Kaumar)",
    gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
    glow: "rgba(79, 172, 254, 0.2)",
    doctors: [
      { name: "Dr. Rahul Verma", time: "10:00 AM - 02:00 PM", status: "Available", room: "Cabin 401" },
      { name: "Dr. Sneha Patil", time: "04:00 PM - 08:00 PM", status: "Available", room: "Cabin 402" }
    ]
  },
  {
    name: "Cardiology",
    gradient: "linear-gradient(135deg, #ff0844, #ffb199)",
    glow: "rgba(255, 8, 68, 0.2)",
    doctors: [
      { name: "Dr. Mahesh Joshi", time: "11:00 AM - 03:00 PM", status: "Available", room: "Cardiac Lab" }
    ]
  },
  {
    name: "Ophthalmology & ENT",
    gradient: "linear-gradient(135deg, #f09819, #edde5d)",
    glow: "rgba(240, 152, 25, 0.2)",
    doctors: [
      { name: "Dr. Vinay Gupta", time: "09:00 AM - 12:30 PM", status: "Available", room: "ENT Cabin 05" }
    ]
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", padding: "40px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <header style={{ marginBottom: "20px" }}>
          <h1 className='-mt-10' style={{ fontSize: "35px", fontWeight: "800", color: "#1e293b", }}>
            Dashboard
          </h1>
        </header>
        
        <div style={{
          background: "linear-gradient(135deg,#0d2e0d,#1a3a1a,#0f2f1a)",
          borderRadius: 24, padding: "40px", marginBottom: 32, position: "relative", overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        }}>
          <div style={{ position: "relative", zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>

              <p style={{ color: "#9ca3af", fontSize: "1rem", margin: "0 0 1px", maxWidth: 500 }}>
                <span style={{color: '#81C784'}}> ● Unified Hospital Intelligence and Analytical Reporting Hub </span> 
                </p>


                <h2 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#f5f5f5", margin: "0 0 8px" }}>
                Welcome, <span style={{ color: "#4CAF50" }}>Admin</span> 🌿
                </h2>
                <p style={{ color: "#9ca3af", fontSize: "1rem", margin: "0 0 24px", maxWidth: 500 }}>
                  Sustaining the vital essence of <span style={{color: '#81C784'}}> Datta Meghe Ayurved </span> Hospital through high-precision patient data orchestration and real-time analytical reporting.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => navigate("/assessment")} style={{ background: "#4CAF50", color: "white", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                    New Assessment <ArrowRight size={16} />
                    </button>
                    
                </div>
            </div>
            {/* Added a subtle info badge */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>
                <div style={{ color: '#4CAF50', fontSize: '0.8rem', fontWeight: 800 }}>ACCREDITATION STATUS</div>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>NABH Level 2</div>
                <div style={{ color: '#9ca3af', fontSize: '0.7rem' }}>Renewal in 45 Days</div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "16px", 
          marginBottom: "40px" 
        }}>
          {STATS.map(({ icon: Icon, label, value, unit, color }) => (
            <div 
              key={label} 
              className="stat-card-lift"
              style={{ 
                background: "white", 
                // Dynamic border: Uses the theme color with 40% opacity
                border: `2px solid ${color}40`, 
                borderRadius: "20px", 
                padding: "20px", 
                display: "flex", 
                alignItems: "center", 
                gap: "14px", 
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // Smooth lift-up
                cursor: "pointer",
                position: "relative"
              }}
            >
              {/* Icon Container */}
              <div style={{ 
                width: "46px", 
                height: "46px", 
                background: `${color}15`, 
                borderRadius: "12px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Icon size={20} style={{ color }} />
              </div>

              {/* Text Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                  <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}>{value}</span>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>{unit}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>{label}</div>
              </div>
            </div>
          ))}

          {/* CSS for Hover Effect */}
          <style>
            {`
              .stat-card-lift:hover {
                transform: translateY(-10px);
                box-shadow: 0 20px 30px -10px rgba(0,0,0,0.12) !important;
                border-color: currentColor; /* Brightens border on hover */
                background-color: #fafafa;
              }
            `}
          </style>
        </div>

        {/* Header for Department Section */}
        <div style={{ marginBottom: 25, paddingLeft: 10 }}>
           <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Information Section: Consultant Rota</h3>
           <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginTop: 4 }}>Live status across all six major departments.</p>
        </div>

        {/* Full Grid of All Departments */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "25px", marginBottom: 40 }}>
          {DEPARTMENTS.map((dept, idx) => (
            <div key={idx} style={{ 
              background: "#fff", borderRadius: "30px", border: "1px solid #f1f5f9", 
              overflow: "hidden", boxShadow: `0 15px 30px ${dept.glow}`
            }} className="vibrant-card">
              <div style={{ background: dept.gradient, padding: "20px 25px", color: "#fff" }}>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: 10 }}>
                  <Stethoscope size={20} /> {dept.name}
                </h4>
              </div>
              <div style={{ padding: "15px" }}>
                {dept.doctors.map((doc, dIdx) => (
                  <div key={dIdx} style={{ 
                    padding: "15px", borderRadius: "20px", background: "#fcfdfe", border: "1px solid #f1f5f9",
                    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10
                  }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: dept.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        <User size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: "800", color: "#0f172a", fontSize: "0.9rem" }}>{doc.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={12} /> {doc.time} • <span style={{color: '#2575fc', fontWeight: 'bold'}}>{doc.room}</span>
                        </div>
                      </div>
                    </div>
                    <span style={{ 
                      fontSize: "0.6rem", fontWeight: "900", padding: "5px 10px", borderRadius: "8px",
                      background: doc.status === "Available" ? "#22c55e" : "#ef4444", color: "#fff"
                    }}>{doc.status}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Daily Tip */}
        <div style={{ background: "#1a1a1a", borderRadius: 20, padding: "24px 30px", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 50, height: 50, background: "linear-gradient(135deg,#1B5E20,#4CAF50)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Leaf size={24} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#4CAF50", fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>Daily Ayurvedic Tip</div>
            <p style={{ fontSize: "0.9rem", color: "#d1d5db", margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: "#fff" }}>Ashwagandha root</strong> balances Vata dosha and promotes deep, restful sleep. Try for 14 days.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .vibrant-card { transition: transform 0.3s ease; }
        .vibrant-card:hover { transform: translateY(-8px); }
      `}</style>

      <Footer/>
    </div>
  );
}