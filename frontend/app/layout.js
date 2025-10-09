export const metadata = {
  title: "Disagro FakeShop",
  description: "Prueba técnica",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <header
          style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}
        >
          <nav style={{ display: "flex", gap: 12 }}>
            <link href="/">Inicio</link>
            <link href="/products">Productos</link>
            <link href="/cart">Carrito</link>
            <link href="/orders">Pedidos</link>
          </nav>
        </header>
        <main style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
