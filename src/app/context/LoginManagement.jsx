// context/LoginManagement.jsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifier } from "../context/NotifierManagent";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotifier()
  const router = useRouter();
  const request_id = Date.now()

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [user, loading]);

  const login = async (email, password) => {
    const res = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const userData = { email };
      setUser(userData);
      notify(`Bienvenido nuevamente, ${email}!`, "success");
      console.log(`${request_id} - [AuthProvider] - Usuario '${email}' conectado correctamente`)
    } else {
      notify('Credenciales inválidas', "error");
      console.log(`${request_id} - [AuthProvider] - Credenciales invalidas`)
    }

    return res.ok
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    notify(`Nos vemos pronto, ${email}!`, "success");
    console.log(`${request_id} - [AuthProvider] - Usuario '${email}' desconectado correctamente`)
    router.push('/login');
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
