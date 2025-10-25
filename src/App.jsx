import { useEffect, useState, useRef } from 'react'
import Column from './components/Column'
import AddTaskModal from './components/AddTaskModal'
import './App.css'

const initialData = {
  todo: [{ id: 1, title: 'Ejemplo: crear estructura del proyecto', description: 'Configurar carpetas y componentes base.', timerActive: false, dueAt: null, timerFired: false }],
  inProgress: [],
  done: [],
}

const COLUMN_CONFIG = [
  { name: 'todo', title: 'Por hacer' },
  { name: 'inProgress', title: 'En progreso' },
  { name: 'done', title: 'Hecho' }
]

function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('kanban-columns')
    return saved ? JSON.parse(saved) : initialData
  })

  useEffect(() => {
    localStorage.setItem('kanban-columns', JSON.stringify(columns))
  }, [columns])

  const columnsRef = useRef(columns)
  useEffect(() => { columnsRef.current = columns }, [columns])

  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 880
      osc.connect(gain)
      gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.01)
      osc.start()
      setTimeout(() => {
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25)
        osc.stop(ctx.currentTime + 0.3)
        ctx.close()
      }, 300)
    } catch (e) {
      console.warn('No se pudo reproducir sonido', e)
    }
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta notificaciones.')
      return
    }
    if (Notification.permission === 'granted') {
      alert('Notificaciones ya habilitadas.')
      return
    }
    try {
      const perm = await Notification.requestPermission()
      if (perm === 'granted') {
        new Notification('Notificaciones habilitadas', { body: 'Se mostrarán recordatorios.' })
      } else {
        alert('Notificaciones bloqueadas.')
      }
    } catch (e) {
      console.warn('Permiso de notificación falló', e)
    }
  }

  const notifyTaskDue = (task) => {
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return
    try {
      new Notification('Tarea vencida', {
        body: task.title || 'Recordatorio',
        tag: `task-${task.id}`,
        icon: '/vite.svg',
      })
    } catch (e) {
      // ignorar errores por permisos o foco
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const current = columnsRef.current
      let changed = false
      const updated = {
        todo: current.todo.map(t => {
          if (t.timerActive && t.dueAt && now >= new Date(t.dueAt).getTime()) {
            changed = true
            playBeep()
            notifyTaskDue(t)
            return { ...t, timerActive: false, timerFired: true }
          }
          return t
        }),
        inProgress: current.inProgress.map(t => {
          if (t.timerActive && t.dueAt && now >= new Date(t.dueAt).getTime()) {
            changed = true
            playBeep()
            notifyTaskDue(t)
            return { ...t, timerActive: false, timerFired: true }
          }
          return t
        }),
        done: current.done.map(t => {
          if (t.timerActive && t.dueAt && now >= new Date(t.dueAt).getTime()) {
            changed = true
            playBeep()
            notifyTaskDue(t)
            return { ...t, timerActive: false, timerFired: true }
          }
          return t
        }),
      }
      if (changed) {
        setColumns(updated)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const addTask = ({ title, description }) => {
    const task = { id: Date.now(), title, description: description || '', timerActive: false, dueAt: null, timerFired: false }
    setColumns(prev => ({ 
      ...prev, 
      todo: [task, ...prev.todo] 
    }))
  }

  const moveTask = (from, to, id) => {
    setColumns(prev => {
      const item = prev[from].find(t => t.id === id)
      if (!item) return prev
      
      return {
        ...prev,
        [from]: prev[from].filter(t => t.id !== id),
        [to]: [item, ...prev[to]],
      }
    })
  }

  const removeTask = (from, id) => {
    setColumns(prev => ({
      ...prev,
      [from]: prev[from].filter(t => t.id !== id),
    }))
  }

  const scheduleTimer = (column, id, dueAt) => {
    setColumns(prev => ({
      ...prev,
      [column]: prev[column].map(t => t.id === id ? { ...t, dueAt, timerActive: true, timerFired: false } : t)
    }))
  }

  const cancelTimer = (column, id) => {
    setColumns(prev => ({
      ...prev,
      [column]: prev[column].map(t => t.id === id ? { ...t, dueAt: null, timerActive: false } : t)
    }))
  }

  return (
    <div className="app">
      <header>
        <h1>Kanban Gadi</h1>
        <AddTaskModal onAddTask={addTask} />
        <button className="btn" onClick={requestNotificationPermission}>
          Habilitar notificaciones
        </button>
      </header>

      <main className="board">
        {COLUMN_CONFIG.map(({ name, title }) => (
          <Column
            key={name}
            name={name}
            title={title}
            cards={columns[name]}
            onMove={moveTask}
            onRemove={removeTask}
            onScheduleTimer={scheduleTimer}
            onCancelTimer={cancelTimer}
          />
        ))}
      </main>

      <footer>
        <small>
          Arrastra las tarjetas entre columnas • Guardado automático
        </small>
      </footer>
    </div>
  )
}

export default App
