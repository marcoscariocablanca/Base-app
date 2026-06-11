import { useEffect, useState } from 'react'
import { Moon, Footprints, Utensils, CheckCircle2, Circle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'
import { getCheckPhrase, cn } from '../lib/utils'
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { ProgressRing } from '../components/ui/ProgressRing'

interface NegItem {
  key: 'rest_done' | 'movement_done' | 'nutrition_done'
  icon: React.ElementType
  title: string
  description: string
}

const ITEMS: NegItem[] = [
  { key: 'rest_done',      icon: Moon,       title: 'Descanso',     description: 'Dormir de 00:00 a 08:00' },
  { key: 'movement_done',  icon: Footprints, title: 'Movimiento',   description: 'Caminar y entrenar cuando corresponda' },
  { key: 'nutrition_done', icon: Utensils,   title: 'Alimentación', description: 'Registrar y cuidar la alimentación' },
]

export function NoNegociables() {
  const profile = useAuthStore((s) => s.profile)
  const { nonNeg, fetchDay, upsertNonNeg, showToast } = useDataStore()
  const [animating, setAnimating] = useState<string | null>(null)

  useEffect(() => {
    if (profile) fetchDay(profile.id)
  }, [profile])

  const score = [nonNeg?.rest_done, nonNeg?.movement_done, nonNeg?.nutrition_done].filter(Boolean).length

  const toggle = async (key: NegItem['key']) => {
    if (!profile) return
    const next = !nonNeg?.[key]
    setAnimating(key)
    setTimeout(() => setAnimating(null), 400)
    await upsertNonNeg(profile.id, { [key]: next })
    if (next) showToast(getCheckPhrase())
  }

  const adherencePercent = Math.round((score / 3) * 100)

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="No Negociables"
          subtitle="Los tres pilares de cada día"
        />

        {/* Progress */}
        <Card className="flex items-center gap-6">
          <ProgressRing
            value={score}
            max={3}
            size={88}
            label={`${score}/3`}
            sublabel="hoy"
          />
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-base-stone text-xs uppercase tracking-widest">Progreso diario</p>
              <p className="text-2xl font-bold text-base-white">{adherencePercent}%</p>
            </div>
            <div className="w-full h-1.5 bg-base-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-base-success rounded-full transition-all duration-700"
                style={{ width: `${adherencePercent}%` }}
              />
            </div>
            <p className="text-base-stone text-xs">
              {score === 3
                ? '🌿 Los tres pilares. Esto es el camino.'
                : score === 0
                ? 'Empieza por el primero.'
                : 'Sigue acumulando.'}
            </p>
          </div>
        </Card>

        {/* Items */}
        <div className="space-y-3">
          {ITEMS.map(({ key, icon: Icon, title, description }) => {
            const done = nonNeg?.[key] ?? false
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={cn(
                  'w-full text-left bg-base-dim border rounded-2xl p-4 transition-all duration-300 flex items-center gap-4',
                  done
                    ? 'border-base-success/50 bg-base-forest/10'
                    : 'border-base-border hover:border-base-stone/50'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300',
                  done ? 'bg-base-success/20' : 'bg-base-muted'
                )}>
                  <Icon size={20} className={done ? 'text-base-success' : 'text-base-stone'} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn('font-medium text-sm', done ? 'text-base-white' : 'text-base-stone')}>
                    {title}
                  </p>
                  <p className="text-base-stone text-xs mt-0.5 truncate">{description}</p>
                </div>

                <div className={cn('transition-all duration-300', animating === key && 'animate-check-pop')}>
                  {done
                    ? <CheckCircle2 size={22} className="text-base-success" />
                    : <Circle size={22} className="text-base-muted" />
                  }
                </div>
              </button>
            )
          })}
        </div>

        {/* Philosophy note */}
        <p className="text-center text-base-stone text-xs italic">
          "El compromiso siempre es visible."
        </p>
      </div>
    </AppShell>
  )
}
