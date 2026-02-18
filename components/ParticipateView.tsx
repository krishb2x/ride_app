
import React from 'react';
import { Challenge } from '../types';
import Button from './Button';

const MOCK_CHALLENGES: Challenge[] = [
  { id: '1', title: 'Road Warrior: Coast to Coast', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9109ad08b?auto=format&fit=crop&q=80&w=800', participants: 1240, daysLeft: 13 },
  { id: '2', title: 'Murthal Paratha Run 2026', imageUrl: 'https://images.unsplash.com/photo-1458110604690-044213642153?auto=format&fit=crop&q=80&w=800', participants: 850, daysLeft: 42 },
  { id: '3', title: 'Leh Ladakh Expedition', imageUrl: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&q=80&w=800', participants: 420, daysLeft: 5 }
];

const ParticipateView: React.FC<{onJoin: () => void}> = ({onJoin}) => {
  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-y-auto pb-10 custom-scrollbar">
      <div className="relative h-72 shrink-0 overflow-hidden">
        <img 
          src={MOCK_CHALLENGES[0].imageUrl} 
          className="w-full h-full object-cover scale-110 blur-[1px] brightness-[0.4]"
          alt="Featured Challenge"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute bottom-8 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-500 text-[9px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-widest animate-pulse">Hot Quest</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter leading-tight">{MOCK_CHALLENGES[0].title}</h2>
          <div className="flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
             <span className="text-orange-500">{MOCK_CHALLENGES[0].daysLeft} Days Left</span>
             <span className="w-1 h-1 bg-zinc-700 rounded-full" />
             <span>{MOCK_CHALLENGES[0].participants} RIDERS JOINED</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-10">
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-xl font-black italic tracking-tighter">ACTIVE QUESTS</h3>
            <button className="text-orange-500 text-[10px] font-black uppercase tracking-widest border-b border-orange-500 pb-0.5">Explore All</button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 scroll-hide snap-x">
            {MOCK_CHALLENGES.slice(1).map(c => (
              <div key={c.id} className="min-w-[300px] bg-zinc-900/50 rounded-[2.5rem] overflow-hidden border border-zinc-800/50 snap-center group">
                <div className="relative h-36 overflow-hidden">
                   <img src={c.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={c.title} />
                   <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest">
                     Join Now
                   </div>
                </div>
                <div className="p-5">
                  <h4 className="font-black text-lg mb-1 tracking-tight">{c.title}</h4>
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{c.participants} PARTICIPANTS READY</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-xl font-black italic tracking-tighter">NEARBY MISSIONS</h3>
            <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            </div>
          </div>
          <div className="bg-zinc-900/80 rounded-[2.5rem] border border-zinc-800 p-6 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
               </div>
            </div>
            <div className="h-40 bg-zinc-950 rounded-[1.5rem] overflow-hidden border border-zinc-800 relative">
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/77.2,28.6,12/400x200?access_token=none')] bg-cover opacity-30 grayscale" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="relative">
                    <div className="w-12 h-12 bg-orange-500 rounded-full animate-ping border-4 border-white/10" />
                    <div className="absolute inset-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white/20">
                       <span className="text-xl">🏍️</span>
                    </div>
                 </div>
              </div>
            </div>
            <div>
               <p className="font-black text-xl mb-1 tracking-tight">Sunday Breakfast Run</p>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Connaught Place • 4.2 KM FROM YOU</p>
            </div>
            <Button size="full" className="!rounded-2xl py-5 shadow-orange-500/20" onClick={onJoin}>ACCEPT MISSION</Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ParticipateView;
