
import React, { useState } from 'react';
import { User, Vehicle, RideStats, Ride } from '../types';
import Button from './Button';
import HelpView from './HelpView';

interface ProfileViewProps {
  user: User;
  garage: Vehicle[];
  rideHistory: Ride[];
  rideStats: RideStats[];
  setGarage: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, garage, rideHistory, rideStats, setGarage, onLogout }) => {
  const [showAddBike, setShowAddBike] = useState(false);
  const [newBike, setNewBike] = useState({ model: '', year: '' });
  const [errors, setErrors] = useState<{ model?: boolean; year?: boolean }>({});

  const addBike = () => {
    const newErrors: { model?: boolean; year?: boolean } = {};
    if (!newBike.model.trim()) newErrors.model = true;
    if (!newBike.year.trim()) newErrors.year = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
    
    setGarage(prev => [...prev, { id, ...newBike }]);
    setNewBike({ model: '', year: '' });
    setErrors({});
    setShowAddBike(false);
  };

  const getStatsForRide = (rideId: string) => {
    return rideStats.find(s => s.ride_id === rideId);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-y-auto custom-scrollbar pb-20">
      {/* Profile Header */}
      <div className="relative h-64 shrink-0 bg-zinc-900/50">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-zinc-950/60 to-zinc-950" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
           <div className="w-24 h-24 rounded-[2.5rem] border-4 border-zinc-950 bg-zinc-900 flex items-center justify-center overflow-hidden shadow-2xl relative group">
              <svg className="w-14 h-14 text-zinc-800" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
              <div className="absolute bottom-0 inset-x-0 bg-[#ff6600] h-1" />
           </div>
           <h2 className="text-3xl font-black mt-5 italic tracking-tighter text-white uppercase">{user.name}</h2>
           <div className="bg-zinc-900/80 px-4 py-1.5 rounded-full border border-zinc-800 mt-2">
             <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{user.phone_number}</p>
           </div>
        </div>
      </div>

      <div className="p-6 space-y-12">
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-3 gap-4">
           {[
             { label: 'RIDES', val: rideHistory.length },
             { label: 'KM', val: rideStats.reduce((acc, r) => acc + r.distance_km, 0).toFixed(0) },
             { label: 'RANK', val: 'PRO' }
           ].map((stat, i) => (
             <div key={i} className="bg-zinc-900/40 p-5 rounded-[2.5rem] border border-zinc-900/50 text-center">
                <p className="text-2xl font-black italic text-white mb-1">{stat.val}</p>
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
             </div>
           ))}
        </div>

        {/* Garage Section */}
        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-xl font-black italic tracking-tighter uppercase text-white">THE GARAGE</h3>
            <button 
              className="w-10 h-10 bg-blue-600/10 text-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-blue-600/20" 
              onClick={() => { setErrors({}); setShowAddBike(true); }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          
          {garage.length === 0 ? (
            <div className="bg-zinc-900/20 border-2 border-dashed border-zinc-900 rounded-[2.5rem] p-12 text-center group cursor-pointer" onClick={() => setShowAddBike(true)}>
              <p className="text-zinc-700 font-black uppercase tracking-widest text-[9px] mb-4">No bikes registered</p>
              <Button size="sm" variant="secondary" className="!rounded-xl text-[10px] uppercase">Add Machine</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {garage.map(bike => (
                <div key={bike.id} className="bg-zinc-900/40 border border-zinc-900/50 p-5 rounded-[2rem] flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-900 text-[#ff6600]">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-4v-3c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1v3H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h15c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z"/></svg>
                    </div>
                    <div>
                      <p className="font-black text-lg tracking-tight text-white uppercase">{bike.model}</p>
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{bike.year} MODEL</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mission History */}
        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-xl font-black italic tracking-tighter uppercase text-white">MISSION HISTORY</h3>
          </div>
          {rideHistory.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/10 rounded-[2.5rem] border border-zinc-900/30">
               <p className="font-black text-[9px] text-zinc-800 uppercase tracking-[0.4em]">Logbook Empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
               {rideHistory.map(r => {
                 const stats = getStatsForRide(r.ride_id);
                 return (
                   <div key={r.ride_id} className="bg-zinc-900/40 border border-zinc-900/50 rounded-[2rem] p-5 relative overflow-hidden group hover:border-[#ff6600]/30 transition-all">
                      <p className="font-black text-xs mb-1 truncate text-white uppercase">{r.ride_name}</p>
                      <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-4">
                        {r.date || new Date(r.start_time).toLocaleDateString()}
                      </p>
                      <div className="pt-4 border-t border-zinc-900 flex justify-between items-end">
                         <span className="text-sm font-black italic text-[#ff6600]">{stats ? `${stats.distance_km} KM` : '--'}</span>
                         <svg className="w-4 h-4 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                      </div>
                   </div>
                 );
               })}
            </div>
          )}
        </section>

        {/* Support Section */}
        <section className="pt-6 border-t border-zinc-900">
           <HelpView isEmbedded={true} />
        </section>

        {/* Logout Section */}
        <section className="pt-12 px-2">
          <div className="border-t border-zinc-900 pt-10">
            <button 
              onClick={onLogout}
              className="w-full py-5 rounded-[2rem] border border-red-500/30 text-red-500 font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-red-500/10 hover:border-red-500 transition-all active:scale-95 group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout Account
            </button>
            <p className="text-zinc-800 text-[9px] font-black uppercase tracking-[0.4em] text-center mt-8">V1.0.0 Stable Build</p>
          </div>
        </section>
      </div>

      {/* Add Bike Modal */}
      {showAddBike && (
        <div className="fixed inset-0 z-[3000] bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[3rem] w-full max-w-sm shadow-2xl">
              <h3 className="text-2xl font-black mb-8 italic tracking-tighter text-white uppercase">NEW MACHINE</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                   <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Make & Model</span>
                   <input 
                    placeholder="e.g. Ninja 400" 
                    className={`w-full bg-zinc-950 border ${errors.model ? 'border-red-500' : 'border-zinc-800'} p-4 rounded-2xl text-white font-black focus:border-[#ff6600] outline-none transition-all`}
                    value={newBike.model}
                    onChange={e => { setNewBike({...newBike, model: e.target.value}); if (errors.model) setErrors({...errors, model: false}); }}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Year</span>
                  <input 
                    placeholder="2024" 
                    type="number"
                    inputMode="numeric"
                    className={`w-full bg-zinc-950 border ${errors.year ? 'border-red-500' : 'border-zinc-800'} p-4 rounded-2xl text-white font-black focus:border-[#ff6600] outline-none transition-all`}
                    value={newBike.year}
                    onChange={e => { setNewBike({...newBike, year: e.target.value}); if (errors.year) setErrors({...errors, year: false}); }}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                 <Button variant="secondary" className="flex-1 !rounded-2xl" onClick={() => setShowAddBike(false)}>Cancel</Button>
                 <Button 
                    className="flex-1 !rounded-2xl" 
                    variant="accent"
                    onClick={addBike}
                    disabled={!newBike.model.trim() || !newBike.year.trim()}
                  >
                    Confirm
                  </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
