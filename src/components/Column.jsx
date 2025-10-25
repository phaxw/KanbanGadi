import { useState } from 'react'
import Card from './Card'

const Column = ({ name, title, cards, onMove, onRemove, onScheduleTimer, onCancelTimer }) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    // Solo cambiar estado si realmente salimos de la columna
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'))
      const { id, from } = data
      
      // Solo mover si es a una columna diferente
      if (from !== name) {
        onMove(from, name, id)
      }
    } catch (error) {
      console.error('Error al procesar drop:', error)
    }
  }

  return (
    <div
      className={`column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2>{title}</h2>
      <div className="cards">
        {cards.length === 0 && (
          <p className="empty">
            {isDragOver ? 'Suelta aquí' : 'Sin tareas'}
          </p>
        )}
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            columnName={name}
            onMove={onMove}
            onRemove={onRemove}
            onScheduleTimer={onScheduleTimer}
            onCancelTimer={onCancelTimer}
          />
        ))}
      </div>
    </div>
  )
}

export default Column