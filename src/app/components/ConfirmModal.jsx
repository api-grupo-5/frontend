import styles from '../css/modal.module.css';

export default function ConfirmModal({ isOpen, onClose, onConfirm, total }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>Confirmar Compra</h2>
        <div className={styles.modalBody}>
          <p>Estás a punto de finalizar tu compra</p>
          <div className={styles.totalAmount}>
            <span>Total a pagar:</span>
            <span className={styles.amount}>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className={styles.modalActions}>
          <button 
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={onConfirm}
          >
            Confirmar Compra
          </button>
        </div>
      </div>
    </div>
  );
} 