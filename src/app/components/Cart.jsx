'use client'
import { useCart } from '../context/CartContent';

export default function Carrito({ email }) {
  const { carrito, loading } = useCart();

  if (loading) return <p>Cargando carrito...</p>;
  
  return (
    <div>
    {carrito && carrito.length > 0 ?(
      <div>
      <h1>Bienvenido{email? `, ${email}`:""}</h1>
      <p>Tenes {carrito.length} productos en tu carrito</p>
      <ul>
        {carrito.map((producto, idx) => (
          <li key={idx}>{producto.nombre} - ${producto.precio}</li>
        ))}
      </ul>
    </div>
    ): (
      <div>
        <h1>
          No agregaste ningún producto al carrito
        </h1>
      </div>
    )}
  </div>
  );
}
