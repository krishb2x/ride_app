
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
  onCreateRide: () => void;
  userLocation: { lat: number, lng: number };
}

const RideDiscovery: React.FC<RideDiscoveryProps> = ({ onJoinRide, onCreateRide, userLocation }) => {
  const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);
  const [rides] = useState<ExtendedRide[]>([
    {
      ride_id: '1',
      admin_id: 'admin1',
      host_name: 'Rohan Sharma',
      ride_name: 'Connaught Place Sunday Run',
      center_lat: userLocation.lat + 0.01,
      center_lng: userLocation.lng + 0.01,
      radius_km: 5,
      status: 'active',
      start_time: Date.now() - 3600000,
      rider_count: 12,
      ride_type: 'city'
    },
    {
      ride_id: '2',
      admin_id: 'admin2',
      host_name: 'Sanya Malhotra',
      ride_name: 'Late Night Chai @ Murthal',
      center_lat: userLocation.lat - 0.02,
      center_lng: userLocation.lng - 0.015,
      radius_km: 10,
      status: 'active',
      start_time: Date.now() - 1800000,
      rider_count: 4,
      ride_type: 'adventure'
    },
    {
      ride_id: '3',
      admin_id: 'admin3',
      host_name: 'Kabir Singh',
      ride_name: 'Lonavala Ghat Morning Ride',
      center_lat: userLocation.lat + 0.005,
      center_lng: userLocation.lng - 0.025,
      radius_km: 3,
      status: 'active',
      start_time: Date.now() - 600000,
      rider_count: 8,
      ride_type: 'sport'
    }
  ]);

  const getRideIcon = (type: string) => {
    switch (type) {
      case 'sport':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'adventure':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'city':
        return (
          <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
    }
  };

  const ridesWithDistance = useMemo(() => {
    return rides.map(ride => ({
      ...ride,
      distanceToUser: haversineDistance(userLocation.lat, userLocation.lng, ride.center_lat, ride.center_lng)
    })).sort((a, b) => a.distanceToUser - b.distanceToUser);
  }, [rides, userLocation]);

  const handleCreateConfirm = () => {
    setShowCreateConfirmation(false);
    onCreateRide();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
      {/* Confirmation Modal */}
      {showCreateConfirmation && (
        <div className="fixed inset-0 z-[2000] bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-6 pointer-events-auto animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-6 tracking-tight leading-tight">Are you sure you want to start a new ride?</h3>
            <div className="flex flex-col gap-3">
              <Button size="full" onClick={handleCreateConfirm} className="shadow-orange-500/30">
                Yes, Start Ride
              </Button>
              <Button variant="secondary" size="full" onClick={() => setShowCreateConfirmation(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto space-y-4">
        {/* Creation CTA */}
        <div className="pointer-events-auto">
          <Button size="full" onClick={() => setShowCreateConfirmation(true)} className="rounded-2xl border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            START A NEW RIDE
          </Button>
        </div>

        {/* Bottom Sheet */}
        <div className="bg-zinc-950/95 backdrop-blur-2xl rounded-[2.5rem] border border-zinc-800 p-6 pointer-events-auto shadow-2xl overflow-hidden max-h-[45vh] flex flex-col">
          <div className="w-16 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 shrink-0" />
          
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute opacity-75" />
                <div className="w-3 h-3 bg-green-500 rounded-full relative" />
              </div>
              Discover
            </h2>
            <span className="text-xs font-black bg-zinc-900 text-zinc-400 px-3 py-1 rounded-full border border-zinc-800 uppercase tracking-widest">
              Nearby Rides
            </span>
          </div>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-1 pb-4 custom-scrollbar">
            {ridesWithDistance.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4 opacity-20">🏍️</div>
                <p className="text-zinc-500 font-bold">No rides happening near you</p>
                <p className="text-zinc-600 text-xs mt-1">Be the first to start a group ride!</p>
              </div>
            ) : ridesWithDistance.map(ride => (
              <div key={ride.ride_id} className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 p-5 rounded-3xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:bg-zinc-700 group-hover:border-zinc-600 transition-colors">
                      {getRideIcon(ride.ride_type)}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-white group-hover:text-orange-400 transition-colors leading-tight">
                        {ride.ride_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-4 h-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs text-zinc-500 font-bold">{ride.host_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-xl font-black text-white">{ride.distanceToUser.toFixed(1)}</span>
                    <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest">KM AWAY</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-zinc-800/50">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-zinc-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z" />
                      </svg>
                      <span className="text-xs font-black text-zinc-400">{ride.rider_count} joined</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-black text-zinc-400">{ride.radius_km}km zone</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => onJoinRide(ride)} 
                    className="rounded-xl px-6 bg-zinc-800 border border-zinc-700 hover:bg-orange-500 hover:border-orange-400 transition-all shadow-lg"
                  >
                    JOIN
                  </Button>
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
