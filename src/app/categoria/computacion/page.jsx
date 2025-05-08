'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from '../perifericos/perifericos.module.css';

const productosComputacion = [
  {
    id: 201,
    nombre: 'Notebook Acer Aspire 5 15.6"',
    precio: 899.99,
    imagen: '/images/notebook.jpg',
  },
  {
    id: 202,
    nombre: 'Placa de Video NVIDIA RTX 4060',
    precio: 549.99,
    imagen: '/images/rtx4060.jpg',
  },
  {
    id: 203,
    nombre: 'Procesador Intel Core i7 12va Gen',
    precio: 399.99,
    imagen: '/images/intel_i7.jpg',
  },
  {
    id: 4,
    nombre: 'Mouse SteelSeries Aerox 9 Wireless',
    precio: 249.99,
    imagen: '/images/mouse.jpg',
  },
  {
    id: 5,
    nombre: 'Auriculares SteelSeries Arctis Nova PRO',
    precio: 299.99,
    imagen: '/images/auriculares.jpg',
  },
  {
    id: 6,
    nombre: 'Teclado Hypermagnetico SteelSeries Apex PRO',
    precio: 389.99,
    imagen: '/images/teclado.jpg',
  },
  {
    id: 7,
    nombre: 'Mouse SteelSeries Aerox 9 Wireless',
    precio: 249.99,
    imagen: '/images/mouse.jpg',
  },
  {
    id: 8,
    nombre: 'Mouse SteelSeries Aerox 9 Wireless',
    precio: 249.99,
    imagen: '/images/mouse.jpg',
  },
  {
    id: 9,
    nombre: 'Auriculares SteelSeries Arctis Nova PRO',
    precio: 299.99,
    imagen: '/images/auriculares.jpg',
  },
  {
    id: 10,
    nombre: 'Teclado Hypermagnetico SteelSeries Apex PRO',
    precio: 389.99,
    imagen: '/images/teclado.jpg',
  },
  {
    id: 11,
    nombre: 'Mouse SteelSeries Aerox 9 Wireless',
    precio: 249.99,
    imagen: '/images/mouse.jpg',
  },
  {
    id: 12,
    nombre: 'Mouse SteelSeries Aerox 9 Wireless',
    precio: 249.99,
    imagen: '/images/mouse.jpg',
  },
  
];

export default function ComputacionPage() {
  const [orden, setOrden] = useState('Todos');

  const ordenarProductos = (lista, criterio) => {
    const copia = [...lista];
    if (criterio === 'Mayor precio') return copia.sort((a, b) => b.precio - a.precio);
    if (criterio === 'Menor precio') return copia.sort((a, b) => a.precio - b.precio);
    return copia;
  };

  const productosOrdenados = ordenarProductos(productosComputacion, orden);

  return (
    <main className={styles.catalogo}>
      <h1>Computación</h1>

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
            <div className={styles.cardHeader}>
              <Link href={`/producto/${producto.id}`}>
                <button className={styles.btnDetalleChico}>Ver detalle</button>
              </Link>
            </div>
            <img src={producto.imagen} alt={producto.nombre} className={styles.imagenProducto} />
            <h3>{producto.nombre}</h3>
            <p>${producto.precio}</p>
            <button className={styles.btnCarrito}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </main>
  );
}
