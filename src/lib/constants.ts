export type TileValue = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048;

export type Direction = "up" | "down" | "left" | "right";

export type GameScreen = "start" | "game" | "win" | "lose";

export interface TileConfig {
  value: TileValue;
  name: string;
  shortName: string;
  icon: string;
  bg: string;
  text: string;
  border?: string;
  glow?: boolean;
  isSpecial?: boolean;
}

export interface RankConfig {
  minValue: TileValue;
  title: string;
}

export const GRID_SIZE = 4;

export const WIN_VALUE: TileValue = 2048;

export const GAME_URL = "https://iran-roshan.ir";

export const TILES: Record<TileValue, TileConfig> = {
  2: {
    value: 2,
    name: "چراغ خاموش",
    shortName: "چراغ خاموش",
    icon: "💡",
    bg: "bg-white",
    text: "text-gray-700",
    border: "border border-gray-200",
  },
  4: {
    value: 4,
    name: "دور کند کولر",
    shortName: "دور کند کولر",
    icon: "❄️",
    bg: "bg-sky-100",
    text: "text-sky-800",
  },
  8: {
    value: 8,
    name: "لامپ LED",
    shortName: "لامپ LED",
    icon: "🔆",
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  16: {
    value: 16,
    name: "کولر ۲۵",
    shortName: "کولر ۲۵",
    icon: "🌡️",
    bg: "bg-gradient-to-br from-yellow-300 to-blue-400",
    text: "text-white",
    glow: true,
    isSpecial: true,
  },
  32: {
    value: 32,
    name: "وسایل پرمصرف کمتر",
    shortName: "مصرف کمتر",
    icon: "⚡",
    bg: "bg-amber-100",
    text: "text-amber-900",
  },
  64: {
    value: 64,
    name: "ساعت کم‌مصرف",
    shortName: "ساعت کم‌مصرف",
    icon: "🕐",
    bg: "bg-orange-100",
    text: "text-orange-900",
  },
  128: {
    value: 128,
    name: "پیک مصرف ممنوع",
    shortName: "پیک ممنوع",
    icon: "🚫",
    bg: "bg-red-100",
    text: "text-red-800",
  },
  256: {
    value: 256,
    name: "خانه کم‌مصرف",
    shortName: "خانه کم‌مصرف",
    icon: "🏠",
    bg: "bg-gradient-to-br from-green-200 to-yellow-200",
    text: "text-green-900",
    glow: true,
  },
  512: {
    value: 512,
    name: "کوچه روشن",
    shortName: "کوچه روشن",
    icon: "🏘️",
    bg: "bg-gradient-to-br from-yellow-200 to-sky-200",
    text: "text-blue-900",
    glow: true,
  },
  1024: {
    value: 1024,
    name: "محله همدل",
    shortName: "محله همدل",
    icon: "🤝",
    bg: "bg-gradient-to-br from-blue-300 to-yellow-300",
    text: "text-blue-900",
    glow: true,
  },
  2048: {
    value: 2048,
    name: "ایران روشن",
    shortName: "ایران روشن",
    icon: "🇮🇷",
    bg: "bg-gradient-to-br from-yellow-400 via-amber-300 to-blue-500",
    text: "text-white",
    glow: true,
    isSpecial: true,
  },
};

export const RANKS: RankConfig[] = [
  { minValue: 2048, title: "سازنده ایران روشن" },
  { minValue: 1024, title: "قهرمان همدلی" },
  { minValue: 512, title: "سفیر روشنایی" },
  { minValue: 256, title: "خانواده کم‌مصرف" },
  { minValue: 128, title: "نگهبان روشنایی" },
  { minValue: 64, title: "همیار انرژی" },
  { minValue: 16, title: "همراه ۲۵ درجه" },
];

export const SPECIAL_BONUS: Partial<Record<TileValue, number>> = {
  16: 25,
  2048: 2048,
};

export function getTileConfig(value: number): TileConfig | null {
  if (value in TILES) {
    return TILES[value as TileValue];
  }
  return null;
}

export function getRank(highestTile: number): string {
  for (const rank of RANKS) {
    if (highestTile >= rank.minValue) {
      return rank.title;
    }
  }
  return "تازه‌کار روشنایی";
}

export function formatPersianNumber(num: number): string {
  return num.toLocaleString("fa-IR");
}

export function formatTileNumber(num: number): string {
  return num.toLocaleString("fa-IR", { useGrouping: false });
}
