import type { CompanionId, OutdoorInterest, Quest, UserAccount } from '../types';
import { COMPANION_PROFILES, getOfflineQuests, getOfflineReaction } from '../data/questBank';
import { getCurrentSeason, getTimeOfDayVibe } from './weather';

export interface QuestGenerationResult {
  quests: Quest[];
  sourceLabel: string;
  isOfflineFallback: boolean;
}

export const OPEN_WEIGHT_MODELS = [
  {
    id: 'meta-llama/Llama-3.2-3B-Instruct',
    label: 'Llama 3.2 3B Instruct (Meta · Open-Weight)',
    provider: 'Hugging Face / Open Router',
  },
  {
    id: 'Qwen/Qwen2.5-7B-Instruct',
    label: 'Qwen 2.5 7B Instruct (Alibaba · Apache 2.0)',
    provider: 'Hugging Face / Open Router',
  },
  {
    id: 'mistralai/Mistral-7B-Instruct-v0.3',
    label: 'Mistral 7B Instruct v0.3 (Mistral · Apache 2.0)',
    provider: 'Hugging Face / Open Router',
  },
  {
    id: 'google/gemma-2-9b-it',
    label: 'Gemma 2 9B IT (Google · Open-Weight)',
    provider: 'Hugging Face / Open Router',
  },
];

export async function generateOutdoorQuests(
  account: UserAccount,
  weatherText: string
): Promise<QuestGenerationResult> {
  const season = getCurrentSeason();
  const timeVibe = getTimeOfDayVibe();
  const profile = COMPANION_PROFILES[account.companionId] || COMPANION_PROFILES.moss;
  const { mode, modelName, ollamaUrl, ollamaModel } = account.aiSettings;

  // 1. Explicit Offline Quest Book mode
  if (mode === 'offline') {
    return {
      quests: getOfflineQuests(account.companionId, account.interests, season),
      sourceLabel: 'Offline Quest Book (Zero-Signal Ready)',
      isOfflineFallback: true,
    };
  }

  // 2. Local Mode: Direct Ollama call on user's machine (http://localhost:11434)
  if (mode === 'ollama') {
    try {
      const prompt = `You are ${profile.name} (${profile.personality}), the Open-Weight AI Quest Master for "TOUCH GRASS: Sprout Patrol".
Generate 3 specific, doable real-world outdoor quests for ${account.city || 'the neighborhood'} in ${season} (${timeVibe.label}, ${weatherText}) for interests: ${account.interests.join(', ')}.
Return ONLY valid JSON:
{"quests":[{"id":"q1","title":"...","description":"...","difficulty":"Easy","minutes":10,"xp":50,"category":"foliage","companionIntro":"...","findName":"...","findType":"leaf"}]}
Provide 1 Easy (50 XP), 1 Medium (90 XP), and 1 Epic (150 XP).`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaModel || 'llama3.2',
          prompt,
          stream: false,
          format: 'json',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.response || '{}');
        if (Array.isArray(parsed.quests) && parsed.quests.length > 0) {
          return {
            quests: sanitizeQuests(parsed.quests, account.companionId, account.interests, season),
            sourceLabel: `Local Ollama: ${ollamaModel || 'llama3.2'}`,
            isOfflineFallback: false,
          };
        }
      }
    } catch {
      // Fall through to offline quest book gracefully
    }

    return {
      quests: getOfflineQuests(account.companionId, account.interests, season),
      sourceLabel: 'Offline Quest Book (Ollama Unreachable)',
      isOfflineFallback: true,
    };
  }

  // 3. Serverless Open-Weight Model API (/api/quest)
  try {
    const res = await fetch('/api/quest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: account.city || 'your neighborhood',
        season,
        timeOfDay: timeVibe.label,
        interests: account.interests,
        weather: weatherText,
        companionId: account.companionId,
        companionName: profile.name,
        model: modelName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && Array.isArray(data.quests) && data.quests.length > 0) {
        const shortModel = (data.model || modelName).split('/').pop() || modelName;
        return {
          quests: sanitizeQuests(data.quests, account.companionId, account.interests, season),
          sourceLabel: `Open Model: ${shortModel}`,
          isOfflineFallback: false,
        };
      }
    }
  } catch {
    // Graceful fallback
  }

  return {
    quests: getOfflineQuests(account.companionId, account.interests, season),
    sourceLabel: 'Offline Quest Book',
    isOfflineFallback: true,
  };
}

export async function generateCompanionReaction(
  account: UserAccount,
  questTitle: string,
  minutesSpent: number,
  sightedItems: string[],
  reflectionNote: string,
  moodAfter: string
): Promise<{ reaction: string; titleAwarded: string; sourceLabel: string }> {
  const profile = COMPANION_PROFILES[account.companionId] || COMPANION_PROFILES.moss;
  const { mode, modelName, ollamaUrl, ollamaModel } = account.aiSettings;

  if (mode === 'ollama') {
    try {
      const prompt = `You are ${profile.name} (${profile.personality}). The player just spent ${minutesSpent} minutes outside completing "${questTitle}". They noticed: ${sightedItems.join(', ')}. Note: "${reflectionNote}". Mood: ${moodAfter}. Respond ONLY with JSON: {"reaction":"2 warm in-character sentences","titleAwarded":"2-3 word nature title"}`;
      const res = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaModel || 'llama3.2',
          prompt,
          stream: false,
          format: 'json',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.response || '{}');
        if (parsed.reaction) {
          return {
            reaction: parsed.reaction,
            titleAwarded: parsed.titleAwarded || 'Grass Toucher',
            sourceLabel: `Local Ollama: ${ollamaModel || 'llama3.2'}`,
          };
        }
      }
    } catch {
      // Fall through
    }
  } else if (mode === 'serverless') {
    try {
      const res = await fetch('/api/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companionId: account.companionId,
          companionName: profile.name,
          questTitle,
          minutesSpent,
          sightedItems,
          reflectionNote,
          moodAfter,
          model: modelName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.fallback && data.reaction) {
          const shortModel = (data.model || modelName).split('/').pop() || modelName;
          return {
            reaction: data.reaction,
            titleAwarded: data.titleAwarded || 'Canopy Explorer',
            sourceLabel: `Open Model: ${shortModel}`,
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  const offline = getOfflineReaction(account.companionId, minutesSpent, sightedItems);
  return {
    ...offline,
    sourceLabel: 'Offline Quest Book',
  };
}

export async function generateCompanionChatReply(
  account: UserAccount,
  userMessage: string
): Promise<{ reply: string; sourceLabel: string }> {
  const profile = COMPANION_PROFILES[account.companionId] || COMPANION_PROFILES.moss;
  const { mode, modelName, ollamaUrl, ollamaModel } = account.aiSettings;

  if (mode === 'ollama') {
    try {
      const prompt = `You are ${profile.name} (${profile.personality}). The player said: "${userMessage}". Reply in character in 1-2 short witty sentences encouraging them to go touch grass and keep screen time minimal. Respond ONLY with JSON: {"reaction":"..."}`;
      const res = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaModel || 'llama3.2',
          prompt,
          stream: false,
          format: 'json',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.response || '{}');
        if (parsed.reaction) {
          return {
            reply: parsed.reaction,
            sourceLabel: `Local Ollama: ${ollamaModel || 'llama3.2'}`,
          };
        }
      }
    } catch {
      // Fall through to offline canned response
    }
  } else if (mode === 'serverless') {
    try {
      const res = await fetch('/api/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          companionId: account.companionId,
          companionName: profile.name,
          userMessage,
          model: modelName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.fallback && data.reaction) {
          const shortModel = (data.model || modelName).split('/').pop() || modelName;
          return {
            reply: data.reaction,
            sourceLabel: `Open Model: ${shortModel}`,
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  // Offline canned fallback chat responses per companion
  const cannedReplies: Record<CompanionId, string[]> = {
    moss: [
      `Interesting theory, human. Now counter-proposal: we close this chat window and go inspect a real tree trunk for 10 minutes.`,
      `My mycelium network just texted me—they said the air outside is 100% less pixelated than this screen.`,
      `I love chatting with you, really, but my spores only grow when we step past the front door!`,
    ],
    pip: [
      `CHIRP! That reminds me of a songbird I heard earlier—let’s step outside for 10 minutes and see if it’s still singing!`,
      `FLAP FLAP! Best idea ever! Let’s pocket the phone and go listen to the wind in the canopy!`,
      `Peep! You’re my favorite flock leader! Ready for a quick outdoor sound check?`,
    ],
    fernsworth: [
      `Well spoken, noble Ranger! Yet no ballad was ever won inside a chat box—let us march into the fresh air!`,
      `By my Emerald Shield! Thy words ring true, and the Woodland Realm beyond thy door awaits our patrol!`,
      `Huzzah! Let us sheathe this glowing tablet and seek glory beneath the living trees!`,
    ],
    beeatrice: [
      `Aw, you’re sweeter than clover honey! Let’s go buzz around the block so we don’t get stuck in the digital hive.`,
      `Bzzz! That’s the spirit, petal! Five minutes of real sunshine beats an hour of typing any day!`,
      `High-hive to that! Let’s go see what’s blooming down the street!`,
    ],
  };

  const list = cannedReplies[account.companionId] || cannedReplies.moss;
  return {
    reply: list[Math.floor(Math.random() * list.length)],
    sourceLabel: 'Offline Companion Voice',
  };
}

function sanitizeQuests(
  rawQuests: Partial<Quest>[],
  companionId: CompanionId,
  interests: OutdoorInterest[],
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter'
): Quest[] {
  const fallback = getOfflineQuests(companionId, interests, season);
  const validCategories: OutdoorInterest[] = ['hiking', 'birding', 'gardening', 'running', 'foliage', 'stargazing'];
  const validFindTypes = ['leaf', 'bird', 'flower', 'stone', 'cloud', 'acorn', 'bug'] as const;

  return [0, 1, 2].map((idx) => {
    const rq = rawQuests[idx] || {};
    const fb = fallback[idx];
    const diff =
      rq.difficulty === 'Easy' || rq.difficulty === 'Medium' || rq.difficulty === 'Epic'
        ? rq.difficulty
        : fb.difficulty;
    const cat = validCategories.includes(rq.category as OutdoorInterest)
      ? (rq.category as OutdoorInterest)
      : fb.category;
    const fType = validFindTypes.includes(rq.findType as typeof validFindTypes[number])
      ? (rq.findType as typeof validFindTypes[number])
      : fb.findType;

    return {
      id: rq.id || `ai-quest-${Date.now()}-${idx}`,
      title: typeof rq.title === 'string' && rq.title.trim() ? rq.title.trim() : fb.title,
      description:
        typeof rq.description === 'string' && rq.description.trim()
          ? rq.description.trim()
          : fb.description,
      difficulty: diff,
      minutes: typeof rq.minutes === 'number' && rq.minutes > 0 ? rq.minutes : fb.minutes,
      xp: typeof rq.xp === 'number' && rq.xp > 0 ? rq.xp : fb.xp,
      category: cat,
      companionIntro:
        typeof rq.companionIntro === 'string' && rq.companionIntro.trim()
          ? rq.companionIntro.trim()
          : fb.companionIntro,
      findName:
        typeof rq.findName === 'string' && rq.findName.trim() ? rq.findName.trim() : fb.findName,
      findType: fType,
    };
  });
}
