import type { Request, Response } from 'express';

interface QuestRequest {
  city?: string;
  season?: string;
  timeOfDay?: string;
  interests?: string[];
  weather?: string;
  companionId?: string;
  companionName?: string;
  model?: string;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      city = 'your neighborhood',
      season = 'Autumn',
      timeOfDay = 'daytime',
      interests = ['hiking', 'birding'],
      weather = 'pleasant outdoor weather',
      companionId = 'moss',
      companionName = 'Moss',
      model,
    } = (req.body || {}) as QuestRequest;

    const selectedModel =
      model ||
      process.env.OPEN_MODEL_NAME ||
      'meta-llama/Llama-3.2-3B-Instruct';

    const apiKey = process.env.OPEN_MODEL_API_KEY || process.env.HF_API_KEY;
    const baseUrl =
      process.env.OPEN_MODEL_BASE_URL || 'https://router.huggingface.co/v1';

    if (!apiKey) {
      return res.status(200).json({
        fallback: true,
        reason: 'No HF_API_KEY or OPEN_MODEL_API_KEY configured on server',
        model: selectedModel,
      });
    }

    const companionPersonas: Record<string, string> = {
      moss: 'Moss, a grumpy-but-lovable mushroom who sarcastically roasts the player for doomscrolling and begs them to touch grass.',
      pip: 'Pip, a hyperactive baby bird who is obsessed with outdoor sounds, chirps, and rustling leaves.',
      fernsworth: 'Sir Fernsworth, a dramatic chivalrous fern knight who treats every walk outside like a noble medieval quest.',
      beeatrice: 'Bee-atrice, a chill, pun-loving honeybee who adores flowers, gardens, and pollination.',
    };

    const persona = companionPersonas[companionId] || companionPersonas.moss;

    const systemPrompt = `You are the Open-Weight AI Quest Master for "TOUCH GRASS: Sprout Patrol", a game designed to get people OFF their screens and into the real world.
Speak in the voice of ${persona}
Generate exactly 3 specific, safe, doable real-world outdoor quests tailored to:
- Location: ${city}
- Season: ${season}
- Time of day: ${timeOfDay}
- Weather: ${weather}
- Player Interests: ${interests.join(', ')}

Respond ONLY with valid JSON matching this exact structure (no markdown code blocks, no extra text):
{
  "quests": [
    {
      "id": "unique-id-1",
      "title": "Short catchy title",
      "description": "Specific, actionable 1-2 sentence real-world outdoor instruction.",
      "difficulty": "Easy",
      "minutes": 10,
      "xp": 50,
      "category": "birding",
      "companionIntro": "A short cheesy or witty 1-sentence intro in ${companionName}'s voice.",
      "findName": "Name of a nature sticker they earn (e.g., Scarlet Maple Leaf)",
      "findType": "leaf"
    }
  ]
}
Note:
- Provide 1 "Easy" (10-15 min, 50 XP), 1 "Medium" (20-30 min, 90 XP), and 1 "Epic" (35-45 min, 150 XP) quest.
- "findType" must be one of: "leaf", "bird", "flower", "stone", "cloud", "acorn".`;

    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Generate 3 outdoor quests for ${city} during ${season} (${timeOfDay}, ${weather}) focusing on ${interests.join(', ')}. Return strict JSON only.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(200).json({
        fallback: true,
        reason: `Open model inference returned ${response.status}: ${errText.slice(0, 120)}`,
        model: selectedModel,
      });
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content || '';

    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(200).json({
        fallback: true,
        reason: 'Model output did not contain valid JSON object',
        model: selectedModel,
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed || !Array.isArray(parsed.quests) || parsed.quests.length === 0) {
      return res.status(200).json({
        fallback: true,
        reason: 'Parsed JSON did not contain quests array',
        model: selectedModel,
      });
    }

    return res.status(200).json({
      fallback: false,
      model: selectedModel,
      quests: parsed.quests,
    });
  } catch (error) {
    return res.status(200).json({
      fallback: true,
      reason: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
