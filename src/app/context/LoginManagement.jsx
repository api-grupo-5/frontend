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
      try {
        const parsed = JSON.parse(storedUser).user;
        if (parsed?.email && parsed?.role) {
          setUser({ email: parsed.email, role: parsed.role, cart: parsed.cart || [] });
        }
      } catch (err) {
        console.error("Error al parsear user de localStorage", err);
        localStorage.removeItem('user');
      }
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
  console.log('Enviando login con:', { email, password });
  
  try {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                 'request_id': '1234567'
      },
      body: JSON.stringify({
        username: email,  // Usar "username" como espera el backend
        password
      }),
      mode: 'cors',

    });

    const responseData = await res.json();

    if (res.ok) {
      const token = responseData.token;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);

      // Ajustar según la estructura del token JWT de Spring
      setUser({ 
        email: decoded.sub || decoded.email,  // Spring usa 'sub' para el username
        role: decoded.roles?.[0] || decoded.role || 'USER',
        cart: decoded.cart || []
      });
      
      await loadCart(decoded.sub || decoded.email);
      notify(responseData.message || `Bienvenido nuevamente, ${decoded.sub || email}!`, "success");
      return true;
    } else {
      notify(responseData.message || 'Credenciales inválidas', "error");
      return false;
    }
  } catch (error) {
    console.error('Error en login:', error);
    notify('Error de conexión con el servidor', "error");
    return false;
  }
};

  const logout = async () => {
    const email = user?.email || null;

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

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers ? {...options.headers} : {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

export async function getUserProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:8080/api/users/me", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "request_id": "1234567"
    }
  });

  if (!res.ok) throw new Error("No se pudo obtener el perfil del usuario");
  return await res.json();
}

export async function updateUserProfile(profileData) {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:8080/api/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "request_id": "1234567"
    },
    body: JSON.stringify(profileData)
  });

  if (!res.ok) {
    throw new Error("No se pudo actualizar el perfil");
  }

  return await res.json();
}



