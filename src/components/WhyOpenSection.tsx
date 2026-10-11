import React from 'react';
import { Cpu, Shield, WifiOff, RefreshCw, DollarSign, Terminal, ExternalLink } from 'lucide-react';
import { OPEN_WEIGHT_MODELS } from '../utils/aiClient';

export const WhyOpenSection: React.FC<{
  currentModel: string;
  aiMode: 'serverless' | 'ollama' | 'offline';
  onGoToSettings: () => void;
}> = ({ currentModel, aiMode, onGoToSettings }) => {
  const pillars = [
    {
      icon: RefreshCw,
      title: '1. Swappable Open-Weight Models',
      desc: 'Never locked into a single closed vendor. Swap seamlessly between Meta Llama 3.2, Alibaba Qwen 2.5, Mistral 7B, or Google Gemma 2 in one click.',
    },
    {
      icon: WifiOff,
      title: '2. Runs Offline on a Mountain Trail',
      desc: 'Real nature rarely has 5G bars. Pair with local Ollama on your laptop or use the built-in 60+ handcrafted Offline Quest Book with zero internet.',
    },
    {
      icon: Shield,
      title: '3. 100% Local & Private by Design',
      desc: 'Your outdoor journal, location city, and reflections live strictly in your browser localStorage. No surveillance tracking or data harvesting.',
    },
    {
      icon: DollarSign,
      title: '4. Zero Cost to Run & Fork',
      desc: 'Small open-weight models (3B–9B parameters) run free on community inference tiers or your own hardware—built for the public good, not screen addiction.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm">
        <div className="text-xs font-bold text-forest-700 mb-2">
          Hackathon Theme · Touch Grass with Open-Source AI
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
          Why Open-Weight AI Belongs Outdoors
        </h2>
        <p className="text-sm sm:text-base text-forest-800/90 mt-2 leading-relaxed max-w-2xl">
          Most consumer AI apps are engineered to maximize time-on-screen.{' '}
          <strong>TOUCH GRASS: Sprout Patrol</strong> flips the incentive: an open-weight AI Quest Master
          that gives you a 15-second mission, locks into a calm phone-down timer, and celebrates when you come back from the real world.
        </p>

        <div className="mt-5 pt-4 border-t border-sage-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-forest-800">
            Active Engine:{' '}
            <strong className="font-mono text-forest-900">
              {aiMode === 'ollama'
                ? 'Local Ollama (http://localhost:11434)'
                : aiMode === 'offline'
                  ? 'Built-in Offline Quest Book'
                  : currentModel}
            </strong>
          </div>
          <button
            type="button"
            onClick={onGoToSettings}
            className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Swap Model in Settings
          </button>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border border-sage-200 shadow-sm"
            >
              <div className="w-10 h-10 rounded-2xl bg-sage-100 flex items-center justify-center text-forest-800 mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-forest-900">{p.title}</h3>
              <p className="text-sm text-forest-800/85 mt-1.5 leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Supported Open-Weight Models Showcase */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <Cpu className="w-5 h-5 text-forest-800" />
          <h3 className="text-xl font-display font-bold text-forest-900">
            Supported Open-Weight Quest Masters
          </h3>
        </div>
        <div className="divide-y divide-sage-200/70">
          {OPEN_WEIGHT_MODELS.map((m) => (
            <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <div className="font-bold text-sm text-forest-900">{m.label}</div>
                <div className="font-mono text-xs text-forest-600">{m.id}</div>
              </div>
              <div className="text-xs text-forest-700">{m.provider}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Run Fully Local with Ollama Instructions */}
      <div className="bg-forest-900 text-sage-50 rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2.5 mb-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-display font-bold text-white">
            Run 100% Offline with Ollama
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-sage-200 leading-relaxed mb-4">
          Want zero cloud calls? Run your own open-weight model locally on your laptop before heading to the trailhead:
        </p>
        <div className="bg-black/40 rounded-2xl p-4 font-mono text-xs text-amber-200 space-y-1.5 overflow-x-auto">
          <div># 1. Pull an open-weight model with Ollama</div>
          <div>ollama run llama3.2</div>
          <div className="pt-2"># 2. Enable CORS for browser local mode</div>
          <div>OLLAMA_ORIGINS="*" ollama serve</div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-sage-300">
          <span>Then toggle "Local Mode (Ollama)" in Settings!</span>
          <a
            href="https://ollama.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-amber-300 hover:underline font-bold"
          >
            <span>ollama.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
