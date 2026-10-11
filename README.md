# TOUCH GRASS: Sprout Patrol 🌱

> **Hackathon Theme**: *"Touch Grass: build something with open-weight models or open-source AI that gets people off the screen and into the world."*

**TOUCH GRASS: Sprout Patrol** is a cozy, mobile-first pocket-companion adventure whose entire goal is to get you **OFF your screen** and into the real outdoors. Your companion only grows when you accept an outdoor quest, lock your phone in a calm "Out in the World" mode, and actually step outside.

---

## Why It Solves "Get People Off the Screen"

Most apps and AI companions are engineered to maximize screen time. **Sprout Patrol** flips the incentive:
1. **15-Second Quest Selection**: An Open-Weight AI Quest Master generates 3 specific, doable outdoor quests tailored to your city, season, local weather (via free Open-Meteo API), and outdoor interests (hiking, birding, gardening, running, foliage, stargazing).
2. **Phone-Down "Out in the World" Mode**: Tapping **"Go Outside"** dims the screen into a calm, distraction-free breathing timer with a single prompt encouraging you to lock your phone and put it in your pocket.
3. **30-Second Trail Check-In**: When you return, you tap what you spotted, play an intentionally tiny 12-second leaf-catching mini-game, and receive an in-character celebration from your companion along with XP, streaks, and botanical stickers.

---

## Why Open-Source / Open-Weight AI Matters Here

1. **Swappable Open-Weight Models**: Switch effortlessly in Settings between `meta-llama/Llama-3.2-3B-Instruct`, `Qwen/Qwen2.5-7B-Instruct`, `mistralai/Mistral-7B-Instruct-v0.3`, and `google/gemma-2-9b-it`.
2. **Offline on the Trail**: Real hiking trails don't always have cell service. You can run the AI locally on your laptop via **Ollama** (`http://localhost:11434`) or rely on the built-in **60+ handcrafted Offline Quest Book** with zero signal.
3. **100% Private (`localStorage` Only)**: Your Trail Name, SHA-256 hashed 4-digit PIN, location city, and field journal never leave your device.
4. **Zero Cost to Run**: Small open-weight models (3B–9B) run free on community inference APIs or consumer hardware.

---

## Meet the Pocket Companions (100% Inline Animated SVG)

- **Moss**: A grumpy-but-lovable forest mushroom who sarcastically roasts you for doomscrolling.
- **Pip**: A hyperactive baby songbird obsessed with outdoor sounds and every chirp.
- **Sir Fernsworth**: A dramatic chivalrous fern knight who treats a neighborhood walk like an epic ballad.
- **Bee-atrice**: A chill honeybee who loves gardening, pollinators, and bee puns.

Each companion evolves through 4 growth stages (**Seedling → Sprout → Bloom → Legend**) as you log outdoor minutes.

---

## How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (runs on http://localhost:3000)
npm run dev

# 3. Verify production build
npm run build
```

---

## How to Run 100% Locally with Ollama (No Internet Required)

1. Install [Ollama](https://ollama.com) on your machine.
2. Pull an open-weight model:
   ```bash
   ollama run llama3.2
   ```
3. Start Ollama with browser CORS enabled:
   ```bash
   OLLAMA_ORIGINS="*" ollama serve
   ```
4. In **TOUCH GRASS: Sprout Patrol**, open **Settings → Local Mode (Ollama)** and select your local model tag (`llama3.2`).

---

## How to Deploy on Vercel

1. Push this repository to GitHub/GitLab and import it into [Vercel](https://vercel.com).
2. Vercel automatically detects Vite + the serverless functions in `/api/quest.ts` and `/api/react.ts`.
3. **Add `HF_API_KEY` in Vercel → Project Settings → Environment Variables** (using a free Hugging Face token with inference permissions, or set `OPEN_MODEL_BASE_URL`, `OPEN_MODEL_NAME`, and `OPEN_MODEL_API_KEY` for any OpenAI-compatible open-weight provider).
4. Note: Even if no API key is configured, the app automatically falls back to the built-in 60+ seasonal **Offline Quest Book** so the game works out of the box!

---

## Submission Blurb (Copy-Paste for DEV Post)

> **TOUCH GRASS: Sprout Patrol** is a pocket-companion web game where the screen is intentionally the shortest part of the experience. Powered by swappable open-weight models (`Llama 3.2`, `Qwen 2.5`, `Mistral 7B`, `Gemma 2`) via Vercel Serverless Functions—plus a 100% local Ollama mode and a 60+ quest offline fallback book—your AI "Quest Master" crafts hyper-local outdoor missions based on real-time Open-Meteo weather and seasonal vibes. Pick a companion (like *Moss*, a sarcastic mushroom who roasts your screen time, or *Sir Fernsworth*, a dramatic fern knight), tap **"Go Outside"**, and lock your phone in a calm Phone-Down timer while you explore the real world. All accounts (SHA-256 PIN hashed) and botanical field journals live privately in `localStorage`.
