import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Download,
  Search,
  X,
  Plus,
  Wallet,
  Users,
  FileText,
  PieChart,
  Check,
  Pencil,
} from "lucide-react";
import { date, money, normalize, type Credit } from "./data";
import { downloadCSV, savePortfolio, usePortfolio } from "./portfolio";
import { BankSelect, BankModal, BankDatePicker } from "./ui";
const states = ["Vigente", "Refinanciado", "Vencido", "Judicial"];
const productNames = [
  "Emprendiendo confianza",
  "Construyendo confianza",
  "Consumo cuotas",
];
const initialDraft = (): Credit => ({
  id: "",
  name: "",
  product: productNames[0],
  status: "Vigente",
  amount: 10000,
  balance: 10000,
  overdue: 0,
  months: 24,
  date: new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()),
  delay: 0,
});
export function Admin() {
  const rows = usePortfolio();
  const [tab, setTab] = useState("Resumen"),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState("Todos"),
    [sort, setSort] = useState("name"),
    [selected, setSelected] = useState<Credit | null>(null),
    [draft, setDraft] = useState<Credit | null>(null),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);
  const filtered = rows
    .filter(
      (c) =>
        (status === "Todos" || c.status === status) &&
        normalize(Object.values(c).join(" ")).includes(normalize(search)),
    )
    .sort((a, b) =>
      sort === "balance"
        ? b.balance - a.balance
        : a.name.localeCompare(b.name, "es"),
    );
  const displayed =
    tab === "Resumen"
      ? [...filtered].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)
      : filtered;
  const total = (key: "amount" | "balance" | "overdue") =>
    rows.reduce((sum, c) => sum + c[key], 0);
  const clients = [
    ...new Map(
      filtered.map((c) => [
        normalize(c.name),
        {
          name: c.name,
          loans: rows.filter((r) => normalize(r.name) === normalize(c.name)),
        },
      ]),
    ).values(),
  ];
  const changeTab = (name: string) => {
    setTab(name);
    setSearch("");
    setStatus("Todos");
  };
  const close = () => {
    setSelected(null);
    setDraft(null);
    setError("");
  };
  const exportRows = (records = filtered) => {
    downloadCSV("crecer-cartera.csv", [
      [
        "Código",
        "Cliente",
        "Producto",
        "Estado",
        "Monto PEN",
        "Saldo capital PEN",
        "Saldo vencido PEN",
        "Plazo meses",
        "Desembolso",
        "Mora días",
      ],
      ...records.map((c) => [
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
    ]);
    setMessage("Reporte descargado");
  };
  const save = () => {
    if (!draft) return;
    if (!draft.name.trim()) {
      setError("Escribe el nombre del cliente.");
      return;
    }
    if (draft.balance > draft.amount || draft.overdue > draft.balance) {
      setError(
        "El saldo capital no puede superar el monto y el saldo vencido no puede superar el capital.",
      );
      return;
    }
    const record = {
      ...draft,
      name: draft.name.trim(),
      id:
        draft.id ||
        "CR-" +
          (
            Math.max(
              1023,
              ...rows.map((c) => Number(c.id.replace("CR-", "")) || 0),
            ) + 1
          )
            .toString()
            .padStart(6, "0"),
    };
    try {
      savePortfolio(
        draft.id
          ? rows.map((c) => (c.id === draft.id ? record : c))
          : [...rows, record],
      );
      close();
      setMessage("Registro guardado en este navegador");
    } catch {
      setError(
        "No se pudo guardar en este navegador. Revisa si el almacenamiento está bloqueado.",
      );
    }
  };
  const field = (key: keyof Credit, value: string | number) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  return (
    <main id="contenido" className="container admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">ÁREA DE GESTIÓN</p>
          <h1>Visión y control de tu cartera.</h1>
          <p>Clientes, créditos e información para tu gestión diaria.</p>
        </div>
        <div className="admin-heading-actions">
          <button className="button outline" onClick={() => exportRows()}>
            <Download size={16} /> Exportar reporte
          </button>
          <button
            className="button primary"
            onClick={() => {
              setSelected(null);
              setDraft(initialDraft());
              setError("");
            }}
          >
            <Plus size={16} /> Nuevo crédito
          </button>
        </div>
      </div>
      <nav className="admin-tabs" aria-label="Secciones de gestión">
        {[
          { name: "Resumen", icon: PieChart },
          { name: "Cartera", icon: Wallet },
          { name: "Clientes", icon: Users },
          { name: "Reportes", icon: FileText },
        ].map((t) => (
          <button
            key={t.name}
            aria-current={tab === t.name ? "page" : undefined}
            className={tab === t.name ? "active" : ""}
            onClick={() => changeTab(t.name)}
          >
            <t.icon size={17} />
            {t.name}
          </button>
        ))}
      </nav>
      {tab === "Resumen" && (
        <>
          <section
            className="admin-metrics"
            aria-label="Indicadores de cartera"
          >
            {[
              {
                label: "Saldo de capital",
                value: money(total("balance")),
                note: `${rows.length} créditos registrados`,
              },
              {
                label: "Total desembolsado",
                value: money(total("amount")),
                note: "Capital original otorgado",
              },
              {
                label: "Saldo vencido",
                value: money(total("overdue")),
                note: `${rows.filter((c) => c.overdue > 0).length} créditos con saldo vencido`,
              },
              {
                label: "Clientes",
                value: String(new Set(rows.map((c) => normalize(c.name))).size),
                note: "Clientes en cartera",
              },
            ].map((m) => (
              <article key={m.label}>
                <p>{m.label}</p>
                <strong>{m.value}</strong>
                <span>{m.note}</span>
              </article>
            ))}
          </section>
          <section className="admin-summary">
            <div>
              <p className="eyebrow">ESTADO DE LA CARTERA</p>
              <h2>Una lectura más clara.</h2>
              <p>
                Consulta la distribución de créditos y revisa los registros que
                requieren seguimiento.
              </p>
            </div>
            <div className="state-bars">
              {states.map((s) => {
                const count = rows.filter((c) => c.status === s).length;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      changeTab("Cartera");
                      setStatus(s);
                    }}
                  >
                    <span>{s}</span>
                    <span className="state-track">
                      <span
                        className={normalize(s)}
                        style={{ width: `${(count / rows.length) * 100}%` }}
                      />
                    </span>
                    <strong>{count}</strong>
                    <small>
                      {((count / rows.length) * 100).toLocaleString("es-PE", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </small>
                    <ChevronRight size={15} />
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}
      {tab === "Reportes" && (
        <section className="report-options">
          {[
            {
              name: "Cartera completa",
              description:
                "Todos los créditos con monto, plazo, fecha, mora y saldos.",
              records: rows,
            },
            {
              name: "Seguimiento de mora",
              description:
                "Créditos con saldo vencido para revisar y priorizar.",
              records: rows.filter((c) => c.overdue > 0),
            },
            {
              name: "Créditos vigentes",
              description: "Información de créditos actualmente vigentes.",
              records: rows.filter((c) => c.status === "Vigente"),
            },
          ].map((r) => (
            <article key={r.name}>
              <FileText size={24} strokeWidth={1.4} />
              <h2>{r.name}</h2>
              <p>{r.description}</p>
              <span>{r.records.length} registros</span>
              <button
                className="text-link"
                onClick={() => exportRows(r.records)}
              >
                Descargar CSV <Download size={15} />
              </button>
            </article>
          ))}
        </section>
      )}
      {tab !== "Reportes" && (
        <section className="management-table">
          <div className="management-title">
            <div>
              <h2>
                {tab === "Clientes"
                  ? "Directorio de clientes"
                  : tab === "Resumen"
                    ? "Créditos recientes"
                    : "Consulta de cartera"}
              </h2>
              <p>
                {tab === "Clientes"
                  ? "Productos y saldos agrupados por cliente."
                  : "Información completa de cada crédito."}
              </p>
            </div>
            {tab === "Resumen" && (
              <button
                className="text-link"
                onClick={() => changeTab("Cartera")}
              >
                Ver cartera <ArrowRight size={15} />
              </button>
            )}
          </div>
          <div className="management-controls">
            <label className="management-search">
              <Search size={17} />
              <input
                aria-label="Buscar en gestión"
                placeholder="Nombre, código, producto…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  aria-label="Limpiar búsqueda"
                  onClick={() => setSearch("")}
                >
                  <X size={15} />
                </button>
              )}
            </label>
            <label>
              Estado
              <BankSelect
                label="Estado del crédito"
                value={status}
                onValueChange={setStatus}
                options={["Todos", ...states].map((value) => ({
                  value,
                  label: value,
                }))}
              />
            </label>
            <label>
              Orden
              <BankSelect
                label="Ordenar cartera"
                value={sort}
                onValueChange={setSort}
                options={[
                  { value: "name", label: "Nombre" },
                  { value: "balance", label: "Mayor saldo" },
                ]}
              />
            </label>
          </div>
          <div
            className="management-scroll"
            tabIndex={0}
            role="region"
            aria-label={
              tab === "Clientes" ? "Tabla de clientes" : "Tabla de créditos"
            }
          >
            <table className="management-data">
              <thead>
                <tr>
                  {(tab === "Clientes"
                    ? [
                        "Cliente",
                        "Créditos",
                        "Capital total",
                        "Saldo vencido",
                        "Detalle",
                      ]
                    : [
                        "Cliente / código",
                        "Producto",
                        "Estado",
                        "Monto",
                        "Plazo",
                        "Desembolso",
                        "Mora",
                        "Saldo capital",
                        "Saldo vencido",
                        "Detalle",
                      ]
                  ).map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tab === "Clientes"
                  ? clients.map((c) => (
                      <tr key={c.name}>
                        <td>
                          <strong>{c.name}</strong>
                        </td>
                        <td>{c.loans.length}</td>
                        <td className="num">
                          {money(c.loans.reduce((a, l) => a + l.balance, 0))}
                        </td>
                        <td className="num">
                          {money(c.loans.reduce((a, l) => a + l.overdue, 0))}
                        </td>
                        <td>
                          <button
                            className="text-link"
                            onClick={() => {
                              changeTab("Cartera");
                              setSearch(c.name);
                            }}
                            aria-label={"Ver créditos de " + c.name}
                          >
                            Ver créditos <ChevronRight size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  : displayed.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <strong>{c.name}</strong>
                          <small>{c.id}</small>
                        </td>
                        <td>{c.product}</td>
                        <td>
                          <span
                            className={
                              "management-status " + normalize(c.status)
                            }
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="num">{money(c.amount)}</td>
                        <td>{c.months} meses</td>
                        <td>{date(c.date)}</td>
                        <td>{c.delay} días</td>
                        <td className="num">{money(c.balance)}</td>
                        <td className="num">{money(c.overdue)}</td>
                        <td>
                          <button
                            className="detail-button"
                            aria-label={"Detalle de " + c.name}
                            onClick={() => setSelected(c)}
                          >
                            <ChevronRight size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && (
            <div className="management-empty">
              <Search size={25} />
              <h3>No se encontraron registros</h3>
              <p>Cambia la búsqueda o el estado seleccionado.</p>
              <button
                className="button outline"
                onClick={() => {
                  setSearch("");
                  setStatus("Todos");
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
          <div className="management-table-footer">
            <span role="status">
              {tab === "Clientes"
                ? clients.length + " clientes"
                : displayed.length + " de " + rows.length + " créditos"}
            </span>
            <span>Moneda: soles (PEN)</span>
          </div>
        </section>
      )}
      <p className="management-storage">
        Los registros que crees o edites se guardan en este navegador. Las
        descargas incluyen los filtros aplicados.
      </p>
      <BankModal
        className="management-dialog"
        open={Boolean(selected || draft)}
        onClose={close}
        title={draft ? "Formulario de crédito" : "Detalle del crédito"}
      >
        <div className="management-dialog-top">
          <p className="eyebrow">
            {draft
              ? draft.id
                ? "EDITAR CRÉDITO"
                : "NUEVO CRÉDITO"
              : "FICHA DEL CRÉDITO"}
          </p>
          <button
            className="icon-button"
            aria-label="Cerrar detalle"
            onClick={close}
          >
            <X size={20} />
          </button>
        </div>
        {draft ? (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const invalid = Array.from(e.currentTarget.querySelectorAll("input")).find((input) => !input.validity.valid);
              if (invalid) {
                setError("Revisa los campos: completa el nombre y utiliza montos y plazos dentro de los límites indicados.");
                invalid.focus();
                return;
              }
              save();
            }}
          >
            <h2>{draft.id ? "Actualizar registro" : "Registrar un crédito"}</h2>
            <div className="management-form">
              <label className="full">
                Nombre del cliente
                <input
                  autoFocus
                  required
                  maxLength={100}
                  value={draft.name}
                  onChange={(e) => field("name", e.target.value)}
                />
              </label>
              <label>
                Producto
                <BankSelect
                  label="Producto"
                  value={draft.product}
                  onValueChange={(value) => field("product", value)}
                  options={productNames.map((value) => ({
                    value,
                    label: value,
                  }))}
                />
              </label>
              <label>
                Estado
                <BankSelect
                  label="Estado"
                  value={draft.status}
                  onValueChange={(value) => field("status", value)}
                  options={states.map((value) => ({ value, label: value }))}
                />
              </label>
              {[
                { key: "amount", name: "Monto desembolsado (PEN)", min: 1 },
                { key: "balance", name: "Saldo capital (PEN)", min: 0 },
                { key: "overdue", name: "Saldo vencido (PEN)", min: 0 },
                { key: "months", name: "Plazo en meses", min: 1 },
                { key: "delay", name: "Días de mora", min: 0 },
              ].map((f) => (
                <label key={f.key}>
                  {f.name}
                  <input
                    required
                    type="number"
                    min={f.min}
                    max={
                      f.key === "months"
                        ? 120
                        : f.key === "delay"
                          ? 10000
                          : 100000000
                    }
                    step={["months", "delay"].includes(f.key) ? 1 : 0.01}
                    value={draft[f.key as keyof Credit]}
                    onChange={(e) =>
                      field(f.key as keyof Credit, Number(e.target.value))
                    }
                  />
                </label>
              ))}
              <label>
                Desembolso
                <BankDatePicker
                  label="Desembolso"
                  value={draft.date}
                  onValueChange={(value) => field("date", value)}
                />
              </label>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              <button className="button outline" type="button" onClick={close}>
                Cancelar
              </button>
              <button className="button primary" type="submit">
                <Check size={16} /> Guardar registro
              </button>
            </div>
          </form>
        ) : (
          selected && (
            <>
              <h2>{selected.name}</h2>
              <p className="management-detail-sub">
                {selected.id} · {selected.product}
              </p>
              <span
                className={"management-status " + normalize(selected.status)}
              >
                {selected.status}
              </span>
              <dl className="credit-facts">
                {[
                  ["Monto desembolsado", money(selected.amount)],
                  ["Saldo capital", money(selected.balance)],
                  ["Saldo vencido", money(selected.overdue)],
                  ["Plazo", selected.months + " meses"],
                  ["Desembolso", date(selected.date)],
                  ["Mora", selected.delay + " días"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="form-actions">
                <button
                  className="button outline"
                  onClick={() => exportRows([selected])}
                >
                  <Download size={16} /> Descargar ficha
                </button>
                <button
                  className="button primary"
                  onClick={() => {
                    setDraft(selected);
                    setSelected(null);
                  }}
                >
                  <Pencil size={16} /> Editar registro
                </button>
              </div>
            </>
          )
        )}
      </BankModal>
      {message && (
        <div className="toast" role="status">
          <Check size={17} />
          {message}
        </div>
      )}
    </main>
  );
}
