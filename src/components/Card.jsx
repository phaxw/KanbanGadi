import { useState } from 'react'

const Card = ({ card, columnName, onMove, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e) => {
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: card.id,
      from: columnName
    }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Determina el destino "siguiente" para el atajo de movimiento
  const getNextTarget = () => {
    if (columnName === 'todo') return 'inProgress'
    if (columnName === 'inProgress') return 'done'
    return null
  }

  const handleQuickMove = () => {
    const to = getNextTarget()
    if (!to) return
    const from = columnName
    onMove(from, to, card.id)
  }

  return (
    <div
      className={`card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="card-content">
        <span className="card-title">{card.title}</span>
        {card.description && (
          <p className="card-desc">{card.description}</p>
        )}
      </div>

      <div className="card-footer">
        {getNextTarget() && (
          <button
            className="card-btn primary"
            onClick={handleQuickMove}
          >
            {columnName === 'inProgress' ? 'Mover a Hecho' : 'Mover a En progreso'}
          </button>
        )}
        <button
          className="card-btn danger"
          onClick={() => onRemove(columnName, card.id)}
        >
          Eliminar tarea
        </button>
      </div>
    </div>
  )
}

export default Card