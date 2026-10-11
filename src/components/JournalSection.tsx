import React, { useState } from 'react';
import { Award, Calendar, Clock, Compass, Sparkles, Share2 } from 'lucide-react';
import type { UserAccount, AchievementBadge } from '../types';
import { ALL_BADGES, getWeeklyMinutes } from '../utils/storage';
import { NatureStickerIcon } from './CompanionAvatar';
import { FieldGuideSection } from './FieldGuideSection';
import { ShareCardModal } from './ShareCardModal';

export const JournalSection: React.FC<{
  account: UserAccount;
  onUpdateAccount: (updated: UserAccount) => void;
  onStartQuestPrompt: () => void;
}> = ({ account, onUpdateAccount, onStartQuestPrompt }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const weeklyMinutes = getWeeklyMinutes(account);
  const completedCount = account.completedQuests.length;

  const renderBadgeIcon = (type: AchievementBadge['iconType'], unlocked: boolean) => {
    const color = unlocked ? 'text-amber-600' : 'text-forest-700/40';
    switch (type) {
      case 'sprout':
      case 'flower':
        return <Sparkles className={`w-5 h-5 ${color}`} />;
      case 'sun':
      case 'star':
        return <Award className={`w-5 h-5 ${color}`} />;
      case 'compass':
      default:
        return <Compass className={`w-5 h-5 ${color}`} />;
    }
  };

  return (
    <div className="space-y-6">
      {shareModalOpen && (
        <ShareCardModal account={account} onClose={() => setShareModalOpen(false)} />
      )}

      {/* Weekly Outdoor Summary Strip */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-xs font-bold text-forest-700 mb-1">
              Field Journal, Scavenger Bingo & Collectible Guide
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
              {account.trailName}’s Outdoor Chronicle
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-forest-800 hover:bg-forest-700 text-white font-display font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Generate PNG Share Card</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-sage-200/80">
          <div>
            <div className="text-xs text-forest-700">This Week Outdoors</div>
            <div className="text-2xl font-display font-bold text-forest-900 tabular-nums mt-0.5">
              {weeklyMinutes} min
            </div>
          </div>
          <div>
            <div className="text-xs text-forest-700">All-Time Grass Time</div>
            <div className="text-2xl font-display font-bold text-forest-900 tabular-nums mt-0.5">
              {account.totalOutdoorMinutes} min
            </div>
          </div>
          <div>
            <div className="text-xs text-forest-700">Quests Completed</div>
            <div className="text-2xl font-display font-bold text-forest-900 tabular-nums mt-0.5">
              {completedCount}
            </div>
          </div>
          <div>
            <div className="text-xs text-forest-700">Current Streak</div>
            <div className="text-2xl font-display font-bold text-amber-600 tabular-nums mt-0.5">
              {account.streakDays} {account.streakDays === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly 3x3 Scavenger Bingo + Collectible Field Guide */}
      <FieldGuideSection account={account} onUpdateAccount={onUpdateAccount} />

      {/* Collected Nature Stickers ("Finds") */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-display font-bold text-forest-900">
              Collected Nature Finds ({completedCount})
            </h3>
            <p className="text-xs text-forest-700">
              Botanical stickers, feathers, and trail stones earned from real-world quests.
            </p>
          </div>
        </div>

        {completedCount === 0 ? (
          <div className="text-center py-8 bg-sage-50/80 rounded-2xl border border-dashed border-sage-300">
            <p className="text-sm font-bold text-forest-800 mb-1">
              Your botanical sticker book is waiting for its first leaf!
            </p>
            <p className="text-xs text-forest-700 mb-4">
              Complete any 10-minute outdoor quest to collect your first nature stamp.
            </p>
            <button
              type="button"
              onClick={onStartQuestPrompt}
              className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold cursor-pointer"
            >
              Pick an Outdoor Quest
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {account.completedQuests.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-sage-50/90 border border-sage-200 flex flex-col items-center text-center"
              >
                <NatureStickerIcon type={item.findType} className="w-12 h-12 mb-2" />
                <div className="font-display font-bold text-sm text-forest-900 leading-snug">
                  {item.findName}
                </div>
                <div className="text-[11px] text-forest-600 mt-1">
                  {new Date(item.completedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  · {item.minutesSpent}m
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements & Trail Badges */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm">
        <h3 className="text-xl font-display font-bold text-forest-900 mb-1">
          Ranger Badges ({account.unlockedBadges.length}/{ALL_BADGES.length})
        </h3>
        <p className="text-xs text-forest-700 mb-4">
          Milestones unlocked by stepping outside in different hours, weather, and streaks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ALL_BADGES.map((badge) => {
            const unlocked = account.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                  unlocked
                    ? 'bg-amber-50/70 border-amber-200/90'
                    : 'bg-sage-50/50 border-sage-200/60 opacity-65'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    unlocked ? 'bg-amber-100' : 'bg-sage-200/60'
                  }`}
                >
                  {renderBadgeIcon(badge.iconType, unlocked)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-forest-900">
                      {badge.title}
                    </span>
                    <span className="text-[11px] font-semibold text-forest-600">
                      · {unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                  <p className="text-xs text-forest-700 mt-0.5">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Quest Log */}
      {completedCount > 0 && (
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm">
          <h3 className="text-xl font-display font-bold text-forest-900 mb-4">
            Past Trail Check-Ins
          </h3>
          <div className="divide-y divide-sage-200/70">
            {account.completedQuests.map((log) => (
              <div key={log.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-base text-forest-900">{log.title}</h4>
                  <div className="text-xs text-forest-700 flex items-center gap-2 tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {log.minutesSpent} min
                    </span>
                    <span>·</span>
                    <span>+{log.xpEarned} XP</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(log.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {log.sightedItems.length > 0 && (
                  <p className="text-xs text-forest-700 mt-1">
                    Spotted: {log.sightedItems.join(' · ')}
                  </p>
                )}

                {log.reflectionNote && (
                  <p className="text-xs text-forest-800 mt-1.5 bg-sage-50 p-2.5 rounded-xl border border-sage-200/70">
                    Field Note: “{log.reflectionNote}”
                  </p>
                )}

                <p className="text-xs text-forest-700 italic mt-2">
                  Companion: “{log.companionReaction}”
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
