export type CompanionId = 'moss' | 'pip' | 'fernsworth' | 'beeatrice';

export type CompanionMood = 'sleepy' | 'happy' | 'excited' | 'grumpy';

export type GrowthStage = 'Seedling' | 'Sprout' | 'Bloom' | 'Legend';

export type OutdoorInterest =
  | 'hiking'
  | 'birding'
  | 'gardening'
  | 'running'
  | 'foliage'
  | 'stargazing';

export type QuestDifficulty = 'Easy' | 'Medium' | 'Epic';

export type FindType = 'leaf' | 'bird' | 'flower' | 'stone' | 'cloud' | 'acorn' | 'bug';

export type AccessoryId = 'none' | 'acorn_cap' | 'flower_crown' | 'cozy_scarf' | 'binoculars';

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  minutes: number;
  xp: number;
  category: OutdoorInterest;
  companionIntro: string;
  findName: string;
  findType: FindType;
  isWeatherBonus?: boolean;
  weatherBonusLabel?: string;
  isMysteryRoll?: boolean;
  mysteryBonusXp?: number;
}

export interface CompletedQuest {
  id: string;
  questId: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  minutesSpent: number;
  xpEarned: number;
  completedAt: string; // ISO date
  sightedItems: string[];
  reflectionNote: string;
  companionReaction: string;
  titleAwarded: string;
  findName: string;
  findType: FindType;
  fieldGuideIdUnlocked?: string;
  isLegendaryFind?: boolean;
  weatherSummary?: string;
  distanceMeters?: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
  iconType: 'sprout' | 'sun' | 'cloud-rain' | 'feather' | 'flower' | 'flame' | 'compass' | 'star';
}

export interface FieldGuideItem {
  id: string;
  name: string;
  category: 'leaves' | 'birds' | 'flowers' | 'bugs';
  rarity: 'Common' | 'Uncommon' | 'Legendary';
  scientificName: string;
  funFact: string;
  svgVariant: string;
}

export interface BingoCell {
  id: string;
  label: string;
  hint: string;
  completed: boolean;
  completedAt?: string;
}

export interface WeeklyBingoState {
  weekStartIso: string; // YYYY-MM-DD of Monday/week start
  cells: BingoCell[];
  claimedLines: number;
  fullHouseClaimed: boolean;
}

export interface AISettings {
  mode: 'serverless' | 'ollama' | 'offline';
  modelName: string;
  ollamaUrl: string;
  ollamaModel: string;
  soundEnabled: boolean;
}

export interface UserAccount {
  trailName: string;
  pinHash: string; // SHA-256 hex or 'GUEST'
  isGuest: boolean;
  onboarded: boolean;
  companionId: CompanionId;
  companionCustomName?: string;
  equippedAccessory: AccessoryId;
  city: string;
  latitude?: number;
  longitude?: number;
  interests: OutdoorInterest[];
  xp: number;
  streakDays: number;
  lastOutsideDate: string | null; // YYYY-MM-DD
  totalOutdoorMinutes: number;
  completedQuests: CompletedQuest[];
  unlockedBadges: string[];
  unlockedFieldGuideIds: string[];
  weeklyBingo: WeeklyBingoState;
  aiSettings: AISettings;
  createdAt: string;
}

export interface WeatherData {
  temperatureC: number;
  temperatureF: number;
  conditionText: string;
  isRainy: boolean;
  isFoggy: boolean;
  isClear: boolean;
  windSpeedKmh: number;
  fetchedAt: number;
}
