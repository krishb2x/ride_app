
import React, { useRef, useEffect, useState } from 'react';
import { RideStats, Ride } from '../types';
import Button from './Button';

interface ShareCardProps {
  ride: Ride;
  stats: RideStats;
  onClose: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ ride, stats, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Overlay Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f9731633');
    gradient.addColorStop(1, '#09090b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Branding
    ctx.fillStyle = '#f97316';
    ctx.font = '900 60px sans-serif';
    ctx.fillText('RIDEADDA', 80, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 24px sans-serif';
    ctx.fillText('COMMUNITY RIDE SUMMARY', 80, 160);

    // Ride Title
    ctx.font = '900 80px sans-serif';
    ctx.fillText(ride.ride_name.toUpperCase(), 80, 400, canvas.width - 160);

    // Stats Grid
    const drawStat = (label: string, value: string, x: number, y: number) => {
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '700 30px sans-serif';
      ctx.fillText(label, x, y);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 90px sans-serif';
      ctx.fillText(value, x, y + 90);
    };

    drawStat('DISTANCE', `${stats.distance_km} KM`, 80, 600);
    drawStat('AVG SPEED', `${stats.avg_speed} KM/H`, 80, 800);
    drawStat('MAX SPEED', `${stats.max_speed} KM/H`, 80, 1000);
    drawStat('TIME', `${stats.moving_time_minutes} MIN`, 80, 1200);

    // Map Placeholder (Simulation)
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 10;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(100, 1400);
    ctx.lineTo(300, 1450);
    ctx.lineTo(500, 1420);
    ctx.lineTo(800, 1500);
    ctx.lineTo(900, 1380);
    ctx.stroke();

    // Footer
    ctx.fillStyle = '#f97316';
    ctx.font = '700 30px sans-serif';
    ctx.fillText('JOIN THE TRIBE AT RIDEADDA.APP', 80, canvas.height - 100);

    setImgUrl(canvas.toDataURL('image/png'));
  }, [ride, stats]);

  const handleShare = async () => {
    if (!imgUrl) return;
    try {
      const blob = await (await fetch(imgUrl)).blob();
      const file = new File([blob], 'ride-stats.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'My Ride Summary',
          text: `Just finished a ride with RideAdda! ${stats.distance_km}km done.`
        });
      } else {
        const link = document.createElement('a');
        link.download = 'ride-adda-stats.png';
        link.href = imgUrl;
        link.click();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">Share Your Ride</h2>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl relative border border-zinc-800">
          <canvas ref={canvasRef} width={1080} height={1920} className="w-full h-full object-contain" />
        </div>

        <div className="mt-8 space-y-3">
          <Button size="full" onClick={handleShare}>
            Share to Instagram
          </Button>
          <Button variant="secondary" size="full" onClick={onClose}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
