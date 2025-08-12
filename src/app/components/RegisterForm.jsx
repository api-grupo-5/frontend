"use client";

import { useState } from "react";
import styles from "../css/registerForm.module.css";
import { useNotifier } from "../context/NotifierManagent";
import { useAuth } from "../context/LoginManagement";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const {notify} = useNotifier()
  const { register, login } = useAuth();
  const router = useRouter();

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

    const success_register = await register(formData.email, formData.password, formData.firstName, formData.lastName, formData.phone);
    if (success_register) {
      const success_login = await login(formData.email, formData.password)
      
      if (success_login) {
        router.push("/home");
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h1 className={styles.registerHeader}>Crear Cuenta</h1>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <label htmlFor="first_name" className={styles.registerLabel}>
            Nombre
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Ingrese su nombre"
            className={styles.registerInput}
            required
          />
          <label htmlFor="last_name" className={styles.registerLabel}>
            Apellido
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
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