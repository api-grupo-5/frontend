'use client'
import React, { createContext, useContext, useState } from 'react';
import Notification from '../components/Notification';
import styles from '../css/notification.module.css';

const NotificationContext = createContext(null);

export function NotifierProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const request_id = Date.now();
  
  const notify = (message, type = 'success') => {
    setNotifications((prev) => {
      const updated = [...prev, { request_id, message, type }]
      return updated.slice(-5);
    });
    console.log(`${request_id} - [NotifierProvider] [${type}]: '${message}'...`);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notifications.length > 0 && (
        <div className={styles.notificationContainer}>
          {notifications.map((n, index) => (
            <Notification
              key={n.request_id + index + 1}
              message={n.message}
              type={n.type}
              onClose={() => removeNotification(n.request_id)}
            />
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifier() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used inside a NotificationProvider');
  }
  return context;
}
