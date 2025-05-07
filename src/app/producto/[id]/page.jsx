'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const productosPerifericos = [
  {
    id: 1,
    nombre: 'Auriculares SteelSeries Arctis Nova PRO',
    precio: 299.99,
    imagen: '/images/mouse.png',
    descripcion: 'Auriculares con calidad de sonido Hi-Res y cancelación activa de ruido.',
  },
  {
    id: 2,
    nombre: 'Teclado Hypermagnetico SteelSeries Apex PRO',
    precio: 389.99,
    imagen: '/images/teclado.jpg',
    descripcion: 'Teclado mecánico con switches ajustables y retroiluminación RGB.',
  },
  {
    id: 3,
    nombre: 'Mouse SteelSeries Aerox 9 Wireless',
    precio: 249.99,
    imagen: '/images/mouse.jpg',
    descripcion: 'Mouse ultra liviano con diseño perforado y conectividad dual.',
  },
  // ... Agregá el resto de tus productos
];

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const encontrado = productosPerifericos.find((p) => p.id === parseInt(id));
    setProducto(encontrado);
  }, [id]);

  if (!producto) return <p>Producto no encontrado</p>;

  const esAdmin = true; // simulado

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{producto.nombre}</h1>
      <img src={producto.imagen} alt={producto.nombre} style={{ maxWidth: '300px', borderRadius: '8px' }} />
      <p><strong>Precio:</strong> ${producto.precio}</p>
      <p><strong>Descripción:</strong> {producto.descripcion}</p>

      {esAdmin && (
        <div style={{ marginTop: '1rem' }}>
          <button style={{ marginRight: '1rem' }}>Editar</button>
          <button>Eliminar</button>
        </div>
      )}
    </div>
  );
}
