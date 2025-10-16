"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientCoupons({ initialItems }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems || []);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [type, setType] = useState("ALL"); // ALL | SOME
  const [productIds, setProductIds] = useState(""); // CSV "1,2,3"
  const [discountPct, setDiscountPct] = useState(10);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  async function refresh() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/coupons", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/login");
          return;
        }
        throw new Error("No se pudo cargar");
      }
      const data = await res.json();
      setItems(data || []);
    } catch (e) {
      setErr(e.message || "No se pudo cargar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        type,
        discountPct: Number(discountPct),
        active: Boolean(active),
        ...(type === "SOME" && {
          productIds: (productIds || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((n) => Number(n)),
        }),
      };

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("No se pudo crear");

      // Limpia y rehidrata SSR
      setCode("");
      setProductIds("");
      setDiscountPct(10);
      setType("ALL");
      setActive(true);

      // Recarga datos SSR del server component
      router.refresh();
    } catch (e) {
      setErr(e.message || "No se pudo crear");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(c) {
    try {
      const res = await fetch(`/api/admin/coupons/${c._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !c.active }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar");
      router.refresh();
    } catch (e) {
      setErr(e.message || "No se pudo actualizar");
    }
  }

  async function onDelete(c) {
    if (!confirm(`¿Eliminar cupón ${c.code}?`)) return;
    try {
      const res = await fetch(`/api/admin/coupons/${c._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      router.refresh();
    } catch (e) {
      setErr(e.message || "No se pudo eliminar");
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#000",
      color: "#fff",
      padding: "24px",
    },
    container: { maxWidth: 920, margin: "0 auto", display: "grid", gap: 16 },
    title: { margin: "0 0 8px 0" },
    card: {
      background: "#fff",
      color: "#000",
      border: "1px solid #e5e5e5",
      borderRadius: 8,
      padding: 16,
    },
    err: {
      background: "#ffe5e5",
      color: "#8a0000",
      border: "1px solid #f0c2c2",
      borderRadius: 6,
      padding: 10,
      marginBottom: 8,
    },
    grid2: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 },
    field: { display: "grid", rowGap: 6 },
    input: {
      background: "#fff",
      border: "1px solid #d0d0d0",
      borderRadius: 6,
      color: "#000",
      padding: "10px 12px",
      outline: "none",
      width: "100%",
    },
    select: {
      background: "#fff",
      border: "1px solid #d0d0d0",
      borderRadius: 6,
      color: "#000",
      padding: "10px 12px",
      outline: "none",
      width: "100%",
    },
    checkbox: { transform: "scale(1.1)" },
    actions: { marginTop: 12 },
    btnSolid: {
      border: "2px solid #000",
      background: "#000",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 600,
    },
    btnGhost: {
      border: "1px solid #d0d0d0",
      background: "#fff",
      color: "#000",
      padding: "8px 12px",
      borderRadius: 6,
      cursor: "pointer",
    },
    btnDanger: {
      border: "1px solid #c62828",
      background: "#fff",
      color: "#c62828",
      padding: "8px 12px",
      borderRadius: 6,
      cursor: "pointer",
    },
    tableWrap: {
      overflowX: "auto",
      borderRadius: 8,
      border: "1px solid #e5e5e5",
      background: "#fff",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      color: "#000",
    },
    th: {
      textAlign: "left",
      padding: 10,
      borderBottom: "1px solid #e5e5e5",
      background: "#f6f6f6",
      fontWeight: 600,
    },
    td: {
      padding: 10,
      borderTop: "1px solid #f0f0f0",
    },
    center: { textAlign: "center" },
  };
  

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Admin · Cupones</h2>

        {err && <div style={styles.err}>{err}</div>}

        <section style={styles.card}>
          <h3 style={{ marginTop: 0 }}>Crear cupón</h3>
          <form onSubmit={onCreate}>
            <div style={styles.grid2}>
              <div style={styles.field}>
                <br></br>
                <label>Código</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label>Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={styles.select}
                >
                  <option value="ALL">ALL</option>
                  <option value="SOME">SOME</option>
                </select>
              </div>

              {type === "SOME" && (
                <div style={styles.field}>
                  <label>Product IDs (CSV)</label>
                  <input
                    value={productIds}
                    onChange={(e) => setProductIds(e.target.value)}
                    placeholder="1,2,3"
                    style={styles.input}
                  />
                </div>
              )}

              <div style={styles.field}>
                <label>Descuento (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discountPct}
                  onChange={(e) => setDiscountPct(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label>Activo</label>
                <br></br>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  style={styles.checkbox}
                />
              </div>
            </div>

            <div style={styles.actions}>
              <button type="submit" disabled={saving} style={styles.btnSolid}>
                {saving ? "Guardando..." : "Crear"}
              </button>
            </div>
          </form>
        </section>

        <section style={styles.card}>
          <h3 style={{ marginTop: 0 }}>Listado</h3>
          <br></br>
          {loading ? (
            <div>Cargando…</div>
          ) : items.length === 0 ? (
            <p>No hay cupones.</p>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Código</th>
                    <th style={{ ...styles.th, ...styles.center }}>Tipo</th>
                    <th style={{ ...styles.th, ...styles.center }}>IDs</th>
                    <th style={{ ...styles.th, ...styles.center }}>%</th>
                    <th style={{ ...styles.th, ...styles.center }}>Activo</th>
                    <th style={{ ...styles.th, ...styles.center }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c._id}>
                      <td style={styles.td}>{c.code}</td>
                      <td style={{ ...styles.td, ...styles.center }}>{c.type}</td>
                      <td style={{ ...styles.td, ...styles.center }}>
                        {(c.productIds || []).join(", ")}
                      </td>
                      <td style={{ ...styles.td, ...styles.center }}>
                        {c.discountPct}
                      </td>
                      <td style={{ ...styles.td, ...styles.center }}>
                        {c.active ? "Sí" : "No"}
                      </td>
                      <td style={{ ...styles.td, ...styles.center }}>
                        <button onClick={() => toggleActive(c)} style={styles.btnGhost}>
                          {c.active ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          onClick={() => onDelete(c)}
                          style={{ ...styles.btnDanger, marginLeft: 8 }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
