import { useEffect, useState } from 'react'
import { CheckCircle2, Dumbbell, Calendar, Lock } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'
import { cn, getCheckPhrase } from '../lib/utils'
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Slider } from '../components/ui/Slider'
import { TextArea } from '../components/ui/Input'

const DAY_MAP: Record<string, string> = {
  lunes: 'lunes', martes: 'martes', miércoles: 'miercoles', miercoles: 'miercoles',
  jueves: 'jueves', viernes: 'viernes', sábado: 'sabado', sabado: 'sabado', domingo: 'domingo',
}

export function Entrenamiento() {
  const profile = useAuthStore((s) => s.profile)
  const { training, fetchDay, upsertTraining, showToast } = useDataStore()
  const [energy, setEnergy] = useState(7)
  const [difficulty, setDifficulty] = useState(6)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (profile) fetchDay(profile.id)
  }, [profile])

  useEffect(() => {
    if (training) {
      setEnergy(training.energy_level ?? 7)
      setDifficulty(training.difficulty ?? 6)
      setNotes(training.notes ?? '')
    }
  }, [training])

  if (!profile) return null

  const todayKey = DAY_MAP[format(new Date(), 'EEEE', { locale: es }).toLowerCase()] ?? ''
  const isTrainingDay = profile.training_days.some(
    (d) => DAY_MAP[d.toLowerCase()] === todayKey || d.toLowerCase() === todayKey
  )

  const nextTrainingDay = profile.training_days[0]

  const complete = async () => {
    if (!profile) return
    setSaving(true)
    await upsertTraining(profile.id, {
      completed: true,
      energy_level: energy,
      difficulty,
      notes: notes || undefined,
    })
    setSaving(false)
    setShowForm(false)
    showToast(getCheckPhrase())
  }

  return (
    <AppShell>
      <div className="space-y-5 animate-fade-in">
        <PageHeader title="Entrenamiento" subtitle="Lunes · Miércoles · Viernes" />

        {!isTrainingDay ? (
          /* Rest day */
          <Card className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-base-muted flex items-center justify-center">
              <Lock size={28} className="text-base-stone" />
            </div>
            <div>
              <p className="text-base-white font-semibold">Día de descanso</p>
              <p className="text-base-stone text-sm mt-1">Hoy no entrenas. Recupera.</p>
              <p className="text-base-stone text-xs mt-3">Próximo entrenamiento: <span className="text-base-white capitalize">{nextTrainingDay}</span></p>
            </div>
          </Card>
        ) : training?.completed ? (
          /* Completed */
          <Card className="flex flex-col items-center gap-4 py-10 text-center border-base-success/40">
            <CheckCircle2 size={48} className="text-base-success" />
            <div>
              <p className="text-base-white font-semibold text-lg">Entrenamiento completado</p>
              <p className="text-base-stone text-sm mt-1">Hoy has aparecido. Esto es el camino.</p>
            </div>
            <div className="flex gap-6 w-full justify-center mt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-base-white">{training.energy_level}</p>
                <p className="text-base-stone text-xs">Energía</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-base-white">{training.difficulty}</p>
                <p className="text-base-stone text-xs">Dificultad</p>
              </div>
            </div>
            {training.notes && (
              <p className="text-base-stone text-sm italic text-center">"{training.notes}"</p>
            )}
          </Card>
        ) : (
          /* Training day, not completed */
          <>
            {/* Workout description */}
            <Card className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-base-forest/30 flex items-center justify-center">
                  <Dumbbell size={20} className="text-base-success" />
                </div>
                <div>
                  <p className="text-base-white font-medium">Entrenamiento del día</p>
                  <p className="text-base-stone text-xs">3 series · 12-15 reps · 60s descanso</p>
                </div>
              </div>
              <div className="space-y-2 pt-1">
                {['Flexiones / Fondos', 'Sentadillas con peso corporal'].map((ex) => (
                  <div key={ex} className="flex items-center gap-3 py-2.5 px-3 bg-base-panel rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-base-success" />
                    <p className="text-base-white text-sm">{ex}</p>
                    <p className="text-base-stone text-xs ml-auto">3×12-15</p>
                  </div>
                ))}
              </div>
            </Card>

            {!showForm ? (
              <Button fullWidth size="lg" onClick={() => setShowForm(true)}>
                Marcar como completado
              </Button>
            ) : (
              <Card className="space-y-4">
                <h3 className="text-base-white font-medium">¿Cómo ha ido?</h3>
                <Slider label="Energía" value={energy} onChange={setEnergy} />
                <Slider label="Dificultad" value={difficulty} onChange={setDifficulty} />
                <TextArea
                  label="Observaciones"
                  placeholder="Ej: me siento preparado para aumentar intensidad."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
                  <Button fullWidth onClick={complete} disabled={saving}>
                    {saving ? 'Guardando…' : 'Confirmar'}
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Weekly schedule */}
        <Card className="space-y-3">
          <p className="text-xs text-base-stone uppercase tracking-widest">Días de entrenamiento</p>
          <div className="flex gap-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d, i) => {
              const keys = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
              const isActive = profile.training_days.some((td) => DAY_MAP[td.toLowerCase()] === keys[i])
              const isToday = keys[i] === todayKey
              return (
                <div
                  key={d}
                  className={cn(
                    'flex-1 text-center py-2 rounded-lg text-xs font-medium transition-colors',
                    isActive && isToday ? 'bg-base-success text-white' :
                    isActive ? 'bg-base-forest/30 text-base-success' :
                    isToday ? 'border border-base-border text-base-white' :
                    'text-base-muted'
                  )}
                >
                  {d}
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
