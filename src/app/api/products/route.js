import fs from 'fs';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src/app/data', 'products.js');

function updateFile(content){
    const fileContent = `export const products = ${JSON.stringify(content, null, 2)};\n`;
    fs.writeFileSync(productsFilePath, fileContent, 'utf-8');
}

export async function PUT(req) {
    const { id, nombre, precio, descripcion, imagen, categoria, vendedor } = await req.json();

    let { products } = await import("../../data/products")

    try{
        console.log("todos los productos:")
        console.log(products)
        
        products[categoria][id] = {
            "title": nombre,
            "price": precio,
            "description": descripcion,
            "image": imagen,
            "seller": vendedor,
            "id": id
        }
        
        updateFile(products)

        console.log(`producto id ${id} modificado:`)
        console.log(products[categoria][id])
        return new Response(JSON.stringify({ ok:true, message: 'Producto modificado correctamente' }), {
            status: 200
        });
    } catch(e){
        console.log(`Error al querer vender: ${e}`)
        return new Response(JSON.stringify({ ok: false, message: 'El producto no se pudo modificar' }), {
            status: 400
        });
    }
}

export async function DELETE(req) {
    const { id, categoria } = await req.json();

    let { products } = await import("../../data/products")
    console.log(id, categoria)

    try{
        const deletedProduct = products[categoria][id]
        delete products[categoria][id]
        updateFile(products)

        console.log(`producto id ${id} eliminado:`)
        console.log(deletedProduct)
        return new Response(JSON.stringify({ ok:true, message: 'Producto eliminado correctamente' }), {
            status: 200
        });
    } catch(e){
        console.log(`Error al querer vender: ${e}`)
        return new Response(JSON.stringify({ ok: false, message: 'El producto no se pudo eliminar' }), {
            status: 400
        });
    }
}