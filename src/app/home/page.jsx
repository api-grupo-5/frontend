'use client';

import { useState } from 'react';

export default function Home() {
  const fakeProduct = {
    id: 1,
    name: 'Producto 1',
    price: 20,
  };

  const handleAddToCart = async (product) => {
    const res = await fetch('/api/carrito', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: product.id }),
      credentials: 'include', // IMPORTANTE para enviar la cookie con el token
    });

    if (res.ok) {
      alert(`${product.name} agregado al carrito`);
    } else if (res.status === 401) {
      alert('Debes iniciar sesión para agregar al carrito');
    } else {
        const data = await res.json();
        console.error('Error al agregar al carrito:', data.message);
        alert(`Error al agregar al carrito: ${data.message}`);
      }
    };

  return (
    <div>
      <h1>Bienvenido a la tienda</h1>
      <div style={{ padding: '1rem' }}>
        <h2>{fakeProduct.name}</h2>
        <p>Precio: ${fakeProduct.price}</p>
        <button onClick={() => handleAddToCart(fakeProduct)}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
