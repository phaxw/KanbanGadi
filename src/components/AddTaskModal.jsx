import { useState } from 'react'

const AddTaskModal = ({ onAddTask }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const reset = () => {
    setTitle('')
    setDescription('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const t = title.trim()
    const d = description.trim()
    if (!t) return
    onAddTask({ title: t, description: d })
    reset()
    setOpen(false)
  }

  return (
    <div className="add-task-modal">
      <button className="btn btn-primary" onClick={() => setOpen(true)}>Añadir</button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nueva tarea</h3>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <label>
                Título
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ingresar título"
                  maxLength={100}
                  autoFocus
                />
              </label>
              <label>
                Descripción
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles de la tarea (opcional)"
                  rows={4}
                  maxLength={400}
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => { reset(); setOpen(false) }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddTaskModal