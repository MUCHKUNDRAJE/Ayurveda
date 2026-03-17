import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import AppLayout from "@/layout/AppLayout"
import Dashboard from "@/pages/Dashboard"
import Assessment from "@/pages/Assessment"
import DoshaResult from "@/pages/DoshaResult"

import Doctors from "@/pages/Doctors"
import Profile from "@/pages/Profile"
import History from "@/pages/History"
import Report from "./pages/Report"
import Filter from "./pages/Fliter"
import Upload from "./pages/Upload"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<Report />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/upload" element={<Upload />} />
        
        </Route>
      </Routes>

     <div style={{ 
  height: "220px", // Increased height to accommodate the image
  width: "100%", 
  backgroundColor: "#ffffff", 
  display: "flex", 
  flexDirection: "column", // Stacks image and text vertically
  alignItems: "center", 
  justifyContent: "center",
  borderTop: "1px solid #f1f5f9",
  marginTop: "0px",
  gap: "15px" // Adds space between image and text
}}>
  {/* Logo Image */}
  <img 
    src="\ayurveda.jpeg" 
    alt="Ayurveda Logo" 
    style={{ 
      height: "80px", // Adjust size as needed
      width: "auto",
      objectFit: "contain" 
    }} 
  />

  {/* Footer Text */}
  <p style={{ 
    margin: 0, 
    color: "#64748b", 
    fontSize: "14px", 
    fontFamily: "sans-serif",
    letterSpacing: "0.02em"
  }}>
    Created and designed by 
    <span style={{ fontWeight: "700", color: "#0f172a", marginLeft: "5px" }}>
      <span style={{ color: "#10b981" }}>Codeware (InnovativeX)</span>
    </span>
  </p>
</div>
    </BrowserRouter>  
  )
}

export default App
