'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifier } from '../context/NotifierManagent';
import { GET, PUT } from "../api/cart/route";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const {notify, request_id} = useNotifier()
  
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart || storedCart == "undefined") {
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
    console.log(`${request_id} - [CartProvider] Agregando producto '[ID: ${producto.id}] ${producto.name}' al carrito...`);
    setCart((prev) => {
      const existingProduct = prev.find((p) => p.id === producto.id);
      if (existingProduct) {
        console.log(`${request_id} - [CartProvider] Nueva cantidad del articulo en el carrito: ${existingProduct.quantity + 1}`);
        return prev.map((p) =>
          p.id === producto.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        console.log(`${request_id} - [CartProvider] Producto agregado al carrito`);
        return [...prev, { ...producto, quantity: 1 }];
      }
    });
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

  const saveCart = async (user_id, token, cart_id) => {
    console.log(`${request_id} - [CartProvider] Guardando carrito del usuario...`);
    await PUT(request_id, user_id, token, cart_id);
    console.log(`${request_id} - [CartProvider] Carrito del usuario guardado correctamente`);
  }

  const loadCart = async (request_id, user_id, token, cart_id) => {
    console.log(`${request_id} - [CartProvider] Cargando carrito del usuario...`);
    const response = await GET(request_id, user_id, token, cart_id);
    const response_json = await response.json();
    const data = response_json.data;
    const cart_items = data.cart_items
    
    setCart(cart_items)
    localStorage.setItem('cart', cart_items);
    console.log(`${request_id} - [CartProvider] Carrito del usuario cargado correctamente`);
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