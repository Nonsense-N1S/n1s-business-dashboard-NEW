import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { blink } from '@/blink/client'
import { BlinkClientBoundary } from '@/components/BlinkClientBoundary'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Login — N1S' },
      { name: 'description', content: 'Sign in to your N1S business dashboard.' },
    ],
  }),
  component: LoginPage,
})

function LoginPage() {
  return (
    <BlinkClientBoundary fallback={<LoginSkeleton />}>
      <LoginForm />
    </BlinkClientBoundary>
  )
}

function LoginSkeleton() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-pulse space-y-4">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-muted" />
        <div className="mx-auto h-6 w-20 rounded bg-muted" />
        <div className="mx-auto h-4 w-48 rounded bg-muted" />
        <div className="h-11 rounded-xl bg-muted" />
        <div className="h-11 rounded-xl bg-muted" />
        <div className="h-11 rounded-xl bg-muted" />
      </div>
    </div>
  )
}

function LoginForm() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isSignUp) {
        await blink.auth.signUp({ email, password })
        await blink.auth.signInWithEmail(email, password)
      } else {
        await blink.auth.signInWithEmail(email, password)
      }
      navigate({ to: '/metrics' })
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-md">
            <span className="text-xl font-bold tracking-tight text-primary-foreground">N1</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">N1S</h1>
          <p className="mt-1 text-sm text-muted-foreground">Business dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              minLength={6}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            className="font-medium text-primary hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  )
}
