// src/App.tsx
import Navbar from "./components/Navbar";
import Router from "./Router";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Navbar />
      <Router />
    </div>
  );
}
