'use client'
import React, { useEffect, useState } from 'react';
import styles from '../css/notification.module.css';

export default function Notification({ message, type = 'success', duration = 4000, onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        handleClose()
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${
        exiting ? styles.slideOut : styles.slideIn
      }`}
    >
      <span>{message}</span>
      <button className={styles.closeButton} onClick={handleClose}>
        ✖
      </button>
    </div>
  );
}
