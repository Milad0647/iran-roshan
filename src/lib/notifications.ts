import type { TileValue } from "./constants";
import { TILES } from "./constants";

export type NotificationVariant = "toast" | "card" | "warning";

export interface GameNotification {
  id: string;
  variant: NotificationVariant;
  title?: string;
  message: string;
  duration: number;
}

const SPECIAL_CARD_TILES: TileValue[] = [16, 128, 256, 1024, 2048];

const TILE_UNLOCK_MESSAGES: Record<TileValue, { title: string; message: string }> = {
  2: {
    title: "رفتار جدید باز شد: چراغ خاموش",
    message: "خاموش کردن چراغ اضافه، ساده‌ترین قدم صرفه‌جویی است.",
  },
  4: {
    title: "رفتار جدید باز شد: دور کند کولر",
    message: "دور کند کولر، مصرف برق رو کمتر می‌کنه و همچنان خنکی مناسبی می‌ده.",
  },
  8: {
    title: "رفتار جدید باز شد: لامپ LED",
    message: "لامپ LED نور کافی می‌ده و برق کمتری مصرف می‌کنه.",
  },
  16: {
    title: "کولر ۲۵ باز شد!",
    message: "۲۵ درجه یعنی خنکی کافی، مصرف کمتر.",
  },
  32: {
    title: "رفتار جدید باز شد: مصرف کمتر",
    message: "کم کردن وسایل پرمصرف، فشار شبکه رو پایین می‌آره.",
  },
  64: {
    title: "زمان درست مصرف رو شناختی",
    message: "وسایل پرمصرف رو به ساعت‌های کم‌مصرف منتقل کن.",
  },
  128: {
    title: "پیک ممنوع باز شد!",
    message: "در زمان اوج مصرف، وسایل سنگین رو روشن نکنیم.",
  },
  256: {
    title: "خانه کم‌مصرف باز شد!",
    message: "خانه کم‌مصرف یعنی سهم تو در حفظ روشنایی.",
  },
  512: {
    title: "کوچه روشن باز شد!",
    message: "وقتی چند خانه درست مصرف کنن، کوچه روشن‌تر می‌مونه.",
  },
  1024: {
    title: "محله همدل باز شد!",
    message: "همدلی در مصرف، از خانه شروع می‌شه و به محله می‌رسه.",
  },
  2048: {
    title: "ایران روشن باز شد!",
    message: "انتخاب‌های کوچک ما، روشنایی ایران رو حفظ می‌کنه.",
  },
};

const SHORT_TIPS = [
  "کولر روی ۲۵ یعنی مصرف کمتر، خنکی کافی‌تر.",
  "وسایل سنگین رو هم‌زمان روشن نکنیم.",
  "در ساعت اوج مصرف، هر انتخاب درست مهمه.",
  "لامپ اضافه خاموش، فشار کمتر روی شبکه.",
  "مصرف کمتر یعنی روشنایی بیشتر برای همه.",
  "دور کند کولر، یک تغییر کوچک اما مؤثره.",
  "هر خانه کم‌مصرف، به پایداری برق کمک می‌کنه.",
  "وسایل سنگین رو به ساعت کم‌مصرف منتقل کن.",
];

const ENCOURAGEMENT_MESSAGES = [
  "عالیه! اثر روشنایی رو دو برابر کردی.",
  "همین چند حرکت ساده، یعنی مصرف هوشمندتر.",
  "تو مسیر ایران روشن هستی.",
  "داری به خانه کم‌مصرف نزدیک می‌شی.",
];

const PEAK_WARNINGS = [
  {
    title: "هشدار پیک مصرف!",
    message: "الان وقت روشن کردن وسایل پرمصرف نیست. تلاش کن کاشی «پیک ممنوع» رو بسازی.",
  },
  {
    title: "هشدار پیک مصرف!",
    message: "در ساعت اوج مصرف، کولر روی ۲۵ و وسایل سنگین بعداً.",
  },
];

let notificationCounter = 0;

function createNotification(
  variant: NotificationVariant,
  message: string,
  title?: string,
  duration?: number,
): GameNotification {
  notificationCounter += 1;
  const defaultDuration = variant === "card" ? 2200 : variant === "warning" ? 2800 : 2500;
  return {
    id: `notif-${notificationCounter}`,
    variant,
    title,
    message,
    duration: duration ?? defaultDuration,
  };
}

export function buildIntroNotification(): GameNotification {
  return createNotification(
    "toast",
    "کاشی‌های هم‌عدد رو ترکیب کن. هر ترکیب، اثر روشنایی رو دو برابر می‌کنه.",
    "راهنمای سریع",
    3200,
  );
}

export function buildUnlockNotification(tile: TileValue): GameNotification {
  const content = TILE_UNLOCK_MESSAGES[tile];
  const isCard = SPECIAL_CARD_TILES.includes(tile);

  if (tile === 16) {
    return createNotification("card", content.message, content.title, 2400);
  }

  if (isCard) {
    return createNotification("card", content.message, content.title, 2200);
  }

  return createNotification("toast", content.message, content.title);
}

export function buildPeakWarning(moveCount: number): GameNotification {
  const index = Math.floor(moveCount / 20) % PEAK_WARNINGS.length;
  const warning = PEAK_WARNINGS[index];
  return createNotification("warning", warning.message, warning.title, 3000);
}

export function buildNearFullWarning(): GameNotification {
  return createNotification(
    "warning",
    "جدول شلوغ شد؛ مصرف هم اگه شلوغ بشه، شبکه فشار می‌کشه.",
    "حواست به مدیریت مصرف باشه!",
    2600,
  );
}

export function buildRandomTip(shownTipIndices: Set<number>): GameNotification {
  const available = SHORT_TIPS.map((_, i) => i).filter((i) => !shownTipIndices.has(i));
  const pool = available.length > 0 ? available : SHORT_TIPS.map((_, i) => i);
  const index = pool[Math.floor(Math.random() * pool.length)];

  return {
    ...createNotification("toast", SHORT_TIPS[index]),
    id: `notif-tip-${index}-${++notificationCounter}`,
  };
}

export function getTipIndex(notification: GameNotification): number | null {
  const match = notification.id.match(/^notif-tip-(\d+)-/);
  return match ? parseInt(match[1], 10) : null;
}

export function buildEncouragement(highestTile: number): GameNotification {
  if (highestTile >= 16 && Math.random() > 0.5) {
    return createNotification("toast", "کاشی ۲۵ رو ساختی؛ قهرمان مصرف درست شدی!", "آفرین!");
  }

  const message =
    ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
  return createNotification("toast", message);
}

export function buildLoseSummary(highestTile: number): string {
  const config = TILES[highestTile as TileValue];
  if (!config) {
    return "برای ساختن ایران روشن، دوباره تلاش کن و مصرف‌ها رو بهتر مدیریت کن.";
  }
  return `این بار تا «${config.shortName}» رسیدی. برای ساختن ایران روشن، دوباره تلاش کن و مصرف‌ها رو بهتر مدیریت کن.`;
}

export const PERIODIC_TIP_INTERVAL = 6;
export const PEAK_WARNING_INTERVAL = 20;
export const MERGE_STREAK_FOR_ENCOURAGEMENT = 3;
export const NEAR_FULL_EMPTY_CELLS = 2;
