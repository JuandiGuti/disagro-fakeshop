"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/services/coupons.admin";

export default function AdminCouponsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // Form nuevo cupón
  const [code, setCode] = useState("");
  const [type, setType] = useState("ALL"); // ALL | SOME
  const [productIds, setProductIds] = useState(""); // CSV "1,2,3"
  const [discountPct, setDiscountPct] = useState(10);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    setErr("");
    try {
      const data = await listCoupons();
      setItems(data);
    } catch (e) {
      // 401/403 => no autenticado/no autorizado
      if (
        /401|no autenticado|token inválido|403|no autorizado/i.test(String(e))
      ) {
        router.push("/login");
        return;
      }
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
      await createCoupon(payload);
      setCode("");
      setProductIds("");
      setDiscountPct(10);
      setType("ALL");
      setActive(true);
      await refresh();
    } catch (e) {
      setErr(e.message || "No se pudo crear");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(c) {
    try {
      await updateCoupon(c._id, { active: !c.active });
      await refresh();
    } catch (e) {
      setErr(e.message || "No se pudo actualizar");
    }
  }

  async function onDelete(c) {
    if (!confirm(`Eliminar cupón ${c.code}?`)) return;
    try {
      await deleteCoupon(c._id);
      await refresh();
    } catch (e) {
      setErr(e.message || "No se pudo eliminar");
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto" }}>
      <h2>Admin · Cupones</h2>
      {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}

      <section
        style={{
          border: "1px solid #ddd",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <h3>Crear cupón</h3>
        <form onSubmit={onCreate}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 12,
            }}
          >
            <div>
              <label>Código</label>
              <br />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Tipo</label>
              <br />
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="ALL">ALL</option>
                <option value="SOME">SOME</option>
              </select>
            </div>
            {type === "SOME" && (
              <div>
                <label>Product IDs (CSV)</label>
                <br />
                <input
                  value={productIds}
                  onChange={(e) => setProductIds(e.target.value)}
                  placeholder="1,2,3"
                />
              </div>
            )}
            <div>
              <label>Descuento (%)</label>
              <br />
              <input
                type="number"
                min={0}
                max={100}
                value={discountPct}
                onChange={(e) => setDiscountPct(e.target.value)}
              />
            </div>
            <div>
              <label>Activo</label>
              <br />
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Crear"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h3>Listado</h3>
        {loading ? (
          <div>Cargando…</div>
        ) : items.length === 0 ? (
          <p>No hay cupones.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Código</th>
                <th>Tipo</th>
                <th>IDs</th>
                <th>%</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c._id} style={{ borderTop: "1px solid #eee" }}>
                  <td>{c.code}</td>
                  <td style={{ textAlign: "center" }}>{c.type}</td>
                  <td style={{ textAlign: "center" }}>
                    {(c.productIds || []).join(", ")}
                  </td>
                  <td style={{ textAlign: "center" }}>{c.discountPct}</td>
                  <td style={{ textAlign: "center" }}>
                    {c.active ? "Sí" : "No"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button onClick={() => toggleActive(c)}>
                      {c.active ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      onClick={() => onDelete(c)}
                      style={{ marginLeft: 8 }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
