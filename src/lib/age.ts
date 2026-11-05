import { type YMD, span, nextBirthday, birthdayIn, diffDays, addDays, weekday, formatLong, toUTC } from "./date";

// [month, first day of the sign, name, glyph]; before that day the previous month's sign applies.
const ZODIAC: [number, number, string, string][] = [
  [1, 20, "Aquarius", "♒"], [2, 19, "Pisces", "♓"], [3, 21, "Aries", "♈"], [4, 20, "Taurus", "♉"],
  [5, 21, "Gemini", "♊"], [6, 21, "Cancer", "♋"], [7, 23, "Leo", "♌"], [8, 23, "Virgo", "♍"],
  [9, 23, "Libra", "♎"], [10, 23, "Scorpio", "♏"], [11, 22, "Sagittarius", "♐"], [12, 22, "Capricorn", "♑"],
];
export function zodiac({ m, d }: YMD) {
  const z = d >= ZODIAC[m - 1][1] ? ZODIAC[m - 1] : ZODIAC[(m + 10) % 12];
  return `${z[3]} ${z[2]}`;
}
const SIGNS = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"];
export const chineseZodiac = (y: number) => SIGNS[((y % 12) + 12) % 12];
const STONES = ["Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Pearl", "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise"];
export const birthstone = (m: number) => STONES[m - 1];
export function generation(y: number) {
  if (y >= 2013) return "Generation Alpha";
  if (y >= 1997) return "Generation Z";
  if (y >= 1981) return "Millennial";
  if (y >= 1965) return "Generation X";
  if (y >= 1946) return "Baby Boomer";
  if (y >= 1928) return "Silent Generation";
  return "Greatest Generation";
}

export type System = "western" | "east-asian";

export function computeAge(dob: YMD, on: YMD, system: System = "western") {
  const s = span(dob, on);
  const westernYears = s.years;
  const headlineYears = system === "east-asian" ? on.y - dob.y + 1 : westernYears;
  const nb = nextBirthday(dob, on);
  const yearDays = diffDays(birthdayIn(dob, nb.date.y - 1), nb.date) || 365;
  return {
    ...s,
    headlineYears,
    totalWeeks: Math.floor(s.totalDays / 7),
    weeksRemDays: s.totalDays % 7,
    totalHours: s.totalDays * 24,
    totalMinutes: s.totalDays * 1440,
    totalSeconds: s.totalDays * 86400,
    nextBirthday: nb,
    progress: Math.min(1, Math.max(0, 1 - nb.daysUntil / yearDays)),
    bornOn: weekday(dob),
    zodiac: zodiac(dob),
    chinese: chineseZodiac(dob.y),
    birthstone: birthstone(dob.m),
    generation: generation(dob.y),
  };
}

export function milestones(dob: YMD, on: YMD) {
  const list: { label: string; date: YMD }[] = [];
  for (const n of [1000, 5000, 10000, 15000, 20000, 25000, 30000]) list.push({ label: `${n.toLocaleString("en-US")} days old`, date: addDays(dob, n) });
  const dobMs = toUTC(dob);
  const billion = new Date(dobMs + 1e9 * 1000);
  list.push({ label: "1 billion seconds old", date: { y: billion.getUTCFullYear(), m: billion.getUTCMonth() + 1, d: billion.getUTCDate() } });
  list.sort((a, b) => toUTC(a.date) - toUTC(b.date));
  return list.map((x) => ({ ...x, text: formatLong(x.date), weekday: weekday(x.date), past: toUTC(x.date) <= toUTC(on), daysAway: diffDays(on, x.date) }));
}
