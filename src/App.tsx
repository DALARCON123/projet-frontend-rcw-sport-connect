import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Router from "./Router";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Router />
      </div>
      <Footer />
    </div>
  );
}
