import type { IconName } from "../lib/icons";

export type Category = "Date & Time" | "Health" | "Math" | "Finance";
/** `icon` is a Lucide icon registered in src/lib/icons.ts. `accent` is optional: when omitted, a colour from the category's family is assigned automatically. */
export type Calc = { slug: string; name: string; category: Category; desc: string; keywords: string; icon: IconName; accent?: string };

/** One colour family per section: blues/violets, greens/pinks/reds, oranges, yellows/limes. */
export const familyAccents: Record<Category, string[]> = {
  "Date & Time": ["#3B82F6", "#8B5CF6", "#6366F1", "#0EA5E9", "#06B6D4", "#A855F7"],
  Health: ["#EC4899", "#14B8A6", "#22C55E", "#EF4444", "#F43F5E"],
  Math: ["#FB923C", "#F97316", "#F59E0B"],
  Finance: ["#EAB308", "#84CC16", "#CA8A04"],
};

export const calculators: Calc[] = [
  { slug: "calendar", icon: "calendar-days", accent: "#3B82F6", name: "Calendar", category: "Date & Time", desc: "A clean live monthly calendar with today highlighted.", keywords: "month year weekday week number day of year today" },
  { slug: "date-calculator", icon: "calendar-range", accent: "#8B5CF6", name: "Date Difference", category: "Date & Time", desc: "Days, weeks and months between any two dates, with business days.", keywords: "days between dates duration interval" },
  { slug: "add-days-calculator", icon: "calendar-plus", accent: "#0EA5E9", name: "Add or Subtract Days", category: "Date & Time", desc: "Find the date that is N days, weeks, months or years from a start date.", keywords: "date plus minus deadline add subtract" },
  { slug: "due-date-calculator", icon: "baby", accent: "#EC4899", name: "Due Date Calculator", category: "Health", desc: "Estimate a pregnancy due date from the last menstrual period.", keywords: "pregnancy baby lmp conception" },
  { slug: "bmi-calculator", icon: "scale", accent: "#14B8A6", name: "BMI Calculator", category: "Health", desc: "Body mass index in metric or imperial units with the healthy range for your height.", keywords: "weight height body mass index" },
  { slug: "percentage-calculator", icon: "percent", accent: "#FB923C", name: "Percentage Calculator", category: "Math", desc: "Percent of, percent change, and what percent one number is of another.", keywords: "percent increase decrease ratio" },
  { slug: "loan-calculator", icon: "landmark", accent: "#EAB308", name: "Loan Calculator", category: "Finance", desc: "Monthly payment, total interest and payoff for any fixed-rate loan.", keywords: "emi mortgage payment interest amortization" },
  { slug: "time-calculator", icon: "timer", accent: "#06B6D4", name: "Time Duration Calculator", category: "Date & Time", desc: "Hours and minutes between two times, including overnight shifts and breaks.", keywords: "hours minutes shift work timesheet" },
  { slug: "compound-interest-calculator", icon: "trending-up", accent: "#84CC16", name: "Compound Interest Calculator", category: "Finance", desc: "See how savings grow with compounding and regular monthly deposits.", keywords: "savings investment growth interest apy" },
  { slug: "tip-calculator", icon: "receipt", accent: "#CA8A04", name: "Tip Calculator", category: "Finance", desc: "Tip and bill split per person, with quick tip presets.", keywords: "gratuity restaurant split bill" },
  { slug: "gpa-calculator", icon: "graduation-cap", accent: "#F97316", name: "GPA Calculator", category: "Math", desc: "Weighted grade point average on the 4.0 scale from your course grades and credits.", keywords: "grade point average college school credits" },
  { slug: "unit-converter", icon: "ruler", accent: "#F59E0B", name: "Unit Converter", category: "Math", desc: "Convert length, weight, temperature, volume and speed instantly.", keywords: "convert metric imperial km miles kg lb celsius fahrenheit" },
];
export const categories: Category[] = ["Date & Time", "Health", "Math", "Finance"];
export const bySlug = (s: string) => calculators.find((c) => c.slug === s)!;

/** Accent colour for a calculator: its own, or the next unused one from its category family. */
export function accentOf(c: Calc): string {
  if (c.accent) return c.accent;
  const fam = familyAccents[c.category];
  const idx = calculators.filter((x) => x.category === c.category).indexOf(c);
  return fam[idx % fam.length];
}
