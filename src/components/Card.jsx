import { useState } from 'react'

const Card = ({ card, columnName, onMove, onRemove, onScheduleTimer, onCancelTimer }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [showTimerForm, setShowTimerForm] = useState(false)
  const [dueAtInput, setDueAtInput] = useState(card.dueAt ? card.dueAt.slice(0, 16) : '')

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

  const handleSchedule = () => {
    if (!dueAtInput) return
    const iso = new Date(dueAtInput).toISOString()
    onScheduleTimer?.(columnName, card.id, iso)
    setShowTimerForm(false)
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
        {(card.dueAt || card.timerActive || card.timerFired) && (
          <div className={`card-timer ${card.timerActive ? 'active' : ''} ${card.timerFired ? 'fired' : ''}`}>
            {card.timerFired ? (
              <span>Recordatorio vencido</span>
            ) : card.dueAt ? (
              <span>Recordatorio: {new Date(card.dueAt).toLocaleString()}</span>
            ) : null}
          </div>
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
        <button className="card-btn" onClick={() => setShowTimerForm(v => !v)}>
          {showTimerForm ? 'Cerrar programación' : 'Programar recordatorio'}
        </button>
        {showTimerForm && (
          <div className="timer-form">
            <label>
              Fecha y hora
              <input
                type="datetime-local"
                value={dueAtInput}
                onChange={(e) => setDueAtInput(e.target.value)}
              />
            </label>
            <div className="timer-actions">
              <button className="card-btn primary" onClick={handleSchedule}>
                Activar
              </button>
              {(card.timerActive || card.dueAt) && (
                <button className="card-btn danger" onClick={() => onCancelTimer?.(columnName, card.id)}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
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