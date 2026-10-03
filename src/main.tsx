import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  HelpCircle,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
  CreditCard,
  BriefcaseBusiness,
  ArrowLeft,
} from "lucide-react";
import { client, money, date } from "./data";
import "./styles.css";

const movements = ["09", "08", "07", "06", "05", "04"].map((month, i) => ({
  id: `OP-${1001 + i}`,
  title: "Pago de cuota",
  description: "Emprendiendo confianza",
  date: `2026-${month}-15`,
  amount: 925,
}));
const products = [
  {
    name: "Cuenta Crecer",
    tag: "PARA TU DÍA A DÍA",
    icon: Wallet,
    description: "Un lugar para tus ahorros. Un comienzo para tus planes.",
    detail:
      "La Cuenta Crecer representa nuestra propuesta de ahorro personal. En este sitio de demostración puedes conocer el producto; la apertura de cuentas y las condiciones comerciales no están habilitadas.",
    action: "Conocer la cuenta",
  },
  {
    name: "Crédito personal",
    tag: "PARA TUS PROYECTOS",
    icon: CreditCard,
    description: "Ese siguiente paso que quieres dar, más cerca de ti.",
    detail:
      "Explora cómo el monto y el plazo afectan una cuota mensual con nuestro simulador ilustrativo. La tasa utilizada es ficticia y no constituye una oferta de crédito.",
    action: "Explorar el crédito",
  },
  {
    name: "Crédito emprendedor",
    tag: "PARA TU NEGOCIO",
    icon: BriefcaseBusiness,
    description: "Impulsa lo que construyes con esfuerzo, todos los días.",
    detail:
      "Emprendiendo confianza es el producto de ejemplo que puedes consultar en nuestra banca personal. Su ficha muestra monto, plazo, saldo y pagos registrados. El sitio no recibe solicitudes de financiación.",
    action: "Conocer más",
  },
];
const faqs = [
  [
    "¿Cómo puedo entrar a la banca por internet?",
    "Selecciona Banca por internet y luego Explorar banca personal. Accederás al perfil ficticio de Mariana Torres. No necesitas ingresar documentos, contraseñas ni información personal.",
  ],
  [
    "¿Puedo abrir una cuenta o solicitar un crédito?",
    "Este proyecto es una experiencia de demostración. Puedes conocer los productos y simular una cuota, pero no abrir cuentas, solicitar créditos ni realizar transacciones.",
  ],
  [
    "¿Qué información puedo consultar en mi banca?",
    "La banca personal de ejemplo permite revisar un crédito, su saldo de capital y el historial de pagos, además de descargar un estado de crédito con datos ficticios.",
  ],
  [
    "¿La cuota del simulador es una oferta bancaria?",
    "No. El cálculo usa una tasa efectiva anual ficticia del 18 %, sin seguros ni comisiones. Es un ejercicio ilustrativo, no una cotización ni una oferta de financiación.",
  ],
];
function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={"logo " + (light ? "logo-light" : "")}>
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <path
          d="M31 8a16 16 0 1 0 0 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          d="M22 15a9 9 0 1 0 0 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M27 25 37 15m-8 0h8v8"
          fill="none"
          stroke="#b18b4a"
          strokeWidth="3"
        />
      </svg>
      <span>
        <strong>CRECER</strong>
        <small>B A N C O</small>
      </span>
    </span>
  );
}
function App() {
  const [route, setRoute] = useState(
    location.hash === "#banca" || location.hash === "#acceso"
      ? "acceso"
      : "inicio",
  );
  const [mobileMenu, setMobileMenu] = useState(false),
    [modal, setModal] = useState<{ title: string; body: string } | null>(null),
    [bankTab, setBankTab] = useState("Mis productos"),
    [hidden, setHidden] = useState(false),
    [amount, setAmount] = useState(15000),
    [months, setMonths] = useState(24),
    [toast, setToast] = useState(""),
    [period, setPeriod] = useState("Todos");
  const dialog = useRef<HTMLDialogElement>(null),
    demoSession = useRef(false);
  useEffect(() => {
    const onHash = () => {
      const hash = location.hash;
      if (hash === "#contenido") return;
      setRoute(
        hash === "#banca" && demoSession.current
          ? "banca"
          : hash === "#acceso" || hash === "#banca"
            ? "acceso"
            : "inicio",
      );
      setMobileMenu(false);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    if (modal) dialog.current?.showModal();
    else dialog.current?.close();
  }, [modal]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const navigate = (next: string) => {
    setToast("");
    setRoute(next);
    setMobileMenu(false);
    location.hash =
      next === "inicio" ? "inicio" : next === "banca" ? "banca" : "acceso";
    window.scrollTo({ top: 0 });
  };
  const enter = () => {
    demoSession.current = true;
    setPeriod("Todos");
    setHidden(false);
    setBankTab("Mis productos");
    navigate("banca");
  };
  const leave = () => {
    demoSession.current = false;
    setHidden(false);
    navigate("inicio");
  };
  useEffect(() => {
    document.title =
      route === "banca"
        ? "Mi banca | Banco Crecer"
        : route === "acceso"
          ? "Banca por internet | Banco Crecer"
          : "Banco Crecer | Un buen comienzo";
    if (
      route === "inicio" &&
      ["#productos", "#simulador", "#nosotros", "#negocios", "#ayuda"].includes(
        location.hash,
      )
    )
      document.querySelector(location.hash)?.scrollIntoView();
  }, [route]);
  const monthlyRate = Math.pow(1.18, 1 / 12) - 1;
  const installment =
    (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const filteredMovements = movements.filter(
    (m) => period === "Todos" || m.date.startsWith(period),
  );
  const exportStatement = () => {
    const rows = [
      ["Estado de crédito - DEMOSTRACIÓN"],
      ["Cliente", client.name],
      ["Crédito", client.id],
      ["Producto", client.product],
      ["Monto desembolsado PEN", client.amount],
      ["Saldo capital PEN", client.balance],
      ["Saldo vencido PEN", client.overdue],
      ["Plazo meses", client.months],
      [],
      ["Operación", "Fecha", "Concepto", "Pago PEN"],
      ...filteredMovements.map((m) => [m.id, m.date, m.title, m.amount]),
    ];
    const csv =
      "\uFEFF" +
      rows
        .map((r) =>
          r.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
        )
        .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "crecer-estado-de-credito-demo.csv";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Tu estado de crédito se descargó correctamente.");
  };
  const helpModal = () =>
    setModal({
      title: "Estamos para orientarte",
      body: "Puedes encontrar respuestas en la sección de preguntas frecuentes del sitio. Esta experiencia de demostración no cuenta con asesores ni canales de atención bancaria operativos. No compartas documentos, claves ni datos personales.",
    });
  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      {route !== "banca" && (
        <div className="utility">
          <div className="container utility-inner">
            <div>
              <a
                className="utility-active"
                href="#inicio"
                onClick={() => navigate("inicio")}
              >
                Personas
              </a>
              <a
                href="#negocios"
                onClick={() => {
                  setRoute("inicio");
                  setMobileMenu(false);
                }}
              >
                Negocios
              </a>
            </div>
            <button onClick={helpModal}>
              <HelpCircle size={13} /> Atención y ayuda
            </button>
          </div>
        </div>
      )}
      <header className="header">
        <div className="container nav-inner">
          <a
            href="#inicio"
            aria-label="Banco Crecer, inicio"
            onClick={() => navigate("inicio")}
          >
            <Logo />
          </a>
          {route === "inicio" ? (
            <>
              <nav
                className={"public-nav " + (mobileMenu ? "expanded" : "")}
                aria-label="Navegación principal"
              >
                <a href="#productos" onClick={() => setMobileMenu(false)}>
                  Nuestros productos
                </a>
                <a href="#simulador" onClick={() => setMobileMenu(false)}>
                  Simula tu crédito
                </a>
                <a href="#nosotros" onClick={() => setMobileMenu(false)}>
                  El banco
                </a>
                <a href="#ayuda" onClick={() => setMobileMenu(false)}>
                  Ayuda
                </a>
              </nav>
              <div className="nav-actions">
                <button
                  className="button primary access-button"
                  onClick={() => navigate("acceso")}
                >
                  <LockKeyhole size={15} /> Banca por internet{" "}
                  <ArrowUpRight size={15} />
                </button>
                <button
                  className="icon-button menu-button"
                  aria-label={mobileMenu ? "Cerrar menú" : "Abrir menú"}
                  aria-expanded={mobileMenu}
                  onClick={() => setMobileMenu(!mobileMenu)}
                >
                  {mobileMenu ? <X /> : <Menu />}
                </button>
              </div>
            </>
          ) : route === "banca" ? (
            <>
              <nav className="bank-nav" aria-label="Banca personal">
                {["Mis productos", "Movimientos", "Mi crédito"].map((t) => (
                  <button
                    key={t}
                    aria-current={bankTab === t ? "page" : undefined}
                    className={bankTab === t ? "active" : ""}
                    onClick={() => setBankTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </nav>
              <button className="logout" onClick={leave}>
                Salir <ArrowUpRight size={15} />
              </button>
            </>
          ) : (
            <button className="back-link" onClick={() => navigate("inicio")}>
              <ArrowLeft size={15} /> Volver al inicio
            </button>
          )}
        </div>
      </header>
      {route === "inicio" ? (
        <main id="contenido">
          <section className="hero">
            <div className="container hero-layout">
              <div className="hero-copy">
                <p className="eyebrow">
                  <span /> LO QUE IMPORTA, CRECE CONTIGO
                </p>
                <h1>
                  Tu futuro merece
                  <br />
                  un buen <em>comienzo.</em>
                </h1>
                <p className="hero-description">
                  Tus proyectos. Tu familia. Ese negocio que sueñas.
                  <br className="desktop-break" /> Estamos aquí para acompañar
                  tu siguiente paso.
                </p>
                <div className="hero-actions">
                  <a className="button primary" href="#productos">
                    Encuentra tu producto <ArrowRight size={17} />
                  </a>
                  <a className="hero-secondary" href="#nosotros">
                    Conoce Banco Crecer <ArrowUpRight size={15} />
                  </a>
                </div>
                <div className="hero-note">
                  <span className="fine-line" />
                  <p>
                    Una banca más cercana.
                    <br />
                    <strong>Para lo que de verdad importa.</strong>
                  </p>
                </div>
              </div>
              <div className="hero-image">
                <img
                  src={import.meta.env.BASE_URL + "images/familia.jpg"}
                  alt="Familia compartiendo un momento al aire libre"
                  fetchPriority="high"
                />
                <div className="image-caption">
                  <span>HOY ES UN BUEN DÍA</span>
                  <strong>para empezar a crecer.</strong>
                </div>
                <span className="photo-index">01 / CRECER CONTIGO</span>
              </div>
            </div>
          </section>
          <div className="service-strip">
            <div className="container service-items">
              <a href="#productos">
                <Wallet size={24} />
                <span>
                  Cuentas y ahorro<small>Un espacio para tus planes</small>
                </span>
                <ChevronRight size={16} />
              </a>
              <a href="#simulador">
                <CreditCard size={24} />
                <span>
                  Créditos personales
                  <small>Haz posible tu siguiente paso</small>
                </span>
                <ChevronRight size={16} />
              </a>
              <a href="#negocios">
                <BriefcaseBusiness size={24} />
                <span>
                  Para tu negocio
                  <small>Ideas que se convierten en futuro</small>
                </span>
                <ChevronRight size={16} />
              </a>
              <button onClick={() => navigate("acceso")}>
                <Smartphone size={24} />
                <span>
                  Banca por internet<small>Tu información, a tu alcance</small>
                </span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <section
            id="productos"
            className="section container products-section"
          >
            <div className="section-intro">
              <div>
                <p className="eyebrow">PERSONAS Y POSIBILIDADES</p>
                <h2>
                  Hay un producto para
                  <br />
                  cada próximo paso.
                </h2>
              </div>
              <p>
                Conoce nuestras propuestas para cuidar tus ahorros
                <br className="desktop-break" /> y acompañar los proyectos que
                tienes en mente.
              </p>
            </div>
            <div className="product-grid">
              {products.map((p, i) => (
                <article className="product" key={p.name}>
                  <div className="product-top">
                    <span className="product-icon">
                      <p.icon size={27} strokeWidth={1.4} />
                    </span>
                    <span className="product-number">0{i + 1}</span>
                  </div>
                  <p className="eyebrow">{p.tag}</p>
                  <h3>{p.name}</h3>
                  <p className="product-description">{p.description}</p>
                  <button
                    onClick={() => setModal({ title: p.name, body: p.detail })}
                  >
                    {p.action} <ArrowRight size={17} />
                  </button>
                </article>
              ))}
            </div>
          </section>
          <section id="simulador" className="simulator-section">
            <div className="container simulator-layout">
              <div className="simulator-copy">
                <p className="eyebrow">EMPIEZA CON UNA IDEA CLARA</p>
                <h2>
                  Imagina tu proyecto.
                  <br />
                  <em>
                    Nosotros hacemos
                    <br />
                    los números.
                  </em>
                </h2>
                <p>
                  Explora una cuota mensual de referencia.
                  <br />
                  Ajusta el monto y encuentra el plazo que quieres conocer.
                </p>
                <div className="calculation-note">
                  <ShieldCheck size={21} />
                  <p>
                    Simulación ilustrativa.
                    <br />
                    <strong>Sin solicitudes ni datos personales.</strong>
                  </p>
                </div>
              </div>
              <form
                className="calculator"
                onSubmit={(e) => {
                  e.preventDefault();
                  setModal({
                    title: "Tu simulación de crédito",
                    body: `Para un monto de ${money(amount)} a ${months} meses, la cuota ilustrativa es ${money(installment)} al mes. Total estimado: ${money(installment * months)}. Tasa efectiva anual ficticia: 18 %. No incluye seguros ni comisiones. Esta simulación no es una oferta de financiación.`,
                  });
                }}
              >
                <div className="calculator-title">
                  <span>Simula tu crédito personal</span>
                  <span className="small-tag">PEN</span>
                </div>
                <label className="field-label" htmlFor="amount">
                  ¿Cuánto tienes en mente?
                </label>
                <div className="amount-input">
                  <span>S/</span>
                  <input
                    id="amount"
                    type="number"
                    min="1000"
                    max="80000"
                    step="500"
                    value={amount}
                    required
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <input
                  aria-label="Ajustar monto"
                  className="amount-range"
                  type="range"
                  min="1000"
                  max="80000"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <div className="range-labels">
                  <span>S/ 1.000</span>
                  <span>S/ 80.000</span>
                </div>
                <label className="field-label" htmlFor="months">
                  ¿En cuánto tiempo?
                </label>
                <div className="select-wrap">
                  <select
                    id="months"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                  >
                    {[12, 18, 24, 36, 48].map((m) => (
                      <option value={m} key={m}>
                        {m} meses
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </div>
                <div className="installment">
                  <span>Cuota mensual estimada</span>
                  <output aria-live="polite">
                    {amount >= 1000 && amount <= 80000
                      ? money(installment)
                      : "—"}
                  </output>
                </div>
                <button className="button primary" type="submit">
                  Ver mi simulación <ArrowRight size={17} />
                </button>
                <p className="calculator-disclaimer">
                  TEA ficticia de 18 %. No incluye seguros ni comisiones.
                  Cálculo referencial, sin carácter de oferta comercial.
                </p>
              </form>
            </div>
          </section>
          <section id="nosotros" className="section container about-section">
            <div className="about-mark" aria-hidden="true">
              <Logo />
              <span>
                Un banco.
                <br />
                Muchas posibilidades.
              </span>
              <div className="mark-line" />
            </div>
            <div className="about-copy">
              <p className="eyebrow">NUESTRA FORMA DE VER LA BANCA</p>
              <h2>
                La confianza se construye.
                <br />
                Paso a paso.
              </h2>
              <p>
                Creemos en una banca que empieza por las personas. En el valor
                de escuchar, en las ideas que merecen una oportunidad y en los
                pequeños pasos que hacen una gran diferencia.
              </p>
              <div className="principles">
                <div>
                  <span>01</span>
                  <h3>Claridad</h3>
                  <p>Información que puedes entender.</p>
                </div>
                <div>
                  <span>02</span>
                  <h3>Cercanía</h3>
                  <p>Una experiencia pensada para ti.</p>
                </div>
                <div>
                  <span>03</span>
                  <h3>Propósito</h3>
                  <p>Tus proyectos en el centro.</p>
                </div>
              </div>
            </div>
          </section>
          <section id="negocios" className="container business-section">
            <div>
              <p className="eyebrow">PARA QUIENES CONSTRUYEN</p>
              <h2>
                Tu negocio tiene una historia.
                <br />
                Que siga creciendo.
              </h2>
              <p>
                Conoce Emprendiendo confianza, nuestra propuesta de crédito para
                negocios.
              </p>
            </div>
            <button
              className="button light-button"
              onClick={() =>
                setModal({
                  title: "Emprendiendo confianza",
                  body: products[2].detail,
                })
              }
            >
              Conocer el producto <ArrowUpRight size={17} />
            </button>
          </section>
          <section id="ayuda" className="section container faq-section">
            <div>
              <p className="eyebrow">ESTAMOS CERCA</p>
              <h2>
                Resolvamos
                <br />
                tus dudas.
              </h2>
              <p>
                Información clara para explorar
                <br />
                esta experiencia bancaria.
              </p>
            </div>
            <div className="faq-list">
              {faqs.map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <ChevronDown size={17} />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
      ) : route === "acceso" ? (
        <main id="contenido" className="access-page container">
          <div className="access-copy">
            <p className="eyebrow">BANCA POR INTERNET</p>
            <h1>
              Tu banco.
              <br />
              <em>Donde tú estés.</em>
            </h1>
            <p>
              Consulta tus productos y pagos desde un espacio personal, claro y
              sencillo.
            </p>
            <div className="access-features">
              <span>
                <Wallet size={19} /> Tus productos en un solo lugar
              </span>
              <span>
                <Download size={19} /> Estados de crédito descargables
              </span>
              <span>
                <Eye size={19} /> Control sobre la visualización de saldos
              </span>
            </div>
          </div>
          <section className="access-card">
            <span className="access-icon">
              <LockKeyhole size={27} strokeWidth={1.4} />
            </span>
            <h2>Bienvenido a tu banca</h2>
            <p>Explora la experiencia con un perfil de ejemplo.</p>
            <div className="demo-user">
              <span>MT</span>
              <div>
                <strong>Mariana Torres</strong>
                <small>Cliente de demostración</small>
              </div>
              <span className="small-tag">DEMO</span>
            </div>
            <button className="button primary" onClick={enter}>
              Explorar banca personal <ArrowRight size={17} />
            </button>
            <div className="access-disclaimer">
              <ShieldCheck size={18} />
              <p>
                Acceso de demostración. No ingreses documentos, claves ni
                información personal. No se realizan operaciones reales.
              </p>
            </div>
            <button className="access-help" onClick={helpModal}>
              ¿Necesitas ayuda? <ArrowUpRight size={14} />
            </button>
          </section>
        </main>
      ) : (
        <main id="contenido" className="container bank-page">
          <div className="bank-heading">
            <div>
              <p className="eyebrow">MI BANCA PERSONAL</p>
              <h1>Hola, Mariana.</h1>
              <p>Es bueno tener tus planes a la vista.</p>
            </div>
            <span className="demo-badge">
              <span /> Perfil de demostración
            </span>
          </div>
          {bankTab === "Mis productos" ? (
            <>
              <section className="personal-overview">
                <div className="credit-summary">
                  <div className="credit-summary-top">
                    <span>
                      <CreditCard size={20} /> Mi crédito
                    </span>
                    <button
                      className="icon-button"
                      aria-label={hidden ? "Mostrar saldo" : "Ocultar saldo"}
                      onClick={() => setHidden(!hidden)}
                    >
                      {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <h2>Emprendiendo confianza</h2>
                  <span className="credit-id">{client.id}</span>
                  <p className="balance-label">Saldo de capital pendiente</p>
                  <strong className="personal-balance">
                    {hidden ? "S/ ••••••" : money(client.balance)}
                  </strong>
                  <div className="credit-summary-bottom">
                    <span className="good-status">
                      <Check size={13} /> Al día
                    </span>
                    <button onClick={() => setBankTab("Mi crédito")}>
                      Ver mi crédito <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
                <div className="personal-message">
                  <p className="eyebrow">CADA PASO SUMA</p>
                  <h2>
                    Tu proyecto avanza.
                    <br />
                    Tú también.
                  </h2>
                  <p>
                    Consulta los pagos registrados y conoce cuánto capital has
                    amortizado de tu crédito.
                  </p>
                  <button
                    className="text-link"
                    onClick={() => setBankTab("Movimientos")}
                  >
                    Revisar mis pagos <ArrowRight size={16} />
                  </button>
                </div>
              </section>
              <section className="bank-section">
                <div className="bank-section-title">
                  <h2>Últimos pagos</h2>
                  <button
                    className="text-link"
                    onClick={() => setBankTab("Movimientos")}
                  >
                    Ver todos <ArrowRight size={15} />
                  </button>
                </div>
                <div className="movement-list">
                  {movements.slice(0, 3).map((m) => (
                    <div className="movement" key={m.id}>
                      <span className="movement-icon">
                        <Check size={18} />
                      </span>
                      <div>
                        <strong>{m.title}</strong>
                        <small>{m.description}</small>
                      </div>
                      <span className="movement-date">{date(m.date)}</span>
                      <span className="movement-amount">
                        {hidden ? "••••••" : money(m.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : bankTab === "Movimientos" ? (
            <section className="bank-section">
              <div className="bank-section-title">
                <div>
                  <h2>Historial de pagos</h2>
                  <p>Pagos aplicados a tu crédito de ejemplo.</p>
                </div>
                <button className="button outline" onClick={exportStatement}>
                  <Download size={16} /> Descargar estado
                </button>
              </div>
              <div className="movement-filter">
                <label htmlFor="period">Periodo</label>
                <select
                  id="period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option>Todos</option>
                  <option value="2026-09">Septiembre 2026</option>
                  <option value="2026-08">Agosto 2026</option>
                  <option value="2026-07">Julio 2026</option>
                  <option value="2026-06">Junio 2026</option>
                  <option value="2026-05">Mayo 2026</option>
                  <option value="2026-04">Abril 2026</option>
                </select>
              </div>
              <div className="movement-list">
                {filteredMovements.map((m) => (
                  <div className="movement" key={m.id}>
                    <span className="movement-icon">
                      <Check size={18} />
                    </span>
                    <div>
                      <strong>{m.title}</strong>
                      <small>
                        {m.id} · {m.description}
                      </small>
                    </div>
                    <span className="movement-date">{date(m.date)}</span>
                    <span className="movement-amount">
                      {hidden ? "••••••" : money(m.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="list-count" role="status">
                {filteredMovements.length} pagos registrados
              </p>
            </section>
          ) : (
            <section className="bank-section credit-detail">
              <div className="bank-section-title">
                <div>
                  <p className="eyebrow">{client.id}</p>
                  <h2>Emprendiendo confianza</h2>
                </div>
                <span className="good-status">
                  <Check size={13} /> Crédito vigente
                </span>
              </div>
              <div className="credit-progress">
                <div>
                  <span>Capital amortizado</span>
                  <strong>
                    {money(client.amount - client.balance)} de{" "}
                    {money(client.amount)}
                  </strong>
                </div>
                <progress
                  value={client.amount - client.balance}
                  max={client.amount}
                  aria-label="Capital amortizado"
                />
                <small>
                  {(
                    ((client.amount - client.balance) / client.amount) *
                    100
                  ).toFixed(1)}{" "}
                  % de tu capital original
                </small>
              </div>
              <dl className="credit-facts">
                {[
                  ["Monto desembolsado", money(client.amount)],
                  ["Saldo de capital", money(client.balance)],
                  ["Saldo vencido", money(client.overdue)],
                  ["Plazo original", client.months + " meses"],
                  ["Fecha de desembolso", date(client.date)],
                  ["Días de mora", String(client.delay)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{hidden && k.includes("Saldo") ? "••••••" : v}</dd>
                  </div>
                ))}
              </dl>
              <button className="button primary" onClick={exportStatement}>
                <Download size={16} /> Descargar estado de crédito
              </button>
              <p className="bank-note">
                Los datos y pagos de esta cuenta son ficticios. No se habilitan
                pagos ni transferencias.
              </p>
            </section>
          )}
          <div className="personal-help">
            <ShieldCheck size={20} />
            <p>Cuida tu información. Nunca compartas tus claves.</p>
            <button onClick={helpModal}>
              Ayuda <ArrowUpRight size={15} />
            </button>
          </div>
        </main>
      )}
      <footer
        className={"footer " + (route !== "inicio" ? "footer-compact" : "")}
      >
        <div className="container">
          {route === "inicio" && (
            <div className="footer-main">
              <div>
                <Logo light />
                <p>
                  Un buen comienzo.
                  <br />
                  Un futuro para crecer.
                </p>
              </div>
              <div>
                <h3>Banco Crecer</h3>
                <a href="#nosotros">Nuestra visión</a>
                <a href="#productos">Nuestros productos</a>
                <a href="#negocios">Para tu negocio</a>
              </div>
              <div>
                <h3>Estamos cerca</h3>
                <a href="#ayuda">Preguntas frecuentes</a>
                <button onClick={helpModal}>Atención y ayuda</button>
                <button
                  onClick={() =>
                    setModal({
                      title: "Privacidad y alcance",
                      body: "Este proyecto usa datos ficticios y no solicita credenciales ni almacena información personal. No utiliza analítica ni cookies propias. Las tipografías se cargan desde Google Fonts. No es una entidad bancaria operativa ni ofrece servicios financieros reales.",
                    })
                  }
                >
                  Privacidad y alcance
                </button>
              </div>
              <div className="footer-access">
                <h3>Tu banca, a tu alcance</h3>
                <p>
                  Consulta tus productos
                  <br />
                  desde donde estés.
                </p>
                <button onClick={() => navigate("acceso")}>
                  Entrar a mi banca <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          )}
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Banco Crecer · Proyecto de Analiza
              Jech
            </span>
            <span>
              Experiencia de demostración · Sin operaciones bancarias reales
            </span>
          </div>
        </div>
      </footer>
      <dialog
        ref={dialog}
        aria-label={modal?.title || "Información"}
        onCancel={() => setModal(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setModal(null);
        }}
      >
        <div className="dialog-top">
          <Logo />
          <button
            className="icon-button"
            aria-label="Cerrar información"
            onClick={() => setModal(null)}
          >
            <X size={22} />
          </button>
        </div>
        <h2>{modal?.title}</h2>
        <p>{modal?.body}</p>
        <button className="button primary" onClick={() => setModal(null)}>
          Entendido <Check size={16} />
        </button>
      </dialog>
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
