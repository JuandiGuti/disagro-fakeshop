const { Resend } = require("resend");

let client;
function getClient() {
  if (!client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("Falta RESEND_API_KEY");
    client = new Resend(key);
  }
  return client;
}

function renderOrderHtml(order) {
  const rows = (order.items || [])
    .map(
      (it) => `<tr>
      <td>${it.title}</td>
      <td style="text-align:right">${it.qty}</td>
      <td style="text-align:right">$${Number(it.price).toFixed(2)}</td>
      <td style="text-align:right">$${Number(it.price * it.qty).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  const coupon = order.couponCode
    ? `<p>Cupón aplicado: <b>${order.couponCode}</b></p>`
    : "";

  return `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif">
    <h2>¡Gracias por tu compra!</h2>
    <p>Tu pedido <b>${order._id}</b> ha sido confirmado.</p>
    ${coupon}
    <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;border:1px solid #eee">
      <thead>
        <tr style="background:#fafafa">
          <th style="text-align:left">Producto</th>
          <th style="text-align:right">Cant</th>
          <th style="text-align:right">Precio</th>
          <th style="text-align:right">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="text-align:right;font-size:16px;margin-top:12px">
      Total pagado: <b>$${Number(order.total).toFixed(2)}</b>
    </p>
  </div>`;
}
async function sendOrderConfirmation({ to, order }) {
  const resend = getClient();
  const html = renderOrderHtml(order);
  const from =
    process.env.MAIL_FROM || "Disagro Fakeshop <onboarding@resend.dev>";
  const cc = process.env.MAIL_CC_ADMIN;

  const payload = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject: `Pedido confirmado #${order._id}`,
    html,
    ...(cc ? { cc } : {}),
  };

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    const errMsg =
      error.message ||
      (typeof error === "string" ? error : JSON.stringify(error));
    return { ok: false, error: errMsg };
  }
  return { ok: true, data };
}

module.exports = { sendOrderConfirmation };
