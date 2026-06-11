import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Users, ChevronRight, ChevronLeft, Send, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'
import { supabase } from '../lib/supabase'
import { cn, MOOD_MAP, today } from '../lib/utils'
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { TextArea } from '../components/ui/Input'
import type { Profile, Meal, NonNegotiable, Training, Evidence } from '../types'

interface ClientData {
  profile: Profile
  nonNeg: NonNegotiable | null
  meals: Meal[]
  training: Training | null
  evidence: Evidence | null
}

type MoodKey = keyof typeof MOOD_MAP

export function MentorPanel() {
  const profile = useAuthStore((s) => s.profile)
  const { sendFeedback, showToast } = useDataStore()
  const [clients, setClients] = useState<Profile[]>([])
  const [selected, setSelected] = useState<ClientData | null>(null)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('role', 'client')
    setClients(data ?? [])
  }

  const selectClient = async (p: Profile) => {
    const dateStr = today()
    const [nn, meals, tr, ev] = await Promise.all([
      supabase.from('non_negotiables').select('*').eq('user_id', p.id).eq('date', dateStr).maybeSingle(),
      supabase.from('meals').select('*').eq('user_id', p.id).eq('date', dateStr),
      supabase.from('trainings').select('*').eq('user_id', p.id).eq('date', dateStr).maybeSingle(),
      supabase.from('evidences').select('*').eq('user_id', p.id).eq('date', dateStr).maybeSingle(),
    ])
    setSelected({ profile: p, nonNeg: nn.data, meals: meals.data ?? [], training: tr.data, evidence: ev.data })
  }

  const send = async () => {
    if (!profile || !selected || !feedbackMsg.trim()) return
    setSending(true)
    await sendFeedback(profile.id, selected.profile.id, feedbackMsg.trim())
    setSending(false)
    setFeedbackMsg('')
    showToast('Feedback enviado.')
  }

  if (profile?.role !== 'mentor') {
    return (
      <AppShell>
        <Card className="py-12 text-center">
          <p className="text-base-stone">Acceso solo para mentores.</p>
        </Card>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-5 animate-fade-in">
        {selected ? (
          <>
            <div className="flex items-center gap-3">
              <button onClick={() => setSelected(null)} className="text-base-stone hover:text-base-white transition-colors">
                <ChevronLeft size={20} />
              </button>
              <PageHeader title={selected.profile.full_name} subtitle="Vista del cliente" className="mb-0 flex-1" />
            </div>

            {/* Client overview */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Edad', value: selected.profile.age ? `${selected.profile.age} años` : '—' },
                { label: 'Peso', value: selected.profile.weight_kg ? `${selected.profile.weight_kg} kg` : '—' },
                { label: 'Objetivo', value: selected.profile.goal_weight_kg ? `${selected.profile.goal_weight_kg} kg` : '—' },
                { label: 'Kcal objetivo', value: `${selected.profile.daily_kcal_goal} kcal` },
              ].map(({ label, value }) => (
                <Card key={label} className="py-3">
                  <p className="text-base-stone text-2xs uppercase tracking-widest">{label}</p>
                  <p className="text-base-white font-semibold mt-0.5">{value}</p>
                </Card>
              ))}
            </div>

            {/* Today's data */}
            <p className="text-xs text-base-stone uppercase tracking-widest">Hoy · {format(new Date(), "d MMM", { locale: es })}</p>

            {/* Non-negociables */}
            <Card className="space-y-2">
              <p className="text-xs text-base-stone uppercase tracking-widest mb-1">No negociables</p>
              {[
                { key: 'rest_done', label: 'Descanso' },
                { key: 'movement_done', label: 'Movimiento' },
                { key: 'nutrition_done', label: 'Alimentación' },
              ].map(({ key, label }) => {
                const done = selected.nonNeg?.[key as keyof NonNegotiable] as boolean | undefined
                return (
                  <div key={key} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className={done ? 'text-base-success' : 'text-base-muted'} />
                    <span className={cn('text-sm', done ? 'text-base-white' : 'text-base-stone')}>{label}</span>
                  </div>
                )
              })}
            </Card>

            {/* Meals */}
            <Card className="space-y-2">
              <div className="flex justify-between">
                <p className="text-xs text-base-stone uppercase tracking-widest">Alimentación</p>
                <p className="text-base-white text-xs">
                  {selected.meals.reduce((a, m) => a + (m.kcal_estimated ?? 0), 0)} kcal
                </p>
              </div>
              {selected.meals.length === 0 ? (
                <p className="text-base-stone text-xs">Sin comidas registradas</p>
              ) : (
                selected.meals.map((m) => (
                  <div key={m.id} className="text-xs space-y-0.5 py-1.5 border-b border-base-border last:border-0">
                    <div className="flex justify-between">
                      <span className="text-base-white capitalize">{m.meal_type.replace('_', ' ')}</span>
                      <span className="text-base-stone">{m.kcal_estimated ? `${m.kcal_estimated} kcal` : '—'}</span>
                    </div>
                    <div className="flex gap-3 text-base-stone">
                      {m.hunger_before && <span>Hambre: {m.hunger_before}/10</span>}
                      {m.satiety_after && <span>Saciedad: {m.satiety_after}/10</span>}
                      {m.mood && <span>{MOOD_MAP[m.mood as MoodKey]?.emoji} {MOOD_MAP[m.mood as MoodKey]?.label}</span>}
                    </div>
                    {m.notes && <p className="text-base-stone italic">{m.notes}</p>}
                  </div>
                ))
              )}
            </Card>

            {/* Training */}
            <Card>
              <p className="text-xs text-base-stone uppercase tracking-widest mb-2">Entrenamiento</p>
              {selected.training ? (
                <div className="space-y-1 text-sm">
                  <p className={selected.training.completed ? 'text-base-success' : 'text-base-stone'}>
                    {selected.training.completed ? '✓ Completado' : 'Pendiente'}
                  </p>
                  {selected.training.energy_level && (
                    <p className="text-base-stone text-xs">
                      Energía: {selected.training.energy_level} · Dificultad: {selected.training.difficulty}
                    </p>
                  )}
                  {selected.training.notes && (
                    <p className="text-base-stone text-xs italic">"{selected.training.notes}"</p>
                  )}
                </div>
              ) : (
                <p className="text-base-stone text-sm">Sin datos</p>
              )}
            </Card>

            {/* Evidence */}
            <Card className="space-y-2">
              <p className="text-xs text-base-stone uppercase tracking-widest">Evidencias diarias</p>
              {[selected.evidence?.evidence_1, selected.evidence?.evidence_2, selected.evidence?.evidence_3]
                .filter(Boolean)
                .map((ev, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-base-warning text-xs mt-0.5">★</span>
                    <p className="text-base-white text-sm">{ev}</p>
                  </div>
                ))}
              {!selected.evidence?.evidence_1 && <p className="text-base-stone text-xs">Sin evidencias registradas</p>}
            </Card>

            {/* Send feedback */}
            <Card className="space-y-3">
              <p className="text-xs text-base-stone uppercase tracking-widest">Enviar feedback</p>
              <TextArea
                placeholder="Escribe tu feedback para este cliente…"
                rows={3}
                value={feedbackMsg}
                onChange={(e) => setFeedbackMsg(e.target.value)}
              />
              <Button fullWidth onClick={send} disabled={sending || !feedbackMsg.trim()}>
                <Send size={14} />
                {sending ? 'Enviando…' : 'Enviar'}
              </Button>
            </Card>
          </>
        ) : (
          <>
            <PageHeader title="Panel Mentor" subtitle={`${clients.length} cliente${clients.length !== 1 ? 's' : ''}`} />

            <div className="space-y-2">
              {clients.length === 0 ? (
                <Card className="py-12 text-center">
                  <Users size={32} className="text-base-muted mx-auto mb-3" />
                  <p className="text-base-stone text-sm">No hay clientes registrados aún.</p>
                </Card>
              ) : (
                clients.map((c) => (
                  <Card key={c.id} className="flex items-center justify-between" onClick={() => selectClient(c)}>
                    <div>
                      <p className="text-base-white font-medium">{c.full_name}</p>
                      <p className="text-base-stone text-xs mt-0.5">{c.email}</p>
                    </div>
                    <ChevronRight size={16} className="text-base-stone" />
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
