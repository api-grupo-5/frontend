import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const SECRET = 'clave_super_secreta';

export async function POST(req) {
  const { email, password } = await req.json();
  const accounts = {
    "usuario@ejemplo.com": "1234",
    "asd@asd.com": "1234"
  }

  if (email in accounts && password === accounts[email]) {
    const token = jwt.sign(
      {
        email,
        carrito: [],
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

    return new Response(JSON.stringify({ ok:true, message: 'Login exitoso' }), {
      status: 200,
      headers: {
        'Set-Cookie': serialized,
      },
    });
  }

  return new Response(JSON.stringify({ ok: false, message: 'Credenciales inválidas' }), {
    status: 401,
  });
}
