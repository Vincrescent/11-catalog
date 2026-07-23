import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

function TodoForm({ todo, onSuccess, onCancel }) {
  const isEdit = !!todo;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prepopulate form data if editing
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'low',
        dueDate: todo.dueDate
          ? new Date(todo.dueDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        completed: todo.completed ?? false,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'low',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
      });
    }
  }, [todo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.title.trim()) {
      setError('Judul todo wajib diisi');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEdit) {
        // PUT Request - Update Todo
        await api.put(`/api/v1/todos/${todo.id}`, formData);
        onSuccess('🎉 Todo berhasil diperbarui!');
      } else {
        // POST Request - Create Todo
        await api.post('/api/v1/todos', formData);
        onSuccess('✨ Todo baru berhasil ditambahkan!');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Gagal menyimpan todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

      <div style={styles.field}>
        <label style={styles.label}>
          Judul Tugas <span style={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Contoh: Menyelesaikan Laporan Praktikum"
          disabled={loading}
          style={styles.input}
          maxLength={100}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Deskripsi (Opsional)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tambahkan catatan detail mengenai tugas ini..."
          disabled={loading}
          rows={3}
          style={styles.textarea}
        />
      </div>

      <div style={styles.row}>
        <div style={{ ...styles.field, flex: 1 }}>
          <label style={styles.label}>Tingkat Prioritas</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={loading}
            style={styles.select}
          >
            <option value="low">🟢 Rendah (Low)</option>
            <option value="medium">🟡 Sedang (Medium)</option>
            <option value="high">🔴 Tinggi (High)</option>
          </select>
        </div>

        <div style={{ ...styles.field, flex: 1 }}>
          <label style={styles.label}>Tenggat Waktu (Due Date)</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            disabled={loading}
            style={styles.input}
          />
        </div>
      </div>

      {isEdit && (
        <div style={styles.checkboxField}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              disabled={loading}
              style={styles.checkbox}
            />
            Status: Tandai sebagai Selesai
          </label>
        </div>
      )}

      <div style={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={styles.cancelBtn}
        >
          Batal
        </button>
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading
            ? 'Menyimpan...'
            : isEdit
            ? 'Update Todo'
            : 'Tambah Todo'}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  errorAlert: {
    backgroundColor: '#fff1f2',
    color: '#be123c',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    border: '1px solid #ffe4e6',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  row: {
    display: 'flex',
    gap: '14px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#334155',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
  },
  select: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  checkboxField: {
    padding: '10px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#334155',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#10b981',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px',
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 22px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#10b981',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.25)',
  },
};

export default TodoForm;
