export async function POST(req) {
  try {
    const requestId = req.headers.get('x-request-id');
    const body = await req.json();

    const res = await fetch(`${process.env.BACKEND_IP}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': requestId ?? '', // opcional: proteger si es null
      },
      body: JSON.stringify(body) // ✅ Reusar el body ya leído
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[API LOGIN ERROR]', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
