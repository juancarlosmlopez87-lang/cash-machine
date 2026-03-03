import { SITE } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
};

export default function Contacto() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-6">Contacto</h1>

      <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
        <p className="text-gray-700 mb-6">
          ¿Tienes alguna pregunta, sugerencia o quieres colaborar con {SITE.name}?
          Estamos encantados de escucharte.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Email</h3>
            <a
              href="mailto:juancarlosmlopez87@gmail.com"
              className="text-blue-600 hover:text-blue-800"
            >
              juancarlosmlopez87@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-xl p-8 border border-blue-100">
        <h2 className="text-xl font-bold mb-3">Sobre {SITE.name}</h2>
        <p className="text-gray-700">
          {SITE.name} es un sitio independiente de guias de compra y comparativas de productos.
          Analizamos cientos de opciones del mercado para recomendarte solo lo mejor,
          con informacion actualizada y honesta. Nuestro objetivo es ayudarte a tomar
          la mejor decision de compra posible.
        </p>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>
          Nota: {SITE.name} participa en el Programa de Afiliados de Amazon EU.
          Al comprar a traves de nuestros enlaces, recibimos una pequena comision
          sin coste adicional para ti.
        </p>
      </div>
    </div>
  );
}
