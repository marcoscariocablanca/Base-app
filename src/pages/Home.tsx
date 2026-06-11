import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'
import { daysSinceStart, getDailyPhrase, getWelcomeMessage, today } from '../lib/utils'
import { AppShell } from '../components/layout/AppShell'
import { Card } from '../components/ui/Card'
import { ProgressRing } from '../components/ui/ProgressRing'
import { BaseLogo } from '../components/ui/BaseLogo'

export function Home() {
  const profile = useAuthStore((s) => s.profile)
  const { nonNeg, meals, training, evidence, feedback, fetchDay, fetchFeedback } = useDataStore()

  useEffect(() => {
    if (profile) {
      fetchDay(profile.id)
      fetchFeedback(profile.id)
    }
  }, [profile])

  if (!profile) return null

  const dayNum = daysSinceStart(profile.start_date)
  const { greeting, subtitle, milestone } = getWelcomeMessage(profile.full_name, dayNum)
  const phrase = getDailyPhrase()

  const nonNegScore = [nonNeg?.rest_done, nonNeg?.movement_done, nonNeg?.nutrition_done].filter(Boolean).length
  const unreadFeedback = feedback.filter((f) => !f.read).length
  const totalKcal = meals.reduce((a, m) => a + (m.kcal_estimated ?? 0), 0)

  const isTrainingDay = profile.training_days.some(
    (d) => d.toLowerCase() === format(new Date(), 'EEEE', { locale: es }).toLowerCase()
      || d.toLowerCase().replace('é','e').replace('á','a') ===
         format(new Date(), 'EEEE', { locale: es }).toLowerCase().replace('é','e').replace('á','a')
  )

  const todayLabel = format(new Date(), "EEEE, d 'de' MMMM", { locale: es })

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">

        {/* ── Logo + Wordmark ───────────────────────────────── */}
        <div className="pt-1 space-y-1">
          {/* Icon + BASE on the exact same line */}
          <div className="flex items-center gap-2.5">
            <BaseLogo size={28} />
            <h1
              className="wordmark leading-none"
              style={{ fontSize: '1.15rem', letterSpacing: '0.22em' }}
            >
              BASE
            </h1>
            <div className="ml-auto">
              <div
                className="text-[0.55rem] uppercase px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: '#252520',
                  color: '#5C5824',
                  letterSpacing: '0.1em',
                  background: '#111110',
                }}
              >
                Día {dayNum}
              </div>
            </div>
          </div>
          {/* Tagline on second line, indented to align with BASE */}
          <p
            className="text-[0.52rem] uppercase"
            style={{ letterSpacing: '0.14em', color: '#5C5824', paddingLeft: '36px' }}
          >
            La base para tu ascenso
          </p>
        </div>

        {/* ── Date ─────────────────────────────────────────── */}
        <p
          className="text-base-stone capitalize"
          style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
        >
          {todayLabel}
        </p>

        {/* ── Welcome ──────────────────────────────────────── */}
        {milestone ? (
          <div
            className="rounded-2xl px-5 py-5 space-y-2"
            style={{
              background: 'linear-gradient(135deg, #1E1A08 0%, #141206 100%)',
              border: '1px solid rgba(168,154,70,0.35)',
            }}
          >
            <p
              className="wordmark"
              style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#A89A46' }}
            >
              PRIMER MES
            </p>
            <h2
              className="text-base-ivory font-medium"
              style={{ fontSize: '1.35rem', letterSpacing: '0.01em' }}
            >
              {greeting}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#9A8E58', lineHeight: 1.6 }}>{subtitle}</p>
          </div>
        ) : (
          <div className="space-y-1">
            <h2
              className="text-base-ivory font-medium"
              style={{ fontSize: '1.3rem', letterSpacing: '0.01em' }}
            >
              {greeting}
            </h2>
            <p className="text-base-stone text-sm">{subtitle}</p>
          </div>
        )}

        {/* ── Daily phrase ──────────────────────────────────── */}
        <div
          className="rounded-2xl px-5 py-4"
          style={{
            background: 'linear-gradient(135deg, #161410 0%, #1A1808 100%)',
            border: '1px solid rgba(154,138,53,0.15)',
          }}
        >
          <p className="text-sm italic leading-relaxed" style={{ color: '#9A8E58', opacity: 0.9 }}>
            "{phrase}"
          </p>
        </div>

        {/* ── Quick stats ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {/* Non-negotiables */}
          <Card className="flex flex-col items-center gap-2 py-4">
            <ProgressRing value={nonNegScore} max={3} size={68} label={`${nonNegScore}/3`} sublabel="pilares" />
          </Card>

          {/* Kcal */}
          <Card className="flex flex-col items-center gap-2 py-4">
            <ProgressRing
              value={totalKcal}
              max={profile.daily_kcal_goal}
              size={68}
              label={`${totalKcal}`}
              sublabel="kcal"
              color="#C4A35A"
            />
          </Card>

          {/* Evidence */}
          <Card className="flex flex-col items-center gap-2 py-4">
            <ProgressRing
              value={evidence?.evidence_1 ? 1 : 0}
              max={1}
              size={68}
              label={evidence?.evidence_1 ? '✓' : '—'}
              sublabel="evidenc."
              color={evidence?.evidence_1 ? '#4A7C59' : '#343430'}
            />
          </Card>
        </div>

        {/* ── Training banner (training days only) ─────────── */}
        {isTrainingDay && (
          <Link to="/entrenamiento">
            <div
              className="rounded-2xl px-4 py-3.5 flex items-center justify-between"
              style={{
                background: training?.completed
                  ? 'linear-gradient(135deg, #1A2A20 0%, #141412 100%)'
                  : 'linear-gradient(135deg, #1A1808 0%, #141412 100%)',
                border: `1px solid ${training?.completed ? 'rgba(74,124,89,0.3)' : 'rgba(196,163,90,0.2)'}`,
              }}
            >
              <div>
                <p
                  className="text-[0.6rem] uppercase mb-1"
                  style={{ letterSpacing: '0.12em', color: training?.completed ? '#4A7C59' : '#9A8535' }}
                >
                  Hoy toca entrenar
                </p>
                <p className="text-base-ivory text-sm font-medium">
                  {training?.completed ? '✓ Completado' : 'Marcar entrenamiento'}
                </p>
              </div>
              <ChevronRight size={16} className="text-base-stone" />
            </div>
          </Link>
        )}

        {/* ── Quick access links ───────────────────────────── */}
        <div className="space-y-2">
          {[
            {
              to: '/no-neg',
              label: 'No Negociables',
              value: nonNegScore === 3 ? 'Completados ✓' : `${nonNegScore}/3 completados`,
              done: nonNegScore === 3,
            },
            {
              to: '/alimentacion',
              label: 'Alimentación',
              value: `${totalKcal} / ${profile.daily_kcal_goal} kcal`,
              done: totalKcal >= profile.daily_kcal_goal * 0.8,
            },
            {
              to: '/evidencias',
              label: 'Evidencias',
              value: evidence?.evidence_1 ? 'Registradas ✓' : 'Pendientes',
              done: !!evidence?.evidence_1,
            },
          ].map(({ to, label, value, done }) => (
            <Link key={to} to={to}>
              <Card
                className="flex items-center justify-between py-3.5"
                style={{
                  borderColor: done ? 'rgba(74,124,89,0.2)' : undefined,
                }}
              >
                <div>
                  <p
                    className="text-base-ivory text-sm font-medium"
                    style={{ letterSpacing: '0.01em' }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: done ? '#4A7C59' : '#6A6A5A' }}
                  >
                    {value}
                  </p>
                </div>
                <ChevronRight size={14} className="text-base-stone flex-shrink-0" />
              </Card>
            </Link>
          ))}
        </div>

        {/* ── Mentor feedback badge ────────────────────────── */}
        {unreadFeedback > 0 && (
          <Link to="/vision">
            <div
              className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
              style={{
                background: '#161208',
                border: '1px solid rgba(196,163,90,0.25)',
              }}
            >
              <MessageCircle size={16} style={{ color: '#C4A35A' }} />
              <div className="flex-1">
                <p className="text-base-ivory text-sm font-medium">Tienes feedback de tu mentor</p>
                <p className="text-xs" style={{ color: '#7A6E30' }}>
                  {unreadFeedback} mensaje{unreadFeedback > 1 ? 's' : ''} nuevo{unreadFeedback > 1 ? 's' : ''}
                </p>
              </div>
              <ChevronRight size={14} className="text-base-stone" />
            </div>
          </Link>
        )}
      </div>
    </AppShell>
  )
}
