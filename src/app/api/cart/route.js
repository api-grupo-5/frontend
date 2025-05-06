// app/api/carrito/route.js
import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';

const SECRET = 'clave_super_secreta';

const productos = [
  { id: 1, nombre: 'Producto 1', precio: 100 },
  { id: 2, nombre: 'Producto 2', precio: 150 },
];

export async function GET(req) {
  const cookies = req.headers.get('cookie');
  const token = cookies && parse(cookies).token;

  if (!token) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    return new Response(JSON.stringify({ carrito: decoded.carrito }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Token inválido' }), { status: 401 });
  }
}

export async function PUT(req) {
  const { productId } = await req.json();
  const cookies = req.headers.get('cookie');
  const token = cookies && parse(cookies).token;

  if (!token) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    const producto = productos.find(p => p.id === productId);
    if (!producto) {
      return new Response(JSON.stringify({ message: 'Producto no encontrado' }), { status: 404 });
    }

    const carritoActualizado = [...decoded.carrito, producto];
    const nuevoToken = jwt.sign(
      { email: decoded.email, carrito: carritoActualizado },
      SECRET,
      { expiresIn: '1h' }
    );

    const serialized = serialize('token', nuevoToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    return new Response(JSON.stringify({ message: 'Producto agregado al carrito' }), {
      status: 200,
      headers: {
        'Set-Cookie': serialized,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Token inválido' }), { status: 401 });
  }
}
