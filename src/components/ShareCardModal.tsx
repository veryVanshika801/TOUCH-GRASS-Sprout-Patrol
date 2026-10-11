import React, { useRef, useEffect, useState } from 'react';
import { Download, X, Sparkles, Check } from 'lucide-react';
import type { UserAccount } from '../types';
import { COMPANION_PROFILES } from '../data/questBank';
import { getGrowthStage, getWeeklyMinutes } from '../utils/storage';

interface ShareCardModalProps {
  account: UserAccount;
  onClose: () => void;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ account, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const profile = COMPANION_PROFILES[account.companionId] || COMPANION_PROFILES.moss;
  const growth = getGrowthStage(account.xp);
  const weeklyMinutes = getWeeklyMinutes(account);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw Sunrise Meadow Gradient Background (800 x 500)
    const grad = ctx.createLinearGradient(0, 0, 0, 500);
    grad.addColorStop(0, '#FFE5D4');
    grad.addColorStop(0.5, '#FDFBF7');
    grad.addColorStop(1, '#D5E3CE');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 500);

    // 2. Rolling Meadow Hills at Bottom
    ctx.fillStyle = '#B5CEAA';
    ctx.beginPath();
    ctx.moveTo(0, 390);
    ctx.quadraticCurveTo(240, 340, 480, 390);
    ctx.quadraticCurveTo(660, 420, 800, 370);
    ctx.lineTo(800, 500);
    ctx.lineTo(0, 500);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#8FB381';
    ctx.beginPath();
    ctx.moveTo(0, 430);
    ctx.quadraticCurveTo(350, 390, 800, 440);
    ctx.lineTo(800, 500);
    ctx.lineTo(0, 500);
    ctx.closePath();
    ctx.fill();

    // 3. Card Frame Border
    ctx.strokeStyle = '#163020';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 760, 460);

    // 4. Header Title & Badge
    ctx.fillStyle = '#2D5A3F';
    ctx.font = 'bold 16px Nunito, sans-serif';
    ctx.fillText('TOUCH GRASS: SPROUT PATROL · OFFICIAL FIELD REPORT', 48, 64);

    ctx.fillStyle = '#163020';
    ctx.font = 'bold 38px Fredoka, sans-serif';
    ctx.fillText(`Ranger ${account.trailName}`, 48, 112);

    ctx.fillStyle = '#3D7654';
    ctx.font = 'bold 20px Nunito, sans-serif';
    ctx.fillText(
      `Companion: ${profile.name} (${growth.stage} Stage · ${account.xp} XP)`,
      48,
      146
    );

    // 5. Draw Stats Boxes
    const stats = [
      { label: 'OUTDOOR STREAK', value: `${account.streakDays} Days` },
      { label: 'THIS WEEK OUTSIDE', value: `${weeklyMinutes} Mins` },
      { label: 'QUESTS COMPLETED', value: `${account.completedQuests.length}` },
    ];

    stats.forEach((st, i) => {
      const bx = 48 + i * 170;
      const by = 180;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      drawRoundedRect(ctx, bx, by, 155, 92, 18);
      ctx.fill();
      ctx.strokeStyle = '#B5CEAA';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#3D7654';
      ctx.font = 'bold 12px Nunito, sans-serif';
      ctx.fillText(st.label, bx + 16, by + 30);

      ctx.fillStyle = '#163020';
      ctx.font = 'bold 26px Fredoka, sans-serif';
      ctx.fillText(st.value, bx + 16, by + 68);
    });

    // 6. Draw Companion Illustration on Right Side of Canvas (cx=640, cy=220)
    const cx = 640;
    const cy = 225;

    // Companion Shadow
    ctx.fillStyle = 'rgba(22, 48, 32, 0.15)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 85, 55, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    if (account.companionId === 'moss') {
      // Mushroom Stem
      ctx.fillStyle = '#FDE68A';
      ctx.strokeStyle = '#163020';
      ctx.lineWidth = 4;
      drawRoundedRect(ctx, cx - 28, cy + 5, 56, 72, 18);
      ctx.fill();
      ctx.stroke();

      // Mushroom Cap
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(cx, cy + 8, 66, Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Spots
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.arc(cx - 28, cy - 22, 10, 0, Math.PI * 2);
      ctx.arc(cx + 26, cy - 25, 9, 0, Math.PI * 2);
      ctx.arc(cx, cy - 38, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (account.companionId === 'pip') {
      // Bird Body
      ctx.fillStyle = '#38BDF8';
      ctx.strokeStyle = '#163020';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy + 15, 56, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (account.companionId === 'fernsworth') {
      // Fern Knight Body
      ctx.fillStyle = '#4ADE80';
      ctx.strokeStyle = '#163020';
      ctx.lineWidth = 4;
      drawRoundedRect(ctx, cx - 42, cy - 38, 84, 110, 36);
      ctx.fill();
      ctx.stroke();
    } else {
      // Bee-atrice Body
      ctx.fillStyle = '#FACC15';
      ctx.strokeStyle = '#163020';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 15, 56, 46, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Companion Eyes & Happy Smile
    const eyeY = account.companionId === 'moss' ? cy + 32 : cy + 8;
    ctx.fillStyle = '#163020';
    ctx.beginPath();
    ctx.arc(cx - 18, eyeY, 6, 0, Math.PI * 2);
    ctx.arc(cx + 18, eyeY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, eyeY + 10, 9, 0, Math.PI, false);
    ctx.stroke();

    // 7. Fun Quote Banner at Bottom
    ctx.fillStyle = '#163020';
    ctx.font = 'italic 18px Nunito, sans-serif';
    const quote = `“${profile.happyLines[0]}” — ${profile.name}`;
    ctx.fillText(quote.slice(0, 74), 48, 335);

    ctx.fillStyle = '#2D5A3F';
    ctx.font = 'bold 14px JetBrains Mono, monospace';
    ctx.fillText(
      `Powered by Open-Weight AI · Zero Screen Doomscrolling · ${new Date().toLocaleDateString()}`,
      48,
      452
    );
  }, [account, profile, growth, weeklyMinutes]);

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `sprout-patrol-${account.trailName.toLowerCase()}-card.png`;
    link.href = dataUrl;
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-forest-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-meadow-cream rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-sage-200 my-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="text-xl font-display font-bold text-forest-900">
              Downloadable Trail Share Card (PNG)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-sage-100 hover:bg-sage-200 text-forest-900 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-forest-700 mb-4">
          Rendered 100% locally on an HTML5 Canvas with zero external images. Save and share your off-screen streak!
        </p>

        <div className="rounded-2xl overflow-hidden border border-sage-300 shadow-inner bg-white mb-5">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full h-auto block"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-sage-100 hover:bg-sage-200 text-forest-900 font-bold text-xs cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            className="px-6 py-3 rounded-2xl bg-forest-800 hover:bg-forest-700 text-white font-display font-semibold text-sm flex items-center gap-2 shadow-md cursor-pointer"
          >
            {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{downloaded ? 'Saved PNG!' : 'Download PNG Share Card'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
