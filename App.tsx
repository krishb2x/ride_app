
import React, { useState, useEffect } from 'react';
import { User, Ride, FeedEvent, FeedEventType, RideStats, AppView, Vehicle } from './types';
import { INDIA_COORDS, MOCK_NAMES } from './constants';
import { aiService } from './services/geminiService';
import { generateStats } from './services/rideLogic';

// Components
import Button from './components/Button';
import ActivityFeed from './components/ActivityFeed';
import RideDiscovery from './components/RideDiscovery';
import LiveRideSession from './components/LiveRideSession';
import ShareCard from './components/ShareCard';
import ParticipateView from './components/ParticipateView';
import ProfileView from './components/ProfileView';
import CreateRideForm from './components/CreateRideForm';

// Leaflet
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RideAddaApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('auth');
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [userLocation, setUserLocation] = useState(INDIA_COORDS);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPoints, setRecordedPoints] = useState<{lat: number, lng: number, timestamp: number}[]>([]);
  const [lastStats, setLastStats] = useState<RideStats | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [garage, setGarage] = useState<Vehicle[]>([]);
  const [myRides, setMyRides] = useState<RideStats[]>([]);
  const [participatedRides, setParticipatedRides] = useState<Ride[]>([]);

  useEffect(() => {
    const initialEvents: FeedEvent[] = [
      {
        event_id: 'e1',
        event_type: FeedEventType.RIDE_STARTED,
        message: 'Rohan started "South Delhi Express" near you! Join now.',
        timestamp: Date.now() - 3600000
      }
    ];
    setFeed(initialEvents);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const handleLogin = () => {
    if (!phoneNumber) return;
    const newUser: User = {
      user_id: crypto.randomUUID(),
      phone_number: phoneNumber,
      name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      created_at: Date.now()
    };
    setUser(newUser);
    setView('explore');
  };

  const handleSaveDetailedRide = (details: Partial<Ride>) => {
    const newRide: Ride = {
      ride_id: crypto.randomUUID(),
      admin_id: user!.user_id,
      // Added host_name to track the creator's name in the ride data
      host_name: user!.name,
      ride_name: details.ride_name || `${user!.name}'s Ride`,
      center_lat: userLocation.lat,
      center_lng: userLocation.lng,
      radius_km: 5,
      status: details.status || 'active',
      visibility: details.visibility || 'public',
      start_time: Date.now(),
      rider_count: 1,
      joined_rider_ids: [user!.user_id],
      pending_requests: [],
      ...details
    };
    setActiveRide(newRide);
    setParticipatedRides(prev => [newRide, ...prev]);
    if (newRide.status === 'active') {
      setIsRecording(true);
      setRecordedPoints([{ ...userLocation, timestamp: Date.now() }]);
    }
    setView('live');
  };

  const handleJoinRide = (r: Ride) => {
    const updatedRide = { ...r, joined_rider_ids: [...(r.joined_rider_ids || []), user!.user_id] };
    setActiveRide(updatedRide);
    setParticipatedRides(prev => {
      if (prev.find(p => p.ride_id === r.ride_id)) return prev;
      return [updatedRide, ...prev];
    });
    setView('live');
  };

  const handleRequestJoin = (r: Ride) => {
    // host_name is now defined on the Ride interface to support this alert
    alert(`Request sent to ${r.host_name || 'Admin'}. Please wait for approval.`);
    // In a real app, this would add user_id to r.pending_requests
  };

  const handleEndRide = async () => {
    if (!activeRide) return;
    setIsRecording(false);
    const stats = generateStats(activeRide.ride_id, user!.user_id, recordedPoints);
    setLastStats(stats);
    setMyRides(prev => [stats, ...prev]);
    
    setParticipatedRides(prev => prev.map(pr => 
      pr.ride_id === activeRide.ride_id 
        ? { ...pr, status: 'completed', end_time: Date.now() } 
        : pr
    ));

    setView('stats');
    setActiveRide(null);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="flex-1 relative overflow-hidden">
        {view === 'explore' && (
          <div className="h-full relative">
            <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <Marker position={userLocation} />
            </MapContainer>
            
            <RideDiscovery 
              userLocation={userLocation} 
              onJoinRide={handleJoinRide} 
              onRequestJoin={handleRequestJoin}
              onCreateRide={() => setView('create_ride')} 
            />
          </div>
        )}

        {view === 'pulse' && <ActivityFeed events={feed} />}
        {view === 'quests' && <ParticipateView onJoin={() => {}} />}
        {view === 'profile' && <ProfileView user={user!} garage={garage} rideHistory={participatedRides} rideStats={myRides} setGarage={setGarage} />}
        {view === 'create_ride' && <CreateRideForm onSave={handleSaveDetailedRide} onCancel={() => setView('explore')} />}

        {view === 'live' && activeRide && (
          <LiveRideSession 
            ride={activeRide} 
            isAdmin={activeRide.admin_id === user?.user_id} 
            onEndRide={handleEndRide} 
            onStartRide={() => {
              const started = { ...activeRide, status: 'active' as const };
              setActiveRide(started);
              setIsRecording(true);
              setRecordedPoints([{ ...userLocation, timestamp: Date.now() }]);
            }}
            onUpdateRideName={(name) => {
              setActiveRide({...activeRide, ride_name: name});
            }}
            onLeaveRide={() => setView('explore')}
          />
        )}

        {view === 'stats' && lastStats && (
          <ShareCard 
            ride={{ ride_name: participatedRides.find(r => r.ride_id === lastStats.ride_id)?.ride_name || 'Epic Ride' } as any} 
            stats={lastStats} 
            onClose={() => setView('explore')} 
          />
        )}
      </div>

      {view !== 'auth' && (
        <nav className="h-20 bg-zinc-950 border-t border-zinc-900 flex items-center justify-around px-2 pb-safe">
          {[
            { id: 'pulse', label: 'Pulse', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { id: 'quests', label: 'Quests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { id: 'explore', label: 'Explore', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
            { id: 'profile', label: 'Profile', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as AppView)} 
              className={`flex flex-col items-center gap-1.5 flex-1 py-2 ${view === item.id ? 'text-orange-500' : 'text-zinc-500'} transition-all duration-300`}
            >
              <svg className={`w-6 h-6 ${view === item.id ? 'scale-110' : 'scale-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
              </svg>
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${view === item.id ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {view === 'auth' && (
        <div className="h-full bg-zinc-950 flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-12">
            <div className="w-24 h-24 bg-orange-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">RIDEADDA</h1>
          </div>
          <div className="w-full max-w-sm space-y-4">
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-4 text-lg font-bold text-white focus:border-orange-500 outline-none"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button size="full" onClick={handleLogin}>Join the Tribe</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideAddaApp;
