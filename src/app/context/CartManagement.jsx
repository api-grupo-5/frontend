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
    const storedCart = localStorage.getItem('cart');
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
    } else {
      console.log("[CartProvider] Todavía no terminó de cargar el carrito!")
    }
  }, [cart, loading]);

  const addToCart = (producto) => {
    console.log(`${request_id} - [CartProvider] Agregando producto '[ID: ${producto.id}] ${producto.title}' al carrito...`);
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
    console.log('[CartProvider] Carrito vaciado');
  };

  const removeFromCart = (id) => {
    console.log(`${request_id} - [CartProvider] Eliminando producto con ID ${id} del carrito...`);
    setCart((prev) => prev.filter((p) => p.id !== id));
    console.log(`${request_id} - [CartProvider] Producto con ID ${id} eliminado`);
    notify("Producto eliminado", "success");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, removeFromCart, updateCartItemQuantity, loading }}>
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