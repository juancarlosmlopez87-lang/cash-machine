"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Te has suscrito correctamente.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Ha ocurrido un error. Intentalo de nuevo.");
      }
    } catch {
      setStatus("error");
      setMessage("Error de conexion. Intentalo de nuevo.");
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-8 my-10">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-amber-400 font-black text-sm uppercase tracking-widest mb-2">
          Newsletter
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white mb-2">
          Recibe las mejores ofertas en tu email
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Cada semana te enviamos las mejores ofertas y comparativas de Amazon.
          Sin spam, solo chollos.
        </p>

        {status === "success" ? (
          <div className="bg-green-900/50 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-bold">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-black font-bold px-6 py-3 rounded-lg transition shrink-0"
            >
              {status === "loading" ? "Enviando..." : "Suscribirme"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-400 text-sm mt-3">{message}</p>
        )}

        <p className="text-gray-600 text-xs mt-4">
          Puedes darte de baja en cualquier momento. Respetamos tu privacidad.
        </p>
      </div>
    </div>
  );
}
