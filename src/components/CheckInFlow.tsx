import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Heart, Award, ArrowRight } from 'lucide-react';
import type { Quest, UserAccount, FieldGuideItem } from '../types';
import { COMPANION_PROFILES } from '../data/questBank';
import { CompanionAvatar, NatureStickerIcon } from './CompanionAvatar';
import { generateCompanionReaction } from '../utils/aiClient';
import { playSoftChime } from '../utils/sound';
import { getGrowthStage } from '../utils/storage';
import { rollFieldGuideDiscovery } from '../data/fieldGuideData';

interface CheckInFlowProps {
  account: UserAccount;
  quest: Quest;
  minutesSpent: number;
  distanceMeters?: number;
  onCompleteCheckIn: (data: {
    sightedItems: string[];
    reflectionNote: string;
    companionReaction: string;
    titleAwarded: string;
    bonusXp: number;
    sourceLabel: string;
    discoveredGuideItem: FieldGuideItem;
    toggledBingoIds: string[];
  }) => void;
}

const SIGHTING_OPTIONS = [
  'Vibrant Leaves',
  'Bird Calls',
  'Cool Breeze',
  'Sunlight Through Trees',
  'Wildflowers or Moss',
  'Friendly Dog / Cat',
  'Interesting Cloud',
  'Smooth Stone or Acorn',
];

const MOOD_OPTIONS = ['Refreshed & Calm', 'Energized', 'Grounded', 'Happy & Cozy'];

export const CheckInFlow: React.FC<CheckInFlowProps> = ({
  account,
  quest,
  minutesSpent,
  distanceMeters,
  onCompleteCheckIn,
}) => {
  const [phase, setPhase] = useState<'reflection' | 'minigame' | 'celebration'>('reflection');
  const [selectedSightings, setSelectedSightings] = useState<string[]>(['Vibrant Leaves', 'Cool Breeze']);
  const [moodAfter, setMoodAfter] = useState<string>('Refreshed & Calm');
  const [reflectionNote, setReflectionNote] = useState('');
  const [toggledBingoIds, setToggledBingoIds] = useState<string[]>([]);
  const [discovery] = useState(() => rollFieldGuideDiscovery(account.unlockedFieldGuideIds || []));

  // 15-second Mini-game state ("Catch Falling Leaves & Pet Companion")
  const [timeLeft, setTimeLeft] = useState(12);
  const [leavesCaught, setLeavesCaught] = useState(0);
  const [fallingLeaves, setFallingLeaves] = useState<
    { id: number; x: number; color: string; caught: boolean }[]
  >([]);

  // AI Reaction state
  const [loadingReaction, setLoadingReaction] = useState(false);
  const [reactionData, setReactionData] = useState<{
    reaction: string;
    titleAwarded: string;
    sourceLabel: string;
  } | null>(null);

  const profile = COMPANION_PROFILES[account.companionId] || COMPANION_PROFILES.moss;

  const toggleSighting = (item: string) => {
    playSoftChime(account.aiSettings.soundEnabled, 'tap');
    setSelectedSightings((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Start Mini-game and trigger AI reaction fetch in parallel
  const startMiniGame = () => {
    playSoftChime(account.aiSettings.soundEnabled, 'start');
    setPhase('minigame');
    setLoadingReaction(true);

    // Spawn 10 colorful leaves
    const colors = ['#F59E0B', '#65A30D', '#EA580C', '#10B981', '#EAB308'];
    const initialLeaves = Array.from({ length: 10 }, (_, idx) => ({
      id: idx,
      x: 10 + ((idx * 17) % 78),
      color: colors[idx % colors.length],
      caught: false,
    }));
    setFallingLeaves(initialLeaves);

    generateCompanionReaction(
      account,
      quest.title,
      minutesSpent,
      selectedSightings,
      reflectionNote,
      moodAfter
    ).then((res) => {
      setReactionData(res);
      setLoadingReaction(false);
    });
  };

  // Mini-game countdown (12 seconds max, intentionally tiny)
  useEffect(() => {
    if (phase !== 'minigame') return;
    if (timeLeft <= 0) {
      playSoftChime(account.aiSettings.soundEnabled, 'complete');
      setPhase('celebration');
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timeLeft, account.aiSettings.soundEnabled]);

  const handleCatchLeaf = (id: number) => {
    playSoftChime(account.aiSettings.soundEnabled, 'leaf');
    setFallingLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, caught: true } : l)));
    setLeavesCaught((c) => c + 1);
  };

  const handlePetCompanion = () => {
    playSoftChime(account.aiSettings.soundEnabled, 'leaf');
    setLeavesCaught((c) => c + 1);
  };

  const bonusXp = Math.min(30, leavesCaught * 3);
  const totalXpEarned = quest.xp + bonusXp;
  const newGrowth = getGrowthStage(account.xp + totalXpEarned);

  return (
    <div className="fixed inset-0 z-50 bg-forest-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-meadow-cream w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-sage-200 my-auto"
      >
        <AnimatePresence mode="wait">
          {/* STEP 1: QUICK 20-SECOND REFLECTION */}
          {phase === 'reflection' && (
            <motion.div
              key="reflection"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <div className="flex items-center justify-between text-xs font-bold text-forest-700 mb-2">
                <span>Welcome Back from the Wild!</span>
                <span>{minutesSpent} min outdoors</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-forest-900 mb-1">
                Quick Trail Check-In
              </h2>
              <p className="text-xs text-forest-700 mb-5">
                Tap what you noticed out there so {profile.name} can log your adventure.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-forest-800 mb-2">
                    1. What did you spot or experience?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SIGHTING_OPTIONS.map((item) => {
                      const active = selectedSightings.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleSighting(item)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            active
                              ? 'bg-forest-800 text-white shadow-sm'
                              : 'bg-sage-100 text-forest-800 hover:bg-sage-200'
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5" />}
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-800 mb-2">
                    2. How do you feel after stepping away from the screen?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {MOOD_OPTIONS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMoodAfter(m)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          moodAfter === m
                            ? 'bg-forest-800 text-white shadow-sm'
                            : 'bg-sage-100 text-forest-800 hover:bg-sage-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-800 mb-1.5" htmlFor="note-input">
                    3. One tiny detail you noticed (Optional)
                  </label>
                  <input
                    id="note-input"
                    type="text"
                    value={reflectionNote}
                    onChange={(e) => setReflectionNote(e.target.value)}
                    placeholder="e.g. A squirrel carrying a huge acorn on a fence..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sage-200 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>

                {/* Quick Weekly Bingo Tick-off */}
                <div>
                  <label className="block text-xs font-bold text-forest-800 mb-1.5">
                    4. Tick off any Weekly Scavenger Bingo squares you spotted!
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {account.weeklyBingo.cells.map((cell) => {
                      const isDone = cell.completed || toggledBingoIds.includes(cell.id);
                      return (
                        <button
                          key={cell.id}
                          type="button"
                          onClick={() => {
                            if (cell.completed) return;
                            setToggledBingoIds((prev) =>
                              prev.includes(cell.id)
                                ? prev.filter((id) => id !== cell.id)
                                : [...prev, cell.id]
                            );
                          }}
                          className={`p-2 rounded-xl text-[11px] font-bold text-left border transition-all cursor-pointer ${
                            isDone
                              ? 'bg-forest-800 text-white border-forest-900'
                              : 'bg-sage-50 text-forest-800 border-sage-200 hover:bg-sage-100'
                          }`}
                        >
                          {isDone ? '✓ ' : ''}
                          {cell.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startMiniGame}
                  className="w-full py-3.5 px-6 rounded-2xl bg-forest-800 hover:bg-forest-700 text-white font-display font-semibold text-base flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
                >
                  <span>Continue to Companion Reward</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: INTENTIONALLY TINY 12-SECOND MINI-GAME */}
          {phase === 'minigame' && (
            <motion.div
              key="minigame"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-between text-xs font-bold text-forest-700 mb-2">
                <span>Mini-Bonus · Tap Falling Leaves or Pet {profile.name}!</span>
                <span className="font-mono text-sm text-amber-700">{timeLeft}s left</span>
              </div>

              <div className="relative h-64 w-full bg-gradient-to-b from-sage-100 to-sage-200/70 rounded-2xl overflow-hidden border border-sage-300 flex flex-col items-center justify-end pb-4 select-none">
                {/* Falling Leaves to Tap */}
                {fallingLeaves.map(
                  (leaf) =>
                    !leaf.caught && (
                      <motion.button
                        key={leaf.id}
                        type="button"
                        initial={{ y: -30, x: `${leaf.x}%`, rotate: 0 }}
                        animate={{ y: 240, rotate: 160 }}
                        transition={{
                          duration: 4 + (leaf.id % 3),
                          repeat: Infinity,
                          delay: leaf.id * 0.4,
                          ease: 'linear',
                        }}
                        onClick={() => handleCatchLeaf(leaf.id)}
                        style={{ left: `${leaf.x}%` }}
                        className="absolute top-0 p-2 cursor-pointer active:scale-125"
                        aria-label="Catch falling leaf"
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24">
                          <path
                            d="M20,4 C10,4 4,10 4,20 C14,20 20,14 20,4 Z"
                            fill={leaf.color}
                            stroke="#163020"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </motion.button>
                    )
                )}

                {/* Companion to Pet */}
                <div className="z-10 flex flex-col items-center">
                  <CompanionAvatar
                    companionId={account.companionId}
                    mood="excited"
                    stage={newGrowth.stage}
                    size="md"
                    interactive
                    onPet={handlePetCompanion}
                  />
                  <span className="text-xs font-bold text-forest-800 mt-1 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Bonus XP: +{bonusXp} XP</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSoftChime(account.aiSettings.soundEnabled, 'complete');
                  setPhase('celebration');
                }}
                className="mt-4 w-full py-3 px-4 rounded-2xl bg-sage-200 hover:bg-sage-300 text-forest-900 font-bold text-xs cursor-pointer"
              >
                Skip Timer & Reveal Rewards Now
              </button>
            </motion.div>
          )}

          {/* STEP 3: CELEBRATION + COMPANION AI REACTION */}
          {phase === 'celebration' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Leaf Confetti Burst */}
              <div className="flex justify-center mb-2">
                <CompanionAvatar
                  companionId={account.companionId}
                  mood="excited"
                  stage={newGrowth.stage}
                  size="md"
                />
              </div>

              <div className="text-xs font-bold text-amber-700 mb-1">
                Title Earned: {reactionData?.titleAwarded || 'Canopy Explorer'}
              </div>
              <h2 className="text-2xl font-display font-bold text-forest-900">
                +{totalXpEarned} XP · Grass Touched!
              </h2>

              {/* Companion Speech Bubble */}
              <div className="my-4 p-4 rounded-2xl bg-white border border-sage-200 text-left relative shadow-sm">
                <p className="text-xs font-bold text-forest-700 mb-1">
                  {profile.name} says:
                </p>
                {loadingReaction ? (
                  <p className="text-sm text-forest-800 italic">
                    Sniffing the fresh outdoor breeze on your jacket...
                  </p>
                ) : (
                  <p className="text-sm text-forest-900 leading-relaxed font-medium">
                    “{reactionData?.reaction || 'You actually went outside! My spores are thriving!'}”
                  </p>
                )}
                <div className="mt-2 pt-2 border-t border-sage-100 flex items-center justify-between text-[11px] text-forest-600">
                  <span>{reactionData?.sourceLabel || 'Offline Quest Book'}</span>
                  {distanceMeters && <span>Walked ~{distanceMeters}m</span>}
                </div>
              </div>

              {/* Collected Nature Sticker + Field Guide Discovery */}
              <motion.div
                initial={{ scale: 0.92 }}
                animate={{
                  scale: discovery.isLegendary ? [1, 1.04, 1] : 1,
                }}
                transition={{ duration: 0.8, repeat: discovery.isLegendary ? 2 : 0 }}
                className={`p-3.5 rounded-2xl border mb-5 text-left ${
                  discovery.isLegendary
                    ? 'bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-amber-400 shadow-md'
                    : 'bg-sage-100/80 border-sage-200'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <NatureStickerIcon type={quest.findType} className="w-11 h-11 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-amber-800 flex items-center gap-1">
                        {discovery.isLegendary && <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
                        <span>
                          {discovery.isLegendary
                            ? '★ LEGENDARY FIELD GUIDE FIND!'
                            : 'Field Guide Species Unlocked'}
                        </span>
                      </div>
                      <div className="text-sm font-display font-bold text-forest-900">
                        {discovery.item.name} ({discovery.item.scientificName})
                      </div>
                      <div className="text-[11px] text-forest-700 mt-0.5">
                        {discovery.item.funFact}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <button
                type="button"
                onClick={() =>
                  onCompleteCheckIn({
                    sightedItems: selectedSightings,
                    reflectionNote,
                    companionReaction:
                      reactionData?.reaction ||
                      'Nothing beats real sunlight and fresh air! Proud of you!',
                    titleAwarded: reactionData?.titleAwarded || 'Grass Toucher',
                    bonusXp,
                    sourceLabel: reactionData?.sourceLabel || 'Offline Quest Book',
                    discoveredGuideItem: discovery.item,
                    toggledBingoIds,
                  })
                }
                className="w-full py-3.5 px-6 rounded-2xl bg-forest-800 hover:bg-forest-700 text-white font-display font-semibold text-base flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Award className="w-5 h-5" />
                <span>Save to Trail Journal</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
