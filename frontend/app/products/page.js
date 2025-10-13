export const dynamic = "force-dynamic";
import Image from "next/image";

async function fetchProducts() {
  const res = await fetch("https://fakestoreapi.com/products", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Error cargando productos");
  return res.json();
}

export default async function ProductsPage() {
  const products = await fetchProducts();
  return (
    <div style={{ padding: "20px 100px" }}>
      <h2>Productos</h2>
      <div style={{ padding: "15px" }}></div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 16,
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        background: "#ddd",
        color: "#000000ff",
      }}
    >
      <h4 style={{ margin: "8px 0" }}>{product.title}</h4>
      <div>${product.price.toFixed(2)}</div>

      <div style={{ padding: "10px" }} />

      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
        }}
      >
        <Image
          src={product.image}
          alt={product.title || "Producto"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: "contain", padding: "20px" }}
        />
      </div>
      <a
        href={`/cart?add=${encodeURIComponent(
          JSON.stringify({
            productId: product.id,
            title: product.title,
            price: product.price,
            qty: 1,
          })
        )}`}
        style={{
          marginTop: "auto",
          display: "inline-block",
          textAlign: "center",
          border: "2px solid #000000ff",
          background: "#000000ff",
          padding: "8px 12px",
          borderRadius: 6,
          color: "#ddd",
          textDecoration: "none",
        }}
      >
        Agregar al carrito
      </a>
    </div>
  );
}
