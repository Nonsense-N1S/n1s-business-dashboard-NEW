import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { blink } from '@/blink/client'
import { BlinkClientBoundary } from '@/components/BlinkClientBoundary'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Check, Trash2 } from 'lucide-react'
import { toast } from '@blinkdotnew/ui'

interface Task {
  id: string
  userId: string
  title: string
  isCompleted: string
  createdAt: string
}

export const Route = createFileRoute('/_app/tasks')({
  head: () => ({
    meta: [
      { title: 'Tasks — N1S' },
    ],
  }),
  component: TasksPage,
})

function TasksPage() {
  return (
    <BlinkClientBoundary fallback={<PageSkeleton />}>
      <TasksContent />
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

function TasksContent() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)

  const tasksTable = blink.db.table<Task>('tasks')

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: () =>
      tasksTable.list({
        where: { userId: user!.id },
        orderBy: { createdAt: 'desc' },
      }),
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: (title: string) =>
      tasksTable.create({ title, userId: user!.id, isCompleted: '0' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
      setNewTitle('')
      setAdding(false)
      toast.success('Task added')
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to add task')
      setAdding(false)
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, current }: { id: string; current: string }) =>
      tasksTable.update(id, { isCompleted: current === '1' ? '0' : '1' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] }),
    onError: () => toast.error('Failed to update task'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksTable.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
      toast.success('Task removed')
    },
    onError: () => toast.error('Failed to delete task'),
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    setAdding(true)
    createMutation.mutate(title)
  }

  const completed = tasks.filter((t) => Number(t.isCompleted) > 0)
  const pending = tasks.filter((t) => Number(t.isCompleted) === 0)

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
        <h1 className="text-base font-semibold tracking-tight text-foreground text-center">Tasks</h1>
      </header>

      {/* Add new task */}
      <form onSubmit={handleAdd} className="px-4 pt-4">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={adding || !newTitle.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>
      </form>

      {/* Task list */}
      <div className="flex-1 px-4 pt-4 pb-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">No tasks yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Add your first task above.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Pending tasks */}
            {pending.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => toggleMutation.mutate({ id: task.id, current: task.isCompleted })}
                onDelete={() => deleteMutation.mutate(task.id)}
              />
            ))}

            {/* Completed tasks */}
            {completed.length > 0 && (
              <>
                <div className="py-2 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Completed ({completed.length})
                  </p>
                </div>
                {completed.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => toggleMutation.mutate({ id: task.id, current: task.isCompleted })}
                    onDelete={() => deleteMutation.mutate(task.id)}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task
  onToggle: () => void
  onDelete: () => void
}) {
  const done = Number(task.isCompleted) > 0

  return (
    <div className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-card">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          done
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border hover:border-primary'
        }`}
      >
        {done && <Check size={12} strokeWidth={3} />}
      </button>

      {/* Title */}
      <span
        className={`flex-1 text-sm ${
          done ? 'text-muted-foreground line-through' : 'text-foreground'
        }`}
      >
        {task.title}
      </span>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
