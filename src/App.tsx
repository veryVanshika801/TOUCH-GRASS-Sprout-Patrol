/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  BookOpen,
  HelpCircle,
  Settings,
  Home,
  Sparkles,
  Flame,
  Clock,
  CloudSun,
  RefreshCw,
  ArrowRight,
  X,
  Dices,
  Send,
  Share2,
  Lock,
} from 'lucide-react';
import type {
  AccessoryId,
  CompanionMood,
  CompletedQuest,
  FieldGuideItem,
  Quest,
  UserAccount,
  WeatherData,
} from './types';
import {
  getActiveAccount,
  getGrowthStage,
  getTodayDateString,
  getWeeklyMinutes,
  hasBeenOutsideToday,
  logoutActiveAccount,
  saveAccount,
} from './utils/storage';
import { fetchLocalWeather, getCurrentSeason, getTimeOfDayVibe } from './utils/weather';
import { generateOutdoorQuests, generateCompanionChatReply } from './utils/aiClient';
import {
  COMPANION_PROFILES,
  getWeatherBonusQuest,
  rollMysteryDiceQuest,
} from './data/questBank';
import { WARDROBE_ACCESSORIES, countBingoLines } from './data/fieldGuideData';
import { playSoftChime } from './utils/sound';
import { MeadowBackdrop } from './components/MeadowBackdrop';
import { CompanionAvatar, NatureStickerIcon } from './components/CompanionAvatar';
import { LoginOnboarding } from './components/LoginOnboarding';
import { OutInTheWorldMode } from './components/OutInTheWorldMode';
import { CheckInFlow } from './components/CheckInFlow';
import { JournalSection } from './components/JournalSection';
import { WhyOpenSection } from './components/WhyOpenSection';
import { SettingsSection } from './components/SettingsSection';
import { ShareCardModal } from './components/ShareCardModal';

type ActiveTab = 'home' | 'quests' | 'journal' | 'why-open' | 'settings';

export default function App() {
  const [account, setAccount] = useState<UserAccount | null>(() => getActiveAccount());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [weatherBonusQuest, setWeatherBonusQuest] = useState<Quest | null>(null);
  const [mysteryQuest, setMysteryQuest] = useState<Quest | null>(null);
  const [diceRolling, setDiceRolling] = useState(false);
  const [lastDiceNumber, setLastDiceNumber] = useState<number | null>(null);

  const [questSourceLabel, setQuestSourceLabel] = useState<string>('Offline Quest Book');
  const [loadingQuests, setLoadingQuests] = useState<boolean>(false);

  // Active Outdoor Session & Check-In states
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [isOutInWorld, setIsOutInWorld] = useState<boolean>(false);
  const [pendingCheckIn, setPendingCheckIn] = useState<{
    quest: Quest;
    minutesSpent: number;
    distanceMeters?: number;
  } | null>(null);

  // Companion speech, Easter Egg, Chat & Share states
  const [speechIdx, setSpeechIdx] = useState(0);
  const [customSpeechOverride, setCustomSpeechOverride] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [whyOpenModalOpen, setWhyOpenModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Load local weather via Open-Meteo
  useEffect(() => {
    if (!account || !account.onboarded) return;
    fetchLocalWeather(account.latitude, account.longitude, account.city).then((w) => {
      setWeather(w);
      const timeVibe = getTimeOfDayVibe();
      setWeatherBonusQuest(
        getWeatherBonusQuest(account.companionId, w.isRainy, w.isFoggy, timeVibe.label)
      );
    });
  }, [account?.city, account?.latitude, account?.longitude, account?.onboarded, account?.companionId]);

  // Generate 3 outdoor quests
  const handleGenerateQuests = useCallback(
    async (acc: UserAccount, currentWeather?: WeatherData | null) => {
      setLoadingQuests(true);
      const weatherSummary = currentWeather
        ? `${currentWeather.conditionText}, ${currentWeather.temperatureC}°C`
        : 'pleasant outdoor air';
      const result = await generateOutdoorQuests(acc, weatherSummary);
      setQuests(result.quests);
      setQuestSourceLabel(result.sourceLabel);
      setLoadingQuests(false);
    },
    []
  );

  useEffect(() => {
    if (account && account.onboarded && quests.length === 0 && !loadingQuests) {
      handleGenerateQuests(account, weather);
    }
  }, [account, weather, quests.length, loadingQuests, handleGenerateQuests]);

  const handleUpdateAccount = (updated: UserAccount) => {
    saveAccount(updated);
    setAccount(updated);
  };

  const handleLogout = () => {
    logoutActiveAccount();
    setAccount(null);
    setQuests([]);
    setActiveTab('home');
  };

  // Mystery Quest Dice Roller
  const handleRollMysteryDice = () => {
    if (!account || diceRolling) return;
    playSoftChime(account.aiSettings.soundEnabled, 'tap');
    setDiceRolling(true);
    setTimeout(() => {
      const rolled = rollMysteryDiceQuest(account.companionId);
      setMysteryQuest(rolled.quest);
      setLastDiceNumber(rolled.diceValue);
      setDiceRolling(false);
      playSoftChime(account.aiSettings.soundEnabled, 'start');
    }, 550);
  };

  // Talk to Your Companion (Open Model via /api/react with canned fallback)
  const handleSendCompanionChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatLoading(true);
    playSoftChime(account.aiSettings.soundEnabled, 'tap');

    const res = await generateCompanionChatReply(account, msg);
    setCustomSpeechOverride(res.reply);
    setQuestSourceLabel(res.sourceLabel);
    setChatLoading(false);
  };

  // Equip Cosmetic Accessory from Wardrobe
  const handleEquipAccessory = (accId: AccessoryId, unlockXp: number) => {
    if (!account || account.xp < unlockXp) return;
    playSoftChime(account.aiSettings.soundEnabled, 'tap');
    handleUpdateAccount({
      ...account,
      equippedAccessory: accId,
    });
  };

  // Start "Out in the World" Phone-Down mode
  const handleStartQuest = (quest: Quest) => {
    if (!account) return;
    playSoftChime(account.aiSettings.soundEnabled, 'start');
    setActiveQuest(quest);
    setIsOutInWorld(true);
  };

  // Finish "Out in the World" and enter 20-second Check-In flow
  const handleFinishOutside = (minutesSpent: number, distanceMeters?: number) => {
    if (!activeQuest) return;
    setIsOutInWorld(false);
    setPendingCheckIn({
      quest: activeQuest,
      minutesSpent,
      distanceMeters,
    });
  };

  // Complete Check-In, award XP, Streak, Field Guide Discovery, Bingo, and Badges
  const handleCompleteCheckIn = (data: {
    sightedItems: string[];
    reflectionNote: string;
    companionReaction: string;
    titleAwarded: string;
    bonusXp: number;
    sourceLabel: string;
    discoveredGuideItem: FieldGuideItem;
    toggledBingoIds: string[];
  }) => {
    if (!account || !pendingCheckIn) return;
    const { quest, minutesSpent, distanceMeters } = pendingCheckIn;
    const todayStr = getTodayDateString();
    const yesterday = new Date(Date.now() - 86400000);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    let nextStreak = account.streakDays;
    if (account.lastOutsideDate !== todayStr) {
      if (account.lastOutsideDate === yesterdayStr) {
        nextStreak += 1;
      } else {
        nextStreak = 1;
      }
    }

    // Update Weekly Bingo cells if any were ticked at check-in
    const updatedBingoCells = account.weeklyBingo.cells.map((cell) =>
      data.toggledBingoIds.includes(cell.id)
        ? { ...cell, completed: true, completedAt: new Date().toISOString() }
        : cell
    );
    const prevBingoLines = account.weeklyBingo.claimedLines || 0;
    const newBingoLines = countBingoLines(updatedBingoCells);
    const bingoLineBonusXp = newBingoLines > prevBingoLines ? (newBingoLines - prevBingoLines) * 40 : 0;

    const totalXpEarned = quest.xp + data.bonusXp + bingoLineBonusXp;
    const newTotalMinutes = account.totalOutdoorMinutes + minutesSpent;

    const newCompleted: CompletedQuest = {
      id: `completed-${Date.now()}`,
      questId: quest.id,
      title: quest.title,
      description: quest.description,
      difficulty: quest.difficulty,
      minutesSpent,
      xpEarned: totalXpEarned,
      completedAt: new Date().toISOString(),
      sightedItems: data.sightedItems,
      reflectionNote: data.reflectionNote,
      companionReaction: data.companionReaction,
      titleAwarded: data.titleAwarded,
      findName: quest.findName,
      findType: quest.findType,
      fieldGuideIdUnlocked: data.discoveredGuideItem.id,
      isLegendaryFind: data.discoveredGuideItem.rarity === 'Legendary',
      weatherSummary: weather ? `${weather.conditionText}, ${weather.temperatureC}°C` : undefined,
      distanceMeters,
    };

    // Check Badges
    const badgeSet = new Set(account.unlockedBadges);
    badgeSet.add('first_touch');
    if (new Date().getHours() < 9) badgeSet.add('dawn_patrol');
    if (weather?.isRainy) badgeSet.add('rain_or_shine');
    if (quest.isWeatherBonus) badgeSet.add('weather_bonus_master');
    if (newBingoLines > 0) badgeSet.add('bingo_champion');
    if (
      quest.category === 'birding' ||
      data.sightedItems.some((s) => s.toLowerCase().includes('bird'))
    ) {
      badgeSet.add('bird_nerd');
    }
    if (
      quest.category === 'gardening' ||
      data.sightedItems.some((s) => s.toLowerCase().includes('flower'))
    ) {
      badgeSet.add('green_thumb');
    }
    if (nextStreak >= 3) badgeSet.add('streak_3');
    if (nextStreak >= 7) badgeSet.add('streak_7');
    if (newTotalMinutes >= 60) badgeSet.add('hour_club');

    const guideSet = new Set(account.unlockedFieldGuideIds || []);
    guideSet.add(data.discoveredGuideItem.id);

    const updatedAccount: UserAccount = {
      ...account,
      xp: account.xp + totalXpEarned,
      streakDays: nextStreak,
      lastOutsideDate: todayStr,
      totalOutdoorMinutes: newTotalMinutes,
      completedQuests: [newCompleted, ...account.completedQuests],
      unlockedBadges: Array.from(badgeSet),
      unlockedFieldGuideIds: Array.from(guideSet),
      weeklyBingo: {
        ...account.weeklyBingo,
        cells: updatedBingoCells,
        claimedLines: Math.max(prevBingoLines, newBingoLines),
        fullHouseClaimed: updatedBingoCells.every((c) => c.completed),
      },
    };

    saveAccount(updatedAccount);
    setAccount(updatedAccount);
    setQuestSourceLabel(data.sourceLabel);
    setPendingCheckIn(null);
    setActiveQuest(null);
    setActiveTab('journal');
  };

  // If not logged in or not onboarded, render LoginOnboarding
  if (!account || !account.onboarded) {
    return (
      <MeadowBackdrop>
        <LoginOnboarding
          existingAccount={account}
          onComplete={(acc) => {
            setAccount(acc);
            handleGenerateQuests(acc, weather);
          }}
          onOpenWhyOpenModal={() => setWhyOpenModalOpen(true)}
        />
        {whyOpenModalOpen && (
          <div className="fixed inset-0 z-50 bg-forest-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-meadow-cream rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-sage-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold text-forest-900">
                  Why Open-Weight AI?
                </h3>
                <button
                  type="button"
                  onClick={() => setWhyOpenModalOpen(false)}
                  className="p-2 rounded-xl bg-sage-100 hover:bg-sage-200 text-forest-900 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <WhyOpenSection
                currentModel="meta-llama/Llama-3.2-3B-Instruct"
                aiMode="serverless"
                onGoToSettings={() => setWhyOpenModalOpen(false)}
              />
            </div>
          </div>
        )}
      </MeadowBackdrop>
    );
  }

  const profile = COMPANION_PROFILES[account.companionId] || COMPANION_PROFILES.moss;
  const outsideToday = hasBeenOutsideToday(account);
  const growth = getGrowthStage(account.xp);
  const weeklyMinutes = getWeeklyMinutes(account);
  const weeklyTarget = 120;
  const grassMeterPercent = Math.min(100, Math.round((weeklyMinutes / weeklyTarget) * 100));
  const season = getCurrentSeason();
  const timeVibe = getTimeOfDayVibe();

  const companionMood: CompanionMood = outsideToday
    ? 'happy'
    : account.companionId === 'moss'
      ? 'grumpy'
      : 'sleepy';

  const speechLines = outsideToday ? profile.happyLines : profile.sleepyLines;
  const activeSpeech = customSpeechOverride || speechLines[speechIdx % speechLines.length];

  // Easter Egg reaction lines when tapped 10 times
  const easterEggSpeech: Record<typeof account.companionId, string> = {
    moss: 'DRAMATIC FAINT! You tapped my mushroom cap 10 times! My spores are dizzy—take me outside immediately to revive me!',
    pip: 'DIZZY BIRD ZOOMIES! 10 taps!! I just did a double barrel roll in mid-air! Let’s fly outside!',
    fernsworth: 'BY MY FROND SHIELD! Ten rapid taps upon my armor?! Ticklishness is my only weakness, noble Ranger!',
    beeatrice: 'BZZZ-WHOA! 10 taps?! You’ve got my wings buzzing like a hummingbird! Let’s go pollinate the block!',
  };

  return (
    <MeadowBackdrop>
      {/* SHARE CARD MODAL */}
      {shareModalOpen && (
        <ShareCardModal account={account} onClose={() => setShareModalOpen(false)} />
      )}

      {/* OUT IN THE WORLD MODE OVERLAY */}
      {isOutInWorld && activeQuest && (
        <OutInTheWorldMode
          quest={activeQuest}
          companionId={account.companionId}
          onFinishOutside={handleFinishOutside}
          onCancel={() => {
            setIsOutInWorld(false);
            setActiveQuest(null);
          }}
        />
      )}

      {/* CHECK-IN & REWARD OVERLAY */}
      {pendingCheckIn && (
        <CheckInFlow
          account={account}
          quest={pendingCheckIn.quest}
          minutesSpent={pendingCheckIn.minutesSpent}
          distanceMeters={pendingCheckIn.distanceMeters}
          onCompleteCheckIn={handleCompleteCheckIn}
        />
      )}

      {/* TOP NAVIGATION BAR (3-Zone Contract: Brand — Nav Links — Primary CTA) */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-sage-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="text-lg sm:text-xl font-display font-bold tracking-tight text-forest-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            TOUCH GRASS: Sprout Patrol
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-forest-700">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`hover:text-forest-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'home' ? 'text-forest-900 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quests')}
              className={`hover:text-forest-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'quests' ? 'text-forest-900 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Quests
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('journal')}
              className={`hover:text-forest-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'journal' ? 'text-forest-900 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Journal & Guide
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('why-open')}
              className={`hover:text-forest-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'why-open' ? 'text-forest-900 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Why Open?
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`hover:text-forest-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'settings' ? 'text-forest-900 underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Settings
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('quests')}
              className="px-4 py-2 text-xs font-display font-bold text-white bg-forest-800 hover:bg-forest-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              Get a Quest
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-28 md:pb-16">
        {/* Contextual Sub-bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-forest-800 mb-6 px-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-forest-900">
              {questSourceLabel.includes('Offline')
                ? `🌿 ${questSourceLabel}`
                : `🧠 ${questSourceLabel}`}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {season} {timeVibe.label} in {account.city || 'Your Neighborhood'}
            </span>
            {weather && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {weather.conditionText} ({weather.temperatureC}°C / {weather.temperatureF}°F)
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 font-bold tabular-nums">
            <span className="text-amber-700">
              Streak: {account.streakDays} {account.streakDays === 1 ? 'Day' : 'Days'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {growth.stage} ({account.xp} XP)
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* TAB 1: HOME (Companion Sanctuary, Talk to Companion, Wardrobe & Grass Meter) */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* Left Column: Companion Sanctuary + Chat + Wardrobe */}
              <div className="lg:col-span-7 bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm flex flex-col justify-between space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-forest-700">
                      {outsideToday
                        ? 'Touched Grass Today · Thriving!'
                        : 'Waiting to Go Outside · Playfully Sleepy'}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900 mt-0.5">
                      {profile.name} the {profile.species}
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShareModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-sage-100 hover:bg-sage-200 text-forest-900 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Card</span>
                  </button>
                </div>

                {/* Interactive Companion Stage (with 10-tap Easter Egg & Wardrobe SVG) */}
                <div className="py-5 px-4 rounded-2xl bg-gradient-to-b from-sage-50/70 to-sage-100/90 border border-sage-200/80 flex flex-col items-center text-center">
                  <CompanionAvatar
                    companionId={account.companionId}
                    mood={companionMood}
                    stage={growth.stage}
                    accessory={account.equippedAccessory}
                    size="xl"
                    interactive
                    onPet={(_taps, isEasterEgg) => {
                      playSoftChime(account.aiSettings.soundEnabled, isEasterEgg ? 'complete' : 'tap');
                      if (isEasterEgg) {
                        setCustomSpeechOverride(easterEggSpeech[account.companionId]);
                      } else {
                        setCustomSpeechOverride(null);
                        setSpeechIdx((i) => i + 1);
                      }
                    }}
                  />

                  {/* Companion Speech Bubble */}
                  <div className="mt-3 max-w-md w-full bg-white px-5 py-3.5 rounded-2xl border border-sage-200 shadow-xs text-sm text-forest-900 font-medium leading-relaxed">
                    “{chatLoading ? 'Thinking in open-weight tokens...' : activeSpeech}”
                    <div className="text-[11px] text-forest-600 font-bold mt-1">
                      Tip: Tap {profile.name} 10 times for a secret reaction!
                    </div>
                  </div>

                  {/* Talk to Your Companion Input */}
                  <form
                    onSubmit={handleSendCompanionChat}
                    className="mt-3 w-full max-w-md flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={`Say hi to ${profile.name} (powered by open AI)...`}
                      aria-label={`Chat with ${profile.name}`}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-sage-200 text-xs font-semibold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading}
                      className="px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </form>
                </div>

                {/* Companion Wardrobe (Unlockable SVG Cosmetics with XP) */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-forest-800 mb-2">
                    <span>Companion Wardrobe (Unlock with Outdoor XP)</span>
                    <span className="tabular-nums">{account.xp} XP Available</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {WARDROBE_ACCESSORIES.map((item) => {
                      const unlocked = account.xp >= item.unlockXp;
                      const equipped = account.equippedAccessory === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          disabled={!unlocked}
                          onClick={() => handleEquipAccessory(item.id, item.unlockXp)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            equipped
                              ? 'bg-forest-800 text-white border-forest-900 shadow-xs cursor-pointer'
                              : unlocked
                                ? 'bg-sage-50 hover:bg-sage-100 text-forest-900 border-sage-200 cursor-pointer'
                                : 'bg-sage-50/40 text-forest-600/50 border-sage-200/50 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-xs font-display font-bold leading-tight">
                            {item.name}
                          </div>
                          <div className="text-[10px] mt-1 flex items-center gap-1 font-semibold">
                            {unlocked ? (
                              equipped ? (
                                'Equipped ✓'
                              ) : (
                                'Tap to Wear'
                              )
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>{item.unlockXp} XP</span>
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Growth Stage XP Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-forest-800 mb-1.5 tabular-nums">
                    <span>
                      Growth XP: {account.xp} XP ({growth.stage})
                    </span>
                    <span>
                      {growth.nextStage
                        ? `${growth.xpForNext} XP to ${growth.nextStage}`
                        : 'Max Stage: Woodland Legend!'}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-sage-100 rounded-full overflow-hidden border border-sage-200">
                    <div
                      className="h-full bg-forest-700 rounded-full transition-all duration-500"
                      style={{ width: `${growth.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Grass Meter, Weather Vibe & Big "Get a Quest" CTA */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-display font-bold text-forest-900">
                      Weekly Grass Meter
                    </h2>
                    <span className="font-mono font-bold text-sm text-forest-800 tabular-nums">
                      {weeklyMinutes} / {weeklyTarget} min
                    </span>
                  </div>
                  <p className="text-xs text-forest-700 mb-4">
                    Real-world outdoor minutes logged over the past 7 days.
                  </p>

                  <div className="w-full h-4 bg-sage-100 rounded-full overflow-hidden border border-sage-200 mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-sage-500 to-forest-700 rounded-full transition-all duration-500"
                      style={{ width: `${grassMeterPercent}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-sage-200/80">
                    <div className="p-3 rounded-2xl bg-sage-50/90">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                        <Flame className="w-4 h-4" />
                        <span>Daily Streak</span>
                      </div>
                      <div className="text-2xl font-display font-bold text-forest-900 mt-1 tabular-nums">
                        {account.streakDays} {account.streakDays === 1 ? 'Day' : 'Days'}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-sage-50/90">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-forest-700">
                        <CloudSun className="w-4 h-4" />
                        <span>Today’s Vibe</span>
                      </div>
                      <div className="text-sm font-display font-bold text-forest-900 mt-1 line-clamp-1">
                        {weather ? `${weather.temperatureC}°C · ${weather.conditionText}` : timeVibe.greeting}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Call to Action Card */}
                <div className="bg-forest-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-xs font-bold text-amber-300">
                      The Screen is the Shortest Part
                    </div>
                    <h2 className="text-2xl font-display font-bold mt-1">
                      Ready to touch some grass?
                    </h2>
                    <p className="text-xs sm:text-sm text-sage-200 mt-2 leading-relaxed">
                      Pick a quest, roll the <strong>Mystery Quest Dice</strong>, or claim today’s <strong>2x XP Weather Bonus</strong>!
                    </p>
                  </div>

                  <div className="mt-6 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('quests')}
                      className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-forest-900 font-display font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Explore Quests & Mystery Dice</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: QUESTS (3 AI Quests + Weather 2x Bonus + Mystery Quest Dice) */}
          {activeTab === 'quests' && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-forest-700">
                    {questSourceLabel.includes('Offline')
                      ? `🌿 ${questSourceLabel}`
                      : `🧠 ${questSourceLabel}`}{' '}
                    · Tailored for {account.city || 'Your Area'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest-900 mt-0.5">
                    Today’s Outdoor Quest Board
                  </h2>
                  <p className="text-xs sm:text-sm text-forest-700 mt-1">
                    Pick a quest below, tap <strong>Go Outside</strong>, and put your phone in your pocket.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRollMysteryDice}
                    className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-forest-900 font-display font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <motion.div
                      animate={diceRolling ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Dices className="w-4 h-4" />
                    </motion.div>
                    <span>
                      {diceRolling
                        ? 'Rolling Dice...'
                        : lastDiceNumber
                          ? `Rolled #${lastDiceNumber}! Roll Again`
                          : 'Roll Mystery Quest Dice'}
                    </span>
                  </motion.button>

                  <button
                    type="button"
                    disabled={loadingQuests}
                    onClick={() => handleGenerateQuests(account, weather)}
                    className="px-4 py-3 rounded-2xl bg-sage-100 hover:bg-sage-200 text-forest-900 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingQuests ? 'animate-spin' : ''}`} />
                    <span>{loadingQuests ? 'Crafting...' : 'New AI Quests'}</span>
                  </button>
                </div>
              </div>

              {/* Special Row: Mystery Dice Quest (if rolled) + Live Open-Meteo 2x XP Weather Bonus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {weatherBonusQuest && (
                  <div className="bg-gradient-to-br from-amber-50/95 via-white to-sage-50 rounded-3xl p-6 border-2 border-amber-300 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1.5 tabular-nums">
                        <span>⚡ {weatherBonusQuest.weatherBonusLabel} · 2x XP!</span>
                        <span>
                          {weatherBonusQuest.minutes} min · +{weatherBonusQuest.xp} XP
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-forest-900">
                        {weatherBonusQuest.title}
                      </h3>
                      <p className="text-sm text-forest-800 mt-2 leading-relaxed">
                        {weatherBonusQuest.description}
                      </p>
                      <p className="text-xs text-forest-700 italic mt-2">
                        “{weatherBonusQuest.companionIntro}”
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartQuest(weatherBonusQuest)}
                      className="mt-5 w-full py-3 px-5 rounded-2xl bg-forest-800 hover:bg-forest-700 text-white font-display font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CloudSun className="w-4 h-4" />
                      <span>Start 2x XP Weather Quest ({weatherBonusQuest.minutes}m)</span>
                    </button>
                  </div>
                )}

                {mysteryQuest ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-emerald-50/95 via-white to-amber-50 rounded-3xl p-6 border-2 border-forest-700 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-forest-800 mb-1.5 tabular-nums">
                        <span>🎲 Mystery Dice Bonus (+{mysteryQuest.mysteryBonusXp} Bonus XP!)</span>
                        <span>
                          {mysteryQuest.minutes} min · +{mysteryQuest.xp} XP
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-forest-900">
                        {mysteryQuest.title}
                      </h3>
                      <p className="text-sm text-forest-800 mt-2 leading-relaxed">
                        {mysteryQuest.description}
                      </p>
                      <p className="text-xs text-forest-700 italic mt-2">
                        “{mysteryQuest.companionIntro}”
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartQuest(mysteryQuest)}
                      className="mt-5 w-full py-3 px-5 rounded-2xl bg-forest-800 hover:bg-forest-700 text-white font-display font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Dices className="w-4 h-4" />
                      <span>Accept Mystery Roll ({mysteryQuest.minutes}m)</span>
                    </button>
                  </motion.div>
                ) : (
                  <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 border border-dashed border-sage-300 flex flex-col items-center justify-center text-center">
                    <Dices className="w-8 h-8 text-amber-600 mb-2" />
                    <h3 className="text-lg font-display font-bold text-forest-900">
                      Feeling Spontaneous? Roll the Mystery Dice!
                    </h3>
                    <p className="text-xs text-forest-700 mt-1 max-w-sm mb-4">
                      Roll a 6-sided nature die for a wildcard outdoor mission with up to +120 bonus XP.
                    </p>
                    <button
                      type="button"
                      onClick={handleRollMysteryDice}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-forest-900 font-display font-bold text-xs cursor-pointer"
                    >
                      Roll Mystery Dice Now
                    </button>
                  </div>
                )}
              </div>

              {/* 3 Standard Tailored Quests */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                {quests.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-sage-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-forest-700 mb-2 tabular-nums">
                        <span>
                          {q.difficulty} · {q.minutes} min · +{q.xp} XP
                        </span>
                        <span className="capitalize">{q.category}</span>
                      </div>

                      <h3 className="text-xl font-display font-bold text-forest-900 leading-snug">
                        {q.title}
                      </h3>

                      <p className="text-sm text-forest-800/90 mt-2.5 leading-relaxed">
                        {q.description}
                      </p>

                      <div className="mt-4 p-3.5 rounded-2xl bg-sage-50 border border-sage-200/80 flex items-start gap-2.5">
                        <div className="shrink-0">
                          <CompanionAvatar
                            companionId={account.companionId}
                            mood="excited"
                            accessory={account.equippedAccessory}
                            size="sm"
                          />
                        </div>
                        <div className="text-xs text-forest-800 italic leading-relaxed">
                          <strong className="not-italic text-forest-900">{profile.name}:</strong> “{q.companionIntro}”
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-sage-200/70">
                      <div className="flex items-center justify-between text-xs text-forest-700 mb-3">
                        <span>Reward Sticker:</span>
                        <span className="font-bold text-forest-900 flex items-center gap-1.5">
                          <NatureStickerIcon type={q.findType} className="w-4 h-4" />
                          {q.findName}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartQuest(q)}
                        className="w-full py-3.5 px-5 rounded-2xl bg-forest-800 hover:bg-forest-700 active:scale-[0.99] text-white font-display font-semibold text-base shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Go Outside ({q.minutes}m)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: JOURNAL, BINGO & FIELD GUIDE */}
          {activeTab === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <JournalSection
                account={account}
                onUpdateAccount={handleUpdateAccount}
                onStartQuestPrompt={() => setActiveTab('quests')}
              />
            </motion.div>
          )}

          {/* TAB 4: WHY OPEN? */}
          {activeTab === 'why-open' && (
            <motion.div
              key="why-open"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <WhyOpenSection
                currentModel={account.aiSettings.modelName}
                aiMode={account.aiSettings.mode}
                onGoToSettings={() => setActiveTab('settings')}
              />
            </motion.div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SettingsSection
                account={account}
                onUpdateAccount={(updated) => {
                  handleUpdateAccount(updated);
                  handleGenerateQuests(updated, weather);
                }}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sage-200 grid grid-cols-5 items-center h-16 px-1"
      >
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
            activeTab === 'home' ? 'text-forest-900 font-bold' : 'text-forest-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quests')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
            activeTab === 'quests' ? 'text-forest-900 font-bold' : 'text-forest-600'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-1">Quests</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('journal')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
            activeTab === 'journal' ? 'text-forest-900 font-bold' : 'text-forest-600'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-1">Journal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('why-open')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
            activeTab === 'why-open' ? 'text-forest-900 font-bold' : 'text-forest-600'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] mt-1">Why Open?</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
            activeTab === 'settings' ? 'text-forest-900 font-bold' : 'text-forest-600'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] mt-1">Settings</span>
        </button>
      </nav>
    </MeadowBackdrop>
  );
}
