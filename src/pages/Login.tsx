import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

type Mode = 'login' | 'register'

export function Login() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp } = useAuthStore()

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const err =
      mode === 'login'
        ? await signIn(email, password)
        : await signUp(email, password, name)
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <div
      className="min-h-screen min-h-dvh flex flex-col items-center justify-center px-6"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #1A1808 0%, #0D0D0B 70%)' }}
    >
      <div className="w-full max-w-sm animate-fade-in">

        {/* ── Logo Mark + Wordmark ─────────────────────────── */}
        <div className="flex flex-col items-center mb-12">

          {/* Official BASE logo */}
          <div className="mb-6 relative flex items-center justify-center">
            <img
              src="/logo-base.png"
              alt="BASE"
              className="w-24 h-24 object-contain"
              style={{ filter: 'drop-shadow(0 0 24px rgba(180,160,60,0.25))' }}
            />
          </div>

          {/* "BASE" in serif — tracking the logo typography */}
          <h1
            className="wordmark text-4xl mb-3"
            style={{ fontSize: '2.25rem' }}
          >
            BASE
          </h1>

          {/* Tagline with decorative lines — mirrors logo bottom text */}
          <p className="divider-line text-[0.6rem] uppercase" style={{ color: '#7A6E30' }}>
            La base para tu ascenso
          </p>
        </div>

        {/* ── Auth Form ────────────────────────────────────── */}
        <div
          className="rounded-3xl p-6 space-y-4"
          style={{
            background: 'linear-gradient(180deg, #1A1A16 0%, #141412 100%)',
            border: '1px solid #252520',
            boxShadow: '0 0 0 1px rgba(154,138,53,0.06), 0 24px 64px rgba(0,0,0,0.6)',
          }}
        >
          <h2 className="text-base-ivory text-sm font-medium text-center tracking-wider uppercase" style={{ letterSpacing: '0.12em' }}>
            {mode === 'login' ? 'Acceder' : 'Crear cuenta'}
          </h2>

          <form onSubmit={handle} className="space-y-4">
            {mode === 'register' && (
              <Input
                label="Nombre completo"
                type="text"
                placeholder="Oscar García"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="hola@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-400 text-xs text-center bg-red-900/20 border border-red-900/40 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Cargando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </Button>
          </form>

          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="w-full text-center text-base-stone text-xs hover:text-base-ivory transition-colors pt-1"
            style={{ letterSpacing: '0.04em' }}
          >
            {mode === 'login' ? '¿Sin cuenta? Regístrate' : '¿Ya tienes cuenta? Accede'}
          </button>
        </div>

        {/* ── GiveMeFive ecosystem tag ──────────────────────── */}
        <p className="text-center mt-10 text-[0.55rem] uppercase tracking-widest" style={{ color: '#4A4840' }}>
          GiveMeFive Ecosystem
        </p>
      </div>
    </div>
  )
}
