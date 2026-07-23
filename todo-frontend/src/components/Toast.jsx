import { useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.toast,
        borderColor: isSuccess ? '#10b981' : '#f43f5e',
        backgroundColor: isSuccess ? '#ecfdf5' : '#fff1f2',
        color: isSuccess ? '#065f46' : '#9f1239',
      }} className="animate-slide-up">
        <span style={styles.icon}>{isSuccess ? '✅' : '⚠️'}</span>
        <span style={styles.text}>{message}</span>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 3000,
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 18px',
    borderRadius: '12px',
    borderLeft: '5px solid',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
    fontSize: '14px',
    fontWeight: 500,
    maxWidth: '400px',
  },
  icon: {
    fontSize: '16px',
  },
  text: {
    flex: 1,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    opacity: 0.6,
    padding: '0 4px',
  },
};

export default Toast;
