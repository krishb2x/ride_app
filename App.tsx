
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
    setView('map');
  };

  const handleSaveDetailedRide = (details: Partial<Ride>) => {
    const newRide: Ride = {
      ride_id: crypto.randomUUID(),
      admin_id: user!.user_id,
      ride_name: details.ride_name || `${user!.name}'s Ride`,
      center_lat: userLocation.lat,
      center_lng: userLocation.lng,
      radius_km: 5,
      status: 'active',
      start_time: Date.now(),
      rider_count: 1,
      ...details
    };
    setActiveRide(newRide);
    setIsRecording(true);
    setRecordedPoints([{ ...userLocation, timestamp: Date.now() }]);
    setView('live');
  };

  const handleEndRide = async () => {
    if (!activeRide) return;
    setIsRecording(false);
    const stats = generateStats(activeRide.ride_id, user!.user_id, recordedPoints);
    setLastStats(stats);
    setMyRides(prev => [stats, ...prev]);
    setView('stats');
    setActiveRide(null);
  };

  if (view === 'auth') {
    return (
      <div className="h-full bg-zinc-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-12">
          <div className="w-24 h-24 bg-orange-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-orange-500/30">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">RIDEADDA</h1>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <input 
            type="tel" 
            placeholder="Phone Number" 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-4 text-lg font-bold text-white focus:border-orange-500 outline-none"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button size="full" onClick={handleLogin}>Join Community</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="flex-1 relative overflow-hidden">
        {view === 'map' && (
          <div className="h-full relative">
            <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <Marker position={userLocation} />
            </MapContainer>
            
            <div className="absolute bottom-6 left-0 right-0 px-6 flex gap-4 z-[1000]">
              <Button variant="secondary" className="flex-1 !rounded-2xl" onClick={() => alert('Route Planning Coming Soon')}>
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 7m0 10V7" /></svg>
                 Plan Route
              </Button>
              <Button className="flex-1 !rounded-2xl" onClick={() => setView('create_ride')}>
                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                 Record
              </Button>
            </div>
            
            <RideDiscovery 
              userLocation={userLocation} 
              onJoinRide={(r) => { setActiveRide(r); setView('live'); }} 
              onCreateRide={() => setView('create_ride')} 
            />
          </div>
        )}

        {view === 'feed' && <ActivityFeed events={feed} />}
        {view === 'participate' && <ParticipateView onJoin={() => setView('live')} />}
        {view === 'profile' && <ProfileView user={user!} garage={garage} rides={myRides} setGarage={setGarage} />}
        {view === 'create_ride' && <CreateRideForm onSave={handleSaveDetailedRide} onCancel={() => setView('map')} />}

        {view === 'live' && activeRide && (
          <LiveRideSession 
            ride={activeRide} 
            isAdmin={activeRide.admin_id === user?.user_id} 
            onEndRide={handleEndRide} 
            onUpdateRideName={(name) => setActiveRide({...activeRide, ride_name: name})}
            onLeaveRide={() => setView('map')}
          />
        )}

        {view === 'stats' && lastStats && (
          <ShareCard 
            ride={{ ride_name: 'Epic Ride' } as any} 
            stats={lastStats} 
            onClose={() => setView('map')} 
          />
        )}
      </div>

      <nav className="h-20 bg-zinc-950 border-t border-zinc-900 flex items-center justify-around px-2 pb-safe">
        {[
          { id: 'feed', label: 'Feed', icon: 'M4 6h16M4 12h16M4 18h16' },
          { id: 'participate', label: 'Participate', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
          { id: 'map', label: 'Map', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 7m0 10V7' },
          { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setView(item.id as AppView)} 
            className={`flex flex-col items-center gap-1 flex-1 py-2 ${view === item.id ? 'text-orange-500' : 'text-zinc-500'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default RideAddaApp;
