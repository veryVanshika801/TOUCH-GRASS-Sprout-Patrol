import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { CompanionId, CompanionMood, GrowthStage, FindType, AccessoryId } from '../types';

interface CompanionAvatarProps {
  companionId: CompanionId;
  mood?: CompanionMood;
  stage?: GrowthStage;
  accessory?: AccessoryId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onPet?: (tapCount: number, isEasterEggTriggered: boolean) => void;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  companionId,
  mood = 'happy',
  stage = 'Seedling',
  accessory = 'none',
  size = 'lg',
  interactive = false,
  onPet,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [petBounce, setPetBounce] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3600 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-56 h-56',
  };

  const handleTap = () => {
    if (!interactive) return;
    const nextTaps = tapCount + 1;
    setTapCount(nextTaps);
    setPetBounce(true);
    setTimeout(() => setPetBounce(false), 450);

    // Trigger 10-tap Easter Egg!
    if (nextTaps >= 10) {
      setEasterEggActive(true);
      if (onPet) onPet(nextTaps, true);
      setTimeout(() => {
        setEasterEggActive(false);
        setTapCount(0);
      }, 3600);
    } else {
      if (onPet) onPet(nextTaps, false);
    }
  };

  // Growth stage crown/sprout decorations
  const renderStageAccessory = () => {
    if (stage === 'Seedling') {
      return (
        <g transform="translate(100, 26)">
          <path d="M0,12 Q-8,0 -14,6 Q-6,14 0,12 Z" fill="#65A30D" />
          <path d="M0,12 Q8,0 14,6 Q6,14 0,12 Z" fill="#84CC16" />
          <line x1="0" y1="12" x2="0" y2="20" stroke="#4D7C0F" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    }
    if (stage === 'Sprout') {
      return (
        <g transform="translate(100, 20)">
          <path d="M0,18 Q-16,-4 -24,8 Q-12,20 0,18 Z" fill="#4D7C0F" />
          <path d="M0,18 Q16,-4 24,8 Q12,20 0,18 Z" fill="#65A30D" />
          <circle cx="0" cy="6" r="5" fill="#FDE047" />
          <line x1="0" y1="10" x2="0" y2="26" stroke="#4D7C0F" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    }
    if (stage === 'Bloom') {
      return (
        <g transform="translate(100, 18)">
          <circle cx="-10" cy="8" r="7" fill="#FB7185" />
          <circle cx="10" cy="8" r="7" fill="#FB7185" />
          <circle cx="0" cy="0" r="7" fill="#FDA4AF" />
          <circle cx="-6" cy="14" r="6" fill="#F43F5E" />
          <circle cx="6" cy="14" r="6" fill="#F43F5E" />
          <circle cx="0" cy="9" r="5.5" fill="#FACC15" />
        </g>
      );
    }
    // Legend stage: Golden woodland halo + crown
    return (
      <g transform="translate(100, 16)">
        <ellipse cx="0" cy="-2" rx="28" ry="7" fill="none" stroke="#FACC15" strokeWidth="3" strokeDasharray="6 3" />
        <polygon points="-16,14 -12,2 -4,10 0,-2 4,10 12,2 16,14" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1.5" />
        <circle cx="0" cy="6" r="3" fill="#FEF08A" />
      </g>
    );
  };

  // Unlockable Cosmetic Wardrobe Accessories (Inline SVG)
  const renderWardrobeAccessory = () => {
    if (accessory === 'acorn_cap') {
      return (
        <g transform="translate(100, 38)">
          <path d="M-32,12 C-32,-12 32,-12 32,12 Z" fill="#78350F" stroke="#163020" strokeWidth="3.5" />
          <path d="M-35,12 L35,12" stroke="#163020" strokeWidth="4" strokeLinecap="round" />
          <line x1="0" y1="-6" x2="4" y2="-16" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <path d="M4,-14 Q14,-18 12,-8 Q6,-8 4,-14 Z" fill="#65A30D" stroke="#163020" strokeWidth="2" />
        </g>
      );
    }
    if (accessory === 'flower_crown') {
      return (
        <g transform="translate(100, 48)">
          <path d="M-34,4 Q0,12 34,4" stroke="#4D7C0F" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="-22" cy="4" r="6.5" fill="#FB7185" stroke="#163020" strokeWidth="2" />
          <circle cx="-22" cy="4" r="2.5" fill="#FACC15" />
          <circle cx="0" cy="7" r="7.5" fill="#FEF08A" stroke="#163020" strokeWidth="2" />
          <circle cx="0" cy="7" r="3" fill="#F59E0B" />
          <circle cx="22" cy="4" r="6.5" fill="#FB7185" stroke="#163020" strokeWidth="2" />
          <circle cx="22" cy="4" r="2.5" fill="#FACC15" />
        </g>
      );
    }
    if (accessory === 'cozy_scarf') {
      return (
        <g transform="translate(100, 146)">
          <path
            d="M-34,-4 Q0,10 34,-4 L30,10 Q0,22 -30,10 Z"
            fill="#E11D48"
            stroke="#163020"
            strokeWidth="3"
          />
          <path
            d="M12,6 L18,30 L30,28 L24,4 Z"
            fill="#F43F5E"
            stroke="#163020"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <line x1="-18" y1="2" x2="-18" y2="12" stroke="#FDE047" strokeWidth="3" />
          <line x1="0" y1="5" x2="0" y2="15" stroke="#FDE047" strokeWidth="3" />
        </g>
      );
    }
    if (accessory === 'binoculars') {
      return (
        <g transform="translate(100, 134)">
          <path d="M-24,-10 Q0,12 24,-10" stroke="#78350F" strokeWidth="2.5" fill="none" />
          <rect x="-18" y="0" width="14" height="16" rx="4" fill="#334155" stroke="#163020" strokeWidth="2.5" />
          <rect x="4" y="0" width="14" height="16" rx="4" fill="#334155" stroke="#163020" strokeWidth="2.5" />
          <line x1="-4" y1="6" x2="4" y2="6" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="-11" cy="12" r="4" fill="#38BDF8" />
          <circle cx="11" cy="12" r="4" fill="#38BDF8" />
        </g>
      );
    }
    return null;
  };

  // Eyes based on mood, blink, or Easter Egg dizzy state
  const renderEyes = (leftX: number, rightX: number, y: number) => {
    if (easterEggActive) {
      return (
        <g stroke="#163020" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d={`M${leftX - 5},${y - 5} L${leftX + 5},${y + 5}`} />
          <path d={`M${leftX + 5},${y - 5} L${leftX - 5},${y + 5}`} />
          <path d={`M${rightX - 5},${y - 5} L${rightX + 5},${y + 5}`} />
          <path d={`M${rightX + 5},${y - 5} L${rightX - 5},${y + 5}`} />
        </g>
      );
    }
    if (mood === 'sleepy' || isBlinking) {
      return (
        <g stroke="#163020" strokeWidth="3.5" fill="none" strokeLinecap="round">
          <path d={`M${leftX - 7},${y} Q${leftX},${y + 6} ${leftX + 7},${y}`} />
          <path d={`M${rightX - 7},${y} Q${rightX},${y + 6} ${rightX + 7},${y}`} />
        </g>
      );
    }
    if (mood === 'grumpy') {
      return (
        <g>
          <circle cx={leftX} cy={y + 2} r="6.5" fill="#163020" />
          <circle cx={rightX} cy={y + 2} r="6.5" fill="#163020" />
          <circle cx={leftX - 2} cy={y} r="2" fill="#FFFFFF" />
          <circle cx={rightX - 2} cy={y} r="2" fill="#FFFFFF" />
          <line x1={leftX - 9} y1={y - 7} x2={leftX + 7} y2={y - 2} stroke="#163020" strokeWidth="3.5" strokeLinecap="round" />
          <line x1={rightX - 7} y1={y - 2} x2={rightX + 9} y2={y - 7} stroke="#163020" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    }
    if (mood === 'excited') {
      return (
        <g>
          <circle cx={leftX} cy={y} r="8" fill="#163020" />
          <circle cx={rightX} cy={y} r="8" fill="#163020" />
          <circle cx={leftX - 2.5} cy={y - 2.5} r="3" fill="#FFFFFF" />
          <circle cx={rightX - 2.5} cy={y - 2.5} r="3" fill="#FFFFFF" />
          <circle cx={leftX + 2.5} cy={y + 2.5} r="1.5" fill="#FFFFFF" />
          <circle cx={rightX + 2.5} cy={y + 2.5} r="1.5" fill="#FFFFFF" />
        </g>
      );
    }
    return (
      <g>
        <circle cx={leftX} cy={y} r="6.5" fill="#163020" />
        <circle cx={rightX} cy={y} r="6.5" fill="#163020" />
        <circle cx={leftX - 2} cy={y - 2} r="2.5" fill="#FFFFFF" />
        <circle cx={rightX - 2} cy={y - 2} r="2.5" fill="#FFFFFF" />
      </g>
    );
  };

  // Mouth based on mood
  const renderMouth = (cx: number, cy: number) => {
    if (easterEggActive) {
      return (
        <path
          d={`M${cx - 8},${cy + 2} Q${cx - 4},${cy - 4} ${cx},${cy + 2} Q${cx + 4},${cy + 8} ${cx + 8},${cy + 2}`}
          stroke="#163020"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    if (mood === 'sleepy') {
      return <circle cx={cx} cy={cy + 3} r="4" fill="#163020" opacity="0.7" />;
    }
    if (mood === 'grumpy') {
      return (
        <path
          d={`M${cx - 8},${cy + 5} Q${cx},${cy - 2} ${cx + 8},${cy + 5}`}
          stroke="#163020"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    if (mood === 'excited') {
      return (
        <path
          d={`M${cx - 10},${cy - 2} Q${cx},${cy + 14} ${cx + 10},${cy - 2} Z`}
          fill="#E11D48"
          stroke="#163020"
          strokeWidth="2.5"
        />
      );
    }
    return (
      <path
        d={`M${cx - 8},${cy} Q${cx},${cy + 8} ${cx + 8},${cy}`}
        stroke="#163020"
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  // Easter Egg Animation per Companion (e.g., Moss dramatically faints sideways!)
  const easterEggAnimation =
    companionId === 'moss'
      ? { rotate: 85, y: 24, scale: 0.95 }
      : companionId === 'pip'
        ? { rotate: [0, 360, 720], y: [-25, 0] }
        : companionId === 'fernsworth'
          ? { scale: [1, 1.2, 1], y: [0, -16, 0] }
          : { rotate: [0, -20, 20, -20, 20, 0] };

  return (
    <motion.div
      onClick={handleTap}
      animate={
        easterEggActive
          ? easterEggAnimation
          : petBounce
            ? { scale: [1, 1.15, 0.92, 1.05, 1], rotate: [0, -6, 6, -3, 0] }
            : mood === 'excited'
              ? { y: [0, -10, 0], scale: [1, 1.03, 1] }
              : mood === 'sleepy'
                ? { y: [0, 3, 0], scale: [1, 0.98, 1] }
                : { y: [0, -5, 0] }
      }
      transition={{
        duration: easterEggActive ? 0.65 : petBounce ? 0.45 : mood === 'excited' ? 1.2 : 3.2,
        repeat: easterEggActive || petBounce ? 0 : Infinity,
        ease: 'easeInOut',
      }}
      className={`relative select-none flex items-center justify-center ${sizeClasses[size]} ${
        interactive ? 'cursor-pointer active:scale-95' : ''
      }`}
      role={interactive ? 'button' : 'img'}
      aria-label={`${companionId} companion in ${mood} mood (${stage} stage)`}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-md">
        {/* Soft ground shadow */}
        <ellipse cx="100" cy="182" rx="52" ry="10" fill="#163020" opacity="0.14" />

        {/* 1. MOSS: Grumpy-but-lovable Mushroom */}
        {companionId === 'moss' && (
          <g>
            <path
              d="M72,110 C68,145 64,172 80,176 L120,176 C136,172 132,145 128,110 Z"
              fill="#FDE68A"
              stroke="#163020"
              strokeWidth="4"
            />
            <path d="M70,130 Q52,138 58,148" fill="#FDE68A" stroke="#163020" strokeWidth="4" strokeLinecap="round" />
            <path d="M130,130 Q148,138 142,148" fill="#FDE68A" stroke="#163020" strokeWidth="4" strokeLinecap="round" />

            <path
              d="M32,112 C28,54 70,34 100,34 C130,34 172,54 168,112 C145,120 55,120 32,112 Z"
              fill="#D97706"
              stroke="#163020"
              strokeWidth="4"
            />
            <circle cx="65" cy="72" r="11" fill="#FEF3C7" opacity="0.9" />
            <circle cx="132" cy="68" r="9" fill="#FEF3C7" opacity="0.9" />
            <circle cx="102" cy="54" r="7" fill="#FEF3C7" opacity="0.9" />
            <circle cx="146" cy="94" r="6" fill="#FEF3C7" opacity="0.9" />
            <circle cx="52" cy="96" r="6" fill="#FEF3C7" opacity="0.9" />

            <path
              d="M75,40 Q88,30 100,38 Q112,28 124,40"
              fill="#65A30D"
              stroke="#163020"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <ellipse cx="76" cy="142" rx="6" ry="3.5" fill="#FB7185" opacity="0.55" />
            <ellipse cx="124" cy="142" rx="6" ry="3.5" fill="#FB7185" opacity="0.55" />

            {renderEyes(83, 117, 134)}
            {renderMouth(100, 145)}
            {renderStageAccessory()}
            {renderWardrobeAccessory()}
          </g>
        )}

        {/* 2. PIP: Hyperactive Baby Songbird */}
        {companionId === 'pip' && (
          <g>
            <line x1="86" y1="164" x2="82" y2="178" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
            <line x1="114" y1="164" x2="118" y2="178" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
            <circle
              cx="100"
              cy="115"
              r="54"
              fill="#38BDF8"
              stroke="#163020"
              strokeWidth="4"
            />
            <path
              d="M66,125 C66,155 134,155 134,125 C134,105 66,105 66,125 Z"
              fill="#E0F2FE"
            />
            <path
              d="M46,110 Q24,95 34,128 Q42,138 50,126"
              fill="#0284C7"
              stroke="#163020"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M154,110 Q176,95 166,128 Q158,138 150,126"
              fill="#0284C7"
              stroke="#163020"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M95,62 Q90,42 100,48 Q108,38 106,62"
              fill="#0284C7"
              stroke="#163020"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <ellipse cx="70" cy="108" rx="7" ry="4" fill="#FB7185" opacity="0.6" />
            <ellipse cx="130" cy="108" rx="7" ry="4" fill="#FB7185" opacity="0.6" />

            {renderEyes(78, 122, 98)}
            <polygon
              points="93,104 107,104 100,116"
              fill="#F59E0B"
              stroke="#163020"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {renderStageAccessory()}
            {renderWardrobeAccessory()}
          </g>
        )}

        {/* 3. SIR FERNSWORTH: Dramatic Fern Knight */}
        {companionId === 'fernsworth' && (
          <g>
            <path
              d="M55,105 L36,168 L164,168 L145,105 Z"
              fill="#15803D"
              stroke="#163020"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <rect
              x="60"
              y="62"
              width="80"
              height="108"
              rx="38"
              fill="#4ADE80"
              stroke="#163020"
              strokeWidth="4"
            />
            <path
              d="M56,82 Q100,66 144,82 L140,56 Q100,38 60,56 Z"
              fill="#854D0E"
              stroke="#163020"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M42,112 C28,112 28,148 48,158 C68,148 68,112 42,112 Z"
              fill="#16A34A"
              stroke="#FEF08A"
              strokeWidth="3.5"
            />
            <line x1="154" y1="145" x2="172" y2="88" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
            <circle cx="172" cy="88" r="5" fill="#84CC16" />

            {renderEyes(82, 118, 104)}
            {renderMouth(100, 120)}
            {renderStageAccessory()}
            {renderWardrobeAccessory()}
          </g>
        )}

        {/* 4. BEE-ATRICE: Chill Garden Honeybee */}
        {companionId === 'beeatrice' && (
          <g>
            <ellipse
              cx="65"
              cy="74"
              rx="26"
              ry="16"
              transform="rotate(-20 65 74)"
              fill="#E0F2FE"
              stroke="#163020"
              strokeWidth="3.5"
              opacity="0.9"
            />
            <ellipse
              cx="135"
              cy="74"
              rx="26"
              ry="16"
              transform="rotate(20 135 74)"
              fill="#E0F2FE"
              stroke="#163020"
              strokeWidth="3.5"
              opacity="0.9"
            />
            <ellipse
              cx="100"
              cy="118"
              rx="54"
              ry="46"
              fill="#FACC15"
              stroke="#163020"
              strokeWidth="4"
            />
            <path
              d="M54,100 Q100,110 146,100"
              stroke="#163020"
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M52,134 Q100,144 148,134"
              stroke="#163020"
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M86,74 Q76,52 66,58" fill="none" stroke="#163020" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="66" cy="58" r="4.5" fill="#163020" />
            <path d="M114,74 Q124,52 134,58" fill="none" stroke="#163020" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="134" cy="58" r="4.5" fill="#163020" />

            <ellipse cx="72" cy="120" rx="6.5" ry="3.5" fill="#FB7185" opacity="0.65" />
            <ellipse cx="128" cy="120" rx="6.5" ry="3.5" fill="#FB7185" opacity="0.65" />

            {renderEyes(82, 118, 114)}
            {renderMouth(100, 122)}
            {renderStageAccessory()}
            {renderWardrobeAccessory()}
          </g>
        )}

        {/* Sleepy Zzz bubble if sleepy */}
        {mood === 'sleepy' && !easterEggActive && (
          <g className="animate-pulse" fill="#163020" opacity="0.65" fontFamily="Fredoka, sans-serif" fontWeight="700">
            <text x="148" y="56" fontSize="16">z</text>
            <text x="160" y="42" fontSize="20">Z</text>
            <text x="175" y="26" fontSize="24">Z</text>
          </g>
        )}
      </svg>
    </motion.div>
  );
};

// Nature Sticker SVG for Journal Finds & Field Guide
export const NatureStickerIcon: React.FC<{ type: FindType; className?: string }> = ({
  type,
  className = 'w-10 h-10',
}) => {
  switch (type) {
    case 'leaf':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <path
            d="M38,10 C22,10 10,20 10,36 C26,36 38,26 38,10 Z"
            fill="#65A30D"
            stroke="#163020"
            strokeWidth="2.5"
          />
          <path d="M10,36 L30,18" stroke="#ECFCCB" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'bird':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <circle cx="24" cy="26" r="13" fill="#38BDF8" stroke="#163020" strokeWidth="2.5" />
          <polygon points="36,23 43,26 36,29" fill="#F59E0B" stroke="#163020" strokeWidth="2" />
          <circle cx="28" cy="23" r="2.2" fill="#163020" />
        </svg>
      );
    case 'flower':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <circle cx="24" cy="14" r="7" fill="#FB7185" stroke="#163020" strokeWidth="2" />
          <circle cx="24" cy="34" r="7" fill="#FB7185" stroke="#163020" strokeWidth="2" />
          <circle cx="14" cy="24" r="7" fill="#FB7185" stroke="#163020" strokeWidth="2" />
          <circle cx="34" cy="24" r="7" fill="#FB7185" stroke="#163020" strokeWidth="2" />
          <circle cx="24" cy="24" r="6" fill="#FACC15" stroke="#163020" strokeWidth="2" />
        </svg>
      );
    case 'bug':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <circle cx="24" cy="26" r="12" fill="#EF4444" stroke="#163020" strokeWidth="2.5" />
          <path d="M18,16 C18,11 30,11 30,16 Z" fill="#163020" />
          <line x1="24" y1="16" x2="24" y2="38" stroke="#163020" strokeWidth="2.5" />
          <circle cx="19" cy="23" r="2" fill="#163020" />
          <circle cx="29" cy="23" r="2" fill="#163020" />
          <circle cx="20" cy="31" r="2" fill="#163020" />
          <circle cx="28" cy="31" r="2" fill="#163020" />
        </svg>
      );
    case 'stone':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <ellipse cx="24" cy="30" rx="16" ry="10" fill="#94A3B8" stroke="#163020" strokeWidth="2.5" />
          <ellipse cx="24" cy="20" rx="11" ry="7" fill="#CBD5E1" stroke="#163020" strokeWidth="2.5" />
          <circle cx="24" cy="11" r="4.5" fill="#E2E8F0" stroke="#163020" strokeWidth="2.5" />
        </svg>
      );
    case 'cloud':
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <path
            d="M14,34 L35,34 C40,34 42,29 39,25 C40,18 33,14 27,17 C23,11 13,14 13,22 C8,23 8,34 14,34 Z"
            fill="#E0F2FE"
            stroke="#163020"
            strokeWidth="2.5"
          />
        </svg>
      );
    case 'acorn':
    default:
      return (
        <svg viewBox="0 0 48 48" className={className}>
          <path d="M14,22 C14,35 24,41 24,41 C24,41 34,35 34,22 Z" fill="#D97706" stroke="#163020" strokeWidth="2.5" />
          <path d="M11,22 C11,14 37,14 37,22 Z" fill="#78350F" stroke="#163020" strokeWidth="2.5" />
          <line x1="24" y1="15" x2="24" y2="9" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
  }
};
