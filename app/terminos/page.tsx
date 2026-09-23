import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Términos y Condiciones" };

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/funnel" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 text-sm">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <h1 className="font-display text-4xl md:text-5xl mb-2 bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">Términos y Condiciones</h1>
        <p className="text-white/40 text-sm mb-10">Última actualización: Mayo 2026</p>

        <div className="prose prose-invert prose-purple max-w-none space-y-6 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-bold mb-3">1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar la plataforma Marketia (<strong>marketia.live</strong>), usted acepta estos Términos y Condiciones en su totalidad. Si no está de acuerdo con alguno de estos términos, le solicitamos no utilizar nuestros servicios.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">2. Descripción del Servicio</h2>
            <p>Marketia es una plataforma SaaS (Software as a Service) que permite a los usuarios crear, personalizar y gestionar embudos de ventas interactivos estilo TikTok. El servicio incluye:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Creación de embudos de ventas de hasta 19 pasos</li>
              <li>Personalización de contenido multimedia (videos, audios, imágenes)</li>
              <li>Captura y gestión de prospectos</li>
              <li>Panel de administración con analítica</li>
              <li>URL personalizada para cada usuario</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">3. Registro y Cuenta</h2>
            <p>Para utilizar los servicios de la Plataforma, usted debe crear una cuenta proporcionando información veraz y completa. Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">4. Suscripción y Pagos</h2>
            <p>El acceso a las funcionalidades completas de la Plataforma requiere una suscripción mensual activa. El precio vigente se muestra en la página de pago. Los pagos se realizan de forma mensual y no son reembolsables una vez procesados. La Plataforma se reserva el derecho de modificar los precios con previo aviso de 30 días.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">5. Uso Aceptable</h2>
            <p>Usted se compromete a utilizar la Plataforma únicamente para fines lícitos y de acuerdo con estos Términos. Queda prohibido:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Usar la plataforma para actividades ilegales, fraudulentas o engañosas</li>
              <li>Distribuir contenido que infrinja derechos de autor, marcas registradas u otros derechos de propiedad intelectual</li>
              <li>Intentar acceder de forma no autorizada a los sistemas o cuentas de otros usuarios</li>
              <li>Distribuir malware, virus u otro código malicioso</li>
              <li>Realizar spam o envío masivo de mensajes no solicitados a través de los embudos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">6. Propiedad Intelectual</h2>
            <p>Todo el contenido de la Plataforma (diseño, código, logotipos, textos) es propiedad de Marketia o sus licenciantes. El contenido que usted suba a la Plataforma (videos, imágenes, textos) seguirá siendo de su propiedad, otorgando a Marketia una licencia no exclusiva para alojarlo y mostrarlo como parte del servicio.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">7. Responsabilidad y Garantías</h2>
            <p>La Plataforma se proporciona &quot;tal cual&quot; sin garantías de ningún tipo, expresas o implícitas. Marketia no será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso de la Plataforma. No garantizamos resultados específicos de ventas o conversión.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">8. Suspensión y Terminación</h2>
            <p>Marketia se reserva el derecho de suspender o cancelar su cuenta si se detecta un incumplimiento de estos Términos, sin previo aviso y sin responsabilidad alguna. Usted puede cancelar su cuenta en cualquier momento contactando a soporte.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">9. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán efectivos desde su publicación en esta página. El uso continuado de la Plataforma después de los cambios constituye su aceptación de los mismos.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">10. Ley Aplicable</h2>
            <p>Estos Términos y Condiciones se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia derivada de estos términos será sometida a los tribunales competentes de la Ciudad de México.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">11. Contacto</h2>
            <p>Para cualquier consulta sobre estos Términos y Condiciones, puede contactarnos en: <a href="mailto:soporte@marketia.live" className="text-purple-400 hover:text-purple-300">soporte@marketia.live</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
