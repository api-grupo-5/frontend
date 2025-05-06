export default function Carrito({ email, carrito }) {
  return (
    <div>
    {carrito ?(
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
