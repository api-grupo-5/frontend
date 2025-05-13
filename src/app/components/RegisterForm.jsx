"use client";

import { useState } from "react";
import styles from "../css/registerForm.module.css";
import { useNotifier } from "../context/NotifierManagent";
import {redirect} from "next/navigation"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const {notify} = useNotifier()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      notify("Las contraseñas no coinciden.", "error");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email: formData.email, password: formData.password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      notify("Registro exitoso. Ahora puedes iniciar sesión.", "success");
      redirect("/login")
    } else {
      notify("Hubo un problema con el registro. Inténtalo nuevamente.", "error");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h1 className={styles.registerHeader}>Crear Cuenta</h1>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <label htmlFor="firstName" className={styles.registerLabel}>
            Nombre
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Ingrese su nombre"
            className={styles.registerInput}
            required
          />
          <label htmlFor="lastName" className={styles.registerLabel}>
            Apellido
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Ingrese su apellido"
            className={styles.registerInput}
            required
          />
          <label htmlFor="email" className={styles.registerLabel}>
            Correo Electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingrese su correo"
            className={styles.registerInput}
            required
          />
          <label htmlFor="password" className={styles.registerLabel}>
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Cree una contraseña"
            className={styles.registerInput}
            required
          />
          <label htmlFor="confirmPassword" className={styles.registerLabel}>
            Ingrese su contraseña nuevamente
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repita su contraseña"
            className={styles.registerInput}
            required
          />
          <label htmlFor="phone" className={styles.registerLabel}>
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ingrese su número de teléfono"
            className={styles.registerInput}
            required
          />
          <button type="submit" className={styles.registerButton}>
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}