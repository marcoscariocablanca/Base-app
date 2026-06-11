import { useEffect, useState } from 'react'
import { Star, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { TextArea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

const EXAMPLES = [
  'He entrenado aunque no tenía ganas.',
  'He cuidado mi alimentación.',
  'He cumplido mi descanso.',
  'He caminado.',
  'He vuelto a aparecer.',
]

export function Evidencias() {
  const profile = useAuthStore((s) => s.profile)
  const { evidence, fetchDay, upsertEvidence, showToast } = useDataStore()
  const [e1, setE1] = useState('')
  const [e2, setE2] = useState('')
  const [e3, setE3] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) fetchDay(profile.id)
  }, [profile])

  useEffect(() => {
    if (evidence) {
      setE1(evidence.evidence_1 ?? '')
      setE2(evidence.evidence_2 ?? '')
      setE3(evidence.evidence_3 ?? '')
      setSaved(!!evidence.evidence_1)
    }
  }, [evidence])

  const save = async () => {
    if (!profile || !e1.trim()) return
    setSaving(true)
    await upsertEvidence(profile.id, {
      evidence_1: e1.trim() || undefined,
      evidence_2: e2.trim() || undefined,
      evidence_3: e3.trim() || undefined,
    })
    setSaving(false)
    setSaved(true)
    showToast('Evidencias registradas. Estás construyendo confianza.')
  }

  const insertExample = (setter: (v: string) => void) => {
    const unused = EXAMPLES.filter((ex) => ![e1, e2, e3].includes(ex))
    if (unused.length) setter(unused[Math.floor(Math.random() * unused.length)])
  }

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <PageHeader title="Evidencias diarias" />

        {/* Instruction */}
        <Card className="border-base-forest/30 bg-gradient-forest">
          <p className="text-base-white text-sm leading-relaxed">
            Antes de cerrar el día, escribe tus tres evidencias.
          </p>
          <p className="text-base-stone text-xs mt-2">
            Una evidencia es cualquier acción que demuestra que estás en el camino.
          </p>
        </Card>

        {/* Evidence fields */}
        <div className="space-y-4">
          {[
            { label: 'Evidencia 1', value: e1, set: setE1 },
            { label: 'Evidencia 2', value: e2, set: setE2 },
            { label: 'Evidencia 3', value: e3, set: setE3 },
          ].map(({ label, value, set }, i) => (
            <Card key={i} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star size={14} className={value ? 'text-base-warning' : 'text-base-muted'} fill={value ? '#C4A35A' : 'none'} />
                  <span className="text-xs text-base-stone uppercase tracking-widest">{label}</span>
                </div>
                <button
                  onClick={() => insertExample(set)}
                  className="text-2xs text-base-stone hover:text-base-white transition-colors"
                >
                  Ejemplo →
                </button>
              </div>
              <TextArea
                placeholder="Describe una acción concreta de hoy…"
                rows={2}
                value={value}
                onChange={(e) => { set(e.target.value); setSaved(false) }}
              />
            </Card>
          ))}
        </div>

        {saved && evidence?.evidence_1 ? (
          <Card className="flex items-center gap-3 border-base-success/40">
            <CheckCircle2 size={20} className="text-base-success flex-shrink-0" />
            <p className="text-base-white text-sm">Evidencias guardadas para hoy.</p>
          </Card>
        ) : null}

        <Button
          fullWidth
          size="lg"
          onClick={save}
          disabled={saving || !e1.trim()}
        >
          {saving ? 'Guardando…' : saved ? 'Actualizar evidencias' : 'Guardar evidencias'}
        </Button>

        <p className="text-center text-base-stone text-xs italic">
          "Cada acción cuenta."
        </p>
      </div>
    </AppShell>
  )
}
