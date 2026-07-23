import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { BlinkClientBoundary } from '@/components/BlinkClientBoundary'
import { Send } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/_app/assistant')({
  head: () => ({
    meta: [
      { title: 'Assistant — N1S' },
    ],
  }),
  component: AssistantPage,
})

function AssistantPage() {
  return (
    <BlinkClientBoundary fallback={<PageSkeleton />}>
      <AssistantContent />
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

interface Message {
  id: string
  text: string
  from: 'user' | 'ai'
}

function AssistantContent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isSending || !user?.email) return

    const userMsg: Message = { id: crypto.randomUUID(), text, from: 'user' }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsSending(true)

    try {
      const response = await fetch('https://n1s.app.n8n.cloud/webhook/assistant-router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, message: text }),
      })

      if (!response.ok) throw new Error(`Router error: ${response.status}`)

      const replyText = await response.text()

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        text: replyText || 'No response text received.',
        from: 'ai',
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        text: 'Something went wrong reaching the assistant. Please try again.',
        from: 'ai',
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
        <h1 className="text-base font-semibold tracking-tight text-foreground text-center">Assistant</h1>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-4 px-4 py-4">
        {messages.length === 0 && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">AI Business Assistant</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Ask questions about your business — the assistant will be available here.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.from === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card text-foreground rounded-bl-md shadow-sm border border-border'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="shrink-0 sticky bottom-0 border-t border-border bg-background/80 backdrop-blur-xl px-3 py-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-30"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  )
}
