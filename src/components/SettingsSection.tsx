import React, { useState } from 'react';
import { Cpu, Volume2, VolumeX, MapPin, LogOut, Check, RefreshCw } from 'lucide-react';
import type { CompanionId, OutdoorInterest, UserAccount } from '../types';
import { COMPANION_PROFILES } from '../data/questBank';
import { OPEN_WEIGHT_MODELS } from '../utils/aiClient';
import { CompanionAvatar } from './CompanionAvatar';
import { playSoftChime } from '../utils/sound';

interface SettingsSectionProps {
  account: UserAccount;
  onUpdateAccount: (updated: UserAccount) => void;
  onLogout: () => void;
}

const ALL_INTERESTS: { id: OutdoorInterest; label: string }[] = [
  { id: 'hiking', label: 'Hiking & Walks' },
  { id: 'birding', label: 'Birding' },
  { id: 'foliage', label: 'Foliage & Trees' },
  { id: 'gardening', label: 'Gardening' },
  { id: 'running', label: 'Running' },
  { id: 'stargazing', label: 'Stargazing & Sky' },
];

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  account,
  onUpdateAccount,
  onLogout,
}) => {
  const [cityInput, setCityInput] = useState(account.city);
  const [ollamaUrlInput, setOllamaUrlInput] = useState(account.aiSettings.ollamaUrl);
  const [ollamaModelInput, setOllamaModelInput] = useState(account.aiSettings.ollamaModel);
  const [savedToast, setSavedToast] = useState(false);

  const triggerSaved = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleModeChange = (mode: 'serverless' | 'ollama' | 'offline') => {
    const updated: UserAccount = {
      ...account,
      aiSettings: {
        ...account.aiSettings,
        mode,
      },
    };
    onUpdateAccount(updated);
    triggerSaved();
  };

  const handleModelSwap = (modelName: string) => {
    const updated: UserAccount = {
      ...account,
      aiSettings: {
        ...account.aiSettings,
        modelName,
      },
    };
    onUpdateAccount(updated);
    triggerSaved();
  };

  const handleCompanionChange = (companionId: CompanionId) => {
    const updated: UserAccount = {
      ...account,
      companionId,
    };
    onUpdateAccount(updated);
    triggerSaved();
  };

  const toggleSound = () => {
    const nextState = !account.aiSettings.soundEnabled;
    if (nextState) {
      playSoftChime(true, 'tap');
    }
    const updated: UserAccount = {
      ...account,
      aiSettings: {
        ...account.aiSettings,
        soundEnabled: nextState,
      },
    };
    onUpdateAccount(updated);
  };

  const toggleInterest = (interest: OutdoorInterest) => {
    const exists = account.interests.includes(interest);
    const nextInterests = exists
      ? account.interests.length > 1
        ? account.interests.filter((i) => i !== interest)
        : account.interests
      : [...account.interests, interest];

    onUpdateAccount({
      ...account,
      interests: nextInterests,
    });
    triggerSaved();
  };

  const handleSaveProfileDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAccount({
      ...account,
      city: cityInput.trim() || 'Local Neighborhood',
      aiSettings: {
        ...account.aiSettings,
        ollamaUrl: ollamaUrlInput.trim() || 'http://localhost:11434',
        ollamaModel: ollamaModelInput.trim() || 'llama3.2',
      },
    });
    triggerSaved();
  };

  return (
    <div className="space-y-6">
      {/* Open-Weight AI Model & Local Mode Configuration */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-forest-800">
            <Cpu className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-forest-900">
              Open-Weight AI Engine & Local Mode
            </h2>
          </div>
          {savedToast && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Saved
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-forest-700 mb-5">
          Demonstrating true AI openness: swap between open-weight cloud models, connect to a local Ollama server on your laptop, or use the zero-signal Offline Quest Book.
        </p>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
          <button
            type="button"
            onClick={() => handleModeChange('serverless')}
            className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
              account.aiSettings.mode === 'serverless'
                ? 'border-forest-800 bg-sage-100/90'
                : 'border-sage-200 bg-white hover:border-sage-300'
            }`}
          >
            <div className="font-display font-bold text-sm text-forest-900">
              Open-Weight API (/api/quest)
            </div>
            <p className="text-xs text-forest-700 mt-0.5">
              Serverless proxy with automatic offline fallback.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('ollama')}
            className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
              account.aiSettings.mode === 'ollama'
                ? 'border-forest-800 bg-sage-100/90'
                : 'border-sage-200 bg-white hover:border-sage-300'
            }`}
          >
            <div className="font-display font-bold text-sm text-forest-900">
              Local Mode (Ollama)
            </div>
            <p className="text-xs text-forest-700 mt-0.5">
              Connect to http://localhost:11434 with zero internet.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('offline')}
            className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
              account.aiSettings.mode === 'offline'
                ? 'border-forest-800 bg-sage-100/90'
                : 'border-sage-200 bg-white hover:border-sage-300'
            }`}
          >
            <div className="font-display font-bold text-sm text-forest-900">
              Offline Quest Book
            </div>
            <p className="text-xs text-forest-700 mt-0.5">
              60+ handcrafted seasonal quests, zero network calls.
            </p>
          </button>
        </div>

        {/* Swap Open-Weight Model Dropdown */}
        {account.aiSettings.mode === 'serverless' && (
          <div className="space-y-2 mb-4">
            <label
              htmlFor="swap-model-select"
              className="block text-xs font-bold text-forest-800 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Swap Open-Weight Model (Sent to /api/quest & /api/react)</span>
            </label>
            <select
              id="swap-model-select"
              value={account.aiSettings.modelName}
              onChange={(e) => handleModelSwap(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-sage-50 border border-sage-200 text-forest-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 cursor-pointer"
            >
              {OPEN_WEIGHT_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-forest-600">
              Tip: Add <code className="font-mono">HF_API_KEY</code> in Vercel → Project Settings → Environment Variables to run live open-weight inference, or enjoy the built-in 60+ quest book automatically.
            </p>
          </div>
        )}

        {/* Ollama Local Settings */}
        {account.aiSettings.mode === 'ollama' && (
          <form onSubmit={handleSaveProfileDetails} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-forest-800 mb-1" htmlFor="ollama-url">
                Ollama Local Endpoint
              </label>
              <input
                id="ollama-url"
                type="text"
                value={ollamaUrlInput}
                onChange={(e) => setOllamaUrlInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-sage-50 border border-sage-200 font-mono text-xs text-forest-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-forest-800 mb-1" htmlFor="ollama-model">
                Local Model Tag
              </label>
              <input
                id="ollama-model"
                type="text"
                value={ollamaModelInput}
                onChange={(e) => setOllamaModelInput(e.target.value)}
                placeholder="llama3.2 or qwen2.5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-sage-50 border border-sage-200 font-mono text-xs text-forest-900"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-bold cursor-pointer"
              >
                Save Ollama Config
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Switch Companion Partner */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm">
        <h3 className="text-xl font-display font-bold text-forest-900 mb-1">
          Switch Pocket Companion
        </h3>
        <p className="text-xs text-forest-700 mb-4">
          Your XP ({account.xp} XP) and Growth Stage carry over across all four companions!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(COMPANION_PROFILES) as CompanionId[]).map((id) => {
            const prof = COMPANION_PROFILES[id];
            const active = account.companionId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleCompanionChange(id)}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                  active
                    ? 'border-forest-800 bg-sage-100/90 shadow-sm'
                    : 'border-sage-200 bg-white/70 hover:border-sage-300'
                }`}
              >
                <CompanionAvatar companionId={id} mood={active ? 'excited' : 'happy'} size="sm" />
                <div className="font-display font-bold text-sm text-forest-900 mt-2">{prof.name}</div>
                <div className="text-[11px] text-forest-600">{prof.species}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location, Interests & Sound Preferences */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-sm space-y-5">
        <h3 className="text-xl font-display font-bold text-forest-900">
          Trailhead & Sensory Preferences
        </h3>

        <form onSubmit={handleSaveProfileDetails} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Your City or Neighborhood"
              aria-label="Your City or Neighborhood"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sage-50 border border-sage-200 text-sm font-semibold text-forest-900"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold cursor-pointer shrink-0"
          >
            Update City
          </button>
        </form>

        <div>
          <div className="text-xs font-bold text-forest-800 mb-2">Active Outdoor Interests</div>
          <div className="flex flex-wrap gap-2">
            {ALL_INTERESTS.map((item) => {
              const active = account.interests.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInterest(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-forest-800 text-white'
                      : 'bg-sage-100 text-forest-800 hover:bg-sage-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-sage-200/80 flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-forest-900">Web Audio Chimes</div>
            <div className="text-xs text-forest-700">
              Soft synthesized bell chimes on quest completion (Off by default).
            </div>
          </div>
          <button
            type="button"
            onClick={toggleSound}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
              account.aiSettings.soundEnabled
                ? 'bg-forest-800 text-white'
                : 'bg-sage-100 text-forest-800'
            }`}
          >
            {account.aiSettings.soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Sound Off</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-4 border-t border-sage-200/80 flex items-center justify-between">
          <div className="text-xs text-forest-700">
            Signed in as <strong>{account.trailName}</strong> ({account.isGuest ? 'Guest' : 'Local Account'})
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Ranger / Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
