import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { users } from "../../data/users"
import crypto from 'crypto';

const SECRET = 'clave_super_secreta';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req) {
  const { email, password } = await req.json();
  console.log(users)

  if (email in users && hashPassword(password) === users[email]["password"]) {
    const token = jwt.sign(
      {
        email,
        cart: users[email]["cart"],
        role: users[email]["role"]
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

    return new Response(JSON.stringify({ ok:true, token: token, message: 'Login exitoso' }), {
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
