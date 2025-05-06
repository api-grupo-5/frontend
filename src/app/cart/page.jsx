import Cart from "../components/Cart";

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = 'clave_super_secreta';

export default async function CarritoPage() {
  const cookieStore = await cookies();
  const token =  cookieStore.get('token')?.value;

  let email = null;
  let carrito = [];

  try {
    const decoded = jwt.verify(token, SECRET);
    email = decoded.email;
    carrito = decoded.carrito || [];
  } catch (err) {
    console.log(`[${err}] en CarritoPage()`);
  }

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <Cart 
        email={email}
        carrito={carrito}
      />
    </div>
  );
}
