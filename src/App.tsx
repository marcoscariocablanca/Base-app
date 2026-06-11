import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'

import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { NoNegociables } from './pages/NoNegociables'
import { Alimentacion } from './pages/Alimentacion'
import { Entrenamiento } from './pages/Entrenamiento'
import { Evidencias } from './pages/Evidencias'
import { Vision } from './pages/Vision'
import { MentorPanel } from './pages/MentorPanel'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuthStore()
  if (loading) return (
    <div className="min-h-screen bg-base-black flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-base-forest border-t-base-success animate-spin" />
    </div>
  )
  if (!profile) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { fetchProfile, setProfile } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/no-neg" element={<RequireAuth><NoNegociables /></RequireAuth>} />
        <Route path="/alimentacion" element={<RequireAuth><Alimentacion /></RequireAuth>} />
        <Route path="/entrenamiento" element={<RequireAuth><Entrenamiento /></RequireAuth>} />
        <Route path="/evidencias" element={<RequireAuth><Evidencias /></RequireAuth>} />
        <Route path="/vision" element={<RequireAuth><Vision /></RequireAuth>} />
        <Route path="/mentor" element={<RequireAuth><MentorPanel /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
