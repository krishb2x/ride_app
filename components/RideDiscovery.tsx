
import React, { useState, useMemo } from 'react';
import { Ride } from '../types';
import Button from './Button';
import { haversineDistance } from '../services/rideLogic';

interface ExtendedRide extends Ride {
  host_name: string;
  ride_type: 'cruiser' | 'sport' | 'adventure' | 'city';
}

interface RideDiscoveryProps {
  onJoinRide: (ride: Ride) => void;
  onRequestJoin: (ride: Ride) => void;
  onCreateRide: () => void;
  userLocation: { lat: number, lng: number };
}

const RideDiscovery: React.FC<RideDiscoveryProps> = ({ onJoinRide, onRequestJoin, onCreateRide, userLocation }) => {
  const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);
  const [rides] = useState<ExtendedRide[]>([
    {
      ride_id: '1',
      admin_id: 'admin1',
      host_name: 'Arjun K.',
      ride_name: 'Morning Hills Run',
      center_lat: userLocation.lat + 0.01,
      center_lng: userLocation.lng + 0.01,
      radius_km: 5,
      status: 'active',
      visibility: 'public',
      start_time: Date.now() - 3600000,
      rider_count: 12,
      ride_type: 'sport',
      joined_rider_ids: []
    },
    {
      ride_id: '2',
      admin_id: 'admin2',
      host_name: 'Sanya M.',
      ride_name: 'Weekend Breakfast Ride',
      center_lat: userLocation.lat - 0.02,
      center_lng: userLocation.lng - 0.015,
      radius_km: 10,
      status: 'upcoming',
      visibility: 'private',
      start_time: Date.now() + 86400000,
      rider_count: 4,
      ride_type: 'city',
      joined_rider_ids: []
    }
  ]);

  const getRideIcon = (type: string) => {
    switch (type) {
      case 'sport':
        return <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      default:
        return <svg className="w-5 h-5 text-[#ff6600]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
    }
  };

  const ridesWithDistance = useMemo(() => {
    return rides.map(ride => ({
      ...ride,
      distanceToUser: haversineDistance(userLocation.lat, userLocation.lng, ride.center_lat, ride.center_lng)
    })).sort((a, b) => a.distanceToUser - b.distanceToUser);
  }, [rides, userLocation]);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
      {showCreateConfirmation && (
        <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 pointer-events-auto animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[3rem] shadow-2xl max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-600/20">
              <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 italic uppercase">Start a Ride?</h3>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-6">Create a ride for others to join</p>
            <div className="flex flex-col gap-3">
              <Button variant="accent" size="full" onClick={() => { setShowCreateConfirmation(false); onCreateRide(); }} className="italic tracking-widest">
                START RIDE
              </Button>
              <Button variant="secondary" size="full" onClick={() => setShowCreateConfirmation(false)} className="uppercase tracking-widest">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto space-y-4">
        <div className="pointer-events-auto">
          <Button variant="accent" size="full" onClick={() => setShowCreateConfirmation(true)} className="rounded-[2.5rem] py-5 italic tracking-tighter text-xl shadow-[#ff6600]/20">
             START A NEW RIDE
          </Button>
        </div>

        <div className="bg-black/95 backdrop-blur-3xl rounded-[3rem] border border-zinc-900 p-6 pointer-events-auto shadow-2xl overflow-hidden max-h-[45vh] flex flex-col">
          <div className="w-16 h-1.5 bg-zinc-900 rounded-full mx-auto mb-6 shrink-0 shadow-inner" />
          
          <div className="flex items-center justify-between mb-6 shrink-0 px-2">
            <h2 className="text-2xl font-black italic tracking-tighter text-white">NEARBY</h2>
            <span className="text-[9px] font-black bg-zinc-950 text-blue-500 px-3 py-1 rounded-full border border-blue-900/30 uppercase tracking-[0.2em]">
              Live Rides
            </span>
          </div>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-1 pb-4 custom-scrollbar">
            {ridesWithDistance.map(ride => (
              <div key={ride.ride_id} className="bg-zinc-900/30 border border-zinc-800/40 p-5 rounded-[2.5rem] transition-all duration-300 group hover:border-[#ff6600]/40">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center border border-zinc-900 group-hover:border-[#ff6600]/20 transition-colors">
                      {getRideIcon(ride.ride_type)}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-white group-hover:text-[#ff6600] transition-colors leading-tight">
                        {ride.ride_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${ride.status === 'active' ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' : 'bg-zinc-800 text-zinc-600'}`}>
                          {ride.status === 'active' ? 'Live Now' : 'Upcoming'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-zinc-900/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white italic">{ride.distanceToUser.toFixed(1)} KM</span>
                    <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">DISTANCE</span>
                  </div>
                  {ride.visibility === 'public' ? (
                    <Button 
                      size="sm" 
                      variant="accent"
                      onClick={() => onJoinRide(ride)} 
                      className="rounded-2xl px-6 font-black italic text-[11px] py-3 shadow-none border-none"
                    >
                      JOIN
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => onRequestJoin(ride)} 
                      className="rounded-2xl px-4 text-[10px] py-3 uppercase tracking-widest opacity-60"
                    >
                      REQUEST
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDiscovery;
