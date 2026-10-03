import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Download,
  LayoutDashboard,
  Leaf,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wallet,
  X,
  Check,
  FileText,
  Landmark,
  Eye,
  EyeOff,
} from "lucide-react";
import "./styles.css";
import { credits, money, date, normalize, sum, type Credit } from "./data";
const nav = [
  { label: "Resumen", icon: LayoutDashboard },
  { label: "Créditos", icon: Wallet },
  { label: "Clientes", icon: Users },
  { label: "Reportes", icon: FileText },
];
function App() {
  const [page, setPage] = useState("Resumen"),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("Todos"),
    [selected, setSelected] = useState<Credit | null>(null),
    [menu, setMenu] = useState(false),
    [notice, setNotice] = useState(false),
    [help, setHelp] = useState(false),
    [settings, setSettings] = useState(false),
    [hidden, setHidden] = useState(false),
    [toast, setToast] = useState(""),
    [sort, setSort] = useState("name");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected || help || settings) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected, help, settings]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const rows = credits
    .filter(
      (c) =>
        (filter === "Todos" || c.status === filter) &&
        normalize(Object.values(c).join(" ")).includes(normalize(search)),
    )
    .sort((a, b) =>
      sort === "balance" ? b.balance - a.balance : a.name.localeCompare(b.name),
    );
  const exportCSV = () => {
    const csv =
      "\uFEFF" +
      [
        [
          "Código",
          "Cliente",
          "Producto",
          "Estado",
          "Monto PEN",
          "Saldo PEN",
          "Vencido PEN",
          "Plazo meses",
          "Desembolso",
          "Mora días",
        ],
        ...rows.map((c) => [
          c.id,
          c.name,
          c.product,
          c.status,
          c.amount,
          c.balance,
          c.overdue,
          c.months,
          c.date,
          c.delay,
        ]),
      ]
        .map((r) =>
          r.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
        )
        .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "crecer-cartera-demo.csv";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Reporte exportado correctamente");
  };
  const changePage = (p: string) => {
    setPage(p);
    setMenu(false);
    setSearch("");
    setFilter("Todos");
  };
  const closeDialog = () => {
    setSelected(null);
    setHelp(false);
    setSettings(false);
  };
  return (
    <div className="app">
      <a className="skip" href="#main">
        Ir al contenido
      </a>
      <aside className={"sidebar " + (menu ? "open" : "")}>
        <a className="brand" href="#" onClick={() => changePage("Resumen")}>
          <span className="brand-mark">
            <Leaf size={25} />
          </span>
          <span>
            crecer<span className="brand-caption">BANCA DIGITAL</span>
          </span>
        </a>
        <div className="workspace">
          <span className="workspace-icon">
            <Landmark size={18} />
          </span>
          <div>
            Mi espacio financiero<small>Portal de gestión</small>
          </div>
          <ChevronDown size={15} />
        </div>
        <p className="nav-label">PRINCIPAL</p>
        <nav aria-label="Navegación principal">
          {nav.map((n) => (
            <button
              key={n.label}
              className={page === n.label ? "active" : ""}
              aria-current={page === n.label ? "page" : undefined}
              onClick={() => changePage(n.label)}
            >
              <n.icon size={19} />
              {n.label}
              {n.label === "Créditos" && <span className="nav-count">8</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="support-box">
            <span className="support-icon">
              <CircleHelp size={21} />
            </span>
            <h3>Estamos para ayudarte</h3>
            <p>Encuentra respuestas y conoce tu portal.</p>
            <button onClick={() => setHelp(true)}>
              Centro de ayuda <ArrowUpRight size={15} />
            </button>
          </div>
          <button className="settings" onClick={() => setSettings(true)}>
            <Settings size={18} /> Preferencias
          </button>
          <div className="sidebar-foot">
            <ShieldCheck size={15} /> Entorno de demostración
          </div>
        </div>
      </aside>
      {menu && (
        <button
          className="backdrop"
          aria-label="Cerrar navegación"
          onClick={() => setMenu(false)}
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              aria-label="Abrir navegación"
              onClick={() => setMenu(!menu)}
            >
              <Menu size={22} />
            </button>
            <span>Banca digital</span>
            <ChevronRight size={14} />
            <strong>{page}</strong>
          </div>
          <div className="top-actions">
            <span className="demo-chip">
              <span /> DEMO
            </span>
            <div className="notification-wrap">
              <button
                className="icon-button bell"
                aria-label="Notificaciones"
                aria-expanded={notice}
                onClick={() => setNotice(!notice)}
              >
                <Bell size={20} />
                <i />
              </button>
              {notice && (
                <div className="notification-panel">
                  <strong>Notificaciones</strong>
                  <p>2 créditos requieren atención.</p>
                  <button
                    onClick={() => {
                      changePage("Créditos");
                      setFilter("Vencido");
                      setNotice(false);
                    }}
                  >
                    Revisar crédito vencido <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
            <span className="top-divider" />
            <button className="profile" onClick={() => setSettings(true)}>
              <span className="avatar">AC</span>
              <span>
                Administración<small>Gestor de cartera</small>
              </span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>
        <main id="main">
          <div className="page-heading">
            <div>
              <p className="eyebrow">TU BANCA, MÁS CERCA</p>
              <h1>
                {page === "Resumen"
                  ? "Cada paso cuenta. Sigue creciendo."
                  : page === "Créditos"
                    ? "Tu cartera de créditos"
                    : page === "Clientes"
                      ? "Personas que crecen contigo"
                      : "Una visión clara de tus finanzas"}
              </h1>
              <p className="subtitle">
                {page === "Resumen"
                  ? "Una visión de tus finanzas, en un solo lugar."
                  : "Consulta, organiza y toma decisiones con información de tu cartera."}
              </p>
            </div>
            <button className="button secondary" onClick={exportCSV}>
              <Download size={17} /> Exportar reporte
            </button>
          </div>
          {page === "Resumen" && (
            <>
              <section className="overview" aria-label="Resumen financiero">
                <div className="balance-card">
                  <div className="balance-top">
                    <span>
                      <Wallet size={18} /> Saldo total de cartera
                    </span>
                    <button
                      className="light-icon"
                      aria-label={hidden ? "Mostrar saldos" : "Ocultar saldos"}
                      onClick={() => setHidden(!hidden)}
                    >
                      {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="balance-amount">
                    {hidden ? "S/ ••••••" : money(sum("balance"))}
                  </div>
                  <div className="balance-caption">
                    <span className="currency-pill">PEN</span> Soles peruanos
                  </div>
                  <div className="balance-footer">
                    <span>
                      <span className="live-dot" /> {credits.length} créditos en
                      tu cartera
                    </span>
                    <span>Datos de ejemplo</span>
                  </div>
                  <div className="card-orbit orbit-one" />
                  <div className="card-orbit orbit-two" />
                </div>
                <div className="metric">
                  <span className="metric-icon">
                    <ArrowUpRight size={21} />
                  </span>
                  <p>Total desembolsado</p>
                  <h2>{hidden ? "S/ ••••••" : money(sum("amount"))}</h2>
                  <span className="metric-note">
                    Capital otorgado en {credits.length} créditos
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-icon amber">
                    <ArrowDownLeft size={21} />
                  </span>
                  <p>Saldo vencido</p>
                  <h2>{hidden ? "S/ ••••••" : money(sum("overdue"))}</h2>
                  <span className="metric-note">
                    <i className="amber-dot" /> 2 créditos requieren atención
                  </span>
                </div>
              </section>
              <section className="insights">
                <div className="portfolio-panel">
                  <div className="section-heading">
                    <div>
                      <h2>Salud de tu cartera</h2>
                      <p>Distribución por estado del crédito</p>
                    </div>
                    <span className="subtle-pill">8 créditos</span>
                  </div>
                  <div className="portfolio-content">
                    <div className="donut">
                      <div>
                        <strong>
                          62,5<span>%</span>
                        </strong>
                        <small>Vigentes</small>
                      </div>
                    </div>
                    <div className="legend">
                      {["Vigente", "Refinanciado", "Vencido", "Judicial"].map(
                        (s, i) => (
                          <button
                            key={s}
                            onClick={() => {
                              changePage("Créditos");
                              setFilter(s);
                            }}
                          >
                            <span className={"legend-dot color-" + i} />
                            <span>{s}</span>
                            <strong>
                              {credits.filter((c) => c.status === s).length}
                            </strong>
                            <small>{i === 0 ? "62,5" : "12,5"}%</small>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <div className="growth-panel">
                  <div className="growth-copy">
                    <span className="growth-label">
                      <Leaf size={15} /> CRECER CONTIGO
                    </span>
                    <h2>
                      Más claridad.
                      <br />
                      Mejores decisiones.
                    </h2>
                    <p>
                      Consulta el detalle de cada crédito y mantén el control de
                      tu cartera.
                    </p>
                    <button onClick={() => changePage("Créditos")}>
                      Explorar mis créditos <ArrowUpRight size={17} />
                    </button>
                  </div>
                  <div className="growth-art" aria-hidden="true">
                    <div className="art-ring" />
                    <span className="bar b1" />
                    <span className="bar b2" />
                    <span className="bar b3" />
                    <ArrowUpRight size={52} />
                  </div>
                </div>
              </section>
            </>
          )}
          {page === "Reportes" && (
            <section className="report-grid">
              {[
                {
                  title: "Cartera total",
                  value: sum("balance"),
                  desc: "Saldo de capital de todos los créditos.",
                },
                {
                  title: "Capital desembolsado",
                  value: sum("amount"),
                  desc: "Monto original de los créditos otorgados.",
                },
                {
                  title: "Cartera vencida",
                  value: sum("overdue"),
                  desc: "Saldo vencido de créditos con mora.",
                },
              ].map((r) => (
                <article className="metric" key={r.title}>
                  <FileText className="report-icon" />
                  <p>{r.title}</p>
                  <h2>{hidden ? "S/ ••••••" : money(r.value)}</h2>
                  <p className="metric-note">{r.desc}</p>
                  <button className="text-button" onClick={exportCSV}>
                    Descargar cartera CSV <Download size={16} />
                  </button>
                </article>
              ))}
            </section>
          )}
          <section className="credits-panel">
            <div className="section-heading">
              <div>
                <h2>
                  {page === "Clientes"
                    ? "Directorio de clientes"
                    : page === "Resumen"
                      ? "Tu cartera, al día"
                      : "Consulta de créditos"}
                </h2>
                <p>
                  {page === "Clientes"
                    ? "Información de clientes y sus productos financieros"
                    : "Todos tus créditos y su información más importante"}
                </p>
              </div>
              {page === "Resumen" && (
                <button
                  className="text-button"
                  onClick={() => changePage("Créditos")}
                >
                  Ver todos <ArrowUpRight size={17} />
                </button>
              )}
            </div>
            <div className="table-toolbar">
              <div className="filter-tabs" aria-label="Filtrar por estado">
                {[
                  "Todos",
                  "Vigente",
                  "Refinanciado",
                  "Vencido",
                  "Judicial",
                ].map((f) => (
                  <button
                    key={f}
                    aria-pressed={filter === f}
                    className={filter === f ? "selected" : ""}
                    onClick={() => setFilter(f)}
                  >
                    {f === "Vigente" ? "Vigentes" : f}
                    {f === "Todos" && <span>{credits.length}</span>}
                  </button>
                ))}
              </div>
              <div className="table-tools">
                <label className="search">
                  <Search size={17} />
                  <input
                    aria-label="Buscar créditos"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar cliente o crédito"
                  />
                  {search && (
                    <button
                      aria-label="Limpiar búsqueda"
                      onClick={() => setSearch("")}
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>
                <label className="sort">
                  <SlidersHorizontal size={17} />
                  <select
                    aria-label="Ordenar créditos"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="name">Nombre</option>
                    <option value="balance">Mayor saldo</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>CLIENTE / CRÉDITO</th>
                    <th>PRODUCTO</th>
                    <th>ESTADO</th>
                    <th className="numeric">SALDO CAPITAL</th>
                    <th>DESEMBOLSO</th>
                    <th>
                      <span className="sr-only">Detalle</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="client-cell">
                          <span className="client-avatar">
                            {c.name
                              .split(" ")
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join("")}
                          </span>
                          <div>
                            <strong>{c.name}</strong>
                            <small>{c.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="product-name">{c.product}</span>
                        <small className="cell-small">
                          {c.months} meses · {money(c.amount)}
                        </small>
                      </td>
                      <td>
                        <span className={"status " + normalize(c.status)}>
                          <i />
                          {c.status}
                        </span>
                      </td>
                      <td className="numeric amount">
                        {hidden ? "••••••" : money(c.balance)}
                      </td>
                      <td className="date-cell">{date(c.date)}</td>
                      <td>
                        <button
                          className="row-action"
                          aria-label={"Ver detalle de " + c.name}
                          onClick={() => setSelected(c)}
                        >
                          <ChevronRight size={19} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!rows.length && (
                <div className="empty">
                  <Search size={30} />
                  <h3>No encontramos créditos</h3>
                  <p>Prueba con otro nombre o cambia los filtros.</p>
                  <button
                    className="button secondary"
                    onClick={() => {
                      setSearch("");
                      setFilter("Todos");
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
            <div className="table-footer">
              <span role="status">
                Mostrando {rows.length} de {credits.length} créditos
              </span>
              <span>Moneda: soles peruanos (PEN)</span>
            </div>
          </section>
          <footer className="footer">
            <span>
              © {new Date().getFullYear()} Banco Crecer{" "}
              <span className="footer-sep">·</span> Crecemos contigo.
            </span>
            <span>
              <ShieldCheck size={14} /> Demostración con datos ficticios
            </span>
          </footer>
        </main>
      </div>
      <dialog
        ref={dialog}
        aria-label={
          selected
            ? "Detalle del crédito"
            : settings
              ? "Preferencias"
              : "Centro de ayuda"
        }
        onCancel={closeDialog}
        onClick={(e) => {
          if (e.target === dialog.current) closeDialog();
        }}
      >
        <div className="dialog-header">
          <span className="eyebrow">
            {selected
              ? "DETALLE DEL CRÉDITO"
              : settings
                ? "TU ESPACIO"
                : "CENTRO DE AYUDA"}
          </span>
          <button
            className="icon-button"
            aria-label="Cerrar"
            onClick={closeDialog}
          >
            <X size={20} />
          </button>
        </div>
        {selected ? (
          <>
            <h2>{selected.name}</h2>
            <p className="subtitle">
              {selected.id} · {selected.product}
            </p>
            <span className={"status " + normalize(selected.status)}>
              <i />
              {selected.status}
            </span>
            <div className="detail-balance">
              <small>Saldo de capital</small>
              <strong>{money(selected.balance)}</strong>
            </div>
            <dl className="detail-grid">
              {[
                ["Monto desembolsado", money(selected.amount)],
                ["Saldo vencido", money(selected.overdue)],
                ["Plazo", selected.months + " meses"],
                ["Desembolso", date(selected.date)],
                ["Días de mora", String(selected.delay)],
                ["Moneda", "PEN · Sol peruano"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="dialog-note">
              Este registro es ficticio y pertenece al entorno de demostración.
            </p>
          </>
        ) : settings ? (
          <>
            <h2>Preferencias de visualización</h2>
            <p className="subtitle">
              Personaliza la privacidad de los saldos en el portal.
            </p>
            <button
              className="preference-toggle"
              aria-pressed={hidden}
              onClick={() => setHidden(!hidden)}
            >
              <span>Ocultar saldos en el resumen y la cartera</span>
              <span className={"toggle " + (hidden ? "on" : "")}>
                <span />
              </span>
            </button>
            <p className="dialog-note">
              Los cambios se aplican durante esta sesión. Perfil de
              demostración: Administración.
            </p>
          </>
        ) : (
          <>
            <h2>¿Cómo podemos ayudarte?</h2>
            <p className="subtitle">
              Todo lo que necesitas para explorar tu banca digital.
            </p>
            {[
              [
                "Consultar un crédito",
                "En Créditos, busca un cliente y abre la flecha de su registro para consultar monto, plazo, desembolso y mora.",
              ],
              [
                "Exportar información",
                "Exportar reporte descarga un archivo CSV con los resultados de tu búsqueda y filtros actuales.",
              ],
              [
                "Sobre esta demostración",
                "Este portal utiliza datos ficticios. No procesa pagos, transferencias ni credenciales bancarias. Una operación real requiere un backend con autenticación y controles de acceso.",
              ],
            ].map(([t, d]) => (
              <div className="help-item" key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </>
        )}
      </dialog>
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
