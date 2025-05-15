'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifier } from "../context/NotifierManagent";
import { useCart } from '../context/CartManagement';
import {jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ email: null, role: null, cart: []});
  const [loading, setLoading] = useState(true);
  const { notify } = useNotifier()
  const { saveCart, loadCart } = useCart()
  const request_id = Date.now()

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser).user;
      setUser({ email: parsed.email, role: parsed.role, cart: parsed.cart });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user.email) {
        localStorage.setItem('user', JSON.stringify({user}));
      } 
    }
  }, [user, loading]);

  const login = async (email, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const { token } = await res.json();
      const decoded = jwtDecode(token);

      setUser({ email: decoded.email, role: decoded.role, cart: decoded.cart });
      await loadCart(decoded.email)
      notify(`Bienvenido nuevamente, ${decoded.email}!`, "success");
      console.log(`${request_id} - [AuthProvider] - Usuario '${decoded.email}' conectado correctamente`)
    } else {
      notify('Credenciales inválidas', "error");
      console.log(`${request_id} - [AuthProvider] - Credenciales invalidas`)
    }
  };

  const logout = async () => {
    const email = user.email

    await saveCart(email)
    notify(`Nos vemos pronto, ${email}!`, "success");
    setUser({ email: null, role: null, cart: []});
    localStorage.removeItem('user');
    
    console.log(`${request_id} - [AuthProvider] - Usuario '${email}' desconectado correctamente`)
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
