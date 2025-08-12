'use client';

import { useState } from 'react';
import styles from '../css/sell.module.css';
import { useNotifier } from '../context/NotifierManagent';
import { useAuth } from '../context/LoginManagement';

export default function SellPage() {
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    imagen: '',
    cantidad: '',
    categoria: '',
  });

  const [mensaje, setMensaje] = useState('');
  const {notify } = useNotifier()
  const {user} = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, precio, descripcion, imagen, cantidad, categoria } = form;

    if (!nombre || !precio || !descripcion || !imagen || !cantidad || !categoria) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    const res = await fetch("/api/sell", {
      method: "POST",
      body: JSON.stringify({ 
        nombre: form.nombre,
        precio: form.precio, 
        descripcion: form.descripcion, 
        imagen:form.imagen, 
        //cantidad:form.cantidad, 
        categoria:form.categoria,
        vendedor: user.email
       }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      notify(`¡Producto "${nombre}" cargado correctamente en categoría "${categoria}"!`, "success")
    } else {
      notify("Hubo un problema al querer agregar el producto. Inténtalo nuevamente.", "error");
    }

  };

  return (
    <main className={styles.contenedor}>
      {user.email ? (
        <>
          <h1>Venta de producto</h1>
          <form onSubmit={handleSubmit} className={styles.formulario}>
            <label>Nombre:</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />

            <label>Precio:</label>
            <input type="number" name="precio" value={form.precio} onChange={handleChange} required />

            <label>Descripción:</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />

            <label>URL de imagen:</label>
            <input type="text" name="imagen" value={form.imagen} onChange={handleChange} required />

            <label>Cantidad:</label>
            <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} required />

            <label>Categoría:</label>
            <select name="categoria" value={form.categoria} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="perifericos">Periféricos</option>
              <option value="computacion">Computación</option>
              <option value="electrodomesticos">Electrodomésticos</option>
            </select>

            <button type="submit">Cargar producto</button>

            {mensaje && <p className={styles.mensaje}>{mensaje}</p>}
          </form>
        </>
      ):(
        <>
          <h2>Conectate a alguna cuenta para poder vender!</h2>
        </>
      )}
    </main>
    
  );
}
