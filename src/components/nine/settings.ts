export function digitClass(digit: number, ink: string, given: boolean): string {
  if (ink === "mono") {
    return given ? "text-ink font-bold" : "text-ink/80";
  }

  // Colorful digit classes for numbers 1 to 9
  const digitColors: Record<number, string> = {
    1: "text-rose-500 dark:text-rose-400",
    2: "text-amber-500 dark:text-amber-400",
    3: "text-emerald-500 dark:text-emerald-400",
    4: "text-sky-500 dark:text-sky-400",
    5: "text-indigo-500 dark:text-indigo-400",
    6: "text-purple-500 dark:text-purple-400",
    7: "text-pink-500 dark:text-pink-400",
    8: "text-orange-500 dark:text-orange-400",
    9: "text-teal-500 dark:text-teal-400",
  };

  const color = digitColors[digit] ?? "text-ink";
  return given ? `${color} font-bold` : color;
}
