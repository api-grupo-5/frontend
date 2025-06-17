import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcrypt';
import pool from '@/app/lib/db';

const SECRET = 'clave_super_secreta';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          {
            email: user.email,
            cart: user.cart,
            role: user.role,
          },
          SECRET,
          { expiresIn: '1h' }
        );

        const serialized = serialize('token', token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 3600,
          path: '/',
        });

        return new Response(JSON.stringify({ ok: true, token, message: 'Login exitoso' }), {
          status: 200,
          headers: {
            'Set-Cookie': serialized,
          },
        });
      }
    }

    // ❌ Acá `serialized` no existe aún, por eso da error
    return new Response(JSON.stringify({ ok: false, message: 'Credenciales inválidas' }), {
      status: 401,
    });

  } catch (error) {
    console.error('Error en login:', error);
    return new Response(JSON.stringify({ ok: false, message: 'Error interno del servidor' }), {
      status: 500,
    });
  }
}
