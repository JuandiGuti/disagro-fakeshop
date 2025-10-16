"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { emitAuthChanged } from "@/lib/authBus";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await login(email, password);
      emitAuthChanged();
      if (data?.user?.role === "admin") {
        router.replace("/admin/coupons");
      } else {
        router.replace("/");
      }
    } catch (e) {
      setErr(e?.message || "Error de login");
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#000",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    card: {
      width: "100%",
      maxWidth: 420,
      background: "#fff",
      color: "#000",
      border: "1px solid #e5e5e5",
      borderRadius: 8,
      padding: 16,
    },
    title: { margin: "0 0 12px 0" },
    field: { display: "grid", rowGap: 6, margin: "10px 0" },
    input: {
      background: "#fff",
      border: "1px solid #d0d0d0",
      borderRadius: 6,
      color: "#000",
      padding: "10px 12px",
      outline: "none",
      width: "100%",
      color: "#000",
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      marginTop: 8,
    },
    btnSolid: {
      border: "2px solid #000",
      background: "#000",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 600,
    },
    err: {
      background: "#ffe5e5",
      color: "#8a0000",
      border: "1px solid #f0c2c2",
      borderRadius: 6,
      padding: 10,
      marginBottom: 8,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Iniciar sesión</h2>

        {err ? <div style={styles.err}>{err}</div> : null}

        <form onSubmit={onSubmit}>
          <label style={styles.field}>
            <span>Correo</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="correo@correo.com"
            />
          </label>

          <label style={styles.field}>
            <span>Contraseña</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
          </label>

          <div style={styles.actions}>
            <button type="submit" style={styles.btnSolid} disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
