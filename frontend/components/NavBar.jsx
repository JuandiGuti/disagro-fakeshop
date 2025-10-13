'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { me, logout } from '@/services/auth';
import { onAuthChanged, emitAuthChanged } from '@/lib/authBus';

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [err, setErr] = useState('');
  const router = useRouter();

  async function loadMe() {
    try { setUser(await me()); }
    finally { setChecking(false); }
  }

  useEffect(() => {
    setChecking(true);
    loadMe();
    const off = onAuthChanged(() => { setChecking(true); loadMe(); });
    return off;
  }, []);

  async function handleLogout() {
    setErr('');
    try {
      await logout();
      emitAuthChanged();
      router.push('/');
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
            <span>
            <Link href="/orders" style={{border:'1px solid #ddd', padding:'4px 8px', borderRadius:6}}>Mis órdenes</Link>
            </span>
            <button onClick={handleLogout} style={{border:'2px solid #ddd', background: '#ddd', padding: '4px 8px', borderRadius:6, color: '#000000ff'}}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{border:'1px solid #ddd', padding:'4px 8px', borderRadius:6}}>
              Login
            </Link>
            <Link href="/register" style={{border:'1px solid #ddd', padding:'4px 8px', borderRadius:6, background: '#ddd', color: '#000000ff'}}>
              Register
            </Link>
          </>
        )}
      </div>

      {err && <div style={{position:'absolute', right:12, top:56, color:'crimson'}}>{err}</div>}
    </header>
  );
}
