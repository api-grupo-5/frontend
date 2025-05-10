'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from '../../css/categories.module.css';
import { productosElectrodomesticos } from '../../data/productos';
import { useCart } from "../../context/CartManagement"

const usuarioActual = 'tobias@demo.com';

export default function ElectrodomesticosPage() {
  const [orden, setOrden] = useState('Todos');
  const { addToCart } = useCart()  

  const ordenarProductos = (lista, criterio) => {
    const copia = [...lista];
    if (criterio === 'Mayor precio') return copia.sort((a, b) => b.price - a.price);
    if (criterio === 'Menor precio') return copia.sort((a, b) => a.price - b.price);
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
            <img src={producto.image} alt={producto.title} className={styles.imagenProducto} />
            <h3>{producto.title}</h3>
            <p>${producto.price}</p>
            <button className={styles.btnCarrito} onClick={() => addToCart(producto)}>
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
