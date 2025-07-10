import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const usersFilePath = path.join(process.cwd(), 'src/app/data', 'users.js');

function updateFile(content) {
  const fileContent = `export const users = ${JSON.stringify(content, null, 2)};\n`;
  fs.writeFileSync(usersFilePath, fileContent, 'utf-8');
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req) {
  const { email, password } = await req.json();
  const { users } = await import("../../data/users");

  if (!(email in users)) {
    try {
      const hashedPassword = hashPassword(password);
      users[email] = {
        "password": hashedPassword,
        "role": "user"
      };

      updateFile(users);

      return new Response(JSON.stringify({ ok: true, message: 'Registro exitoso' }), {
        status: 200
      });
    } catch (e) {
      console.log(`Error al registrar: ${e}`);
      return new Response(JSON.stringify({ ok: false, message: 'Registro fallido' }), {
        status: 400
      });
    }
  } else {
    return new Response(JSON.stringify({ ok: false, message: 'El usuario ya existe' }), {
      status: 409
    });
  }
}
