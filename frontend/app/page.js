//final
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "20px 100px" }}>
      <h1>Disagro FakeShop</h1>
      <div style={{ padding: "8px" }} />
      <p>
        Ir hacia
        <Link
          href="/products"
          style={{
            border: "1px solid #ddd",
            padding: "4px 8px",
            borderRadius: 6,
            background: "#ddd",
            color: "#000000ff",
          }}
        >
          Productos
        </Link>
      </p>
    </div>
  );
}
