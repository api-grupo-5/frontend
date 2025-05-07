'use client'
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      console.log("[CartProvider] Obteniendo carrito desde localStorage...");
      let json = JSON.parse(storedCart) 
      setCart(json);
      console.log(`[CartProvider] Agregando producto ${json}...`);
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
    } else {
      console.log("[CartProvider] Todavía no terminó de cargar el carrito!")
    }
  }, [cart, loading]);

  const addToCart = (producto) => {
    console.log(`[CartProvider] Agregando producto ${producto.title} al carrito...`);
    setCart((prev) => [...prev, producto]);
    console.log(`[CartProvider] Producto agregado al carrito`);
  };

  const clearCart = () => {
    console.log('[CartProvider] Vaciando carrito...');
    setCart([]);
    console.log('[CartProvider] Carrito vaciado');
  };

  const removeFromCart = (id) => {
    console.log(`[CartProvider] Eliminando producto con ID ${id} del carrito...`);
    setCart((prev) => prev.filter((p) => p.id !== id));
    console.log(`[CartProvider] Producto con ID ${id} eliminado`);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, removeFromCart, loading }}>
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