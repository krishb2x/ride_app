
import React, { useState } from 'react';
import { User, Vehicle, RideStats } from '../types';
import Button from './Button';
import HelpView from './HelpView';

interface ProfileViewProps {
  user: User;
  garage: Vehicle[];
  rides: RideStats[];
  setGarage: React.Dispatch<React.SetStateAction<Vehicle[]>>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, garage, rides, setGarage }) => {
  const [showAddBike, setShowAddBike] = useState(false);
  const [newBike, setNewBike] = useState({ model: '', year: '' });

  const addBike = () => {
    if (newBike.model && newBike.year) {
      setGarage(prev => [...prev, { id: crypto.randomUUID(), ...newBike }]);
      setNewBike({ model: '', year: '' });
      setShowAddBike(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-y-auto">
      {/* Profile Header */}
      <div className="relative h-48 shrink-0 bg-zinc-900 border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent" />
        <div className="absolute -bottom-10 left-6 flex items-end gap-4">
          <div className="w-24 h-24 rounded-full border-4 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
             <svg className="w-12 h-12 text-zinc-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          </div>
          <div className="pb-12">
            <h2 className="text-2xl font-black">{user.name}</h2>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Elite Rider • Pro</p>
          </div>
        </div>
      </div>

      <div className="pt-16 p-6 space-y-8 pb-10">
        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-4 text-center">
           <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <p className="text-xl font-black">{rides.length}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Rides</p>
           </div>
           <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <p className="text-xl font-black">{rides.reduce((acc, r) => acc + r.distance_km, 0).toFixed(0)}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Km</p>
           </div>
           <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <p className="text-xl font-black">4</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Badges</p>
           </div>
        </div>

        {/* My Garage */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black">My Garage</h3>
            <button className="text-zinc-500" onClick={() => setShowAddBike(true)}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
          </div>
          
          {garage.length === 0 ? (
            <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl p-10 text-center">
              <p className="text-zinc-600 font-bold text-sm mb-4">No vehicles added yet</p>
              <Button size="sm" onClick={() => setShowAddBike(true)}>Add New Vehicle</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {garage.map(bike => (
                <div key={bike.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-zinc-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-4v-3c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1v3H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h15c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z"/></svg>
                    </div>
                    <div>
                      <p className="font-bold">{bike.model}</p>
                      <p className="text-[10px] text-zinc-500 uppercase">{bike.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Rides List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black">Tracked Rides</h3>
            <div className="flex gap-2">
               <button className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
               <button className="p-2 bg-zinc-900 text-zinc-500 rounded-lg"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
            </div>
          </div>
          {rides.length === 0 ? (
            <div className="text-center py-10 opacity-30">
               <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 7m0 10V7" /></svg>
               <p className="font-bold text-sm">No Tracked Rides</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
               {rides.map(r => (
                 <div key={r.stat_id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <div className="h-20 bg-zinc-800 rounded-lg mb-3" />
                    <p className="font-bold text-xs">Sunday Session</p>
                    <p className="text-[10px] text-zinc-500">{r.distance_km} km</p>
                 </div>
               ))}
            </div>
          )}
        </section>

        {/* Help Section - integrated inside profile and placed last */}
        <section className="pt-4 border-t border-zinc-900">
           <HelpView isEmbedded={true} />
        </section>
      </div>

      {/* Add Bike Modal */}
      {showAddBike && (
        <div className="fixed inset-0 z-[3000] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
           <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] w-full max-w-sm">
              <h3 className="text-xl font-black mb-6">Add New Vehicle</h3>
              <input 
                placeholder="Model (e.g. Ninja 300)" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl mb-3 text-white font-bold"
                value={newBike.model}
                onChange={e => setNewBike({...newBike, model: e.target.value})}
              />
              <input 
                placeholder="Year" 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl mb-6 text-white font-bold"
                value={newBike.year}
                onChange={e => setNewBike({...newBike, year: e.target.value})}
              />
              <div className="flex gap-3">
                 <Button variant="secondary" className="flex-1" onClick={() => setShowAddBike(false)}>Cancel</Button>
                 <Button className="flex-1" onClick={addBike}>Save</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
