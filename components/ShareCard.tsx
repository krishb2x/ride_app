
import React, { useRef, useEffect, useState } from 'react';
import { RideStats, Ride, User, Vehicle } from '../types';
import Button from './Button';

interface ShareCardProps {
  user: User;
  vehicle?: Vehicle;
  ride: Ride;
  stats?: RideStats | null;
  onClose: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ user, vehicle, ride, stats, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Instagram Story Dimensions: 1080x1920
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    const isCompleted = !!stats;

    // Helper: Rounded Rect
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
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
    };

    // 1. BACKGROUND: Deep Matte Black
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);

    // 2. SUBTLE ORBIT RINGS
    ctx.strokeStyle = 'rgba(255, 106, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 400 * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. SILHOUETTE: Faint shadow bike (Low Opacity)
    ctx.save();
    ctx.globalAlpha = 0.01;
    ctx.font = '800px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🏍', W / 2, H / 2 + 300);
    ctx.restore();

    // --- START RENDERING SECTIONS ---
    let y = 180;

    // TOP SECTION: Branding
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FF6A00';
    ctx.font = 'bold 110px sans-serif';
    ctx.fillText('MotoOrbit', W / 2, y);

    y += 80;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 32px sans-serif';
    ctx.letterSpacing = '18px';
    ctx.fillText('STAY IN ORBIT', W / 2 + 9, y);
    ctx.letterSpacing = 'normal';

    y += 200;
    // EVENT TITLE SECTION (Dynamic)
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 80px sans-serif';
    // Preserve rider's formatting
    const displayTitle = (ride.ride_name || 'MISSION ORBIT');
    ctx.fillText(displayTitle, W / 2, y);

    y += 85;
    ctx.font = '700 48px sans-serif';
    ctx.fillText(ride.destination || 'Maa Chandrika Devi 🛕', W / 2, y);

    y += 60;
    ctx.fillStyle = '#666666'; // Grey Subtitle
    ctx.font = '700 28px sans-serif';
    ctx.fillText(`${ride.meeting_point || 'Lucknow'} Morning Orbit`, W / 2, y);

    y += 120;
    // MIDDLE SECTION: MAP CARD
    const cardH = 520;
    const cardMargin = 120;
    const cardW = W - cardMargin * 2;
    const cardY = y;

    // Card background with glow border
    ctx.shadowBlur = 40;
    ctx.shadowColor = 'rgba(255, 106, 0, 0.12)';
    ctx.fillStyle = 'rgba(15, 15, 15, 1)';
    roundRect(cardMargin, cardY, cardW, cardH, 60);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 106, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Map content clip
    ctx.save();
    roundRect(cardMargin, cardY, cardW, cardH, 60);
    ctx.clip();
    
    // Grid texture
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for(let i=0; i<W; i+=70) {
      ctx.beginPath(); ctx.moveTo(i, cardY); ctx.lineTo(i, cardY+cardH); ctx.stroke();
    }
    for(let j=cardY; j<cardY+cardH; j+=70) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke();
    }

    // Curved line
    ctx.beginPath();
    ctx.strokeStyle = '#FF6A00';
    ctx.lineWidth = 8;
    ctx.setLineDash([25, 20]);
    ctx.moveTo(cardMargin + 80, cardY + 100);
    ctx.bezierCurveTo(400, cardY + 450, 680, cardY + 80, W - cardMargin - 80, cardY + 400);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Pin icon
    ctx.fillStyle = '#FF6A00';
    ctx.font = '60px sans-serif';
    ctx.fillText('📍', W - cardMargin - 120, cardY + 400);

    // Glass Badge Center
    const bW = 400, bH = 180;
    const bX = W/2 - bW/2, bY = cardY + cardH/2 - bH/2;
    ctx.fillStyle = 'rgba(40, 40, 40, 0.85)';
    roundRect(bX, bY, bW, bH, 45);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px sans-serif';
    ctx.fillText(ride.total_distance || '56 KM', W / 2, bY + 85);
    ctx.fillStyle = '#FF6A00';
    ctx.font = '800 24px sans-serif';
    ctx.fillText('Morning Ride', W / 2, bY + 130);
    ctx.restore();

    y += cardH + 150;
    // STATUS SECTION
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 95px sans-serif';
    ctx.fillText(isCompleted ? 'MISSION LOGGED' : 'RIDE STARTED', W / 2, y);
    
    // Underline
    ctx.fillStyle = '#FF6A00';
    ctx.fillRect(W / 2 - 220, y + 35, 440, 5);

    y += 200;
    // INFO SECTION (Two Column)
    const colLeft = 200;
    const colRight = 620;

    const drawData = (label: string, value: string, x: number, py: number, highlight = false) => {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#666666';
      ctx.font = '900 26px sans-serif';
      ctx.fillText(label.toUpperCase(), x, py);
      
      ctx.fillStyle = highlight ? '#FF6A00' : '#ffffff';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText(value, x, py + 55);
    };

    if (isCompleted && stats) {
      drawData('🛣 Distance', `${stats.distance_km} KM`, colLeft, y);
      drawData('⏱ Duration', `${stats.moving_time_minutes} MIN`, colRight, y);
      drawData('⚡ Avg Speed', `${stats.avg_speed} KPH`, colLeft, y + 180);
      drawData('🚀 Max Speed', `${stats.max_speed} KPH`, colRight, y + 180, true);
    } else {
      drawData('⏰ Assemble', ride.assembling_time || '06:45 AM', colLeft, y);
      drawData('🚦 Departure', ride.departure_time || '07:00 AM', colRight, y, true);
      drawData('📍 Location', ride.meeting_point?.substring(0, 16) || 'Store', colLeft, y + 180);
      drawData('🍽 Stop', ride.breakfast_point?.substring(0, 16) || 'Dhaba', colRight, y + 180);
    }

    y += 380;
    // FOOTER
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px sans-serif';
    
    if (ride.gears_mandatory) {
      ctx.fillStyle = '#FF6A00';
      ctx.fillText('✔ RIDING GEAR MANDATORY', W / 2, y);
    } else {
      ctx.fillStyle = '#444444';
      ctx.fillText('RIDE SAFE • STAY IN ORBIT', W / 2, y);
    }

    y += 110;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 50px sans-serif';
    ctx.letterSpacing = '14px';
    ctx.fillText('#STAYINORBIT', W / 2, y);
    ctx.letterSpacing = 'normal';

    y += 70;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '700 22px sans-serif';
    ctx.fillText('MotoOrbit – Stay in Orbit', W / 2, y);

    setImgUrl(canvas.toDataURL('image/png'));
  }, [ride, stats, user, vehicle]);

  const handleShare = async () => {
    if (!imgUrl) return;
    try {
      const blob = await (await fetch(imgUrl)).blob();
      const file = new File([blob], 'motoorbit-summary.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Mission Log | MotoOrbit',
          text: `Established Orbit with MotoOrbit! #StayInOrbit`
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!imgUrl) return;
    const link = document.createElement('a');
    link.download = `motoorbit-${Date.now()}.png`;
    link.href = imgUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[6000] bg-black/98 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300 backdrop-blur-md">
      <div className="max-w-md w-full flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-6 shrink-0 px-2">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#FF6A00] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.5)]">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             </div>
             <div>
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Mission Card</h2>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Premium High-End Sync</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors border border-zinc-800">
            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 bg-zinc-950 rounded-[3.5rem] overflow-hidden shadow-2xl relative border border-zinc-900/50 group">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-[2px]">
             <span className="bg-zinc-900/80 px-8 py-3.5 rounded-full border border-zinc-800 text-[11px] font-black uppercase tracking-[0.4em] text-white">HQ Preview</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 shrink-0 px-2">
          <Button variant="accent" size="full" onClick={handleShare} className="!rounded-[2.5rem] py-6 italic tracking-tighter text-2xl shadow-[#FF6A00]/40 transition-all active:scale-[0.98]">
            SHARE MISSION
          </Button>
          <button 
            onClick={handleDownload}
            className="w-full py-4 text-[11px] font-black text-zinc-700 uppercase tracking-[0.5em] hover:text-white transition-colors"
          >
            Save to Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
