'use client';

import { useEffect, useState } from 'react';
import Product from './Product';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_FAKE_STORE_API;

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h2 style={{ color: 'white' }}>Catálogo de productos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {products.map(product => (
          <Product
            key={product.id}
            title={product.title}
            image={product.image}
            price={product.price}
            onAddToCart={() => console.log("Agregar al carrito", product)}
          />
        ))}
      </div>
    </div>
  );
}