import { useEffect, useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { MessageCircle, ChevronRight, Flame, Trophy } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'
import { supabase } from '../lib/supabase'
import { cn, today } from '../lib/utils'
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import type { DaySummary } from '../types'

function dayColor(summary: DaySummary | undefined, isTrainingDay: boolean): string {
  if (!summary) return 'bg-base-muted'
  const score = summary.non_neg_score + (summary.meals_logged > 0 ? 1 : 0) + (summary.has_evidence ? 1 : 0)
  const maxScore = 3 + 1 + 1 + (isTrainingDay ? 1 : 0)
  const ratio = score / maxScore
  if (ratio >= 0.8) return 'bg-base-success'
  if (ratio >= 0.4) return 'bg-base-warning/70'
  return 'bg-base-muted'
}

export function Vision() {
  const profile = useAuthStore((s) => s.profile)
  const { feedback, fetchFeedback, markFeedbackRead } = useDataStore()
  const [summaries, setSummaries] = useState<DaySummary[]>([])
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  useEffect(() => {
    if (!profile) return
    fetchFeedback(profile.id)
    loadSummaries()
  }, [profile])

  const loadSummaries = async () => {
    if (!profile) return
    const start = format(subMonths(new Date(), 1), 'yyyy-MM-dd')
    const end = today()

    const [nn, meals, trainings, evidences] = await Promise.all([
      supabase.from('non_negotiables').select('*').eq('user_id', profile.id).gte('date', start),
      supabase.from('meals').select('date, kcal_estimated').eq('user_id', profile.id).gte('date', start),
      supabase.from('trainings').select('date, completed').eq('user_id', profile.id).gte('date', start),
      supabase.from('evidences').select('date, evidence_1').eq('user_id', profile.id).gte('date', start),
    ])

    const days = eachDayOfInterval({ start: new Date(start), end: new Date(end) })
    const built: DaySummary[] = days.map((d) => {
      const dateStr = format(d, 'yyyy-MM-dd')
      const nnDay = nn.data?.find((r) => r.date === dateStr)
      const mealCount = meals.data?.filter((r) => r.date === dateStr).length ?? 0
      const tr = trainings.data?.find((r) => r.date === dateStr)
      const ev = evidences.data?.find((r) => r.date === dateStr)
      const nonNegScore = [nnDay?.rest_done, nnDay?.movement_done, nnDay?.nutrition_done].filter(Boolean).length
      const isTrainingDay = profile.training_days.some((td) => td.toLowerCase() === format(d, 'EEEE', { locale: es }).toLowerCase())
      return {
        date: dateStr,
        non_neg_score: nonNegScore,
        has_training: isTrainingDay,
        training_completed: tr?.completed ?? false,
        meals_logged: mealCount,
        has_evidence: !!ev?.evidence_1,
      }
    })
    setSummaries(built)

    // Calculate streaks
    let cur = 0, best = 0, running = 0
    for (const s of [...built].reverse()) {
      const hasActivity = s.non_neg_score > 0 || s.meals_logged > 0 || s.has_evidence
      if (hasActivity) { running++; best = Math.max(best, running) }
      else running = 0
    }
    cur = running
    setStreak(cur)
    setBestStreak(best)
  }

  if (!profile) return null

  const thisMonth = eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) })
  const totalDays = summaries.length
  const activeDays = summaries.filter((s) => s.non_neg_score > 0 || s.meals_logged > 0).length
  const adherence = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0

  return (
    <AppShell>
      <div className="space-y-5 animate-fade-in">
        <PageHeader title="Visión global" subtitle="Tu progreso en perspectiva" />

        {/* Streak cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="flex flex-col items-center gap-1 py-5">
            <Flame size={20} className="text-base-warning" />
            <p className="text-3xl font-bold text-base-white">{streak}</p>
            <p className="text-base-stone text-xs">Racha actual</p>
          </Card>
          <Card className="flex flex-col items-center gap-1 py-5">
            <Trophy size={20} className="text-base-success" />
            <p className="text-3xl font-bold text-base-white">{bestStreak}</p>
            <p className="text-base-stone text-xs">Mejor racha</p>
          </Card>
        </div>

        {/* Adherence */}
        <Card className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs text-base-stone uppercase tracking-widest">Adherencia</p>
            <p className="text-base-white font-semibold">{adherence}%</p>
          </div>
          <div className="w-full h-2 bg-base-muted rounded-full overflow-hidden">
            <div className="h-full bg-base-success rounded-full transition-all duration-700" style={{ width: `${adherence}%` }} />
          </div>
          <p className="text-base-stone text-xs">{activeDays} días activos de {totalDays}</p>
        </Card>

        {/* Monthly calendar */}
        <Card className="space-y-3">
          <p className="text-xs text-base-stone uppercase tracking-widest capitalize">
            {format(new Date(), 'MMMM yyyy', { locale: es })}
          </p>
          <div className="grid grid-cols-7 gap-1">
            {['L','M','X','J','V','S','D'].map((d) => (
              <p key={d} className="text-center text-2xs text-base-stone pb-1">{d}</p>
            ))}
            {thisMonth.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const summary = summaries.find((s) => s.date === dateStr)
              const isTrainingDay = profile.training_days.some(
                (td) => td.toLowerCase() === format(day, 'EEEE', { locale: es }).toLowerCase()
              )
              const isToday = dateStr === today()
              const isFuture = day > new Date()
              return (
                <div
                  key={dateStr}
                  className={cn(
                    'aspect-square rounded-lg flex items-center justify-center text-2xs font-medium transition-colors',
                    isFuture ? 'text-base-muted' :
                    isToday ? `${dayColor(summary, isTrainingDay)} ring-1 ring-base-white/40 text-white` :
                    summary ? `${dayColor(summary, isTrainingDay)} text-white` :
                    'bg-base-panel text-base-stone'
                  )}
                >
                  {format(day, 'd')}
                </div>
              )
            })}
          </div>
          {/* Legend */}
          <div className="flex gap-4 pt-1">
            {[['bg-base-success', 'Cumplido'], ['bg-base-warning/70', 'Parcial'], ['bg-base-muted', 'Pendiente']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                <span className="text-2xs text-base-stone">{label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Feedback from mentor */}
        {feedback.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-base-stone uppercase tracking-widest">Feedback de tu mentor</p>
            {feedback.map((f) => (
              <Card
                key={f.id}
                className={cn('space-y-1', !f.read && 'border-base-warning/40')}
                onClick={() => !f.read && markFeedbackRead(f.id)}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle size={14} className="text-base-warning" />
                  <p className="text-2xs text-base-stone">{format(new Date(f.created_at), "d MMM · HH:mm", { locale: es })}</p>
                  {!f.read && <span className="ml-auto text-2xs bg-base-warning/20 text-base-warning px-2 py-0.5 rounded-full">Nuevo</span>}
                </div>
                <p className="text-base-white text-sm leading-relaxed">{f.message}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
