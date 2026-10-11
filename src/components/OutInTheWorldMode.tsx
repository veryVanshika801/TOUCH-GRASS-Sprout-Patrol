import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Lock, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import type { CompanionId, Quest } from '../types';
import { COMPANION_PROFILES } from '../data/questBank';

interface OutInTheWorldModeProps {
  quest: Quest;
  companionId: CompanionId;
  onFinishOutside: (minutesSpent: number, distanceMeters?: number) => void;
  onCancel: () => void;
}

// Haversine formula to estimate meters walked between GPS points
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const OutInTheWorldMode: React.FC<OutInTheWorldModeProps> = ({
  quest,
  companionId,
  onFinishOutside,
  onCancel,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [trackingDistance, setTrackingDistance] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const lastCoordRef = useRef<{ lat: number; lon: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const profile = COMPANION_PROFILES[companionId] || COMPANION_PROFILES.moss;
  const promptLine = profile.phoneDownPrompts[0];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const toggleGpsTracking = () => {
    if (trackingDistance) {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      setTrackingDistance(false);
      return;
    }

    if (!navigator.geolocation) return;
    setTrackingDistance(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const current = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        if (lastCoordRef.current) {
          const delta = calculateDistanceMeters(
            lastCoordRef.current.lat,
            lastCoordRef.current.lon,
            current.lat,
            current.lon
          );
          if (delta > 3 && delta < 500) {
            setDistanceMeters((prev) => Math.round(prev + delta));
          }
        }
        lastCoordRef.current = current;
      },
      () => {
        setTrackingDistance(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const formattedTimer = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const handleComplete = () => {
    // Credit at least the quest's target minutes or actual elapsed minutes (friendly for testing & real walks)
    const creditedMinutes = Math.max(quest.minutes, Math.max(1, Math.ceil(elapsedSeconds / 60)));
    onFinishOutside(creditedMinutes, distanceMeters > 0 ? distanceMeters : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D1F14] text-[#EBF1E8] flex flex-col justify-between items-center p-6 sm:p-10 select-none">
      {/* Top Minimal Header */}
      <div className="w-full max-w-md flex items-center justify-between text-xs text-[#B5CEAA]/80">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>Out in the World Mode · Phone Down</span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-[#B5CEAA]/70 hover:text-white flex items-center gap-1 py-1 px-2 cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>

      {/* Center Breathing Circle + Timer + Single Line Prompt */}
      <div className="flex flex-col items-center text-center max-w-md my-auto">
        <div className="relative flex items-center justify-center w-60 h-60 sm:w-72 sm:h-72 mb-8">
          <div className="absolute inset-0 rounded-full bg-[#2D5A3F]/30 animate-breathe" />
          <div className=" relative z-10 flex flex-col items-center">
            <span className="text-5xl sm:text-6xl font-mono font-semibold tracking-tight tabular-nums text-[#FDFBF7]">
              {formattedTimer}
            </span>
            <span className="text-xs text-[#B5CEAA] mt-2">
              Target: {quest.minutes} min · +{quest.xp} XP
            </span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-display font-semibold text-[#FDFBF7] mb-3 max-w-sm">
          {quest.title}
        </h2>

        <p className="text-sm sm:text-base text-[#D5E3CE]/90 leading-relaxed max-w-sm">
          {promptLine}
        </p>

        {/* Optional Local Distance Pedometer */}
        <button
          type="button"
          onClick={toggleGpsTracking}
          className="mt-6 py-2 px-4 rounded-xl bg-[#163020] border border-[#2D5A3F] text-xs text-[#B5CEAA] hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>
            {trackingDistance
              ? `Estimating Walk Distance: ${distanceMeters}m (Local Only)`
              : 'Optional: Estimate Distance Walked (GPS)'}
          </span>
        </button>
      </div>

      {/* Bottom Return Check-In Action */}
      <div className="w-full max-w-md space-y-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleComplete}
          className="w-full py-4 px-6 rounded-2xl bg-[#6C965D] hover:bg-[#8FB381] text-[#0D1F14] font-display font-bold text-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>I’m Back! Check In & Claim Rewards</span>
        </motion.button>
      </div>
    </div>
  );
};
