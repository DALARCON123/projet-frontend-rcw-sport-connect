import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Sports from './pages/Sports'
import Reco from './pages/Reco'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Tracking from './pages/Tracking'

export default function App() {
  const isAuth = !!localStorage.getItem('token')

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '1rem' }}>
        <Routes>
          {/* Home redirige a /dashboard si hay sesión */}
          <Route
            path="/"
            element={isAuth ? <Navigate to="/dashboard" replace /> : <Home />}
          />
          import Tracking from './pages/Tracking'
            // ...
            <Route path="/tracking" element={
              <ProtectedRoute><Tracking /></ProtectedRoute>
            }/>


          {/* Auth públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Onboarding y panel protegidos */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/sports"
            element={
              <ProtectedRoute>
                <Sports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reco"
            element={
              <ProtectedRoute>
                <Reco />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* Alias */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}
