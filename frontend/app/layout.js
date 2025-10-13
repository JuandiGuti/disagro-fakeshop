// frontend/app/layout.js
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
        <main style={{ padding: "12px" }}>{children}</main>
      </body>
    </html>
  );
}
