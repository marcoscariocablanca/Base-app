import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { today } from '../lib/utils'
import type { NonNegotiable, Meal, Training, Evidence, MentorFeedback } from '../types'

interface DataState {
  nonNeg: NonNegotiable | null
  meals: Meal[]
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
  upsertTraining: (userId: string, fields: Partial<Training>) => Promise<void>
  upsertEvidence: (userId: string, fields: Partial<Evidence>) => Promise<void>
  fetchFeedback: (userId: string) => Promise<void>
  sendFeedback: (mentorId: string, clientId: string, message: string) => Promise<void>
  markFeedbackRead: (id: string) => Promise<void>
}

export const useDataStore = create<DataState>((set, get) => ({
  nonNeg: null,
  meals: [],
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
    const [nonNegRes, mealsRes, trainingRes, evidenceRes] = await Promise.all([
      supabase.from('non_negotiables').select('*').eq('user_id', userId).eq('date', date).maybeSingle(),
      supabase.from('meals').select('*').eq('user_id', userId).eq('date', date),
      supabase.from('trainings').select('*').eq('user_id', userId).eq('date', date).maybeSingle(),
      supabase.from('evidences').select('*').eq('user_id', userId).eq('date', date).maybeSingle(),
    ])
    set({
      nonNeg: nonNegRes.data,
      meals: mealsRes.data ?? [],
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
}))
