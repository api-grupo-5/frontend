'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifier } from "../context/NotifierManagent";
import { useCart } from '../context/CartManagement';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ email: null, user_id: null, role: null, cart: []});
  const [loading, setLoading] = useState(true);
  const { notify, request_id } = useNotifier()
  const { saveCart, loadCart } = useCart()

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
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'request_id': request_id
      },
      body: JSON.stringify({ email, password })
    });
    
    const response  = await res.json();
    if (response.code == "0200"){
      const data = response.data
      setUser({ email: email, role: data.role, user_id: data.user_id, cart: null });
      notify(`Bienvenido nuevamente, ${email}!`, "success");
      console.log(`${request_id} - [AuthProvider] - Usuario '${email}' conectado correctamente`);
    } else if(response.code == "0201" || response.code == "0412"){
      const log = `backend - login: ${response.code}: ${response.message}`
      notify("Credenciales invalidas o cuenta inexistente", "error");
      console.log(`${request_id} - [AuthProvider] - Credenciales invalidas o cuenta inexistente: ${log}`);
    }
  } catch (error) {
    console.error(`${request_id} - [AuthProvider] - Error inesperado en login:`, error);
    notify('Error de conexión al servidor', 'error');
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
  
  const register = async (email, password) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'request_id': request_id
      },
      body: JSON.stringify({ email, password })
    });
    
    const response  = await res.json();
    const log = `backend - login: ${response.code}: ${response.message}`
    console.log(log)
    console.log(response)
    if (response.code == "0200"){
      notify("Registro exitoso. Ahora puedes iniciar sesión.", "success");
      console.log(`${request_id} - [AuthProvider] - Usuario '${email}' registrado correctamente`);
    } else if(response.code == "0201" || response.code == "0412"){
      notify("Credenciales invalidas o cuenta inexistente", "error");
      console.log(`${request_id} - [AuthProvider] - Credenciales invalidas o cuenta inexistente: ${log}`);
    }
  } catch (error) {
    console.error(`${request_id} - [AuthProvider] - Error inesperado en register:`, error);
    notify('Error de conexión al servidor', 'error');
  }
};

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
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
