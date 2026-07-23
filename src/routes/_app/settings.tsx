import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { BlinkClientBoundary } from '@/components/BlinkClientBoundary'
import { LogOut, ChevronRight } from 'lucide-react'
import { blink } from '@/blink/client'

export const Route = createFileRoute('/_app/settings')({
  head: () => ({
    meta: [{ title: 'Settings — N1S' }],
  }),
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <BlinkClientBoundary fallback={<PageSkeleton />}>
      <SettingsContent />
    </BlinkClientBoundary>
  )
}

function PageSkeleton() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

function SettingsContent() {
  const { user } = useAuth()

  const handleSignOut = async () => {
    await blink.auth.signOut()
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
        <h1 className="text-base font-semibold tracking-tight text-foreground text-center">
          Settings
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pt-6">
        {/* Profile section */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {user?.email?.charAt(0).toUpperCase() || 'N'}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
          </div>
        </div>

        {/* Settings groups */}
        <div className="space-y-6">
          <div>
            <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Account
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <SettingRow label="Profile" value="Edit your profile" />
              <SettingDivider />
              <SettingRow label="Notifications" value="On" />
              <SettingDivider />
              <SettingRow label="Security" value="Password, 2FA" />
            </div>
          </div>

          <div>
            <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Preferences
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <SettingRow label="Appearance" value="System" />
              <SettingDivider />
              <SettingRow label="Language" value="English" />
            </div>
          </div>

          <div>
            <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              About
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <SettingRow label="Version" value="1.0.0" />
              <SettingDivider />
              <SettingRow label="Support" value="Contact us" />
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5 active:scale-[0.98]"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <button className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50">
      <span className="text-sm text-foreground">{label}</span>
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        {value}
        <ChevronRight size={14} className="text-muted-foreground/50" />
      </span>
    </button>
  )
}

function SettingDivider() {
  return <div className="h-px bg-border ml-4" />
}
