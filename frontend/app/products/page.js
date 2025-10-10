export const dynamic = "force-dynamic";

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
    <div>
      <h2>Productos</h2>
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
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h4 style={{ margin: "8px 0" }}>{product.title}</h4>
      <div>${product.price.toFixed(2)}</div>
      <a
        href={`/cart?add=${encodeURIComponent(
          JSON.stringify({
            productId: product.id,
            title: product.title,
            price: product.price,
            qty: 1,
          })
        )}`}
        style={{ display: "inline-block", marginTop: 8 }}
      >
        Agregar al carrito
      </a>
    </div>
  );
}
