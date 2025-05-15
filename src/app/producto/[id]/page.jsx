'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { products } from '../../data/products';
import { useAuth } from '../../context/LoginManagement';
import { useCart } from '../../context/CartManagement';
import { useNotifier } from '../../context/NotifierManagent';
import styles from '../../css/productDetails.module.css';
import { redirect } from "next/navigation";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1); // ← Nuevo estado
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { notify } = useNotifier()

  const [editData, setEditData] = useState({
    title: '',
    price: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    const computacion = Object.values(products["computacion"]);
    const electrodomesticos = Object.values(products["electrodomesticos"]);
    const perifericos = Object.values(products["perifericos"]);
    const todosLosProductos = [
      ...perifericos,
      ...electrodomesticos,
      ...computacion
    ];
    const encontrado = todosLosProductos.find((p) => p.id === parseInt(id));
    setProducto(encontrado);
    setEditData({
      title: encontrado?.title,
      price: encontrado?.price,
      image: encontrado?.image,
      description: encontrado?.description
    });
    
  }, [id]);

  if (!producto) {
    return (
      <div style={{ padding: '2rem', background: '#222', borderRadius: '8px', textAlign: 'center' }}>
        <h2 style={{ color: 'white' }}>Producto no encontrado</h2>
      </div>
    );
  }

  const handleEditarProducto = async (item) => {
    const productId = parseInt(id)
    let categoriaProducto = null

    for(let categoria in products){
      try{
        products[categoria][productId] //si no está en esta categoria, rompe y va al catch directo, iterando de nuevo
        
        const res = await fetch("/api/products", {
          method: "PUT",
          body: JSON.stringify(
            { nombre: item.title,
              precio: item.price,
              imagen: item.image,
              descripcion: item.description,
              categoria: categoria,
              id: productId,
              vendedor: products[categoria][productId]["seller"]
            }
          ),
          headers: { "Content-Type": "application/json" },
        });
        console.log("Respuesta de la API: ", res);

        if (res.ok) {
          notify("Se ha editado el articulo correctamente.", "success");
          categoriaProducto = categoria
        } else {
          notify("No se pudo editar el articulo.", "error");
        }
        
        break
      } catch{
        console.log("Buscando categoria del producto...")
      }
    }
    const path = `/categoria/${categoriaProducto}`
    redirect(path)
  }

const handleEliminarProducto = (item) => {
  confirmAlert({
    title: '¿Eliminar producto?',
    message: '¿Estás seguro que querés eliminar este producto?',
    buttons: [
      {
        label: 'Sí, eliminar',
        onClick: () => eliminarProducto(item) // Separás la lógica real acá
      },
      {
        label: 'Cancelar',
        onClick: () => console.log("Cancelado")
      }
    ]
  });
};

const eliminarProducto = async (item) => {
  const productId = parseInt(id);
  let categoriaProducto = null;

  for (let categoria in products) {
    try {
      if (products[categoria][productId].id === productId) {
        const res = await fetch("/api/products", {
          method: "DELETE",
          body: JSON.stringify({
            id: productId,
            categoria: categoria
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          notify("Se ha eliminado el producto correctamente.", "success");
          categoriaProducto = categoria;
        } else {
          notify("No se pudo eliminar el artículo.", "error");
        }
        break;
      }
    } catch {
      console.log("Buscando categoría del producto...");
    }
  }

  const path = `/categoria/${categoriaProducto}`;
  redirect(path);
};

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) setCantidad(value);
  };

  const handleAgregarCarrito = () => {
    addToCart({ ...producto, cantidad });
  };

  return (
    <div className={styles.contenedor}>
      <img src={producto.image} alt={producto.title} className={styles.imagen} />
      <div className={styles.detalles}>
        {user && (user.email == producto.seller || user.role == "admin")?
          (
            <>
              <h1>Hola {user.email}!</h1>
              <h2>Estas viendo esto porque {user.role == "admin"? "tenes rol de admin": "sos el vendedor de este articulo"}, desde acá podrás editar toda la información relacionada al articulo seleccionado</h2>
              Titulo
              <input
                className={styles.editarInput}
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Título"
              />
              Precio
              <input
                className={styles.editarInput}
                value={editData.price}
                type="number"
                onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                placeholder="Precio"
              />
              Imagen
              <input
                className={styles.editarInput}
                value={editData.image}
                onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                placeholder="URL Imagen"
              />
              Descripcion
              <textarea
                className={styles.editarTextarea}
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Descripción"
              />
              <div className={styles.botonGuardarCambios}>
              <button onClick={() => handleEditarProducto(editData)}>Guardar cambios</button>
              <button id={styles.delete} onClick={() => handleEliminarProducto(editData)}>Eliminar producto</button>
              </div>
            </>
          ):(
            <>
            <h1 className={styles.titulo}>{producto.title}</h1>
            <p className={styles.precio}>${producto.price}</p>
            <label className={styles.cantidadLabel}>
              Cantidad:
              <input className={styles.cantidadInput}
                type="number"
                value={cantidad}
                min="1"
                onChange={handleCantidadChange}
              />
            </label>

            <button className={styles.agregarCarrito} onClick={handleAgregarCarrito}>
              Añadir al carrito
            </button>
            <div className={styles.descripcion}>
              <p><strong>Descripción</strong><br /><br />{producto.description}</p>
            </div>
          </>
          )
        }
      </div>
    </div>
  );
}
