import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Lock, MapPin, Sparkles, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import type { CompanionId, OutdoorInterest, UserAccount } from '../types';
import { COMPANION_PROFILES } from '../data/questBank';
import { CompanionAvatar } from './CompanionAvatar';
import { createInitialAccount, getAllAccounts, hashPin, saveAccount } from '../utils/storage';

interface LoginOnboardingProps {
  existingAccount: UserAccount | null;
  onComplete: (account: UserAccount) => void;
  onOpenWhyOpenModal: () => void;
}

const INTEREST_OPTIONS: { id: OutdoorInterest; label: string; desc: string }[] = [
  { id: 'hiking', label: 'Trail & Neighborhood Walks', desc: 'Detours, footpaths & parks' },
  { id: 'birding', label: 'Birding & Soundscapes', desc: 'Chirps, feathers & skywatch' },
  { id: 'foliage', label: 'Foliage & Trees', desc: 'Leaf colors, bark & moss' },
  { id: 'gardening', label: 'Gardening & Botany', desc: 'Flowers, soil & pollinators' },
  { id: 'running', label: 'Running & Brisk Strides', desc: 'Endorphin jogs & breeze runs' },
  { id: 'stargazing', label: 'Sky & Twilight Watch', desc: 'Clouds, sunsets & stars' },
];

export const LoginOnboarding: React.FC<LoginOnboardingProps> = ({
  existingAccount,
  onComplete,
  onOpenWhyOpenModal,
}) => {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [trailName, setTrailName] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeAccount, setActiveAccount] = useState<UserAccount | null>(existingAccount);

  // 3-step onboarding state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionId>('moss');
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<OutdoorInterest[]>([
    'hiking',
    'birding',
    'foliage',
  ]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = trailName.trim();
    if (cleanName.length < 2) {
      setErrorMsg('Please enter a Trail Name of at least 2 characters.');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setErrorMsg('Your Secret Seed must be a 4-digit PIN (e.g. 1234).');
      return;
    }

    const hashed = await hashPin(pin);
    const all = getAllAccounts();
    const key = cleanName.toLowerCase();

    if (authMode === 'login') {
      const found = all[key];
      if (!found) {
        setErrorMsg('No ranger found with that Trail Name. Switch to Sign Up to sprout a new profile!');
        return;
      }
      if (found.pinHash !== hashed) {
        setErrorMsg('Secret Seed PIN did not match. Try again!');
        return;
      }
      saveAccount(found);
      if (found.onboarded) {
        onComplete(found);
      } else {
        setActiveAccount(found);
      }
    } else {
      if (all[key] && all[key].pinHash !== hashed) {
        setErrorMsg('That Trail Name is already claimed on this device. Switch to Log In or pick another!');
        return;
      }
      const newAcc = all[key] || createInitialAccount(cleanName, hashed, false);
      saveAccount(newAcc);
      if (newAcc.onboarded) {
        onComplete(newAcc);
      } else {
        setActiveAccount(newAcc);
      }
    }
  };

  const handleGuestContinue = () => {
    const guestAcc = createInitialAccount('Wanderer', 'GUEST', true);
    saveAccount(guestAcc);
    setActiveAccount(guestAcc);
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setCity('Greenwood Trail');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        if (!city.trim()) {
          setCity('Local Trailhead');
        }
        setLocating(false);
      },
      () => {
        setLocating(false);
        if (!city.trim()) setCity('My Neighborhood');
      },
      { timeout: 6000 }
    );
  };

  const toggleInterest = (id: OutdoorInterest) => {
    setSelectedInterests((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id]
    );
  };

  const finishOnboarding = () => {
    if (!activeAccount) return;
    const updated: UserAccount = {
      ...activeAccount,
      onboarded: true,
      companionId: selectedCompanion,
      city: city.trim() || 'Local Neighborhood',
      latitude: coords?.lat,
      longitude: coords?.lon,
      interests: selectedInterests,
    };
    saveAccount(updated);
    onComplete(updated);
  };

  // VIEW 1: STUNNING LOGIN / SIGNUP SCREEN
  if (!activeAccount) {
    return (
      <div className="min-h-screen flex flex-col justify-between px-4 py-8 max-w-xl mx-auto">
        {/* Top Hackathon Theme Banner */}
        <div className="flex items-center justify-between text-xs text-forest-800/80 bg-white/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-sage-200">
          <span>Hackathon Theme: Open-Weight AI that gets you off the screen</span>
          <button
            type="button"
            onClick={onOpenWhyOpenModal}
            className="font-bold text-forest-800 underline hover:text-forest-600 ml-2 whitespace-nowrap cursor-pointer"
          >
            Why Open AI?
          </button>
        </div>

        {/* Main Glassmorphism Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-6 bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white"
        >
          {/* Logo & Mascot Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-28 h-28 mb-2">
              <CompanionAvatar companionId="moss" mood="happy" stage="Sprout" size="md" />
            </div>
            <p className="text-xs font-semibold tracking-wide text-forest-700">
              Pocket-Companion Outdoor Adventure
            </p>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-forest-900 mt-1">
              TOUCH GRASS: Sprout Patrol
            </h1>
            <p className="text-sm text-forest-800/80 mt-2 max-w-md">
              Raise a creature that only grows when you close the app and step outside. Powered by swappable open-weight AI.
            </p>
          </div>

          {/* Sign up / Log in Segmented Toggle */}
          <div className="flex items-center p-1 bg-sage-100 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-forest-900 shadow-sm'
                  : 'text-forest-700 hover:text-forest-900'
              }`}
            >
              New Ranger (Sign Up)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-forest-900 shadow-sm'
                  : 'text-forest-700 hover:text-forest-900'
              }`}
            >
              Return to Trail (Log In)
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-forest-800 mb-1.5" htmlFor="trail-name">
                Trail Name (Username)
              </label>
              <div className="relative">
                <Compass className="w-5 h-5 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="trail-name"
                  type="text"
                  value={trailName}
                  onChange={(e) => setTrailName(e.target.value)}
                  placeholder="e.g. FernWalker"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-sage-50/80 border border-sage-200 text-forest-900 font-semibold focus:outline-none focus:ring-2 focus:ring-forest-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-800 mb-1.5" htmlFor="secret-seed">
                4-Digit Secret Seed (PIN)
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="secret-seed"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-sage-50/80 border border-sage-200 text-forest-900 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-forest-600"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-forest-800 hover:bg-forest-700 active:scale-[0.99] text-white font-display font-semibold text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{authMode === 'signup' ? 'Sprout My Companion' : 'Unlock Trail Journal'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="relative my-5 flex items-center justify-center">
            <div className="border-t border-sage-200 w-full" />
            <span className="bg-white px-3 text-xs text-forest-700 font-semibold">or</span>
            <div className="border-t border-sage-200 w-full" />
          </div>

          <button
            type="button"
            onClick={handleGuestContinue}
            className="w-full py-3 px-4 rounded-2xl bg-sage-100 hover:bg-sage-200 active:scale-[0.99] text-forest-900 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-forest-700" />
            <span>Continue as Guest</span>
          </button>
        </motion.div>

        {/* Privacy & Local Storage Footer */}
        <footer className="text-center text-xs text-forest-800/80 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
          <span>100% Private: Accounts stay in your browser localStorage (PIN hashed via Web Crypto SHA-256).</span>
        </footer>
      </div>
    );
  }

  // VIEW 2: 3-STEP ONBOARDING FLOW
  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-8 max-w-2xl mx-auto">
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-forest-700 mb-6">
          <span>Ranger Setup · Step {step} of 3</span>
          <span>
            {step === 1 && 'Choose Your Companion'}
            {step === 2 && 'Set Your Home Trailhead'}
            {step === 3 && 'Pick Outdoor Interests'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
            >
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
                Who is joining your pocket patrol?
              </h2>
              <p className="text-sm text-forest-800/80 mt-1 mb-5">
                Your companion only gains XP when you lock your phone and step into the real world.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                {(Object.keys(COMPANION_PROFILES) as CompanionId[]).map((id) => {
                  const prof = COMPANION_PROFILES[id];
                  const isSelected = selectedCompanion === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedCompanion(id)}
                      className={`p-4 rounded-2xl text-left transition-all border-2 flex flex-col items-center sm:items-start cursor-pointer ${
                        isSelected
                          ? 'border-forest-800 bg-sage-50 shadow-md'
                          : 'border-sage-200/80 bg-white/70 hover:border-sage-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <CompanionAvatar companionId={id} mood={isSelected ? 'excited' : 'happy'} size="sm" />
                        <div>
                          <h3 className="font-display font-bold text-lg text-forest-900">{prof.name}</h3>
                          <p className="text-xs font-semibold text-forest-700">{prof.species}</p>
                        </div>
                      </div>
                      <p className="text-xs text-forest-800/90 mt-2.5 leading-relaxed">{prof.personality}</p>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-6 rounded-2xl bg-forest-800 hover:bg-forest-700 text-white font-display font-semibold text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Choose {COMPANION_PROFILES[selectedCompanion].name}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
            >
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
                Where is your home trailhead?
              </h2>
              <p className="text-sm text-forest-800/80 mt-1 mb-5">
                Used to check real-time local weather (via free Open-Meteo) and tailor seasonal quests.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-forest-800 mb-1.5" htmlFor="city-input">
                    City, Town, or Neighborhood (Optional)
                  </label>
                  <input
                    id="city-input"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Portland, OR or Brooklyn"
                    className="w-full px-4 py-3.5 rounded-2xl bg-sage-50 border border-sage-200 text-forest-900 font-semibold focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleUseGeolocation}
                  disabled={locating}
                  className="w-full py-3 px-4 rounded-2xl bg-sage-100 hover:bg-sage-200 text-forest-900 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-forest-700" />
                  <span>
                    {locating
                      ? 'Checking skies...'
                      : coords
                        ? 'Coordinates linked for local weather!'
                        : 'Use My Current Location (Browser Geolocation)'}
                  </span>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3.5 px-5 rounded-2xl bg-sage-100 hover:bg-sage-200 text-forest-900 font-bold text-sm cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-forest-800 hover:bg-forest-700 text-white font-display font-semibold text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Next: Outdoor Vibes</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
            >
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
                How do you like to touch grass?
              </h2>
              <p className="text-sm text-forest-800/80 mt-1 mb-5">
                Pick one or more outdoor interests so the Open-Weight AI Quest Master can craft your missions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {INTEREST_OPTIONS.map((item) => {
                  const active = selectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        active
                          ? 'border-forest-800 bg-sage-100/90 shadow-sm'
                          : 'border-sage-200 bg-white/70 hover:border-sage-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-forest-900 text-base">{item.label}</span>
                        <span className="text-xs font-bold text-forest-700">{active ? 'Selected' : ''}</span>
                      </div>
                      <p className="text-xs text-forest-700 mt-1">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3.5 px-5 rounded-2xl bg-sage-100 hover:bg-sage-200 text-forest-900 font-bold text-sm cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={finishOnboarding}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-forest-800 hover:bg-forest-700 text-white font-display font-semibold text-base flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Enter the Meadow</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
