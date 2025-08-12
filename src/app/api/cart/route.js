export async function GET(request_id, user_id, token, cart_id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${cart_id}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'request_id': request_id,
        "Authorization": `Bearer ${token}`
        },
      body: JSON.stringify({ 
        user_id
      })
    });

    const response  = await res.json();
    if (response.code == "0200") {
      return new Response(JSON.stringify({ ok: false, message: `${request_id} - [CartRoute] Carrito obtenido correctamente`, data: response.data }), {status: 500});
    } else {
      return new Response(JSON.stringify({ ok: false, message: `${request_id} - [CartRoute] No se pudo obtener el carrito` }), {status: 400});
    }
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: `${request_id} - [CartRoute] Error desconocido al obtener el carrito del usuario: ${e}` }), {status: 500});
  }
}

export async function PUT(request_id, user_id, token, cart_id) {
  try {
    let cart_items = []

    if(localStorage.getItem('cart')){
      const actualCart = JSON.parse(localStorage.getItem('cart'));
      if (actualCart && actualCart.length){
        for(let item of actualCart){
          cart_items.push({
            "id": item.id,
            "quantity": item.quantity
          })
        }

        console.table(cart_items)
      }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${cart_id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'request_id': request_id,
        "Authorization": `Bearer ${token}`
        },
      body: JSON.stringify({ 
        user_id, 
        items: cart_items
      })
    });

    localStorage.removeItem('cart');
    const response  = await res.json();
    if (response.code == "0200") {
      return new Response(JSON.stringify({ ok: true, message: `${request_id} - [CartRoute] Carrito guardado correctamente` }), {status: 200});
    } else {
      return new Response(JSON.stringify({ ok: false, message: `${request_id} - [CartRoute] No se pudo guardar el carrito` }), {status: 400});
    }
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: `${request_id} - [CartRoute] Error desconocido al querer guardar el carrito: ${e}` }), {status: 500});
  }
}