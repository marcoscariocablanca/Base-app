import { BottomNav } from './BottomNav'
import { Toast } from '../ui/Toast'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen min-h-dvh font-sans" style={{ background: '#0D0D0B', color: '#F5F4EF' }}>
      <Toast />
      <main className="max-w-lg mx-auto px-4 pt-8 pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
