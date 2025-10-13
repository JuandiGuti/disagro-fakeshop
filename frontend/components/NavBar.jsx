'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { me, logout } from '@/services/auth';

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await me();
        if (mounted) setUser(u);
      } catch (e) {
        // no-op
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function handleLogout() {
    setErr('');
    try {
      await logout();
      setUser(null);
      // opcional: window.location.href = '/';
    } catch (e) {
      setErr(e.message || 'No se pudo cerrar sesión');
    }
  }

  return (
    <header style={{
      borderBottom:'1px solid #eee', padding:'8px 12px',
      display:'flex', alignItems:'center', justifyContent:'space-between'
    }}>
      <div style={{display:'flex', gap:12}}>
        <Link href="/">Inicio</Link>
        <Link href="/products">Productos</Link>
        <Link href="/cart">Carrito</Link>
        <Link href="/orders">Mis órdenes</Link>
      </div>

      <div style={{display:'flex', alignItems:'center', gap:8}}>
        {checking ? (
          <span>Cargando…</span>
        ) : user ? (
          <>
            <span style={{fontSize:12, opacity:.7}}>
              {user.email} · {user.role}
            </span>
            {user.role === 'admin' && (
              <Link href="/admin/coupons" style={{border:'1px solid #ddd', padding:'4px 8px', borderRadius:6}}>
                Administrar cupones
              </Link>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{border:'1px solid #ddd', padding:'4px 8px', borderRadius:6}}>
              Login
            </Link>
            <Link href="/register" style={{border:'1px solid #ddd', padding:'4px 8px', borderRadius:6}}>
              Register
            </Link>
          </>
        )}
      </div>

      {err && <div style={{position:'absolute', right:12, top:56, color:'crimson'}}>{err}</div>}
    </header>
  );
}
