'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from '../perifericos/perifericos.module.css'; 

const productosElectrodomesticos = [
  {
    id: 101,
    nombre: 'Heladera No Frost 320L',
    precio: 799.99,
    imagen: '/images/heladera.jpg',
  },
  {
    id: 102,
    nombre: 'Microondas Digital 20L',
    precio: 219.99,
    imagen: '/images/microondas.jpg',
  },
  {
    id: 103,
    nombre: 'Lavarropas Automático 7kg',
    precio: 659.99,
    imagen: '/images/lavarropas.jpg',
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

export default function ElectrodomesticosPage() {
  const [orden, setOrden] = useState('Todos');

  const ordenarProductos = (lista, criterio) => {
    const copia = [...lista];
    if (criterio === 'Mayor precio') return copia.sort((a, b) => b.precio - a.precio);
    if (criterio === 'Menor precio') return copia.sort((a, b) => a.precio - b.precio);
    return copia;
  };

  const productosOrdenados = ordenarProductos(productosElectrodomesticos, orden);

  return (
    <main className={styles.catalogo}>
      <h1>Electrodomésticos</h1>

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
