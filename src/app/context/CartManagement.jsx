'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { useNotifier } from '../context/NotifierManagent';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const {notify, request_id} = useNotifier()
  
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
    localStorage.setItem('cart', []);
    console.log('[CartProvider] Carrito vaciado');
  };

  const removeFromCart = (id) => {
    console.log(`${request_id} - [CartProvider] Eliminando producto con ID ${id} del carrito...`);
    setCart((prev) => prev.filter((p) => p.id !== id));
    console.log(`${request_id} - [CartProvider] Producto con ID ${id} eliminado`);
    notify("Producto eliminado", "success");
  };

  const saveCart = async (user_id, token) => {
    console.log(`${request_id} - [CartProvider] Guardando carrito del usuario...`);

    if(localStorage.getItem('cart')){
      const actualCart = JSON.parse(localStorage.getItem('cart'));
      if (actualCart && actualCart.length){
        let items = []

        for(let item of actualCart){
          items.push({
            "id": item.id,
            "quantity": item.quantity
          })
        }

        console.table(items)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/saveCart`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'request_id': request_id,
            "Authorization": `Bearer ${token}`
           },
          body: JSON.stringify({ 
            user_id, 
            items
          })
        });

        const response  = await res.json();
        console.log(response)
        if (response.code == "0200") {
          console.log(`${request_id} - [CartProvider] Carrito del usuario guardado correctamente...`);
        } else {
          console.log(`${request_id} - [CartProvider] No se pudo guardar el carrito del usuario`)
        }

        localStorage.removeItem('cart');
      }
    } else{
      localStorage.setItem('cart', []);
    }
  }

  const loadCart = async (user_id, token) => {
    console.log(`${request_id} - [CartProvider] Cargando carrito del usuario...`);
    if (user_id){
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/loadCart`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'request_id': request_id,
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          user_id
        })
      });
      
      const response  = await res.json();
      console.log(response)
      if (response.code == "0200") {
        console.log(`${request_id} - [CartProvider] Carrito del usuario cargado correctamente...`);
        const cart_items = response.data.cart_items
        console.log(cart_items)
        localStorage.setItem('cart', JSON.stringify(cart_items));
        setCart(cart_items);
      } else {
        console.log(`${request_id} - [CartProvider] No se pudo cargar el carrito del usuario`)
      }
    } else{
      console.log(`${request_id} - [CartProvider] Falta el user_id`);
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