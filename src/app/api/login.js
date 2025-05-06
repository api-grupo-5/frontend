import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';


export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  const SECRET = process.env.JWT_SECRET || 'clave_super_secreta';

  if (email === 'usuario@ejemplo.com' && password === '1234') {
    const token = jwt.sign({ email, carrito: [{ nombre: "Producto 1", precio: 99 }] }, SECRET, { expiresIn: '1h' });

    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    }));

    return res.status(200).json({ mensaje: 'Login exitoso' });
  }

  return res.status(401).json({ mensaje: 'Credenciales inválidas' });
}
