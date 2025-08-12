export async function POST(request_id, email, password) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'request_id': request_id
        },
        body: JSON.stringify({ email, password })
      });
      

    const response  = await res.json();
    if (response.code == "0200") {
      return new Response(JSON.stringify({ ok: true, message: `${request_id} - [LoginRoute] Usuario logeado correctamente`, data: response.data }), {status: 200});
    } else {
      return new Response(JSON.stringify({ ok: false, message: `${request_id} - [LoginRoute] El usuario no pudo conectarse` }), {status: 400});
    }
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: `${request_id} - [LoginRoute] El usuario no pudo conectarse por un error desconocido: ${e}` }), {status: 500});
  }
}
