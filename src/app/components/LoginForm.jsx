"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../css/loginForm.module.css";
import { useAuth } from "../context/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(email, password);
    if (success) {
      router.push("/home");
    } else {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <img
          src="/images/OnlyLogo.png"
          alt="Accelerate Logo"
          className={styles.logo}
        />
      </div>
      <div className={styles.loginBox}>
        <h1 className={styles.loginHeader}>Bienvenido</h1>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <label htmlFor="email" className={styles.loginLabel}>
            Correo Electrónico o Usuario
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo o usuario"
            className={styles.loginInput}
            required
          />
          <label htmlFor="password" className={styles.loginLabel}>
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            className={styles.loginInput}
            required
          />
          <button type="submit" className={styles.loginButton}>
            Continuar
          </button>
        </form>
        <p className={styles.loginFooter}>
          ¿Olvidaste tu contraseña? <a href="/recover">Recupérala aquí</a>
        </p>
        <p className={styles.loginFooter}>
          ¿No tienes una cuenta? <a href="/register">Crea una aquí</a>
        </p>
      </div>
    </div>
  );
}
