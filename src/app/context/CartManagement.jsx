'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifier } from '../context/NotifierManagent';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const {notify} = useNotifier()
  const request_id = Date.now()
  
  useEffect(() => {
    const storedCart = localStorage.getItem('user')?.cart;
    if (storedCart) {
      console.log("[CartProvider] Obteniendo carrito desde localStorage...");
      let json = JSON.parse(storedCart) 
      setCart(json);
      console.log(`[CartProvider] Articulos del localStorage cargados al carrito: ${storedCart}`);
    } else{
      console.log(`[CartProvider] No existe información del carrito en localStorage...`);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log("[CartProvider] Cargando carrito...");
      let json = JSON.stringify(cart)
      localStorage.setItem('cart', json);
      console.log(`[CartProvider] Carrito cargado`);
    } 
  }, [cart, loading]);

const addToCart = (producto) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    notify("Debes iniciar sesión para agregar productos al carrito", "error");
    return;
  }

  console.log(`${request_id} - [CartProvider] Agregando producto '[ID: ${producto.id}] ${producto.title}' al carrito...`);
  
  // Proceder a agregar el producto al carrito
  setCart((prev) => {
    const existingProduct = prev.find((p) => p.id === producto.id);
    if (existingProduct) {
      return prev.map((p) =>
        p.id === producto.id ? { ...p, quantity: p.quantity + 1 } : p
      );
    } else {
      return [...prev, { ...producto, quantity: 1 }];
    }
  });

  console.log(`${request_id} - [CartProvider] Producto agregado al carrito`);
  notify("Producto agregado al carrito", "success");
};


  const updateCartItemQuantity = (id, newQuantity) => {
    console.log(`${request_id} - [CartProvider] Actualizando cantidad del producto en el carrito con ID ${id} a ${newQuantity}`);
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    console.log('[CartProvider] Vaciando carrito...');
    notify("Compra realizada correctamente!", "success")
    setCart([]);
    localStorage.setItem('cart', []);
    console.log('[CartProvider] Carrito vaciado');
  };

  const removeFromCart = (id) => {
    console.log(`${request_id} - [CartProvider] Eliminando producto con ID ${id} del carrito...`);
    setCart((prev) => prev.filter((p) => p.id !== id));
    console.log(`${request_id} - [CartProvider] Producto con ID ${id} eliminado`);
    notify("Producto eliminado", "success");
  };

  const saveCart = async (userEmail) => {
    console.log(`${request_id} - [CartProvider] Guardando carrito del usuario...`);
    const actualCart = JSON.parse(localStorage.getItem('cart'));
    console.log(actualCart)
    console.log(typeof(actualCart))
    if (actualCart && actualCart.length){
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, cart: actualCart})
      });
  
      if (res.ok) {
        console.log(`${request_id} - [CartProvider] Carrito del usuario guardado correctamente...`);
      } else {
        console.log(`${request_id} - [CartProvider] No se pudo guardar el carrito del usuario`)
      }
    }
    localStorage.removeItem('cart');
  }

  const loadCart = async (userEmail) => {
    console.log(`${request_id} - [CartProvider] Cargando carrito del usuario...`);
    if (userEmail){
      const res = await fetch('/api/cart', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Email': userEmail }
      });
      
      console.log("Respuesta de la API: ", res);
      if (res.ok) {
        console.log(`${request_id} - [CartProvider] Carrito del usuario guardado correctamente...`);
        localStorage.setItem('cart', res.cart_data);
      } else {
        console.log(`${request_id} - [CartProvider] No se pudo guardar el carrito del usuario`)
      }
    }
  }

  return (
    <CartContext.Provider value={{ cart, saveCart, loadCart, addToCart, clearCart, removeFromCart, updateCartItemQuantity, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
}