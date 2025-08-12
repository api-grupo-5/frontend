'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifier } from "../context/NotifierManagent";
import { useCart } from '../context/CartManagement';
import { POST as LOGIN_POST } from '../api/login/route'
import { POST as REGISTER_POST} from '../api/register/route'

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ email: null, user_id: null, role_id: null, token: null, cart_id: null});
  const [loading, setLoading] = useState(true);
  const { notify, request_id } = useNotifier()
  const { saveCart, loadCart } = useCart()

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser).user;
        if (parsed?.email && parsed?.role_id) {
          setUser({ 
            email: parsed.email, 
            user_id: parsed.user_id || null,
            role_id: parsed.role_id || null, 
            token: parsed.token || null,
            cart_id: parsed.token || null
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
      const res = await LOGIN_POST(request_id, email, password)
      if (res.ok){
        const response  = await res.json();
        const data = response.data
        setUser({ 
          email, 
          role_id: data.role_id, 
          user_id: data.user_id,
          token: data.token,
          cart_id: data.cart_id
        });

        if(registered){
          notify(`Bienvenido, ${email}!`, "success");
        } else{
          notify(`Bienvenido nuevamente, ${email}!`, "success");
          loadCart(request_id, data.user_id, data.token, data.cart_id)
        }
        console.log(`${request_id} - [AuthProvider] - Usuario '${email}' conectado correctamente`);
        return true
      } else{
        notify(`Error: los datos son incorrectos o inexistentes`, "error");
      }
    } catch (error) {
      console.error(`${request_id} - [AuthProvider] - Error inesperado en login:`, error);
      notify('Ocurrió un error desconocido, vuelva a intentar a la brevedad', 'error');
      return false
    }
  } 
  
  const logout = async () => {
    if(user.email){
      await saveCart(user.user_id, user.token, user.cart_id)
      notify(`Nos vemos pronto, ${user.email}!`, "success");
      setUser({ email: null, user_id: null, role_id: null, token: null, cart_id: null });
      localStorage.removeItem('cart_items');
      localStorage.removeItem('user');
      console.log(`${request_id} - [AuthProvider] - Usuario '${user.email}' desconectado correctamente`)
    }
  };
  
  const register = async (email, password, firstName, lastName, phone) => {
    try {
      const response = await REGISTER_POST(request_id, email, password, firstName, lastName, phone)
      if (response.ok){
        notify("Registro exitoso.", "success");
        notify("Iniciandote sesion automaticamente...", "info");
        console.log(`${request_id} - [AuthProvider] - Usuario '${email}' registrado correctamente`);
        return true
      }   
        notify("Error: El email esta en uso, ingresa otro", "error");
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
