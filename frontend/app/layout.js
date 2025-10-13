import { CartProvider } from "@/store/CartContext";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Disagro Fakeshop",
  description: "Demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <NavBar />
        <CartProvider>
          <main style={{ padding: "12px" }}>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
