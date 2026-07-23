import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axiosInstance';
import Modal from '../components/Modal';
import TodoForm from '../components/TodoForm';
import TodoCard from '../components/TodoCard';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search State
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all', 'high', 'medium', 'low'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch Data (GET /api/v1/todos)
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/v1/todos';
      if (filterStatus === 'active') url += '?completed=false';
      if (filterStatus === 'completed') url += '?completed=true';

      const response = await api.get(url);
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(err.message || 'Gagal mengambil data todo dari server');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Handle Create New Todo
  const handleAddTodo = () => {
    setEditingTodo(null);
    setModalOpen(true);
  };

  // Handle Edit Todo
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setModalOpen(true);
  };

  // Handle Toggle Completed Status (PUT)
  const handleToggleComplete = async (todo) => {
    try {
      const updatedStatus = !todo.completed;
      await api.put(`/api/v1/todos/${todo.id}`, {
        completed: updatedStatus,
      });
      showToast(
        updatedStatus
          ? '✅ Status diubah menjadi Selesai!'
          : '🔄 Status diubah menjadi Belum Selesai'
      );
      fetchTodos(); // Refetch
    } catch (err) {
      console.error('Error toggling complete:', err);
      showToast(err.message || 'Gagal memperbarui status todo', 'error');
    }
  };

  // Handle Delete Todo (DELETE)
  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setDeleting(true);
      await api.delete(`/api/v1/todos/${deleteConfirmId}`);
      showToast('🗑️ Todo berhasil dihapus!');
      setDeleteConfirmId(null);
      fetchTodos(); // Refetch
    } catch (err) {
      console.error('Error deleting todo:', err);
      showToast(err.message || 'Gagal menghapus todo', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Handle Form Success Callback (Add/Edit)
  const handleFormSuccess = (message) => {
    setModalOpen(false);
    setEditingTodo(null);
    showToast(message);
    fetchTodos(); // Refetch
  };

  // Client-side filtering for Search & Priority
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPriority =
        priorityFilter === 'all' || todo.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [todos, searchTerm, priorityFilter]);

  // Statistics counters
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, active, completed };
  }, [todos]);

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Header Banner */}
      <header style={styles.header}>
        <div>
          <div style={styles.brandBadge}>Praktikum 11 Full-Stack CRUD</div>
          <h1 style={styles.title}>Taskflow Studio</h1>
          <p style={styles.subtitle}>
            Kelola tugas harian dengan integrasi React Frontend & NestJS Backend API
          </p>
        </div>
        <button onClick={handleAddTodo} style={styles.addBtn}>
          <span style={{ fontSize: '18px' }}>+</span> Tambah Todo Baru
        </button>
      </header>

      {/* Stats Cards */}
      <section style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Tugas</span>
          <span style={styles.statNumber}>{stats.total}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Aktif / Belum Selesai</span>
          <span style={{ ...styles.statNumber, color: '#059669' }}>{stats.active}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Selesai</span>
          <span style={{ ...styles.statNumber, color: '#64748b' }}>{stats.completed}</span>
        </div>
      </section>

      {/* Filters & Controls Toolbar */}
      <div style={styles.toolbar}>
        {/* Status Filter Tabs */}
        <div style={styles.filterTabs}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              ...styles.tabBtn,
              backgroundColor: filterStatus === 'all' ? '#10b981' : '#ffffff',
              color: filterStatus === 'all' ? '#ffffff' : '#64748b',
              border: filterStatus === 'all' ? 'none' : '1px solid #e2e8f0',
            }}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            style={{
              ...styles.tabBtn,
              backgroundColor: filterStatus === 'active' ? '#10b981' : '#ffffff',
              color: filterStatus === 'active' ? '#ffffff' : '#64748b',
              border: filterStatus === 'active' ? 'none' : '1px solid #e2e8f0',
            }}
          >
            Aktif ({stats.active})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            style={{
              ...styles.tabBtn,
              backgroundColor: filterStatus === 'completed' ? '#10b981' : '#ffffff',
              color: filterStatus === 'completed' ? '#ffffff' : '#64748b',
              border: filterStatus === 'completed' ? 'none' : '1px solid #e2e8f0',
            }}
          >
            Selesai ({stats.completed})
          </button>
        </div>

        {/* Search & Priority Inputs */}
        <div style={styles.searchGroup}>
          <input
            type="text"
            placeholder="🔍 Cari todo berdasarkan judul atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={styles.prioritySelect}
          >
            <option value="all">Semua Prioritas</option>
            <option value="high">🔴 Prioritas Tinggi</option>
            <option value="medium">🟡 Prioritas Sedang</option>
            <option value="low">🟢 Prioritas Rendah</option>
          </select>
          <button onClick={fetchTodos} style={styles.refreshBtn} title="Refetch data dari server">
            🔄
          </button>
        </div>
      </div>

      {/* Main Content States */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Memuat data todo dari NestJS API...</p>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Gagal Terhubung ke Backend API</h3>
          <p style={styles.errorMessage}>{error}</p>
          <button onClick={fetchTodos} style={styles.retryBtn}>
            🔄 Coba Lagi
          </button>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📋</div>
          <h3 style={styles.emptyTitle}>Tidak ada data todo ditemukan</h3>
          <p style={styles.emptySubtitle}>
            {searchTerm
              ? `Tidak ada todo yang cocok dengan kata kunci "${searchTerm}"`
              : 'Belum ada tugas di daftar ini. Klik "+ Tambah Todo Baru" untuk memulai!'}
          </p>
          {!searchTerm && (
            <button onClick={handleAddTodo} style={styles.emptyAddBtn}>
              + Tambah Todo Pertama
            </button>
          )}
        </div>
      ) : (
        <div style={styles.todoGrid}>
          {filteredTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTodo}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTodo(null);
        }}
        title={editingTodo ? '✏️ Edit Todo (PUT)' : '✨ Tambah Todo Baru (POST)'}
      >
        <TodoForm
          todo={editingTodo}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setModalOpen(false);
            setEditingTodo(null);
          }}
        />
      </Modal>

      {/* Modal Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
        loading={deleting}
        title="Hapus Todo (DELETE)"
        message="Apakah Anda yakin ingin menghapus todo ini dari database?"
      />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px 80px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    gap: '20px',
    flexWrap: 'wrap',
  },
  brandBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '9999px',
    backgroundColor: '#ecfdf5',
    color: '#059669',
    fontSize: '12px',
    fontWeight: 700,
    marginBottom: '8px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    marginTop: '4px',
    margin: 0,
  },
  addBtn: {
    padding: '12px 24px',
    borderRadius: '12px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    fontWeight: 700,
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.25)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#64748b',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#0f172a',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterTabs: {
    display: 'flex',
    gap: '8px',
  },
  tabBtn: {
    padding: '8px 16px',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  searchGroup: {
    display: 'flex',
    gap: '10px',
    flex: 1,
    maxWidth: '540px',
  },
  searchInput: {
    flex: 1,
    padding: '9px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
  },
  prioritySelect: {
    padding: '9px 12px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    backgroundColor: '#ffffff',
    outline: 'none',
    color: '#334155',
  },
  refreshBtn: {
    padding: '9px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  todoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 0',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e2e8f0',
    borderTopColor: '#10b981',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  errorContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #ffe4e6',
    padding: '40px 20px',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  errorTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#9f1239',
  },
  errorMessage: {
    color: '#be123c',
    fontSize: '14px',
    marginTop: '6px',
    marginBottom: '20px',
  },
  retryBtn: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px border #e2e8f0',
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#0f172a',
  },
  emptySubtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
    marginBottom: '20px',
  },
  emptyAddBtn: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default TodoList;
