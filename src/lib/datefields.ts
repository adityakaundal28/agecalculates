import { type YMD, isValidYMD } from "./date";

export type FieldState = { status: "empty" | "partial" | "invalid" | "ok"; value?: YMD };

/** Wires a <DateFields> group (day / month / year inputs) with auto-advance and validation. */
export function dateFields(root: HTMLElement, onChange: () => void) {
  const q = (p: string) => root.querySelector<HTMLInputElement>(`[data-part="${p}"]`)!;
  const [d, m, y] = [q("d"), q("m"), q("y")];
  const order = [d, m, y];

  const read = (): FieldState => {
    const vals = order.map((i) => i.value);
    if (vals.every((v) => !v)) return { status: "empty" };
    if (d.value.length < 1 || m.value.length < 1 || y.value.length < 4) return { status: "partial" };
    const v = { y: +y.value, m: +m.value, d: +d.value };
    return isValidYMD(v) ? { status: "ok", value: v } : { status: "invalid" };
  };
  const paint = () => {
    const bad = read().status === "invalid";
    order.forEach((i) => i.setAttribute("aria-invalid", String(bad)));
  };

  order.forEach((input, idx) => {
    const max = input === y ? 4 : 2;
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, max);
      if (input !== y && input.value.length === max) order[idx + 1].focus();
      else if (input === m && +m.value > 1 && m.value.length === 1) y.focus();
      else if (input === d && +d.value > 3 && d.value.length === 1) m.focus();
      paint();
      onChange();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && idx > 0) { e.preventDefault(); order[idx - 1].focus(); }
    });
    input.addEventListener("focus", () => input.select());
  });

  return {
    get: read,
    set(v: YMD | null) {
      d.value = v ? String(v.d).padStart(2, "0") : "";
      m.value = v ? String(v.m).padStart(2, "0") : "";
      y.value = v ? String(v.y).padStart(4, "0") : "";
      paint();
    },
    focus: () => d.focus(),
  };
}
