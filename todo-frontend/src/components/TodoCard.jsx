function TodoCard({ todo, onToggleComplete, onEdit, onDelete }) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return { label: 'Tinggi', bg: '#fee2e2', color: '#991b1b' };
      case 'medium':
        return { label: 'Sedang', bg: '#fef3c7', color: '#92400e' };
      case 'low':
      default:
        return { label: 'Rendah', bg: '#d1fae5', color: '#065f46' };
    }
  };

  const badge = getPriorityBadge(todo.priority);
  const formattedDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div
      style={{
        ...styles.card,
        opacity: todo.completed ? 0.75 : 1,
        borderColor: todo.completed ? '#e2e8f0' : '#cbd5e1',
      }}
      className="animate-fade-in"
    >
      <div style={styles.leftSection}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo)}
          style={styles.checkbox}
          title={todo.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
        />
        <div style={styles.details}>
          <div style={styles.titleRow}>
            <h3
              style={{
                ...styles.title,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#64748b' : '#0f172a',
              }}
            >
              {todo.title}
            </h3>
            <span
              style={{
                ...styles.priorityBadge,
                backgroundColor: badge.bg,
                color: badge.color,
              }}
            >
              {badge.label}
            </span>
          </div>

          {todo.description && (
            <p
              style={{
                ...styles.description,
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.description}
            </p>
          )}

          {formattedDate && (
            <div style={styles.metaRow}>
              <span style={styles.dueDate}>📅 Tenggat: {formattedDate}</span>
              {todo.completed && <span style={styles.completedBadge}>✓ Selesai</span>}
            </div>
          )}
        </div>
      </div>

      <div style={styles.actions}>
        <button
          onClick={() => onEdit(todo)}
          style={styles.editBtn}
          title="Edit Todo (PUT)"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          style={styles.deleteBtn}
          title="Hapus Todo (DELETE)"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '16px 20px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)',
    transition: 'all 0.2s ease',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    flex: 1,
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginTop: '3px',
    accentColor: '#10b981',
    cursor: 'pointer',
    borderRadius: '6px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  priorityBadge: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '9999px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  description: {
    margin: 0,
    fontSize: '13px',
    color: '#64748b',
    lineHeight: 1.5,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '6px',
    fontSize: '12px',
  },
  dueDate: {
    color: '#94a3b8',
    fontWeight: 500,
  },
  completedBadge: {
    color: '#10b981',
    fontWeight: 600,
    backgroundColor: '#ecfdf5',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  editBtn: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  deleteBtn: {
    background: '#fff1f2',
    border: '1px solid #ffe4e6',
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default TodoCard;
