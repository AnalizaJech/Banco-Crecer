import { useEffect, useState } from "react";
import { credits, type Credit } from "./data";
const key = "crecer-portfolio-v1";
const isCredit = (value: unknown): value is Credit => {
  if (!value || typeof value !== "object") return false;
  const c = value as Credit;
  return (
    ["id", "name", "product", "status", "date"].every(
      (k) => typeof c[k as keyof Credit] === "string",
    ) &&
    ["amount", "balance", "overdue", "months", "delay"].every(
      (k) =>
        typeof c[k as keyof Credit] === "number" &&
        Number.isFinite(c[k as keyof Credit]),
    ) &&
    c.amount > 0 &&
    c.balance >= 0 &&
    c.balance <= c.amount &&
    c.overdue >= 0 &&
    c.overdue <= c.balance &&
    c.months > 0 &&
    c.delay >= 0 &&
    ["Vigente", "Refinanciado", "Vencido", "Judicial"].includes(c.status) &&
    /^\d{4}-\d{2}-\d{2}$/.test(c.date)
  );
};
function readPortfolio(): Credit[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const value: unknown = JSON.parse(raw);
      if (Array.isArray(value) && value.length && value.every(isCredit))
        return value;
    }
  } catch {
    /* Use reference data when storage is unavailable. */
  }
  return credits;
}
export function savePortfolio(rows: Credit[]) {
  localStorage.setItem(key, JSON.stringify(rows));
  window.dispatchEvent(new Event("crecer-portfolio-change"));
}
export function usePortfolio() {
  const [rows, setRows] = useState(readPortfolio);
  useEffect(() => {
    const refresh = () => setRows(readPortfolio());
    window.addEventListener("crecer-portfolio-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("crecer-portfolio-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return rows;
}
export function downloadCSV(filename: string, rows: (string | number)[][]) {
  const content =
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map((value) => {
            let text = String(value);
            if (/^[=+@-]/.test(text)) text = "'" + text;
            return '"' + text.replaceAll('"', '""') + '"';
          })
          .join(","),
      )
      .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
