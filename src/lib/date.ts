export type YMD = { y: number; m: number; d: number };

const MS_DAY = 86_400_000;

export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
export const isValidYMD = ({ y, m, d }: YMD) =>
  Number.isInteger(y) && y >= 1 && y <= 9999 && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
export const toUTC = ({ y, m, d }: YMD) => {
  const t = new Date(Date.UTC(2000, m - 1, d));
  t.setUTCFullYear(y);
  return t.getTime();
};
export const fromUTC = (t: number): YMD => {
  const x = new Date(t);
  return { y: x.getUTCFullYear(), m: x.getUTCMonth() + 1, d: x.getUTCDate() };
};
export const diffDays = (a: YMD, b: YMD) => Math.round((toUTC(b) - toUTC(a)) / MS_DAY);
export const addDays = (a: YMD, n: number) => fromUTC(toUTC(a) + n * MS_DAY);
export const cmp = (a: YMD, b: YMD) => toUTC(a) - toUTC(b);
export const today = (): YMD => {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() };
};
export const toISO = ({ y, m, d }: YMD) =>
  `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
export const parseISO = (s: string | null): YMD | null => {
  const r = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s ?? "");
  if (!r) return null;
  const v = { y: +r[1], m: +r[2], d: +r[3] };
  return isValidYMD(v) ? v : null;
};

/** Add n months, clamping to the last day of the target month (Jan 31 + 1mo = Feb 28/29). */
export function addMonths(a: YMD, n: number): YMD {
  const idx = a.y * 12 + (a.m - 1) + n;
  const y = Math.floor(idx / 12);
  const m = (idx % 12) + 1;
  return { y, m, d: Math.min(a.d, daysInMonth(y, m)) };
}

export type Span = { years: number; months: number; days: number; totalMonths: number; totalDays: number };

/** Calendar span from `from` to `to` (from <= to). Whole months first, then leftover days. */
export function span(from: YMD, to: YMD): Span {
  let totalMonths = (to.y - from.y) * 12 + (to.m - from.m);
  while (totalMonths > 0 && cmp(addMonths(from, totalMonths), to) > 0) totalMonths--;
  const anchor = addMonths(from, totalMonths);
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days: diffDays(anchor, to),
    totalMonths,
    totalDays: diffDays(from, to),
  };
}

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const weekday = (a: YMD) => WEEKDAYS[new Date(toUTC(a)).getUTCDay()];
export const formatLong = (a: YMD) => `${MONTHS[a.m - 1]} ${a.d}, ${a.y}`;
export const fmt = (n: number) => n.toLocaleString("en-US");
export const plural = (n: number, w: string) => `${fmt(n)} ${w}${n === 1 ? "" : "s"}`;

/** Birthday in year y; Feb 29 birthdays fall on Feb 28 in non-leap years. */
export const birthdayIn = (dob: YMD, y: number): YMD => ({ y, m: dob.m, d: Math.min(dob.d, daysInMonth(y, dob.m)) });

export function nextBirthday(dob: YMD, from: YMD) {
  let date = birthdayIn(dob, from.y);
  if (cmp(date, from) < 0) date = birthdayIn(dob, from.y + 1);
  return { date, daysUntil: diffDays(from, date), turning: date.y - dob.y, weekday: weekday(date) };
}
