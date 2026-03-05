import { NextRequest, NextResponse } from "next/server";

// In-memory dedup for the current instance (best-effort on Vercel)
const recentEmails = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email no valido." },
        { status: 400 },
      );
    }

    // Best-effort dedup within same instance
    if (recentEmails.has(email)) {
      return NextResponse.json(
        { message: "Ya estas suscrito. Gracias por tu interes." },
        { status: 200 },
      );
    }

    // Notify admin via Telegram (persistent storage)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const text = `📬 Nuevo subscriber TopActual\n\nEmail: ${email}\nFecha: ${new Date().toISOString()}`;
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      }).catch(() => {});
    }

    recentEmails.add(email);

    return NextResponse.json(
      { message: "Suscripcion confirmada. Recibiras las mejores ofertas." },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Error interno. Intentalo de nuevo." },
      { status: 500 },
    );
  }
}
