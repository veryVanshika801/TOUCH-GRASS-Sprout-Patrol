import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Check, Grid } from 'lucide-react';
import type { UserAccount, FieldGuideItem } from '../types';
import {
  FIELD_GUIDE_CATALOG,
  countBingoLines,
  createInitialWeeklyBingo,
} from '../data/fieldGuideData';
import { NatureStickerIcon } from './CompanionAvatar';
import { playSoftChime } from '../utils/sound';

interface FieldGuideAndBingoModalProps {
  account: UserAccount;
  onUpdateAccount: (updated: UserAccount) => void;
}

export const FieldGuideSection: React.FC<FieldGuideAndBingoModalProps> = ({
  account,
  onUpdateAccount,
}) => {
  const [filterCat, setFilterCat] = useState<'all' | 'leaves' | 'birds' | 'flowers' | 'bugs'>('all');
  const [selectedEntry, setSelectedEntry] = useState<FieldGuideItem | null>(null);

  const unlockedIds = account.unlockedFieldGuideIds || [];
  const filteredCatalog =
    filterCat === 'all'
      ? FIELD_GUIDE_CATALOG
      : FIELD_GUIDE_CATALOG.filter((item) => item.category === filterCat);

  const handleToggleBingoCell = (cellId: string) => {
    playSoftChime(account.aiSettings.soundEnabled, 'tap');
    const updatedCells = account.weeklyBingo.cells.map((c) =>
      c.id === cellId
        ? {
            ...c,
            completed: !c.completed,
            completedAt: !c.completed ? new Date().toISOString() : undefined,
          }
        : c
    );

    const newLines = countBingoLines(updatedCells);
    const prevLines = account.weeklyBingo.claimedLines || 0;
    const bonusXpFromBingo = newLines > prevLines ? (newLines - prevLines) * 40 : 0;

    if (bonusXpFromBingo > 0) {
      playSoftChime(account.aiSettings.soundEnabled, 'complete');
    }

    const nextBadges = new Set(account.unlockedBadges);
    if (newLines > 0) {
      nextBadges.add('bingo_champion');
    }

    onUpdateAccount({
      ...account,
      xp: account.xp + bonusXpFromBingo,
      unlockedBadges: Array.from(nextBadges),
      weeklyBingo: {
        ...account.weeklyBingo,
        cells: updatedCells,
        claimedLines: Math.max(prevLines, newLines),
        fullHouseClaimed: updatedCells.every((c) => c.completed),
      },
    });
  };

  const handleResetBingoCard = () => {
    onUpdateAccount({
      ...account,
      weeklyBingo: createInitialWeeklyBingo(),
    });
  };

  const mapCategoryToFindType = (cat: FieldGuideItem['category']) => {
    if (cat === 'leaves') return 'leaf';
    if (cat === 'birds') return 'bird';
    if (cat === 'flowers') return 'flower';
    return 'bug';
  };

  const activeLines = countBingoLines(account.weeklyBingo.cells);

  return (
    <div className="space-y-6">
      {/* 1. WEEKLY 3x3 OUTDOOR SCAVENGER BINGO CARD */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-forest-800" />
            <h3 className="text-xl font-display font-bold text-forest-900">
              Weekly 3×3 Outdoor Scavenger Bingo
            </h3>
          </div>
          <div className="text-xs font-bold text-amber-700 tabular-nums">
            Bingo Lines: {activeLines} (+40 XP per line!)
          </div>
        </div>
        <p className="text-xs text-forest-700 mb-4">
          Tick off real-world sights as you spot them on your walks! Every 3-in-a-row line awards +40 bonus XP.
        </p>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 max-w-lg mx-auto">
          {account.weeklyBingo.cells.map((cell) => (
            <button
              key={cell.id}
              type="button"
              onClick={() => handleToggleBingoCell(cell.id)}
              className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[92px] cursor-pointer ${
                cell.completed
                  ? 'bg-forest-800 border-forest-900 text-white shadow-sm'
                  : 'bg-sage-50/90 border-sage-200 text-forest-900 hover:border-forest-600'
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="font-display font-bold text-xs sm:text-sm leading-snug">
                  {cell.label}
                </span>
                {cell.completed && (
                  <Check className="w-4 h-4 text-amber-300 shrink-0" />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] mt-1.5 leading-tight ${
                  cell.completed ? 'text-sage-200' : 'text-forest-600'
                }`}
              >
                {cell.hint}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-forest-700 max-w-lg mx-auto">
          <span>
            {account.weeklyBingo.cells.filter((c) => c.completed).length} of 9 squares spotted
          </span>
          <button
            type="button"
            onClick={handleResetBingoCard}
            className="font-bold text-forest-800 underline hover:text-forest-600 cursor-pointer"
          >
            Fresh Card
          </button>
        </div>
      </div>

      {/* 2. COLLECTIBLE FIELD GUIDE OF LEAVES, BIRDS, FLOWERS & BUGS */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-forest-800" />
              <h3 className="text-xl font-display font-bold text-forest-900">
                Collectible Field Guide ({unlockedIds.length}/{FIELD_GUIDE_CATALOG.length} Discovered)
              </h3>
            </div>
            <p className="text-xs text-forest-700 mt-0.5">
              Undiscovered species appear as mystery silhouettes until you unlock them at quest check-in!
            </p>
          </div>

          {/* Interactive Category Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-sage-100 rounded-xl">
            {(['all', 'leaves', 'birds', 'flowers', 'bugs'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                  filterCat === cat
                    ? 'bg-white text-forest-900 shadow-xs'
                    : 'text-forest-700 hover:text-forest-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {filteredCatalog.map((item) => {
            const unlocked = unlockedIds.includes(item.id);
            const isLegendary = item.rarity === 'Legendary';
            return (
              <motion.button
                key={item.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => unlocked && setSelectedEntry(item)}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  unlocked
                    ? isLegendary
                      ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-sm cursor-pointer'
                      : 'bg-sage-50/90 border-sage-200 hover:border-forest-600 cursor-pointer'
                    : 'bg-sage-100/50 border-sage-200/60 opacity-75 cursor-default'
                }`}
              >
                {/* Silhouette if undiscovered */}
                <div
                  className={`p-2 rounded-2xl mb-2 ${
                    unlocked ? '' : 'brightness-0 opacity-25'
                  }`}
                >
                  <NatureStickerIcon
                    type={mapCategoryToFindType(item.category)}
                    className="w-12 h-12"
                  />
                </div>

                <div>
                  <div className="text-[11px] font-bold text-forest-600">
                    {unlocked ? item.rarity : 'Undiscovered'}
                    {unlocked && isLegendary && ' ★'}
                  </div>
                  <div className="font-display font-bold text-sm text-forest-900 mt-0.5">
                    {unlocked ? item.name : '??? Mystery Species'}
                  </div>
                  <div className="text-[11px] italic text-forest-700 mt-0.5">
                    {unlocked ? item.scientificName : 'Complete quests to unlock'}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Field Guide Entry Detail Card */}
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-5 rounded-2xl bg-sage-100/90 border border-sage-300 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <NatureStickerIcon
                type={mapCategoryToFindType(selectedEntry.category)}
                className="w-14 h-14 shrink-0"
              />
              <div>
                <div className="text-xs font-bold text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {selectedEntry.rarity} {selectedEntry.category} · {selectedEntry.scientificName}
                  </span>
                </div>
                <h4 className="text-lg font-display font-bold text-forest-900">
                  {selectedEntry.name}
                </h4>
                <p className="text-xs sm:text-sm text-forest-800 mt-1">
                  {selectedEntry.funFact}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedEntry(null)}
              className="px-4 py-2 rounded-xl bg-white text-forest-900 text-xs font-bold shrink-0 cursor-pointer"
            >
              Close Entry
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
