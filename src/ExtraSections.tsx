import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
  FileText,
  KeyRound,
  BellRing,
  BookOpen,
} from "lucide-react";
export function ExtraSections({
  openBank,
  showInfo,
}: {
  openBank: () => void;
  showInfo: (title: string, body: string) => void;
}) {
  return (
    <>
      <section id="canales" className="container section channels-section">
        <div className="section-intro">
          <div>
            <p className="eyebrow">A TU ALCANCE</p>
            <h2>
              Tu información.
              <br />A tu manera.
            </h2>
          </div>
          <p>
            Consulta, organiza y descarga lo que necesitas
            <br />
            desde nuestra banca por internet.
          </p>
        </div>
        <div className="channel-grid">
          <article>
            <Smartphone size={27} strokeWidth={1.4} />
            <h3>Banca por internet</h3>
            <p>
              Accede a tus productos, consulta el saldo de tu crédito y revisa
              los pagos registrados.
            </p>
            <button className="text-link" onClick={openBank}>
              Entrar a mi banca <ArrowRight size={16} />
            </button>
          </article>
          <article>
            <FileText size={27} strokeWidth={1.4} />
            <h3>Documentos a mano</h3>
            <p>
              Descarga el estado de tu crédito y el historial de pagos para
              organizar tu información.
            </p>
            <button className="text-link" onClick={openBank}>
              Consultar documentos <ArrowRight size={16} />
            </button>
          </article>
          <article>
            <BookOpen size={27} strokeWidth={1.4} />
            <h3>Información que orienta</h3>
            <p>
              Conoce los conceptos que aparecen en tus productos y aprende a
              leer tu estado de crédito.
            </p>
            <a className="text-link" href="#educacion">
              Ver la guía financiera <ArrowRight size={16} />
            </a>
          </article>
        </div>
      </section>
      <section id="seguridad" className="security-section">
        <div className="container security-layout">
          <div>
            <p className="eyebrow">SEGURIDAD DIGITAL</p>
            <h2>
              Tu tranquilidad
              <br />
              empieza contigo.
            </h2>
            <p>Hábitos sencillos para cuidar tu información.</p>
          </div>
          <div className="security-practices">
            {[
              {
                icon: KeyRound,
                title: "Tus claves son personales",
                text: "No compartas contraseñas ni códigos de acceso con otras personas.",
              },
              {
                icon: ShieldCheck,
                title: "Verifica antes de entrar",
                text: "Revisa la dirección del sitio y evita abrir enlaces de mensajes desconocidos.",
              },
              {
                icon: BellRing,
                title: "Presta atención a tus movimientos",
                text: "Consulta periódicamente tus registros y conserva tus estados de cuenta.",
              },
            ].map((p) => (
              <article key={p.title}>
                <p.icon size={23} strokeWidth={1.4} />
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="educacion" className="container section education-section">
        <div className="section-intro">
          <div>
            <p className="eyebrow">EDUCACIÓN FINANCIERA</p>
            <h2>
              Entender también
              <br />
              es avanzar.
            </h2>
          </div>
          <p>
            Una guía breve para leer mejor
            <br />
            la información de tu crédito.
          </p>
        </div>
        <div className="education-grid">
          {[
            {
              title: "Capital y saldo pendiente",
              category: "TU CRÉDITO",
              text: "El monto desembolsado es el capital original. El saldo de capital indica cuánto de ese monto queda por amortizar. No equivale necesariamente al total de cuotas por pagar, que puede incluir intereses y otros conceptos.",
            },
            {
              title: "Tasa, plazo y cuota",
              category: "ANTES DE DECIDIR",
              text: "El plazo es el número de meses del crédito. La cuota depende del monto, la tasa y las condiciones del producto. El simulador utiliza una TEA de referencia del 18 % y calcula cuotas constantes; seguros y comisiones no están incluidos.",
            },
            {
              title: "Cómo leer tus pagos",
              category: "TUS MOVIMIENTOS",
              text: "El historial presenta fecha, código y monto de los pagos registrados. El estado de crédito reúne los saldos y condiciones principales. Usa el filtro de periodo para revisar un mes y descarga el archivo para conservarlo.",
            },
          ].map((p, i) => (
            <button key={p.title} onClick={() => showInfo(p.title, p.text)}>
              <span className="education-number">0{i + 1}</span>
              <p className="eyebrow">{p.category}</p>
              <h3>{p.title}</h3>
              <span>
                Leer guía <ArrowUpRight size={16} />
              </span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
