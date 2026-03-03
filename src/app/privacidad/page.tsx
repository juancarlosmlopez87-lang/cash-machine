import { SITE } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidad",
};

export default function Privacidad() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose">
      <h1>Politica de Privacidad</h1>
      <p><strong>Ultima actualizacion:</strong> Marzo 2026</p>

      <h2>Responsable del tratamiento</h2>
      <p>
        {SITE.name} ({SITE.url}) es un sitio web de guias de compra y comparativas de productos.
        El responsable del tratamiento de los datos es el titular del sitio.
      </p>

      <h2>Datos que recopilamos</h2>
      <p>Este sitio web puede recopilar los siguientes datos de forma automatica:</p>
      <ul>
        <li>Direccion IP (anonimizada)</li>
        <li>Tipo de navegador y dispositivo</li>
        <li>Paginas visitadas y tiempo de permanencia</li>
        <li>Fuente de trafico (como llegaste al sitio)</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Utilizamos cookies propias y de terceros para mejorar la experiencia del usuario,
        analizar el trafico y mostrar publicidad personalizada a traves de Google AdSense.
      </p>
      <p>
        Google utiliza cookies como la cookie DART para mostrar anuncios basados en las visitas
        del usuario a este y otros sitios de Internet. Los usuarios pueden inhabilitar el uso
        de la cookie DART en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">
        configuracion de anuncios de Google</a>.
      </p>

      <h2>Google AdSense y publicidad</h2>
      <p>
        Este sitio utiliza Google AdSense, un servicio de publicidad de Google LLC.
        Google AdSense utiliza cookies para mostrar anuncios relevantes. Para mas informacion
        sobre como Google utiliza los datos, visita{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
          la politica de privacidad de Google
        </a>.
      </p>

      <h2>Enlaces de afiliado</h2>
      <p>
        {SITE.name} participa en el Programa de Afiliados de Amazon EU, un programa de
        publicidad para afiliados diseñado para ofrecer a sitios web un modo de obtener
        comisiones por publicidad, publicitando e incluyendo enlaces a Amazon.es.
      </p>
      <p>
        Cuando haces clic en un enlace de afiliado y realizas una compra, recibimos una
        pequena comision sin coste adicional para ti.
      </p>

      <h2>Derechos del usuario</h2>
      <p>De acuerdo con el RGPD, tienes derecho a:</p>
      <ul>
        <li>Acceder a tus datos personales</li>
        <li>Rectificar datos inexactos</li>
        <li>Solicitar la eliminacion de tus datos</li>
        <li>Oponerte al tratamiento de tus datos</li>
        <li>Solicitar la portabilidad de tus datos</li>
      </ul>

      <h2>Contacto</h2>
      <p>
        Para ejercer tus derechos o cualquier consulta relacionada con la privacidad,
        contacta con nosotros en: <strong>juancarlosmlopez87@gmail.com</strong>
      </p>
    </div>
  );
}
