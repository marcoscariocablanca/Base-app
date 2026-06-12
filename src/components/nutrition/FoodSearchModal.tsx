import { useState, useRef, useEffect } from 'react'
import { X, Search, ArrowLeft, Star } from 'lucide-react'
import { searchSpanishFoods, type SpanishFood } from '../../lib/fooddb'
import { useDataStore } from '../../store/dataStore'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import type { MealItem } from '../../types'

type Step = 'home' | 'detail'

interface Props {
  isOpen: boolean
  mealType: string
  userId: string
  date: string
  onAdd: (items: Omit<MealItem, 'id' | 'created_at'>[]) => Promise<void>
  onClose: () => void
}

const PORTIONS = [50, 100, 150, 200, 250, 300]

function MacroGrid({ kcal, protein, carbs, fat }: { kcal: number; protein: number; carbs: number; fat: number }) {
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {[['Kcal', kcal, '#C4A35A', ''], ['Prot', protein, '#4A7C59', 'g'], ['H.C.', carbs, '#8A7A4A', 'g'], ['Gras', fat, '#6A6A5A', 'g']].map(([l, v, c, u]) => (
        <div key={l as string} className="rounded-xl py-2.5 px-1" style={{ background: '#1A1A16' }}>
          <p className="text-[0.5rem] uppercase tracking-widest mb-1" style={{ color: '#6A6A5A' }}>{l}</p>
          <p className="text-sm font-semibold" style={{ color: c as string }}>{v}{u}</p>
        </div>
      ))}
    </div>
  )
}

function FoodRow({ food, onSelect }: { food: SpanishFood; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className="w-full text-left px-4 py-3.5 rounded-2xl border border-base-border hover:border-[#353528] bg-base-dim transition-colors">
      <p className="text-sm text-base-ivory font-medium mb-1">{food.name}</p>
      <div className="flex gap-3 text-xs" style={{ color: '#6A6A5A' }}>
        <span style={{ color: '#C4A35A' }}>{food.kcal} kcal</span>
        <span>P {food.protein}g</span>
        <span>H {food.carbs}g</span>
        <span>G {food.fat}g</span>
        <span className="ml-auto opacity-50">/ 100g</span>
      </div>
    </button>
  )
}

export function FoodSearchModal({ isOpen, mealType, userId, date, onAdd, onClose }: Props) {
  const { mealItems, favorites, fetchFavorites, addFavorite, removeFavorite } = useDataStore()
  const [step, setStep] = useState<Step>('home')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SpanishFood[]>([])
  const [selected, setSelected] = useState<SpanishFood | null>(null)
  const [quantity, setQuantity] = useState(100)
  const [adding, setAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchFavorites(userId)
      setStep('home'); setQuery(''); setResults([]); setSelected(null); setQuantity(100)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const onQueryChange = (q: string) => {
    setQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setResults(searchSpanishFoods(q)), 150)
  }

  const selectFood = (food: SpanishFood) => {
    setSelected(food)
    setQuantity(food.portion)
    setStep('detail')
  }

  const selectFromQuick = (foodName: string, kcal: number, protein: number, carbs: number, fat: number, qty: number) => {
    const synth: SpanishFood = {
      id: '', name: foodName, category: '',
      kcal, protein, carbs, fat,
      portion: qty, portionLabel: `${qty}g`,
    }
    setSelected(synth)
    setQuantity(qty)
    setStep('detail')
  }

  const calcMacros = (food: SpanishFood, g: number) => ({
    kcal: Math.round(food.kcal * g / 100),
    protein_g: parseFloat((food.protein * g / 100).toFixed(1)),
    carbs_g: parseFloat((food.carbs * g / 100).toFixed(1)),
    fat_g: parseFloat((food.fat * g / 100).toFixed(1)),
  })

  const doAdd = async () => {
    if (!selected) return
    setAdding(true)
    const macros = calcMacros(selected, quantity)
    await onAdd([{
      user_id: userId, date, meal_type: mealType,
      food_name: selected.name,
      food_id: selected.id || undefined,
      quantity_g: quantity,
      source: 'usda',
      ...macros,
    }])
    setAdding(false)
    setStep('home'); setQuery(''); setResults([]); setSelected(null)
  }

  const isFavorite = selected ? favorites.some((f) => f.food_name === selected.name) : false

  const toggleFavorite = async () => {
    if (!selected) return
    const existing = favorites.find((f) => f.food_name === selected.name)
    if (existing) {
      await removeFavorite(existing.id)
    } else {
      await addFavorite(userId, {
        food_name: selected.name,
        food_id: selected.id || undefined,
        kcal_per_100g: selected.kcal,
        protein_per_100g: selected.protein,
        carbs_per_100g: selected.carbs,
        fat_per_100g: selected.fat,
        default_quantity_g: selected.portion,
      })
    }
  }

  // Derive recents: last 8 unique food names from mealItems
  const recents = Array.from(
    new Map(
      [...mealItems]
        .filter((i) => i.food_id)
        .reverse()
        .map((i) => [i.food_name, i])
    ).values()
  ).slice(0, 8)

  if (!isOpen) return null

  const macros = selected ? calcMacros(selected, quantity) : null

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="flex-1 mt-14 rounded-t-3xl flex flex-col overflow-hidden" style={{ background: '#141412', border: '1px solid #252520' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          {step === 'detail'
            ? <button onClick={() => { setStep('home'); setSelected(null) }} className="text-base-stone hover:text-base-ivory transition-colors"><ArrowLeft size={20} /></button>
            : <div className="w-5" />}
          <p className="text-sm font-medium text-base-ivory" style={{ letterSpacing: '0.04em' }}>Añadir alimento</p>
          <button onClick={onClose} className="text-base-stone hover:text-base-ivory transition-colors"><X size={20} /></button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 pb-10">

          {/* ── HOME: search + recents + favorites ── */}
          {step === 'home' && (
            <div className="space-y-5">
              {/* Search input */}
              <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-stone pointer-events-none" />
                <input
                  ref={inputRef}
                  placeholder="Buscar alimento…"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  className="w-full bg-base-panel border border-base-border rounded-xl pl-10 pr-4 py-3 text-base-ivory placeholder-base-muted text-sm outline-none focus:border-base-gold/50 transition-colors"
                />
              </div>

              {/* Search results */}
              {query.trim() ? (
                <div className="space-y-2">
                  {results.length === 0
                    ? <p className="text-xs text-base-stone text-center py-8">Sin resultados para "{query}"</p>
                    : results.map((food) => <FoodRow key={food.id} food={food} onSelect={() => selectFood(food)} />)}
                </div>
              ) : (
                <>
                  {/* Recents */}
                  {recents.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[0.6rem] uppercase tracking-widest text-base-stone">Recientes</p>
                      {recents.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => selectFromQuick(item.food_name, item.kcal / item.quantity_g * 100, item.protein_g / item.quantity_g * 100, item.carbs_g / item.quantity_g * 100, item.fat_g / item.quantity_g * 100, item.quantity_g)}
                          className="w-full text-left px-4 py-3 rounded-2xl border border-base-border hover:border-[#353528] bg-base-dim transition-colors flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm text-base-ivory">{item.food_name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#6A6A5A' }}>{item.quantity_g}g · {Math.round(item.kcal)} kcal</p>
                          </div>
                          <p className="text-xs" style={{ color: '#5C5824' }}>+</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Favorites */}
                  {favorites.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[0.6rem] uppercase tracking-widest text-base-stone flex items-center gap-1.5">
                        <Star size={10} className="fill-current" style={{ color: '#9A8535' }} />
                        Favoritos
                      </p>
                      {favorites.map((fav) => (
                        <button
                          key={fav.id}
                          onClick={() => selectFromQuick(fav.food_name, fav.kcal_per_100g, fav.protein_per_100g, fav.carbs_per_100g, fav.fat_per_100g, fav.default_quantity_g)}
                          className="w-full text-left px-4 py-3 rounded-2xl border hover:border-[#353528] bg-base-dim transition-colors flex items-center justify-between"
                          style={{ borderColor: 'rgba(154,133,53,0.25)' }}
                        >
                          <div>
                            <p className="text-sm text-base-ivory">{fav.food_name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#6A6A5A' }}>
                              {fav.kcal_per_100g} kcal · P {fav.protein_per_100g}g / 100g
                            </p>
                          </div>
                          <Star size={13} className="fill-current flex-shrink-0" style={{ color: '#9A8535' }} />
                        </button>
                      ))}
                    </div>
                  )}

                  {recents.length === 0 && favorites.length === 0 && (
                    <p className="text-xs text-center py-10 opacity-40" style={{ color: '#9A8E58' }}>
                      Busca cualquier alimento de tu dieta habitual
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── DETAIL ── */}
          {step === 'detail' && selected && (
            <div className="space-y-5">
              {/* Food name + favorite */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base-ivory font-medium leading-snug">{selected.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: '#6A6A5A' }}>
                    Ración sugerida: {selected.portionLabel} ({selected.portion}g)
                  </p>
                </div>
                {selected.id && (
                  <button onClick={toggleFavorite} className="flex-shrink-0 mt-0.5 transition-colors">
                    <Star
                      size={20}
                      className={isFavorite ? 'fill-current' : ''}
                      style={{ color: isFavorite ? '#C4A35A' : '#4A4840' }}
                    />
                  </button>
                )}
              </div>

              {/* Per 100g */}
              <div>
                <p className="text-[0.6rem] uppercase tracking-widest text-base-stone mb-2">Por 100g</p>
                <MacroGrid kcal={selected.kcal} protein={selected.protein} carbs={selected.carbs} fat={selected.fat} />
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-[0.6rem] uppercase tracking-widest text-base-stone">Cantidad (gramos)</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-base-panel border border-base-border rounded-xl px-4 py-3 text-base-ivory text-sm outline-none focus:border-base-gold/50"
                />
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setQuantity(selected.portion)}
                    className={cn('px-3 py-1.5 rounded-lg text-xs border transition-colors',
                      quantity === selected.portion ? 'bg-base-forest border-base-success text-base-ivory' : 'border-base-border text-base-stone hover:border-base-stone')}>
                    {selected.portionLabel}
                  </button>
                  {PORTIONS.filter((g) => g !== selected.portion).map((g) => (
                    <button key={g} onClick={() => setQuantity(g)}
                      className={cn('px-3 py-1.5 rounded-lg text-xs border transition-colors',
                        quantity === g ? 'bg-base-forest border-base-success text-base-ivory' : 'border-base-border text-base-stone hover:border-base-stone')}>
                      {g}g
                    </button>
                  ))}
                </div>
              </div>

              {/* Total */}
              {macros && (
                <div className="space-y-2">
                  <p className="text-[0.6rem] uppercase tracking-widest text-base-stone">Total · {quantity}g</p>
                  <MacroGrid kcal={macros.kcal} protein={macros.protein_g} carbs={macros.carbs_g} fat={macros.fat_g} />
                </div>
              )}

              <Button fullWidth size="lg" onClick={doAdd} disabled={adding}>
                {adding ? 'Añadiendo…' : 'Añadir al registro'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
