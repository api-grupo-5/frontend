'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './perifericos.module.css';

const usuarioActual = 'tobias@demo.com';

const productosPerifericos = [
  {
    id: 1,
    nombre: 'Auriculares SteelSeries',
    precio: 299.99,
    imagen: '/images/auricular.jpeg',
    autor: 'tobias@demo.com',
    descripcion: 'Auriculares con sonido nítido y diseño cómodo para largas sesiones.',
  },
  {
    id: 2,
    nombre: 'Teclado Hypermagnetico',
    precio: 389.99,
    imagen: '/images/teclado1.jpg',
    autor: 'otro@demo.com',
    descripcion: 'Teclado mecánico con gran sensibilidad y retroiluminación RGB.',
  },
  {
    id: 3,
    nombre: 'Mouse Logitech Pro',
    precio: 249.99,
    imagen: '/images/mouse2.jpeg',
    autor: 'tobias@demo.com',
    descripcion: 'Mouse gamer de alta precisión con diseño ergonómico.',
  },
  {
    id: 4,
    nombre: 'Teclado Razer Chroma',
    precio: 249.99,
    imagen: '/images/teclado2.jpg',
    autor: 'otro@demo.com',
    descripcion: 'Teclado con iluminación personalizable y respuesta rápida.',
  },
  {
    id: 5,
    nombre: 'Teclado Razer Blackwidow',
    precio: 299.99,
    imagen: '/images/teclado3.jpeg',
    autor: 'tobias@demo.com',
    descripcion: 'Modelo clásico con switches mecánicos ideales para gaming.',
  },
  {
    id: 6,
    nombre: 'Auriculares Sony',
    precio: 389.99,
    imagen: '/images/auricular3.jpeg',
    autor: 'otro@demo.com',
    descripcion: 'Auriculares con cancelación de ruido y gran calidad de sonido.',
  },
  {
    id: 7,
    nombre: 'Mouse Logitech G503',
    precio: 249.99,
    imagen: '/images/mouse4.jpeg',
    autor: 'tobias@demo.com',
    descripcion: 'Mouse con sensor óptico avanzado y botones programables.',
  },
  {
    id: 8,
    nombre: 'Mouse Logitech G303',
    precio: 249.99,
    imagen: '/images/mouse5.jpeg',
    autor: 'otro@demo.com',
    descripcion: 'Compacto, liviano y preciso. Ideal para juegos de reacción rápida.',
  },
  {
    id: 9,
    nombre: 'Auriculares HyperX',
    precio: 299.99,
    imagen: '/images/auricular2.jpeg',
    autor: 'tobias@demo.com',
    descripcion: 'Audio inmersivo con almohadillas suaves para mayor confort.',
  },
  {
    id: 10,
    nombre: 'Auricular Jnl tune',
    precio: 389.99,
    imagen: '/images/auricular1.jpg',
    autor: 'otro@demo.com',
    descripcion: 'Diseño moderno con excelente rendimiento de graves.',
  },
  {
    id: 11,
    nombre: 'Mouse Logitech Lightspeed',
    precio: 249.99,
    imagen: '/images/mouse1.jpeg',
    autor: 'tobias@demo.com',
    descripcion: 'Mouse inalámbrico ultrarrápido con tecnología Lightspeed.',
  },
  {
    id: 12,
    nombre: 'Mouse Logitech Wireless',
    precio: 249.99,
    imagen: '/images/mouse.jpg',
    autor: 'otro@demo.com',
    descripcion: 'Mouse inalámbrico confiable con gran duración de batería.',
  },
];

export default function PerifericosPage() {
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

  const productosOrdenados = ordenarProductos(productosPerifericos, orden);

  return (
    <main className={styles.catalogo}>
      <h1>Periféricos</h1>

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
