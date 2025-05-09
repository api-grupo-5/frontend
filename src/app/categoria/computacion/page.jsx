'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from '../perifericos/perifericos.module.css';
import { productosComputacion } from '../../data/productos';

const usuarioActual = 'tobias@demo.com';

export default function ComputacionPage() {
  const [orden, setOrden] = useState('Todos');
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    alert(`${producto.nombre} fue agregado al carrito`);
  };

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
            <button className={styles.btnCarrito} onClick={() => agregarAlCarrito(producto)}>
              Agregar al carrito
            </button>

            {producto.autor === usuarioActual && (
              <div className={styles.botonesAdmin}>
                <button className={styles.btnEditar}>Editar</button>
                <button className={styles.btnEliminar}>Eliminar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
