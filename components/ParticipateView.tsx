
import React from 'react';
import { Challenge } from '../types';
import Button from './Button';

const MOCK_CHALLENGES: Challenge[] = [
  { id: '1', title: 'Road Warrior Challenge 2026', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9109ad08b?auto=format&fit=crop&q=80&w=800', participants: 1240, daysLeft: 13 },
  { id: '2', title: 'Ride to Daytona Bike Week', imageUrl: 'https://images.unsplash.com/photo-1458110604690-044213642153?auto=format&fit=crop&q=80&w=800', participants: 850, daysLeft: 42 },
  { id: '3', title: 'Mountain Peak Ascent', imageUrl: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&q=80&w=800', participants: 420, daysLeft: 5 }
];

const ParticipateView: React.FC<{onJoin: () => void}> = ({onJoin}) => {
  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-y-auto pb-10">
      {/* Hero Carousel Simulation */}
      <div className="relative h-64 shrink-0 group">
        <img 
          src={MOCK_CHALLENGES[0].imageUrl} 
          className="w-full h-full object-cover brightness-50"
          alt="Featured Challenge"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end p-6 bg-gradient-to-t from-zinc-950 to-transparent">
          <h2 className="text-2xl font-black text-white text-center mb-1">{MOCK_CHALLENGES[0].title}</h2>
          <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
             <span className="text-orange-500">{MOCK_CHALLENGES[0].daysLeft} Days Left</span>
             <span>•</span>
             <span>{MOCK_CHALLENGES[0].participants} Bikers Joined</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Featured Challenges */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black">Featured Challenges</h3>
            <button className="text-orange-500 text-xs font-bold uppercase">See More</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scroll-hide">
            {MOCK_CHALLENGES.slice(1).map(c => (
              <div key={c.id} className="min-w-[280px] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                <img src={c.imageUrl} className="h-32 w-full object-cover" alt={c.title} />
                <div className="p-4">
                  <h4 className="font-black text-sm mb-1">{c.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">{c.participants} PARTICIPANTS</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Events Nearby Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black">Events Nearby</h3>
            <button className="text-zinc-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg></button>
          </div>
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-4 space-y-4">
            <div className="h-32 bg-zinc-800 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/77.2,28.6,12/400x200?access_token=none')] bg-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-10 h-10 bg-orange-500 rounded-full animate-pulse border-4 border-white/20" />
              </div>
            </div>
            <div>
               <p className="font-bold text-sm">Sunday Breakfast Run</p>
               <p className="text-xs text-zinc-500">Connaught Place • 4.2km away</p>
            </div>
            <Button size="full" className="!rounded-xl" onClick={onJoin}>Join Now</Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ParticipateView;
