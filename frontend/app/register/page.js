"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register, login } from "@/services/auth";
import { emitAuthChanged } from "@/lib/authBus";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(email, password);
      await login(email, password);
      emitAuthChanged();
      router.replace("/");
    } catch (e) {
      setErr(e.message || "Error de registro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Crear cuenta</h2>
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
          {loading ? "Creando..." : "Crear"}
        </button>
      </form>
    </div>
  );
}
