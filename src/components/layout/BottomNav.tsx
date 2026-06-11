import { NavLink } from 'react-router-dom'
import { Home, CheckSquare, Utensils, Dumbbell, Star, BarChart2, Users } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../store/authStore'

const CLIENT_NAV = [
  { to: '/',              icon: Home,        label: 'BASE' },
  { to: '/no-neg',        icon: CheckSquare, label: 'Pilares' },
  { to: '/alimentacion',  icon: Utensils,    label: 'Comida' },
  { to: '/entrenamiento', icon: Dumbbell,    label: 'Entrena' },
  { to: '/evidencias',    icon: Star,        label: 'Evidencias' },
  { to: '/vision',        icon: BarChart2,   label: 'Visión' },
]

const MENTOR_NAV = [
  { to: '/',       icon: Home,      label: 'BASE' },
  { to: '/mentor', icon: Users,     label: 'Clientes' },
  { to: '/vision', icon: BarChart2, label: 'Visión' },
]

export function BottomNav() {
  const profile = useAuthStore((s) => s.profile)
  const nav = profile?.role === 'mentor' ? MENTOR_NAV : CLIENT_NAV

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, #0D0D0B 20%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #1E1E1A',
      }}
    >
      <div className="flex items-center max-w-lg mx-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center gap-0.5 py-3 transition-all duration-200 relative',
                isActive ? 'text-[#A89A46]' : 'text-[#525048] hover:text-[#8A8A7A]'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator — subtle gold line above icon */}
                {isActive && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, #8A7E38, transparent)' }}
                  />
                )}
                <Icon
                  size={18}
                  strokeWidth={isActive ? 1.75 : 1.4}
                />
                <span
                  className="font-medium"
                  style={{
                    fontSize: '0.55rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
