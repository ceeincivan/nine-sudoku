export const REACTIONS = ["🦆", "🔥", "💩", "💀", "🤡", "⚡"] as const;
export type Reaction = (typeof REACTIONS)[number];

export const TAUNTS = [
  "Quack quack! That cell was WRONG! 🦆",
  "Is that your final answer? Oof. 💀",
  "Bold strategy... let's see if it pays off. 🤡",
  "Even a random number generator would perform better! ⚡",
  "Did you close your eyes for that move? 🔥",
  "That placement just hurt my soul. 💩",
  "Sudoku is supposed to be relaxing, not a disaster! 🦆",
  "You're making this look harder than quantum physics! ⚡",
  "Ouch! Watch out for those red numbers! 💀",
  "Are you guessing or just feeling lucky? 🤡",
];

export function getRandomTaunts(count = 3): string[] {
  const shuffled = [...TAUNTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, TAUNTS.length));
}
