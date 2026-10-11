import type { Request, Response } from 'express';

interface ReactRequest {
  mode?: 'checkin' | 'chat';
  companionId?: string;
  companionName?: string;
  questTitle?: string;
  minutesSpent?: number;
  sightedItems?: string[];
  reflectionNote?: string;
  moodAfter?: string;
  userMessage?: string;
  model?: string;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      mode = 'checkin',
      companionId = 'moss',
      companionName = 'Moss',
      questTitle = 'Outdoor Adventure',
      minutesSpent = 15,
      sightedItems = [],
      reflectionNote = '',
      moodAfter = 'Refreshed',
      userMessage = '',
      model,
    } = (req.body || {}) as ReactRequest;

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
      moss: 'Moss, a grumpy-but-lovable mushroom who secretly feels proud of the player for touching grass instead of scrolling.',
      pip: 'Pip, a hyperactive baby bird who is thrilled about every sound and nature sighting.',
      fernsworth: 'Sir Fernsworth, a dramatic fern knight who celebrates the player as a returning hero of the realm.',
      beeatrice: 'Bee-atrice, a chill bee who showers the player with warm bee/flower puns and encouragement.',
    };

    const persona = companionPersonas[companionId] || companionPersonas.moss;

    const systemPrompt =
      mode === 'chat'
        ? `You are ${persona}
The player sent you a quick message: "${userMessage.slice(0, 200)}".
Respond in character in 1-2 short, witty sentences that playfully encourage them to step outside and keep screen time tiny.
Respond ONLY with valid JSON:
{
  "reaction": "Your 1-2 sentence in-character reply"
}`
        : `You are ${persona}
The player just returned from the real world after completing "${questTitle}" (${minutesSpent} minutes outside).
They spotted: ${sightedItems.join(', ') || 'nature vibes'}.
Their note: "${reflectionNote || 'Just enjoyed the fresh air!'}"
Their mood now: ${moodAfter}.

Respond ONLY with valid JSON matching this exact format:
{
  "reaction": "A warm, in-character 2-sentence response celebrating their specific sightings and time off-screen.",
  "titleAwarded": "A fun 2-3 word nature title for today (e.g., Moss Whisperer, Canopy Knight)"
}`;

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
            content: 'Generate the JSON reaction now.',
          },
        ],
        temperature: 0.75,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      return res.status(200).json({
        fallback: true,
        reason: `Status ${response.status}`,
        model: selectedModel,
      });
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content || '';
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(200).json({
        fallback: true,
        reason: 'Invalid JSON response',
        model: selectedModel,
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed || typeof parsed.reaction !== 'string') {
      return res.status(200).json({
        fallback: true,
        reason: 'Missing reaction string',
        model: selectedModel,
      });
    }

    return res.status(200).json({
      fallback: false,
      model: selectedModel,
      reaction: parsed.reaction,
      titleAwarded: parsed.titleAwarded || 'Grass Toucher',
    });
  } catch (error) {
    return res.status(200).json({
      fallback: true,
      reason: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
