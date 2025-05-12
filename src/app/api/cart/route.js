import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'src/app/data', 'users.js');
const SECRET = 'clave_super_secreta';

function updateFile(content) {
  const fileContent = `export const users = ${JSON.stringify(content, null, 2)};\n`;
  fs.writeFileSync(usersFilePath, fileContent, 'utf-8');
}

export async function GET(req) {
  const email = req.headers.get('Email');
  const { users } = await import("../../data/users");

  try {
    const cart_data = users[email]["cart"]
    console.log(email)
    console.log(users[email])
    return new Response(JSON.stringify({ ok: true, cart:cart_data, message: 'Carrito cargado correctamente' }), {
      status: 200
    });

  } catch (e) {
    console.log(`Error al registrar: ${e}`);
    return new Response(JSON.stringify({ ok: false, message: 'No se pudo cargar el carrito del usuario' }), {
      status: 400
    });
  }
}


export async function PUT(req) {
  const { email, cart } = await req.json();
  const { users } = await import("../../data/users");

  try {
    users[email]["cart"] = cart
    updateFile(users);

    console.log(users)
    return new Response(JSON.stringify({ ok: true, message: 'Carrito guardado correctamente' }), {
      status: 200
    });

  } catch (e) {
    console.log(`Error al registrar: ${e}`);
    return new Response(JSON.stringify({ ok: false, message: 'No se pudo guardar el carrito del usuario' }), {
      status: 400
    });
  }
}

// export async function GET(req) {
//   const cookies = req.headers.get('cookie');
//   const token = cookies && parse(cookies).token;

//   if (!token) {
//     return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET);
//     return new Response(JSON.stringify({ carrito: decoded.carrito }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ message: 'Token inválido' }), { status: 401 });
//   }
// }


// export async function PUT(req) {
//   const { productId } = await req.json();
//   const cookies = req.headers.get('cookie');
//   const token = cookies && parse(cookies).token;

//   if (!token) {
//     return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET);
//     const producto = productos.find(p => p.id === productId);
//     if (!producto) {
//       return new Response(JSON.stringify({ message: 'Producto no encontrado' }), { status: 404 });
//     }

//     const carritoActualizado = [...decoded.carrito, producto];
//     const nuevoToken = jwt.sign(
//       { email: decoded.email, carrito: carritoActualizado },
//       SECRET,
//       { expiresIn: '1h' }
//     );

//     const serialized = serialize('token', nuevoToken, {
//       httpOnly: true,
//       sameSite: 'strict',
//       maxAge: 3600,
//       path: '/',
//     });

//     return new Response(JSON.stringify({ message: 'Producto agregado al carrito' }), {
//       status: 200,
//       headers: {
//         'Set-Cookie': serialized,
//       },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ message: 'Token inválido' }), { status: 401 });
//   }
// }
