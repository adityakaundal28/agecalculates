import hourglass from "lucide-static/icons/hourglass.svg?raw";
import calendarDays from "lucide-static/icons/calendar-days.svg?raw";
import calendarRange from "lucide-static/icons/calendar-range.svg?raw";
import calendarPlus from "lucide-static/icons/calendar-plus.svg?raw";
import timer from "lucide-static/icons/timer.svg?raw";
import baby from "lucide-static/icons/baby.svg?raw";
import scale from "lucide-static/icons/scale.svg?raw";
import percent from "lucide-static/icons/percent.svg?raw";
import graduationCap from "lucide-static/icons/graduation-cap.svg?raw";
import ruler from "lucide-static/icons/ruler.svg?raw";
import landmark from "lucide-static/icons/landmark.svg?raw";
import trendingUp from "lucide-static/icons/trending-up.svg?raw";
import receipt from "lucide-static/icons/receipt.svg?raw";
import calculator from "lucide-static/icons/calculator.svg?raw";

/** Register new Lucide icons here (file name from lucide-static/icons). */
const ICONS = {
  hourglass, "calendar-days": calendarDays, "calendar-range": calendarRange, "calendar-plus": calendarPlus,
  timer, baby, scale, percent, "graduation-cap": graduationCap, ruler, landmark, "trending-up": trendingUp, receipt, calculator,
} as const;
export type IconName = keyof typeof ICONS;

/** Returns an inline <svg> string for a Lucide icon, sized and stroked as requested. */
export function iconSvg(name: IconName, size: number, stroke: number): string {
  const raw = ICONS[name] ?? ICONS.calculator;
  const inner = raw.slice(raw.indexOf(">", raw.indexOf("<svg")) + 1, raw.lastIndexOf("</svg>")).trim();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
}
