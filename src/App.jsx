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
    </BrowserRouter>
  )
}

export default App
