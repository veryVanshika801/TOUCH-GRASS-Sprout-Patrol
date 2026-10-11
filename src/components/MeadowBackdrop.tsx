import React from 'react';
import { getCurrentSeason, getTimeOfDayVibe } from '../utils/weather';

export const MeadowBackdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const season = getCurrentSeason();
  const timeVibe = getTimeOfDayVibe();
  const isNight = timeVibe.label === 'Night';

  const leafColors: Record<typeof season, string[]> = {
    Spring: ['#84CC16', '#F9A8D4', '#A3E635'],
    Summer: ['#4ADE80', '#22C55E', '#FDE047'],
    Autumn: ['#F59E0B', '#EA580C', '#D97706'],
    Winter: ['#E0F2FE', '#BAE6FD', '#94A3B8'],
  };

  const currentColors = leafColors[season];

  return (
    <div
      className={`min-h-screen w-full relative overflow-x-hidden bg-gradient-to-b ${timeVibe.tintClass} transition-colors duration-700`}
    >
      {/* Drifting Clouds / Stars SVG Layer */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {isNight ? (
          <svg className="w-full h-64 opacity-60" viewBox="0 0 800 200" preserveAspectRatio="none">
            <circle cx="90" cy="40" r="2" fill="#FEF08A" />
            <circle cx="210" cy="75" r="2.5" fill="#FEF08A" />
            <circle cx="380" cy="30" r="1.8" fill="#FEF08A" />
            <circle cx="520" cy="65" r="2.5" fill="#FEF08A" />
            <circle cx="690" cy="45" r="2" fill="#FEF08A" />
            <path
              d="M620,35 A22,22 0 1,0 645,65 A18,18 0 1,1 620,35 Z"
              fill="#FEF08A"
              opacity="0.85"
            />
          </svg>
        ) : (
          <svg className="w-full h-64 opacity-55" viewBox="0 0 800 220" preserveAspectRatio="none">
            {/* Warm Sun */}
            <circle cx="680" cy="68" r="38" fill="#FDE68A" opacity="0.7" />
            {/* Soft Clouds */}
            <g className="animate-float-slow" fill="#FFFFFF" opacity="0.8">
              <ellipse cx="140" cy="70" rx="55" ry="22" />
              <ellipse cx="170" cy="62" rx="40" ry="20" />
              <ellipse cx="520" cy="95" rx="65" ry="22" />
              <ellipse cx="555" cy="85" rx="45" ry="18" />
            </g>
          </svg>
        )}

        {/* Subtle Floating Seasonal Leaves / Fireflies */}
        <div className="absolute inset-0">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              style={{
                left: `${15 + idx * 19}%`,
                top: `${12 + (idx % 3) * 18}%`,
                animationDelay: `${idx * 0.9}s`,
              }}
              className="absolute animate-float-slow opacity-45"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M20,4 C10,4 4,10 4,20 C14,20 20,14 20,4 Z"
                  fill={currentColors[idx % currentColors.length]}
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Rolling Parallax Meadow Hills + Swaying Grass Blades at Bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full h-44 md:h-56"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill={isNight ? '#163020' : '#D5E3CE'}
            fillOpacity="0.65"
            d="M0,192L80,186.7C160,181,320,171,480,181.3C640,192,800,224,960,218.7C1120,213,1280,171,1360,149.3L1440,128L1440,320L0,320Z"
          />
          <path
            fill={isNight ? '#0F2217' : '#B5CEAA'}
            fillOpacity="0.8"
            d="M0,240L120,229.3C240,219,480,197,720,202.7C960,208,1200,240,1320,256L1440,272L1440,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
