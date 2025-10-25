import { useEffect, useState } from 'react'
import Column from './components/Column'
import AddTaskModal from './components/AddTaskModal'
import './App.css'

const initialData = {
  todo: [{ id: 1, title: 'Ejemplo: crear estructura del proyecto', description: 'Configurar carpetas y componentes base.' }],
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

  const addTask = ({ title, description }) => {
    const task = { id: Date.now(), title, description: description || '' }
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

  return (
    <div className="app">
      <header>
        <h1>Kanban Gadi</h1>
        <AddTaskModal onAddTask={addTask} />
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
