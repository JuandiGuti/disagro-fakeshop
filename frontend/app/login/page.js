"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/admin/coupons");
    } catch (e) {
      setErr(e.message || "Error de login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Iniciar sesión</h2>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
      <form onSubmit={onSubmit}>
        <div style={{ margin: "8px 0" }}>
          <label>Email</label>
          <br />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div style={{ margin: "8px 0" }}>
          <label>Contraseña</label>
          <br />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>
        <button disabled={loading} type="submit">
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
