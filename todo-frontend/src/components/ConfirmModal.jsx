import Modal from './Modal';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title || 'Konfirmasi Hapus'}>
      <div style={styles.content}>
        <div style={styles.iconWrapper}>🗑️</div>
        <p style={styles.message}>{message || 'Apakah Anda yakin ingin menghapus todo ini?'}</p>
        <p style={styles.subtext}>Tindakan ini tidak dapat dibatalkan.</p>

        <div style={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={styles.cancelBtn}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={styles.deleteBtn}
          >
            {loading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

const styles = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '8px 0',
  },
  iconWrapper: {
    fontSize: '36px',
    marginBottom: '12px',
    backgroundColor: '#fff1f2',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '4px',
  },
  subtext: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '24px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
  deleteBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#f43f5e',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default ConfirmModal;
