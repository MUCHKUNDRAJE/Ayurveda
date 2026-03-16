import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"
import AyurvedicChatbot from "@/components/AyurvedicChatbot"

export default function AppLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "white" } }   >
      <div className="border-r-2 border-gray-200">
      <Sidebar />

      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="border-b-2 border-gray-200">
        <Navbar />
        </div>
        <main style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
          <Outlet />
        </main>
        <AyurvedicChatbot />
      </div>
    </div>
  )
}
