
import React from 'react';
import { Challenge } from '../types';
import Button from './Button';

const MOCK_CHALLENGES: Challenge[] = [
  { id: '1', title: 'Night Ride: Highway Run', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9109ad08b?auto=format&fit=crop&q=80&w=800', participants: 1240, daysLeft: 13 },
  { id: '2', title: 'City Loop: 100km', imageUrl: 'https://images.unsplash.com/photo-1458110604690-044213642153?auto=format&fit=crop&q=80&w=800', participants: 850, daysLeft: 42 },
  { id: '3', title: 'Mountain Expedition', imageUrl: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&q=80&w=800', participants: 420, daysLeft: 5 }
];

const ParticipateView: React.FC<{onJoin: () => void}> = ({onJoin}) => {
  return (
    <div className="flex flex-col h-full bg-black overflow-y-auto pb-10 custom-scrollbar">
      <div className="relative h-72 shrink-0 overflow-hidden">
        <img 
          src={MOCK_CHALLENGES[0].imageUrl} 
          className="w-full h-full object-cover scale-110 blur-[1px] brightness-[0.4]"
          alt="Featured Challenge"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-8 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-widest animate-pulse">Trending</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter leading-tight uppercase">{MOCK_CHALLENGES[0].title}</h2>
          <div className="flex items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
             <span className="text-[#ff6600]">{MOCK_CHALLENGES[0].daysLeft} Days Left</span>
             <span className="w-1 h-1 bg-zinc-800 rounded-full" />
             <span>{MOCK_CHALLENGES[0].participants} RIDERS JOINED</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-10">
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-xl font-black italic tracking-tighter uppercase">MISSION RADAR</h3>
            <button className="text-blue-500 text-[10px] font-black uppercase tracking-widest border-b border-blue-500 pb-0.5">See All</button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 scroll-hide snap-x">
            {MOCK_CHALLENGES.slice(1).map(c => (
              <div key={c.id} className="min-w-[300px] bg-zinc-900/30 rounded-[2.5rem] overflow-hidden border border-zinc-800/50 snap-center group">
                <div className="relative h-36 overflow-hidden">
                   <img src={c.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60" alt={c.title} />
                   <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-[#ff6600] uppercase tracking-widest border border-[#ff6600]/30">
                     Enter
                   </div>
                </div>
                <div className="p-5">
                  <h4 className="font-black text-lg mb-1 tracking-tight text-white">{c.title}</h4>
                  <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{c.participants} RIDERS</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-xl font-black italic tracking-tighter uppercase">LOCAL RIDES</h3>
          </div>
          <div className="bg-zinc-950 rounded-[2.5rem] border border-zinc-900 p-6 space-y-6 shadow-2xl relative overflow-hidden group hover:border-[#ff6600]/30 transition-all">
            <div className="absolute top-0 right-0 p-4">
               <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
               </div>
            </div>
            <div className="h-40 bg-black rounded-[1.5rem] overflow-hidden border border-zinc-900 relative">
              <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center opacity-20">
                 <span className="text-4xl">🗺️</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="relative">
                    <div className="w-12 h-12 bg-[#ff6600] rounded-full animate-ping border-4 border-white/10" />
                    <div className="absolute inset-0 w-12 h-12 bg-[#ff6600] rounded-full flex items-center justify-center border-2 border-white/20 shadow-[0_0_20px_rgba(255,102,0,0.5)]">
                       <span className="text-xl">🏍️</span>
                    </div>
                 </div>
              </div>
            </div>
            <div>
               <p className="font-black text-xl mb-1 tracking-tight text-white">Local Sunday Ride</p>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">4.2 KM Away</p>
            </div>
            <Button variant="accent" size="full" className="!rounded-2xl py-5 italic tracking-tighter" onClick={onJoin}>JOIN RIDE</Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ParticipateView;
