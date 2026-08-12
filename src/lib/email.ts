import nodemailer from "nodemailer";
import { formatInr } from "@/lib/money";

function getFromAddress() {
  const fromEmail = process.env.SMTP_FROM || "hello@skynsoul.com";
  return `Sky n Soul <${fromEmail}>`;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

type OrderEmailData = {
  id: string;
  orderNumber: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
};

export async function sendOrderConfirmationEmail(
  order: OrderEmailData,
  userEmail: string,
  userName: string,
) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured — skipping order emails");
    return { success: false, skipped: true };
  }

  try {
    const transporter = createTransporter();
    const from = getFromAddress();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const orderUrl = `${appUrl}/orders/${order.id}`;

    const itemRows = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.productName} × ${item.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatInr(item.total)}</td>
          </tr>`,
      )
      .join("");

    const customerHtml = `
      <div style="font-family:Georgia,serif;padding:24px;color:#4b3222;max-width:560px;">
        <h2 style="color:#80592C;font-weight:500;">Thank you for your order</h2>
        <p>Hello ${userName || "there"},</p>
        <p>Your Sky n Soul order <strong>${order.orderNumber}</strong> is confirmed.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;">${itemRows}</table>
        <p>Subtotal: ${formatInr(order.subtotal)}<br/>
        ${order.discount > 0 ? `Discount: −${formatInr(order.discount)}<br/>` : ""}
        Shipping: ${order.shippingFee === 0 ? "Free" : formatInr(order.shippingFee)}<br/>
        <strong>Total: ${formatInr(order.total)}</strong></p>
        <p>Shipping to:<br/>
        ${order.shippingName}<br/>
        ${order.shippingAddress}<br/>
        ${order.shippingCity}, ${order.shippingState} ${order.shippingPincode}<br/>
        ${order.shippingPhone}</p>
        <p><a href="${orderUrl}" style="color:#80592C;">View your order</a></p>
        <p style="color:#889A6F;">With love,<br/>Sky n Soul</p>
      </div>
    `;

    const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
    const results = await Promise.allSettled([
      transporter.sendMail({
        from,
        to: userEmail,
        subject: `Order confirmed — ${order.orderNumber}`,
        html: customerHtml,
      }),
      ...(adminEmail
        ? [
            transporter.sendMail({
              from,
              to: adminEmail,
              subject: `New order ${order.orderNumber}`,
              html: `
                <div style="font-family:Arial,sans-serif;padding:20px;color:#4b3222;">
                  <h2>New paid order</h2>
                  <p><strong>${order.orderNumber}</strong> · ${formatInr(order.total)}</p>
                  <p>Customer: ${userName} (${userEmail})</p>
                  <p><a href="${orderUrl}">Open order</a></p>
                </div>
              `,
            }),
          ]
        : []),
    ]);

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to send order email (${index === 0 ? "customer" : "admin"}):`,
          result.reason,
        );
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending order emails:", error);
    return { success: false, error };
  }
}
