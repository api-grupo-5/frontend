
import { users } from "../../data/users"

export async function POST(req) {
  const { email } = await req.json();

  if (email in users) {
    return new Response(JSON.stringify({ ok:true, message: 'El mail existe' }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ ok: false, message: 'El mail no existe' }), {
    status: 401,
  });
}
