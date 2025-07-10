'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifier } from "../context/NotifierManagent";
import { useCart } from '../context/CartManagement';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ email: null, user_id: null, role: null, token: null});
  const [loading, setLoading] = useState(true);
  const { notify, request_id } = useNotifier()
  const { saveCart, loadCart } = useCart()

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser).user;
        if (parsed?.email && parsed?.role) {
          setUser({ 
            email: parsed.email, 
            user_id: parsed.user_id || null,
            role: parsed.role, 
            token: parsed.token || null,
            cart: parsed.cart || [] 
          });
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


  const login = async (email, password, registered = false) => {
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
        setUser({ 
          email, 
          role: data.role, 
          user_id: data.user,
          token: data.token
        });
        
        if(registered){
          notify(`Bienvenido nuevamente, ${email}!`, "success");
        } else{
          notify(`Bienvenido, ${email}!`, "success");
        }
        console.log(`${request_id} - [AuthProvider] - Usuario '${email}' conectado correctamente`);
        return true
      } else if(response.code == "0201" || response.code == "0412"){
        const log = `backend - login: ${response.code}: ${response.message}`
        notify("Credenciales invalidas o cuenta inexistente", "error");
        console.log(`${request_id} - [AuthProvider] - Credenciales invalidas o cuenta inexistente: ${log}`);
        return false
      }
    } catch (error) {
      console.error(`${request_id} - [AuthProvider] - Error inesperado en login:`, error);
      notify('Ocurrió un error desconocido, vuelva a intentar a la brevedad', 'error');
      return false
    }
  } 
  
  const logout = async () => {
    if(user.email){
      await saveCart(user.user_id, user.token)
      notify(`Nos vemos pronto, ${user.email}!`, "success");
      setUser({ email: null, user_id: null, role: null, token: null, cart: [] });
      localStorage.removeItem('cart');
      localStorage.removeItem('user');
      console.log(`${request_id} - [AuthProvider] - Usuario '${user.email}' desconectado correctamente`)
    }
  };
  
  const register = async (email, password, firstName, lastName, phone) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'request_id': request_id
        },
        body: JSON.stringify({ 
          "username": email, 
          password, 
          "first_name": firstName, 
          "last_name": lastName, 
          phone })
      });
      
      const response  = await res.json();
      if (response.code == "0200"){
        notify("Registro exitoso.", "success");
        notify("Iniciandote sesion automaticamente...", "info");
        console.log(`${request_id} - [AuthProvider] - Usuario '${email}' registrado correctamente`);
        return true
      } else if(response.code == "0410"){
        const log = `backend - registro: ${response.code}: ${response.message}`
        notify("El usuario ya está en uso", "error");
        console.log(`${request_id} - [AuthProvider] - Credenciales invalidas o cuenta inexistente: ${log}`);
        return false
      }
    } catch (error) {
      console.error(`${request_id} - [AuthProvider] - Error inesperado en register:`, error);
      notify('Ocurrió un error desconocido, vuelva a intentar a la brevedad', 'error');
      return false
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
