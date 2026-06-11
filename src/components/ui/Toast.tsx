import { useDataStore } from '../../store/dataStore'

export function Toast() {
  const toast = useDataStore((s) => s.toast)
  if (!toast) return null
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up pointer-events-none">
      <div
        className="text-sm font-medium px-5 py-3 rounded-2xl max-w-xs text-center"
        style={{
          background: 'linear-gradient(135deg, #1E2018 0%, #141412 100%)',
          border: '1px solid rgba(154,138,53,0.4)',
          color: '#A89A46',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(154,138,53,0.1)',
          letterSpacing: '0.02em',
        }}
      >
        {toast}
      </div>
    </div>
  )
}
