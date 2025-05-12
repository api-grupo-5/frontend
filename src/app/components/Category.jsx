'use client';
import { useState } from 'react';
import styles from '../css/categories.module.css';
import { products } from '../data/products';
import { useCart } from "../context/CartManagement";
import { useAuth } from '../context/LoginManagement';

export default function CategoryPage({ categoria }) {
  const [orden, setOrden] = useState('Todos');
  const { addToCart } = useCart();
  const { user } = useAuth();

  const ordenarProductos = (lista, criterio) => {
    const copia = Object.values(lista);
    if (criterio === 'Mayor precio') return copia.sort((a, b) => b.price - a.price);
    if (criterio === 'Menor precio') return copia.sort((a, b) => a.price - b.price);
    return copia;
  };

  const handleRedirigir = (producto) => {
    const url = `/producto/${producto.id}`;
    window.open(url, '_blank');
  };

  // Obtener los productos de la categoría dinámica
  const productosOrdenados = ordenarProductos(products[categoria], orden);

  return (
    <main className={styles.catalogo}>
      <h1>{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h1>

      <div className={styles.filtro}>
        <label htmlFor="orden">Ordenar por: </label>
        <select id="orden" value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Mayor precio">Mayor precio</option>
          <option value="Menor precio">Menor precio</option>
        </select>
      </div>

      <div className={styles.grid}>
        {productosOrdenados.map((producto, index) => (
            <div key={index} className={styles.card}>
                <div key={index + productosOrdenados.length + 1} onClick={() => handleRedirigir(producto)}>
                    <img src={producto.image} alt={producto.title} className={styles.imagenProducto} />
                    <h3>{producto.title}</h3>
                    <p>${producto.price}</p>
                </div>
                {user && (producto.seller == user.email || user.role == "admin") ? (
                    <>
                        <button onClick={() => handleRedirigir(producto)}>Editar producto</button>
                    </>
                    ) : 
                    <button className={styles.btnCarrito} onClick={() => addToCart(producto)}>
                        Agregar al carrito
                    </button>
                }
            </div>
        ))}
      </div>
    </main>
  );
}
