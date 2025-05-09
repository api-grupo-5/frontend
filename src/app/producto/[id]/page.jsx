'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { productosPerifericos, productosElectrodomesticos, productosComputacion } from '../../data/productos';
import styles from './productoDetalle.module.css';

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const todosLosProductos = [
      ...productosPerifericos,
      ...productosElectrodomesticos,
      ...productosComputacion
    ];
    const encontrado = todosLosProductos.find((p) => p.id === parseInt(id));
    setProducto(encontrado);
  }, [id]);
  
  if (!producto) {
    return (
      <div style={{ padding: '2rem', background: '#222', borderRadius: '8px', textAlign: 'center' }}>
        <h2 style={{ color: 'white' }}>Producto no encontrado</h2>
      </div>
    );
  }

  const esAdmin = true; // simulado

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>{producto.nombre}</h1>
      <img src={producto.imagen} alt={producto.nombre} className={styles.imagen} />
      <p className={styles.precio}><strong>Precio:</strong> ${producto.precio}</p>
      <p className={styles.descripcion}><strong>Descripción:</strong> {producto.descripcion}</p>
  
      {esAdmin && (
        <div className={styles.botones}>
          <button>Editar</button>
          <button>Eliminar</button>
        </div>
      )}
    </div>
  );
  
}
