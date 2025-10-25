import { useState } from 'react'

const TaskInput = ({ onAddTask }) => {
  const [newTitle, setNewTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    
    onAddTask(title)
    setNewTitle('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <form className="new-task" onSubmit={handleSubmit}>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Nueva tarea..."
        maxLength={100}
      />
      <button type="submit">Añadir</button>
    </form>
  )
}

export default TaskInput