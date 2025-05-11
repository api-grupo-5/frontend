'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { products } from '../../data/products';
import { useAuth } from '../../context/LoginManagement';
import { useCart } from '../../context/CartManagement';
import styles from '../../css/productDetails.module.css';

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1); // ← Nuevo estado
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const computacion = Object.values(products["computacion"]);
    const electrodomesticos = Object.values(products["electrodomesticos"]);
    const perifericos = Object.values(products["perifericos"]);
    const todosLosProductos = [
      ...perifericos,
      ...electrodomesticos,
      ...computacion
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

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) setCantidad(value);
  };

  const handleAgregarCarrito = () => {
    addToCart({ ...producto, cantidad });
  };

  return (
    <div className={styles.contenedor}>
      <img src={producto.image} alt={producto.title} className={styles.imagen} />

      <div className={styles.detalles}>
        <h1 className={styles.titulo}>{producto.title}</h1>
        <p className={styles.precio}>${producto.price}</p>

        {/* Input para seleccionar cantidad */}
        <label className={styles.cantidadLabel}>
          Cantidad:
          <input className={styles.cantidadInput}
            type="number"
            value={cantidad}
            min="1"
            onChange={handleCantidadChange}
          />
        </label>

        <button
          className={styles.agregarCarrito}
          onClick={handleAgregarCarrito}
        >
          Añadir al carrito
        </button>

        {user.email === producto.seller && (
          <div className={styles.botones}>
            <button className={styles.boton}>Editar</button>
            <button className={styles.boton}>Eliminar</button>
          </div>
        )}
      </div>

      <div className={styles.descripcion}>
        <p><strong>Descripción</strong><br /><br />{producto.description}</p>
      </div>
    </div>
  );
}
