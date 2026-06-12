import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'
import { MEAL_LABELS, MEALS_BY_COUNT, MOOD_MAP, cn, today } from '../lib/utils'
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { TextArea } from '../components/ui/Input'
import { Slider } from '../components/ui/Slider'
import { FoodSearchModal } from '../components/nutrition/FoodSearchModal'
import type { Meal, MealItem } from '../types'

type MoodKey = keyof typeof MOOD_MAP

interface SubjectiveForm {
  hunger: number
  satiety: number
  mood: MoodKey
  notes: string
}

const DEFAULT_FORM: SubjectiveForm = { hunger: 5, satiety: 5, mood: 'neutro', notes: '' }

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <p className="text-[0.55rem] uppercase tracking-widest" style={{ color: '#6A6A5A' }}>{label}</p>
        <p className="text-xs font-medium" style={{ color }}>{value}g</p>
      </div>
      <div className="h-1 rounded-full" style={{ background: '#252520' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export function Alimentacion() {
  const profile = useAuthStore((s) => s.profile)
  const { meals, mealItems, fetchDay, upsertMeal, deleteMeal, addMealItems, deleteMealItem, showToast } = useDataStore()

  const [expanded, setExpanded] = useState<string | null>(null)
  const [showSubjective, setShowSubjective] = useState<string | null>(null)
  const [forms, setForms] = useState<Record<string, SubjectiveForm>>({})
  const [saving, setSaving] = useState(false)
  const [modalMeal, setModalMeal] = useState<string | null>(null)

  useEffect(() => {
    if (profile) fetchDay(profile.id)
  }, [profile])

  if (!profile) return null

  const activeMeals = MEALS_BY_COUNT[profile.meals_per_day] ?? MEALS_BY_COUNT[3]
  const todayDate = today()

  // Compute day totals from meal_items
  const dayKcal = Math.round(mealItems.reduce((a, i) => a + i.kcal, 0))
    || meals.reduce((a, m) => a + (m.kcal_estimated ?? 0), 0)
  const dayProtein = parseFloat(mealItems.reduce((a, i) => a + i.protein_g, 0).toFixed(1))
  const dayCarbs = parseFloat(mealItems.reduce((a, i) => a + i.carbs_g, 0).toFixed(1))
  const dayFat = parseFloat(mealItems.reduce((a, i) => a + i.fat_g, 0).toFixed(1))
  const remaining = profile.daily_kcal_goal - dayKcal
  const progressPct = Math.min((dayKcal / profile.daily_kcal_goal) * 100, 100)

  const getMeal = (type: string) => meals.find((m) => m.meal_type === type as Meal['meal_type'])
  const getItems = (type: string) => mealItems.filter((i) => i.meal_type === type)

  const getForm = (type: string): SubjectiveForm => {
    if (forms[type]) return forms[type]
    const meal = getMeal(type)
    if (meal) return {
      hunger: meal.hunger_before ?? 5,
      satiety: meal.satiety_after ?? 5,
      mood: (meal.mood as MoodKey) ?? 'neutro',
      notes: meal.notes ?? '',
    }
    return DEFAULT_FORM
  }

  const setForm = (type: string, patch: Partial<SubjectiveForm>) =>
    setForms((prev) => ({ ...prev, [type]: { ...getForm(type), ...patch } }))

  const saveSubjective = async (type: string) => {
    const f = getForm(type)
    setSaving(true)
    const existing = getMeal(type)
    const typeItems = getItems(type)
    await upsertMeal(profile.id, {
      id: existing?.id,
      meal_type: type as Meal['meal_type'],
      hunger_before: f.hunger,
      satiety_after: f.satiety,
      mood: f.mood,
      notes: f.notes,
      kcal_estimated: existing?.kcal_estimated ?? Math.round(typeItems.reduce((a, i) => a + i.kcal, 0)),
      foods: existing?.foods,
    })
    setSaving(false)
    setShowSubjective(null)
    showToast('Guardado.')
  }

  const handleAddItems = async (items: Omit<MealItem, 'id' | 'created_at'>[]) => {
    await addMealItems(profile.id, items)
    showToast('Alimento añadido.')
  }

  return (
    <AppShell>
      <div className="space-y-5 animate-fade-in">
        <PageHeader title="Alimentación" subtitle="Registra tu nutrición de hoy" />

        {/* ── Day summary ─────────────────────────────────── */}
        <Card className="space-y-4">
          {/* Kcal row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-base-stone text-xs uppercase tracking-widest">Consumidas</p>
              <p className="text-3xl font-bold text-base-white">{dayKcal}</p>
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

          {/* Kcal bar */}
          <div className="w-full h-2 bg-base-muted rounded-full overflow-hidden">
            <div className={cn('h-full rounded-full transition-all duration-700', remaining < 0 ? 'bg-base-warning' : 'bg-base-success')}
              style={{ width: `${progressPct}%` }} />
          </div>

          {/* Macro bars */}
          {(dayProtein > 0 || dayCarbs > 0 || dayFat > 0) && (
            <div className="grid grid-cols-3 gap-4 pt-1">
              <MacroBar label="Proteína" value={dayProtein} max={200} color="#4A7C59" />
              <MacroBar label="Hidratos" value={dayCarbs} max={300} color="#C4A35A" />
              <MacroBar label="Grasas" value={dayFat} max={100} color="#8A7A4A" />
            </div>
          )}
        </Card>

        {/* ── Meal cards ──────────────────────────────────── */}
        <div className="space-y-2">
          {activeMeals.map((type) => {
            const meal = getMeal(type)
            const items = getItems(type)
            const mealKcal = items.length
              ? Math.round(items.reduce((a, i) => a + i.kcal, 0))
              : (meal?.kcal_estimated ?? 0)
            const isOpen = expanded === type
            const hasData = items.length > 0 || !!meal

            return (
              <div key={type} className={cn('border rounded-2xl overflow-hidden transition-colors duration-300',
                hasData ? 'border-base-success/30 bg-base-dim' : 'border-base-border bg-base-dim')}>

                {/* Meal header */}
                <button onClick={() => setExpanded(isOpen ? null : type)} className="w-full flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs',
                      hasData ? 'bg-base-success/20 text-base-success' : 'bg-base-muted text-base-stone')}>
                      {hasData ? '✓' : '+'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-base-white">{MEAL_LABELS[type]}</p>
                      <p className="text-xs text-base-stone">
                        {items.length > 0
                          ? `${items.length} alimento${items.length !== 1 ? 's' : ''} · ${mealKcal} kcal`
                          : meal ? `${mealKcal} kcal` : 'Sin registrar'}
                      </p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-base-stone" /> : <ChevronDown size={16} className="text-base-stone" />}
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 pb-5 space-y-3 border-t border-base-border">
                    <div className="h-2" />

                    {/* Food items list */}
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 py-2 border-b border-base-border/40 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-base-ivory font-medium truncate">{item.food_name}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#6A6A5A' }}>
                            {item.quantity_g}g · {Math.round(item.kcal)} kcal
                            {item.protein_g > 0 && ` · P ${item.protein_g}g`}
                            {item.carbs_g > 0 && ` · H ${item.carbs_g}g`}
                            {item.fat_g > 0 && ` · G ${item.fat_g}g`}
                          </p>
                        </div>
                        <button onClick={() => deleteMealItem(item.id)} className="text-base-stone hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}

                    {/* Add food button */}
                    <button
                      onClick={() => setModalMeal(type)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-base-border text-base-stone hover:border-[#353528] hover:text-base-ivory transition-colors text-sm"
                    >
                      <Plus size={14} />
                      Añadir alimento
                    </button>

                    {/* Subjective section */}
                    <button
                      onClick={() => setShowSubjective(showSubjective === type ? null : type)}
                      className="w-full flex items-center justify-between py-2 text-xs text-base-stone hover:text-base-ivory transition-colors"
                    >
                      <span className="uppercase tracking-widest" style={{ fontSize: '0.6rem' }}>Cómo me sentí</span>
                      {showSubjective === type ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    {showSubjective === type && (
                      <div className="space-y-4 pt-1">
                        <Slider label="Hambre antes" value={getForm(type).hunger} onChange={(v) => setForm(type, { hunger: v })} />
                        <Slider label="Saciedad después" value={getForm(type).satiety} onChange={(v) => setForm(type, { satiety: v })} />

                        <div className="space-y-2">
                          <p className="text-xs text-base-stone uppercase tracking-widest">Estado emocional</p>
                          <div className="flex gap-2 flex-wrap">
                            {(Object.entries(MOOD_MAP) as [MoodKey, { emoji: string; label: string }][]).map(([k, { emoji, label }]) => (
                              <button key={k} onClick={() => setForm(type, { mood: k })}
                                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all',
                                  getForm(type).mood === k
                                    ? 'bg-base-forest border-base-success text-base-white'
                                    : 'border-base-border text-base-stone hover:border-base-stone')}>
                                {emoji} {label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <TextArea
                          label="Observaciones"
                          placeholder="¿Cómo te has sentido con esta comida?"
                          rows={2}
                          value={getForm(type).notes}
                          onChange={(e) => setForm(type, { notes: e.target.value })}
                        />

                        <div className="flex gap-2">
                          <Button fullWidth onClick={() => saveSubjective(type)} disabled={saving}>
                            {saving ? 'Guardando…' : 'Guardar'}
                          </Button>
                          {meal && !items.length && (
                            <Button variant="danger" onClick={async () => { await deleteMeal(meal.id); setExpanded(null) }}>
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Food Search Modal */}
      <FoodSearchModal
        isOpen={!!modalMeal}
        mealType={modalMeal ?? ''}
        userId={profile.id}
        date={todayDate}
        onAdd={handleAddItems}
        onClose={() => setModalMeal(null)}
      />
    </AppShell>
  )
}
