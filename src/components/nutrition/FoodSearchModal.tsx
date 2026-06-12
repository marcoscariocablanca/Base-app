import { useState, useRef, useCallback, useEffect } from 'react'
import { X, Search, Camera, ArrowLeft, Loader2, Check } from 'lucide-react'
import { searchFoods, type USDAFood } from '../../lib/usda'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import type { MealItem } from '../../types'

type Tab = 'search' | 'photo'
type SearchStep = 'list' | 'detail'

interface PhotoFood {
  name: string
  quantity_g: number
  kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
  checked: boolean
}

interface Props {
  isOpen: boolean
  mealType: string
  userId: string
  date: string
  onAdd: (items: Omit<MealItem, 'id' | 'created_at'>[]) => Promise<void>
  onClose: () => void
}

const PORTIONS = [50, 100, 150, 200, 250, 300]

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      const max = 800
      const ratio = Math.min(max / img.width, max / img.height, 1)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.75).split(',')[1])
    }
    img.onerror = reject
    img.src = url
  })
}

export function FoodSearchModal({ isOpen, mealType, userId, date, onAdd, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('search')
  const [step, setStep] = useState<SearchStep>('list')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<USDAFood[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [selected, setSelected] = useState<USDAFood | null>(null)
  const [quantity, setQuantity] = useState(100)
  const [adding, setAdding] = useState(false)

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [photoFoods, setPhotoFoods] = useState<PhotoFood[]>([])
  const [photoError, setPhotoError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) {
      setTab('search'); setStep('list'); setQuery(''); setResults([])
      setSelected(null); setQuantity(100)
      setPhotoPreview(null); setPhotoFoods([]); setPhotoError(''); setSearchError('')
    }
  }, [isOpen])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setSearching(true); setSearchError('')
    const res = await searchFoods(q)
    setSearching(false)
    if (!res.length) setSearchError('Sin resultados. Prueba en inglés (ej: "chicken breast", "rice").')
    setResults(res)
  }, [])

  const onQueryChange = (q: string) => {
    setQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(q), 500)
  }

  const calcMacros = (food: USDAFood, g: number) => ({
    kcal: Math.round(food.kcal * g / 100),
    protein_g: parseFloat((food.protein * g / 100).toFixed(1)),
    carbs_g: parseFloat((food.carbs * g / 100).toFixed(1)),
    fat_g: parseFloat((food.fat * g / 100).toFixed(1)),
  })

  const addSelected = async () => {
    if (!selected) return
    setAdding(true)
    await onAdd([{
      user_id: userId, date, meal_type: mealType,
      food_name: selected.description,
      food_id: String(selected.fdcId),
      quantity_g: quantity,
      source: 'usda',
      ...calcMacros(selected, quantity),
    }])
    setAdding(false)
    setStep('list'); setSelected(null); setQuery(''); setResults([])
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoPreview(URL.createObjectURL(file))
    setPhotoFoods([]); setPhotoError(''); setAnalyzing(true)
    try {
      const base64 = await compressImage(file)
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.foods?.length) {
        setPhotoFoods(data.foods.map((f: any) => ({ ...f, checked: true })))
      } else {
        setPhotoError('No se detectaron alimentos. Intenta con una foto más clara.')
      }
    } catch {
      setPhotoError('Error al analizar la foto. Comprueba tu conexión.')
    }
    setAnalyzing(false)
  }

  const addPhotoFoods = async () => {
    const checked = photoFoods.filter((f) => f.checked)
    if (!checked.length) return
    setAdding(true)
    await onAdd(checked.map(({ checked: _c, name, ...f }) => ({
      user_id: userId, date, meal_type: mealType, source: 'photo' as const, food_id: undefined, food_name: name, ...f,
    })))
    setAdding(false)
    onClose()
  }

  if (!isOpen) return null

  const macros = selected ? calcMacros(selected, quantity) : null

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex-1 mt-14 rounded-t-3xl flex flex-col overflow-hidden" style={{ background: '#141412', border: '1px solid #252520' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          {step === 'detail'
            ? <button onClick={() => { setStep('list'); setSelected(null) }} className="text-base-stone hover:text-base-ivory transition-colors"><ArrowLeft size={20} /></button>
            : <div className="w-5" />}
          <p className="text-sm font-medium text-base-ivory" style={{ letterSpacing: '0.04em' }}>Añadir alimento</p>
          <button onClick={onClose} className="text-base-stone hover:text-base-ivory transition-colors"><X size={20} /></button>
        </div>

        {/* Tabs */}
        {step === 'list' && (
          <div className="flex mx-5 mb-4 rounded-xl overflow-hidden border border-base-border flex-shrink-0">
            {(['search', 'photo'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={cn('flex-1 py-2.5 text-xs flex items-center justify-center gap-2 transition-colors',
                  tab === t ? 'bg-base-forest text-base-ivory' : 'text-base-stone hover:text-base-ivory')}>
                {t === 'search' ? <Search size={13} /> : <Camera size={13} />}
                {t === 'search' ? 'Buscar' : 'Foto IA'}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-10">

          {/* ── SEARCH: list ── */}
          {tab === 'search' && step === 'list' && (
            <div className="space-y-3">
              <input
                autoFocus
                placeholder="Buscar alimento (ej: arroz, pollo, plátano…)"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="w-full bg-base-panel border border-base-border rounded-xl px-4 py-3 text-base-ivory placeholder-base-muted text-sm outline-none focus:border-base-gold/50 transition-colors"
              />
              {searching && <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-base-stone" /></div>}
              {!searching && searchError && <p className="text-xs text-base-stone text-center py-6">{searchError}</p>}
              {!searching && results.map((food) => (
                <button key={food.fdcId} onClick={() => { setSelected(food); setStep('detail'); setQuantity(100) }}
                  className="w-full text-left p-4 rounded-2xl border border-base-border hover:border-[#353528] bg-base-dim transition-colors">
                  <p className="text-sm text-base-ivory font-medium leading-snug mb-1.5">{food.description}</p>
                  <div className="flex gap-3 text-xs" style={{ color: '#6A6A5A' }}>
                    <span className="text-base-stone">{food.kcal} kcal</span>
                    <span>P {food.protein}g</span>
                    <span>H {food.carbs}g</span>
                    <span>G {food.fat}g</span>
                    <span className="ml-auto opacity-50">/ 100g</span>
                  </div>
                </button>
              ))}
              {!query && !searching && (
                <p className="text-xs text-center py-10 opacity-40" style={{ color: '#9A8E58' }}>
                  Base de datos USDA FoodData Central
                </p>
              )}
            </div>
          )}

          {/* ── SEARCH: detail ── */}
          {tab === 'search' && step === 'detail' && selected && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base-ivory font-medium leading-snug mb-1">{selected.description}</h3>
                <p className="text-xs" style={{ color: '#6A6A5A' }}>
                  Por 100g · {selected.kcal} kcal · P {selected.protein}g · H {selected.carbs}g · G {selected.fat}g
                </p>
              </div>

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
                  {PORTIONS.map((g) => (
                    <button key={g} onClick={() => setQuantity(g)}
                      className={cn('px-3 py-1.5 rounded-lg text-xs border transition-colors',
                        quantity === g ? 'bg-base-forest border-base-success text-base-ivory' : 'border-base-border text-base-stone hover:border-base-stone')}>
                      {g}g
                    </button>
                  ))}
                </div>
              </div>

              {macros && (
                <div className="rounded-2xl px-5 py-4 space-y-3" style={{ background: '#1A1A16', border: '1px solid #252520' }}>
                  <div className="flex items-baseline justify-between">
                    <p className="text-[0.6rem] uppercase tracking-widest text-base-stone">Total · {quantity}g</p>
                    <p className="text-2xl font-bold text-base-ivory">{macros.kcal} <span className="text-sm font-normal text-base-stone">kcal</span></p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[['Proteína', macros.protein_g, '#4A7C59'], ['Hidratos', macros.carbs_g, '#C4A35A'], ['Grasas', macros.fat_g, '#8A7A4A']].map(([l, v, c]) => (
                      <div key={l as string}>
                        <p className="text-[0.55rem] uppercase tracking-widest mb-0.5" style={{ color: '#6A6A5A' }}>{l}</p>
                        <p className="text-base font-semibold" style={{ color: c as string }}>{v}g</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button fullWidth size="lg" onClick={addSelected} disabled={adding}>
                {adding ? 'Añadiendo…' : 'Añadir al registro'}
              </Button>
            </div>
          )}

          {/* ── PHOTO TAB ── */}
          {tab === 'photo' && (
            <div className="space-y-5">
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />

              {!photoPreview && (
                <button onClick={() => fileRef.current?.click()}
                  className="w-full h-52 border-2 border-dashed border-base-border rounded-2xl flex flex-col items-center justify-center gap-3 text-base-stone hover:border-[#353528] transition-colors">
                  <Camera size={40} style={{ color: '#5C5824' }} />
                  <p className="text-sm text-base-stone">Tomar foto o seleccionar imagen</p>
                  <p className="text-xs opacity-50">La IA identificará los alimentos y sus macros</p>
                </button>
              )}

              {photoPreview && (
                <div className="space-y-4">
                  <img src={photoPreview} alt="Plato" className="w-full h-52 object-cover rounded-2xl" />

                  {analyzing && (
                    <div className="flex items-center justify-center gap-3 py-4">
                      <Loader2 size={18} className="animate-spin" style={{ color: '#9A8E58' }} />
                      <p className="text-sm text-base-stone">Analizando alimentos…</p>
                    </div>
                  )}

                  {!analyzing && photoError && <p className="text-xs text-red-400 text-center py-2">{photoError}</p>}

                  {!analyzing && photoFoods.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[0.6rem] uppercase tracking-widest text-base-stone">Alimentos detectados</p>
                      {photoFoods.map((f, i) => (
                        <button key={i} onClick={() => setPhotoFoods((prev) => prev.map((x, j) => j === i ? { ...x, checked: !x.checked } : x))}
                          className={cn('w-full text-left p-4 rounded-2xl border transition-colors flex items-start gap-3',
                            f.checked ? 'border-base-success/40 bg-base-forest/10' : 'border-base-border bg-base-dim')}>
                          <div className={cn('w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5',
                            f.checked ? 'bg-base-success border-base-success' : 'border-base-border')}>
                            {f.checked && <Check size={11} className="text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-base-ivory font-medium">{f.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#6A6A5A' }}>
                              {f.quantity_g}g · {f.kcal} kcal · P {f.protein_g}g · H {f.carbs_g}g · G {f.fat_g}g
                            </p>
                          </div>
                        </button>
                      ))}
                      <Button fullWidth size="lg" onClick={addPhotoFoods} disabled={adding || !photoFoods.some((f) => f.checked)}>
                        {adding ? 'Añadiendo…' : `Añadir ${photoFoods.filter((f) => f.checked).length} alimento${photoFoods.filter((f) => f.checked).length !== 1 ? 's' : ''}`}
                      </Button>
                    </div>
                  )}

                  {!analyzing && (
                    <button onClick={() => { setPhotoPreview(null); setPhotoFoods([]); setPhotoError('') }}
                      className="w-full text-center text-xs text-base-stone hover:text-base-ivory py-2 transition-colors">
                      Seleccionar otra foto
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
