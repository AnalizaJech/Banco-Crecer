// Perfil ficticio de demostración. No representa una cuenta bancaria real.
export const client = {
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
};
export const money = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value);
export const date = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value + "T12:00:00"));
