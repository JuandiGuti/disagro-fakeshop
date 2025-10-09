import { CartProvider } from "@/store/CartContext";

/* eslint-disable @next/next/no-html-link-for-pages */
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
            <a href="/">Inicio</a>
            <a href="/products">Productos</a>
            <a href="/cart">Carrito</a>
            <a href="/orders">Pedidos</a>
          </nav>
        </header>
        <CartProvider>
          <main style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
