export async function POST(request_id, email, password, firstName, lastName, phone) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'request_id': request_id
      },
      body: JSON.stringify({ 
        email,
        password,
        "first_name": firstName,
        "last_name": lastName,
        phone,
        "address": "test_123",
        "personal_id": 123455678 })
    });

    const response  = await res.json();
    if (response.code == "0200") {
      return new Response(JSON.stringify({ ok: true, message: `${request_id} - [RegisterRoute] Usuario registrado correctamente` }), {status: 200});
    } else {
      return new Response(JSON.stringify({ ok: false, message: `${request_id} - [RegisterRoute] El usuario no pudo registarse` }), {status: 400});
    }
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: `${request_id} - [RegisterRoute] El usuario no pudo registarse por un error desconocido: ${e}` }), {status: 500});
  }
}
