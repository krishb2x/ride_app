
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
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, garage, rideHistory, rideStats, setGarage }) => {
  const [showAddBike, setShowAddBike] = useState(false);
  const [newBike, setNewBike] = useState({ model: '', year: '' });

  const addBike = () => {
    if (newBike.model && newBike.year) {
      setGarage(prev => [...prev, { id: crypto.randomUUID(), ...newBike }]);
      setNewBike({ model: '', year: '' });
      setShowAddBike(false);
    }
  };

  const getStatsForRide = (rideId: string) => {
    return rideStats.find(s => s.ride_id === rideId);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-y-auto custom-scrollbar">
      {/* Profile Header */}
      <div className="relative h-56 shrink-0 bg-zinc-900/50">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 via-zinc-950/40 to-zinc-950" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
           <div className="w-24 h-24 rounded-[2rem] border-4 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden shadow-2xl relative">
              <svg className="w-12 h-12 text-zinc-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
              <div className="absolute bottom-0 inset-x-0 bg-orange-500 h-1.5" />
           </div>
           <h2 className="text-3xl font-black mt-4 italic tracking-tighter">{user.name}</h2>
           <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mt-1">Rider Profile</p>
        </div>
      </div>

      <div className="p-6 space-y-12 pb-10">
        {/* Dashboard Strip */}
        <div className="grid grid-cols-3 gap-4">
           <div className="bg-zinc-900/50 p-5 rounded-[2rem] border border-zinc-800 text-center flex flex-col items-center justify-center">
              <p className="text-2xl font-black italic leading-none mb-1">{rideHistory.length}</p>
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Rides</p>
           </div>
           <div className="bg-zinc-900/50 p-5 rounded-[2rem] border border-zinc-800 text-center flex flex-col items-center justify-center">
              <p className="text-2xl font-black italic leading-none mb-1">{rideStats.reduce((acc, r) => acc + r.distance_km, 0).toFixed(0)}</p>
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">KM</p>
           </div>
           <div className="bg-zinc-900/50 p-5 rounded-[2rem] border border-zinc-800 text-center flex flex-col items-center justify-center">
              <p className="text-2xl font-black italic leading-none mb-1">4</p>
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Badges</p>
           </div>
        </div>

        {/* My Machines */}
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-xl font-black italic tracking-tighter uppercase tracking-widest">The Garage</h3>
            <button 
              className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all" 
              onClick={() => setShowAddBike(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          
          {garage.length === 0 ? (
            <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[2.5rem] p-12 text-center group hover:border-orange-500/30 transition-all cursor-pointer" onClick={() => setShowAddBike(true)}>
              <div className="w-16 h-16 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                 <span className="text-3xl opacity-20">🏍️</span>
              </div>
              <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px] mb-4">No machines added yet</p>
              <Button size="sm" className="!rounded-xl">Park Your Bike</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {garage.map(bike => (
                <div key={bike.id} className="bg-zinc-900 border border-zinc-800/50 p-5 rounded-[2rem] flex items-center justify-between hover:border-orange-500/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center border border-zinc-800">
                      <svg className="w-7 h-7 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-4v-3c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1v3H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h15c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z"/></svg>
                    </div>
                    <div>
                      <p className="font-black text-lg tracking-tight">{bike.model}</p>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{bike.year} Model</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Logged Rides */}
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-xl font-black italic tracking-tighter uppercase tracking-widest">Mission Log</h3>
          </div>
          {rideHistory.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/20 rounded-[2.5rem] border border-zinc-800/30">
               <svg className="w-16 h-16 mx-auto mb-4 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 7m0 10V7" /></svg>
               <p className="font-black text-[10px] text-zinc-600 uppercase tracking-[0.3em]">No missions logged</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
               {rideHistory.map(r => {
                 const stats = getStatsForRide(r.ride_id);
                 return (
                   <div key={r.ride_id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 relative overflow-hidden group hover:border-orange-500/50 transition-all shadow-xl">
                      {r.status === 'active' && (
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                           <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                           <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Live</span>
                        </div>
                      )}
                      
                      <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-5 text-orange-500 shadow-inner group-hover:scale-110 transition-transform">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      </div>

                      <p className="font-black text-sm mb-1 truncate tracking-tight">{r.ride_name}</p>
                      <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-4">
                        {r.date || new Date(r.start_time).toLocaleDateString()}
                      </p>

                      <div className="pt-4 border-t border-zinc-800 flex justify-between items-end">
                         <div className="flex flex-col">
                            <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-1">Distance</span>
                            <span className="text-sm font-black italic">{stats ? `${stats.distance_km} KM` : '--'}</span>
                         </div>
                         <div className="w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-4">
                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                         </div>
                      </div>
                   </div>
                 );
               })}
            </div>
          )}
        </section>

        <section className="pt-6 border-t border-zinc-900">
           <HelpView isEmbedded={true} />
        </section>
      </div>

      {showAddBike && (
        <div className="fixed inset-0 z-[3000] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[3rem] w-full max-w-sm shadow-2xl">
              <h3 className="text-2xl font-black mb-8 italic tracking-tighter">NEW MACHINE</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                   <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Make & Model</span>
                   <input 
                    placeholder="Ninja 300 / Himalayan" 
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white font-black focus:border-orange-500 outline-none transition-all"
                    value={newBike.model}
                    onChange={e => setNewBike({...newBike, model: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Manufacture Year</span>
                  <input 
                    placeholder="2024" 
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white font-black focus:border-orange-500 outline-none transition-all"
                    value={newBike.year}
                    onChange={e => setNewBike({...newBike, year: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                 <Button variant="secondary" className="flex-1 !rounded-2xl" onClick={() => setShowAddBike(false)}>Cancel</Button>
                 <Button className="flex-1 !rounded-2xl" onClick={addBike}>Park It</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
