export type Credit = {
  id: string;
  name: string;
  product: string;
  status: string;
  amount: number;
  balance: number;
  overdue: number;
  months: number;
  date: string;
  delay: number;
};
export const credits: Credit[] = [
  {
    id: "CR-001024",
    name: "Mariana Torres Ruiz",
    product: "Emprendiendo confianza",
    status: "Vigente",
    amount: 24000,
    balance: 18450,
    overdue: 0,
    months: 24,
    date: "2026-03-15",
    delay: 0,
  },
  {
    id: "CR-001025",
    name: "Diego Mendoza Salas",
    product: "Construyendo confianza",
    status: "Vigente",
    amount: 48000,
    balance: 36200,
    overdue: 0,
    months: 36,
    date: "2026-01-20",
    delay: 0,
  },
  {
    id: "CR-001026",
    name: "Valentina Ríos Castro",
    product: "Consumo cuotas",
    status: "Vigente",
    amount: 12000,
    balance: 8400,
    overdue: 0,
    months: 12,
    date: "2026-05-10",
    delay: 0,
  },
  {
    id: "CR-001027",
    name: "Andrés Vega Molina",
    product: "Emprendiendo confianza",
    status: "Refinanciado",
    amount: 32000,
    balance: 24600,
    overdue: 0,
    months: 48,
    date: "2025-11-08",
    delay: 7,
  },
  {
    id: "CR-001028",
    name: "Lucía Herrera Paz",
    product: "Consumo cuotas",
    status: "Vencido",
    amount: 8500,
    balance: 3120,
    overdue: 780,
    months: 18,
    date: "2025-12-02",
    delay: 31,
  },
  {
    id: "CR-001029",
    name: "Gabriel Soto León",
    product: "Construyendo confianza",
    status: "Judicial",
    amount: 52000,
    balance: 41300,
    overdue: 12400,
    months: 36,
    date: "2025-07-22",
    delay: 120,
  },
  {
    id: "CR-001030",
    name: "Camila Paredes Díaz",
    product: "Emprendiendo confianza",
    status: "Vigente",
    amount: 18000,
    balance: 12600,
    overdue: 0,
    months: 24,
    date: "2026-04-18",
    delay: 0,
  },
  {
    id: "CR-001031",
    name: "Nicolás Flores Ramos",
    product: "Consumo cuotas",
    status: "Vigente",
    amount: 6500,
    balance: 3250,
    overdue: 0,
    months: 12,
    date: "2026-02-12",
    delay: 0,
  },
];
export const money = (n: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(n);
export const date = (d: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(d + "T12:00:00"));
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export const sum = (key: "amount" | "balance" | "overdue") =>
  credits.reduce((a, c) => a + c[key], 0);
