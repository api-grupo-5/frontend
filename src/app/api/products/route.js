export async function GET(request_id) {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'request_id': request_id
            }
        }); 
        const response  = await res.json();
        if (response.code == "0200") {
            return new Response(JSON.stringify({ ok: true, message: `${request_id} - [ProductsRoute] Productos obtenidos correctamente`, data: response.data }), {status: 200});
        } else {
            return new Response(JSON.stringify({ ok: true, message: `${request_id} - [ProductsRoute] No se pudo obtener los productos` }), {status: 500});
        }
    } catch(e){
        return new Response(JSON.stringify({ ok: false, message: `${request_id} - [ProductsRoute] Error desconocido al querer obtener los productos: ${e}` }), {status: 500});
    }
}