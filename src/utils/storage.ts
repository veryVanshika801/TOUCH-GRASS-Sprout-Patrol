import type { UserAccount, AchievementBadge, GrowthStage } from '../types';
import { createInitialWeeklyBingo } from '../data/fieldGuideData';

const ACCOUNTS_KEY = 'touch_grass_accounts_v1';
const ACTIVE_USER_KEY = 'touch_grass_active_user_v1';

// Hash 4-digit PIN using Web Crypto SHA-256 API (with deterministic fallback if running on non-HTTPS local IP)
export async function hashPin(pin: string): Promise<string> {
  const input = `sprout_patrol_salt_${pin}`;
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // Fallback below
  }
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function migrateAccount(acc: UserAccount): UserAccount {
  return {
    ...acc,
    equippedAccessory: acc.equippedAccessory || 'none',
    unlockedFieldGuideIds: Array.isArray(acc.unlockedFieldGuideIds) ? acc.unlockedFieldGuideIds : [],
    weeklyBingo: acc.weeklyBingo && Array.isArray(acc.weeklyBingo.cells)
      ? acc.weeklyBingo
      : createInitialWeeklyBingo(),
  };
}

export function getAllAccounts(): Record<string, UserAccount> {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, UserAccount>;
    Object.keys(parsed).forEach((k) => {
      parsed[k] = migrateAccount(parsed[k]);
    });
    return parsed;
  } catch {
    return {};
  }
}

export function saveAccount(account: UserAccount): void {
  const accounts = getAllAccounts();
  const key = account.trailName.trim().toLowerCase();
  accounts[key] = migrateAccount(account);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  localStorage.setItem(ACTIVE_USER_KEY, key);
}

export function getActiveAccount(): UserAccount | null {
  try {
    const key = localStorage.getItem(ACTIVE_USER_KEY);
    if (!key) return null;
    const accounts = getAllAccounts();
    return accounts[key] ? migrateAccount(accounts[key]) : null;
  } catch {
    return null;
  }
}

export function logoutActiveAccount(): void {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

export function createInitialAccount(trailName: string, pinHash: string, isGuest: boolean): UserAccount {
  return {
    trailName: trailName.trim(),
    pinHash,
    isGuest,
    onboarded: false,
    companionId: 'moss',
    equippedAccessory: 'none',
    city: '',
    interests: ['hiking', 'birding', 'foliage'],
    xp: 0,
    streakDays: 0,
    lastOutsideDate: null,
    totalOutdoorMinutes: 0,
    completedQuests: [],
    unlockedBadges: [],
    unlockedFieldGuideIds: [],
    weeklyBingo: createInitialWeeklyBingo(),
    aiSettings: {
      mode: 'serverless',
      modelName: 'meta-llama/Llama-3.2-3B-Instruct',
      ollamaUrl: 'http://localhost:11434',
      ollamaModel: 'llama3.2',
      soundEnabled: false,
    },
    createdAt: new Date().toISOString(),
  };
}

export function getGrowthStage(xp: number): {
  stage: GrowthStage;
  nextStage: GrowthStage | null;
  progressPercent: number;
  xpForNext: number;
  stageIndex: number;
} {
  if (xp < 100) {
    return {
      stage: 'Seedling',
      nextStage: 'Sprout',
      progressPercent: Math.min(100, Math.round((xp / 100) * 100)),
      xpForNext: 100 - xp,
      stageIndex: 1,
    };
  }
  if (xp < 300) {
    return {
      stage: 'Sprout',
      nextStage: 'Bloom',
      progressPercent: Math.min(100, Math.round(((xp - 100) / 200) * 100)),
      xpForNext: 300 - xp,
      stageIndex: 2,
    };
  }
  if (xp < 600) {
    return {
      stage: 'Bloom',
      nextStage: 'Legend',
      progressPercent: Math.min(100, Math.round(((xp - 300) / 300) * 100)),
      xpForNext: 600 - xp,
      stageIndex: 3,
    };
  }
  return {
    stage: 'Legend',
    nextStage: null,
    progressPercent: 100,
    xpForNext: 0,
    stageIndex: 4,
  };
}

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function hasBeenOutsideToday(account: UserAccount): boolean {
  return account.lastOutsideDate === getTodayDateString();
}

export function getWeeklyMinutes(account: UserAccount): number {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return account.completedQuests
    .filter((q) => new Date(q.completedAt).getTime() >= oneWeekAgo)
    .reduce((sum, q) => sum + q.minutesSpent, 0);
}

export const ALL_BADGES: AchievementBadge[] = [
  {
    id: 'first_touch',
    title: 'First Touch',
    description: 'Completed your very first real-world outdoor quest.',
    iconType: 'sprout',
  },
  {
    id: 'dawn_patrol',
    title: 'Dawn Patrol',
    description: 'Checked in from an outdoor quest before 9:00 AM.',
    iconType: 'sun',
  },
  {
    id: 'rain_or_shine',
    title: 'Rain or Shine',
    description: 'Ventured outside during rainy or misty weather.',
    iconType: 'cloud-rain',
  },
  {
    id: 'bird_nerd',
    title: 'Bird Nerd',
    description: 'Spotted birds or completed a birding quest in the wild.',
    iconType: 'feather',
  },
  {
    id: 'green_thumb',
    title: 'Green Thumb',
    description: 'Completed a gardening or botanical Care quest.',
    iconType: 'flower',
  },
  {
    id: 'streak_3',
    title: '3-Day Trailblazer',
    description: 'Maintained a 3-day outdoor Touch Grass streak.',
    iconType: 'flame',
  },
  {
    id: 'streak_7',
    title: '7-Day Streak Legend',
    description: 'Touched grass 7 days in a row without missing a beat.',
    iconType: 'star',
  },
  {
    id: 'hour_club',
    title: '60-Minute Canopy Club',
    description: 'Logged over 60 minutes of real-world outdoor time.',
    iconType: 'compass',
  },
  {
    id: 'weather_bonus_master',
    title: 'Storm & Sunbeam Chaser',
    description: 'Completed a 2x XP Weather Bonus quest during rain, mist, or golden hour.',
    iconType: 'cloud-rain',
  },
  {
    id: 'bingo_champion',
    title: 'Scavenger Bingo Line',
    description: 'Completed a 3-in-a-row line on your Weekly Outdoor Bingo card.',
    iconType: 'star',
  },
];
