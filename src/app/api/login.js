import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  // Acá hacés tu validación (simplificada)
  if (email === 'usuario@ejemplo.com' && password === '1234') {
    const token = jwt.sign({ email }, 'clave_secreta', { expiresIn: '1h' });

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
