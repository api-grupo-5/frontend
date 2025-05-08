'use client';

import { useState } from 'react';
import styles from './emular-venta.module.css';

export default function EmularVenta() {
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    imagen: '',
    cantidad: '',
    categoria: '',
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { nombre, precio, descripcion, imagen, cantidad, categoria } = form;

    if (!nombre || !precio || !descripcion || !imagen || !cantidad || !categoria) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    setMensaje(`¡Producto "${nombre}" cargado correctamente en categoría "${categoria}"!`);
  };

  return (
    <main className={styles.contenedor}>
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
    </main>
  );
}
