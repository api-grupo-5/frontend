'use client'
import Cart from "../components/Cart";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("useEffect ejecutado en el cliente");
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          setCarrito(JSON.parse(cartData));
        } else {
          console.log("No hay carrito en localStorage");
        }
      } catch (err) {
        console.error(`[${err}] en CartPage()`);
      }
    }
  }, []);

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <Cart/>
    </div>
  );
}
