import { createFileRoute } from '@tanstack/react-router'
import { BlinkClientBoundary } from '@/components/BlinkClientBoundary'
import { DashboardRenderer } from '@/features/dashboard'
import { SAMPLE_DASHBOARD } from '@/features/dashboard/sample-config'

export const Route = createFileRoute('/_app/metrics')({
  head: () => ({
    meta: [
      { title: 'Metrics — N1S' },
    ],
  }),
  component: MetricsPage,
})

function MetricsPage() {
  return (
    <BlinkClientBoundary fallback={<PageSkeleton />}>
      <MetricsContent />
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

function MetricsContent() {
  return <DashboardRenderer config={SAMPLE_DASHBOARD} />
}
