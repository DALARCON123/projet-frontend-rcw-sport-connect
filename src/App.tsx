// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Reco from "./pages/Reco";
import Sports from "./pages/Sports";
import Chat from "./pages/Chat";
import Tracking from "./pages/Tracking";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import AdminUsers from "./pages/AdminUsers";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Navbar />

      <Routes>
        {/* PAGES PUBLIQUES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PAGES PROTÉGÉES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reco" element={<Reco />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        {/* REDIRECTIONS / 404 */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
