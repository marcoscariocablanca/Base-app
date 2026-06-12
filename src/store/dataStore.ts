import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { today } from '../lib/utils'
import type { NonNegotiable, Meal, MealItem, FavoriteFood, Training, Evidence, MentorFeedback } from '../types'

interface DataState {
  nonNeg: NonNegotiable | null
  meals: Meal[]
  mealItems: MealItem[]
  favorites: FavoriteFood[]
  training: Training | null
  evidence: Evidence | null
  feedback: MentorFeedback[]
  toast: string | null

  showToast: (msg: string) => void
  clearToast: () => void

  fetchDay: (userId: string, date?: string) => Promise<void>
  upsertNonNeg: (userId: string, fields: Partial<NonNegotiable>) => Promise<void>
  upsertMeal: (userId: string, meal: Partial<Meal>) => Promise<void>
  deleteMeal: (id: string) => Promise<void>
  addMealItems: (userId: string, items: Omit<MealItem, 'id' | 'created_at'>[], date?: string) => Promise<void>
  deleteMealItem: (id: string) => Promise<void>
  fetchFavorites: (userId: string) => Promise<void>
  addFavorite: (userId: string, food: Omit<FavoriteFood, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  removeFavorite: (id: string) => Promise<void>
  upsertTraining: (userId: string, fields: Partial<Training>) => Promise<void>
  upsertEvidence: (userId: string, fields: Partial<Evidence>) => Promise<void>
  fetchFeedback: (userId: string) => Promise<void>
  sendFeedback: (mentorId: string, clientId: string, message: string) => Promise<void>
  markFeedbackRead: (id: string) => Promise<void>
}

export const useDataStore = create<DataState>((set, get) => ({
  nonNeg: null,
  meals: [],
  mealItems: [],
  favorites: [],
  training: null,
  evidence: null,
  feedback: [],
  toast: null,

  showToast: (msg) => {
    set({ toast: msg })
    setTimeout(() => set({ toast: null }), 3000)
  },

  clearToast: () => set({ toast: null }),

  fetchDay: async (userId, date = today()) => {
    const [nonNegRes, mealsRes, trainingRes, evidenceRes, itemsRes] = await Promise.all([
      supabase.from('non_negotiables').select('*').eq('user_id', userId).eq('date', date).maybeSingle(),
      supabase.from('meals').select('*').eq('user_id', userId).eq('date', date),
      supabase.from('trainings').select('*').eq('user_id', userId).eq('date', date).maybeSingle(),
      supabase.from('evidences').select('*').eq('user_id', userId).eq('date', date).maybeSingle(),
      supabase.from('meal_items').select('*').eq('user_id', userId).eq('date', date).order('created_at'),
    ])
    set({
      nonNeg: nonNegRes.data,
      meals: mealsRes.data ?? [],
      mealItems: itemsRes.data ?? [],
      training: trainingRes.data,
      evidence: evidenceRes.data,
    })
  },

  upsertNonNeg: async (userId, fields) => {
    const existing = get().nonNeg
    const record = {
      user_id: userId,
      date: today(),
      rest_done: false,
      movement_done: false,
      nutrition_done: false,
      ...existing,
      ...fields,
    }
    const { data } = await supabase
      .from('non_negotiables')
      .upsert(record, { onConflict: 'user_id,date' })
      .select()
      .single()
    set({ nonNeg: data })
  },

  upsertMeal: async (userId, meal) => {
    const record = { user_id: userId, date: today(), ...meal }
    const { data } = await supabase
      .from('meals')
      .upsert(record, { onConflict: 'id' })
      .select()
      .single()
    if (!data) return
    set((s) => ({
      meals: s.meals.some((m) => m.id === data.id)
        ? s.meals.map((m) => (m.id === data.id ? data : m))
        : [...s.meals, data],
    }))
  },

  deleteMeal: async (id) => {
    await supabase.from('meals').delete().eq('id', id)
    set((s) => ({ meals: s.meals.filter((m) => m.id !== id) }))
  },

  addMealItems: async (userId, items, date = today()) => {
    const { data } = await supabase.from('meal_items').insert(items).select()
    if (!data) return
    const newItems = [...get().mealItems, ...data]
    set({ mealItems: newItems })

    // Update meal record with aggregated macros for each affected meal_type
    const affectedTypes = [...new Set(items.map((i) => i.meal_type))]
    for (const mealType of affectedTypes) {
      const typeItems = newItems.filter((i) => i.meal_type === mealType && i.date === date && i.user_id === userId)
      const kcal = Math.round(typeItems.reduce((a, i) => a + i.kcal, 0))
      const protein = parseFloat(typeItems.reduce((a, i) => a + i.protein_g, 0).toFixed(1))
      const carbs = parseFloat(typeItems.reduce((a, i) => a + i.carbs_g, 0).toFixed(1))
      const fat = parseFloat(typeItems.reduce((a, i) => a + i.fat_g, 0).toFixed(1))
      const foods = typeItems.map((i) => i.food_name).join(', ')
      const existing = get().meals.find((m) => m.meal_type === mealType)
      const record = {
        user_id: userId, date, meal_type: mealType,
        kcal_estimated: kcal, protein_g: protein, carbs_g: carbs, fat_g: fat, foods,
        ...(existing ? { id: existing.id, hunger_before: existing.hunger_before, satiety_after: existing.satiety_after, mood: existing.mood, notes: existing.notes } : {}),
      }
      const { data: mealData } = await supabase.from('meals').upsert(record, { onConflict: existing ? 'id' : 'user_id,date,meal_type' }).select().single()
      if (mealData) {
        set((s) => ({
          meals: s.meals.some((m) => m.id === mealData.id)
            ? s.meals.map((m) => m.id === mealData.id ? mealData : m)
            : [...s.meals, mealData],
        }))
      }
    }
  },

  deleteMealItem: async (id) => {
    const item = get().mealItems.find((i) => i.id === id)
    await supabase.from('meal_items').delete().eq('id', id)
    const remaining = get().mealItems.filter((i) => i.id !== id)
    set({ mealItems: remaining })

    if (!item) return
    const typeItems = remaining.filter((i) => i.meal_type === item.meal_type && i.date === item.date)
    const kcal = Math.round(typeItems.reduce((a, i) => a + i.kcal, 0))
    const protein = parseFloat(typeItems.reduce((a, i) => a + i.protein_g, 0).toFixed(1))
    const carbs = parseFloat(typeItems.reduce((a, i) => a + i.carbs_g, 0).toFixed(1))
    const fat = parseFloat(typeItems.reduce((a, i) => a + i.fat_g, 0).toFixed(1))
    const foods = typeItems.map((i) => i.food_name).join(', ')
    const existing = get().meals.find((m) => m.meal_type === item.meal_type)
    if (existing) {
      await supabase.from('meals').update({ kcal_estimated: kcal, protein_g: protein, carbs_g: carbs, fat_g: fat, foods }).eq('id', existing.id)
      set((s) => ({ meals: s.meals.map((m) => m.id === existing.id ? { ...m, kcal_estimated: kcal, protein_g: protein, carbs_g: carbs, fat_g: fat, foods } : m) }))
    }
  },

  upsertTraining: async (userId, fields) => {
    const existing = get().training
    const record = { user_id: userId, date: today(), completed: false, ...existing, ...fields }
    const { data } = await supabase
      .from('trainings')
      .upsert(record, { onConflict: 'user_id,date' })
      .select()
      .single()
    set({ training: data })
  },

  upsertEvidence: async (userId, fields) => {
    const existing = get().evidence
    const record = { user_id: userId, date: today(), ...existing, ...fields }
    const { data } = await supabase
      .from('evidences')
      .upsert(record, { onConflict: 'user_id,date' })
      .select()
      .single()
    set({ evidence: data })
  },

  fetchFeedback: async (userId) => {
    const { data } = await supabase
      .from('mentor_feedback')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false })
    set({ feedback: data ?? [] })
  },

  sendFeedback: async (mentorId, clientId, message) => {
    await supabase.from('mentor_feedback').insert({ mentor_id: mentorId, client_id: clientId, message, read: false })
  },

  markFeedbackRead: async (id) => {
    await supabase.from('mentor_feedback').update({ read: true }).eq('id', id)
    set((s) => ({ feedback: s.feedback.map((f) => (f.id === id ? { ...f, read: true } : f)) }))
  },

  fetchFavorites: async (userId) => {
    const { data } = await supabase.from('favorite_foods').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    set({ favorites: data ?? [] })
  },

  addFavorite: async (userId, food) => {
    const { data } = await supabase.from('favorite_foods').upsert({ user_id: userId, ...food }, { onConflict: 'user_id,food_name' }).select().single()
    if (data) set((s) => ({ favorites: [data, ...s.favorites.filter((f) => f.food_name !== food.food_name)] }))
  },

  removeFavorite: async (id) => {
    await supabase.from('favorite_foods').delete().eq('id', id)
    set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) }))
  },
}))
