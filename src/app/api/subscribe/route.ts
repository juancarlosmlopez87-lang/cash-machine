import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "subscribers.json");

interface Subscriber {
  email: string;
  subscribedAt: string;
}

function readSubscribers(): Subscriber[] {
  try {
    if (!fs.existsSync(SUBSCRIBERS_FILE)) return [];
    const raw = fs.readFileSync(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(raw) as Subscriber[];
  } catch {
    return [];
  }
}

function writeSubscribers(subscribers: Subscriber[]): void {
  const dir = path.dirname(SUBSCRIBERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email no valido." },
        { status: 400 },
      );
    }

    const subscribers = readSubscribers();

    // Check duplicate
    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json(
        { message: "Ya estas suscrito. Gracias por tu interes." },
        { status: 200 },
      );
    }

    // Add subscriber
    subscribers.push({
      email,
      subscribedAt: new Date().toISOString(),
    });
    writeSubscribers(subscribers);

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
