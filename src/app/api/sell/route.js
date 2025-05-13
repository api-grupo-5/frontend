import fs from 'fs';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src/app/data', 'products.js');

function updateFile(content){
    const fileContent = `export const products = ${JSON.stringify(content, null, 2)};\n`;
    fs.writeFileSync(productsFilePath, fileContent, 'utf-8');
}

export async function POST(req) {
    const { nombre, precio, descripcion, imagen, categoria, vendedor } = await req.json();

    const { products } = await import("../../data/products")

    try{
        const new_last_id = parseInt(products["last_id"] + 1)
        products[categoria][new_last_id] = {
            "title": nombre,
            "price": precio,
            "description": descripcion,
            "image": imagen,
            "seller": vendedor,
            "id": new_last_id
        }

        products["last_id"] = new_last_id

        updateFile(products)

        console.log("todos los productos:")
        console.log(products)

        console.log(`producto id ${new_last_id} agregado:`)
        console.log(products[categoria][new_last_id])
        return new Response(JSON.stringify({ ok:true, message: 'Producto agregado al catalogo correctamente' }), {
            status: 200
        });
    } catch(e){
        console.log(`Error al querer vender: ${e}`)
        return new Response(JSON.stringify({ ok: false, message: 'El producto no se pudo agregar al catalogo' }), {
            status: 400
        });
    }
}
