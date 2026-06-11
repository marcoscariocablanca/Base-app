import { useEffect, useState } from 'react'
import { Plus, ChevronDown, ChevronUp, Camera, Trash2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'
import { MEAL_LABELS, MEALS_BY_COUNT, MOOD_MAP, cn } from '../lib/utils'
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, TextArea } from '../components/ui/Input'
import { Slider } from '../components/ui/Slider'
import type { Meal } from '../types'

type MoodKey = keyof typeof MOOD_MAP

interface MealFormState {
  foods: string
  kcal: string
  hunger: number
  satiety: number
  mood: MoodKey
  notes: string
}

const DEFAULT_FORM: MealFormState = {
  foods: '', kcal: '', hunger: 5, satiety: 5, mood: 'neutro', notes: '',
}

export function Alimentacion() {
  const profile = useAuthStore((s) => s.profile)
  const { meals, fetchDay, upsertMeal, deleteMeal, showToast } = useDataStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState<MealFormState>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) fetchDay(profile.id)
  }, [profile])

  if (!profile) return null

  const activeMeals = MEALS_BY_COUNT[profile.meals_per_day] ?? MEALS_BY_COUNT[3]
  const totalKcal = meals.reduce((a, m) => a + (m.kcal_estimated ?? 0), 0)
  const remaining = profile.daily_kcal_goal - totalKcal
  const progressPct = Math.min((totalKcal / profile.daily_kcal_goal) * 100, 100)

  const getMealData = (type: string) => meals.find((m) => m.meal_type === type as Meal['meal_type'])

  const openMeal = (type: string) => {
    const existing = getMealData(type)
    if (existing) {
      setForm({
        foods: existing.foods ?? '',
        kcal: existing.kcal_estimated?.toString() ?? '',
        hunger: existing.hunger_before ?? 5,
        satiety: existing.satiety_after ?? 5,
        mood: (existing.mood as MoodKey) ?? 'neutro',
        notes: existing.notes ?? '',
      })
    } else {
      setForm(DEFAULT_FORM)
    }
    setExpanded(expanded === type ? null : type)
  }

  const saveMeal = async (type: string) => {
    if (!profile) return
    setSaving(true)
    const existing = getMealData(type)
    await upsertMeal(profile.id, {
      id: existing?.id,
      meal_type: type as Meal['meal_type'],
      foods: form.foods,
      kcal_estimated: parseInt(form.kcal) || undefined,
      hunger_before: form.hunger,
      satiety_after: form.satiety,
      mood: form.mood,
      notes: form.notes,
    })
    setSaving(false)
    setExpanded(null)
    showToast('Comida registrada.')
  }

  return (
    <AppShell>
      <div className="space-y-5 animate-fade-in">
        <PageHeader title="Alimentación" subtitle="Registra tu nutrición de hoy" />

        {/* Kcal summary */}
        <Card className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-base-stone text-xs uppercase tracking-widest">Consumidas</p>
              <p className="text-3xl font-bold text-base-white">{totalKcal}</p>
              <p className="text-base-stone text-xs">de {profile.daily_kcal_goal} kcal</p>
            </div>
            <div className="text-right">
              <p className="text-base-stone text-xs uppercase tracking-widest">Restantes</p>
              <p className={cn('text-2xl font-semibold', remaining >= 0 ? 'text-base-success' : 'text-base-warning')}>
                {Math.abs(remaining)}
              </p>
              <p className="text-base-stone text-xs">{remaining < 0 ? 'sobre el objetivo' : 'disponibles'}</p>
            </div>
          </div>
          <div className="w-full h-2 bg-base-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-700', remaining < 0 ? 'bg-base-warning' : 'bg-base-success')}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </Card>

        {/* Meals */}
        <div className="space-y-2">
          {activeMeals.map((type) => {
            const data = getMealData(type)
            const isOpen = expanded === type
            return (
              <div key={type} className={cn('bg-base-dim border rounded-2xl overflow-hidden transition-colors duration-300', data ? 'border-base-success/40' : 'border-base-border')}>

                {/* Meal header */}
                <button
                  onClick={() => openMeal(type)}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs', data ? 'bg-base-success/20 text-base-success' : 'bg-base-muted text-base-stone')}>
                      {data ? '✓' : '+'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-base-white">{MEAL_LABELS[type]}</p>
                      {data ? (
                        <p className="text-xs text-base-stone">
                          {data.kcal_estimated ? `${data.kcal_estimated} kcal` : 'Registrada'}
                          {data.mood ? ` · ${MOOD_MAP[data.mood as MoodKey]?.emoji}` : ''}
                        </p>
                      ) : (
                        <p className="text-xs text-base-stone">Sin registrar</p>
                      )}
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-base-stone" /> : <ChevronDown size={16} className="text-base-stone" />}
                </button>

                {/* Meal form */}
                {isOpen && (
                  <div className="px-4 pb-5 space-y-4 border-t border-base-border">
                    <div className="h-3" />

                    {/* Photo placeholder */}
                    <button className="w-full h-24 border border-dashed border-base-border rounded-xl flex flex-col items-center justify-center gap-2 text-base-stone hover:border-base-stone transition-colors">
                      <Camera size={20} />
                      <span className="text-xs">Añadir foto del plato</span>
                    </button>

                    <Input
                      label="Alimentos"
                      placeholder="Ej: Arroz integral, pollo a la plancha, ensalada"
                      value={form.foods}
                      onChange={(e) => setForm({ ...form, foods: e.target.value })}
                    />

                    <Input
                      label="Calorías estimadas"
                      type="number"
                      placeholder="ej: 650"
                      value={form.kcal}
                      onChange={(e) => setForm({ ...form, kcal: e.target.value })}
                    />

                    <Slider
                      label="Hambre antes"
                      value={form.hunger}
                      onChange={(v) => setForm({ ...form, hunger: v })}
                    />
                    <Slider
                      label="Saciedad después"
                      value={form.satiety}
                      onChange={(v) => setForm({ ...form, satiety: v })}
                    />

                    {/* Mood */}
                    <div className="space-y-2">
                      <p className="text-xs text-base-stone uppercase tracking-widest">Estado emocional</p>
                      <div className="flex gap-2 flex-wrap">
                        {(Object.entries(MOOD_MAP) as [MoodKey, { emoji: string; label: string }][]).map(([k, { emoji, label }]) => (
                          <button
                            key={k}
                            onClick={() => setForm({ ...form, mood: k })}
                            className={cn(
                              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all',
                              form.mood === k
                                ? 'bg-base-forest border-base-success text-base-white'
                                : 'border-base-border text-base-stone hover:border-base-stone'
                            )}
                          >
                            {emoji} {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <TextArea
                      label="Observaciones"
                      placeholder="¿Cómo te has sentido con esta comida?"
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />

                    <div className="flex gap-2">
                      <Button fullWidth onClick={() => saveMeal(type)} disabled={saving}>
                        {saving ? 'Guardando…' : 'Guardar'}
                      </Button>
                      {data && (
                        <Button
                          variant="danger"
                          onClick={async () => { await deleteMeal(data.id); setExpanded(null) }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
