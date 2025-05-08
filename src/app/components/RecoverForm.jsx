"use client";

import { useState } from "react";
import styles from "../css/recoverForm.module.css";

export default function RecoverForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/recover", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setMessage("Se ha enviado un enlace de recuperación a tu correo.");
    } else {
      setMessage("No se pudo enviar el enlace. Verifica tu correo.");
    }
  };

  return (
    <div className={styles.recoverContainer}>
      <div className={styles.recoverBox}>
        <h1 className={styles.recoverHeader}>Recuperar Contraseña</h1>
        <form onSubmit={handleSubmit} className={styles.recoverForm}>
          <label htmlFor="email" className={styles.recoverLabel}>
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo"
            className={styles.recoverInput}
            required
          />
          <button type="submit" className={styles.recoverButton}>
            Enviar Enlace
          </button>
        </form>
        {message && <p className={styles.recoverMessage}>{message}</p>}
      </div>
    </div>
  );
}