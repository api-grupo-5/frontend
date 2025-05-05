// pages/carrito.js
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const SECRET = 'clave_super_secreta';

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token || null;

  if (!token) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    return { props: { email: decoded.email, carrito: decoded.carrito } };
  } catch (err) {
    return { redirect: { destination: '/login', permanent: false } };
  }
}

export default function Carrito({ email, carrito }) {
  return (
    <div>
      <h1>Bienvenido, {email}</h1>
      <p>Tu carrito: {carrito.length} productos</p>
      <ul>
        {carrito.map((producto, idx) => (
          <li key={idx}>{producto.nombre} - ${producto.precio}</li>
        ))}
      </ul>
    </div>
  );
}
