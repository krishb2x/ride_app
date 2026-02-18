
import React, { useState, useEffect, useCallback } from 'react';
import { User, Ride, FeedEvent, FeedEventType, RideStats } from './types';
import { INDIA_COORDS, MOCK_NAMES } from './constants';
import { aiService } from './services/geminiService';
import { generateStats } from './services/rideLogic';

// Components
import Button from './components/Button';
import ActivityFeed from './components/ActivityFeed';
import RideDiscovery from './components/RideDiscovery';
import LiveRideSession from './components/LiveRideSession';
import ShareCard from './components/ShareCard';

// Leaflet
import { MapContainer, TileLayer, Marker, Circle, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Icons Fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RideAddaApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'auth' | 'home' | 'feed' | 'live' | 'stats'>('auth');
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [userLocation, setUserLocation] = useState(INDIA_COORDS);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPoints, setRecordedPoints] = useState<{lat: number, lng: number, timestamp: number}[]>([]);
  const [lastStats, setLastStats] = useState<RideStats | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  // 1. Initial Feed Loading
  useEffect(() => {
    const initialEvents: FeedEvent[] = [
      {
        event_id: 'e1',
        event_type: FeedEventType.RIDE_STARTED,
        message: 'Rohan started "South Delhi Express" near you! Join now.',
        timestamp: Date.now() - 3600000
      },
      {
        event_id: 'e2',
        event_type: FeedEventType.RIDER_JOINED,
        message: 'Aaryan joined "Late Night Chai @ Murthal".',
        timestamp: Date.now() - 1800000
      }
    ];
    setFeed(initialEvents);
  }, []);

  // 2. Geolocation Simulation (or Real if possible)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  // 3. Recording Track
  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setUserLocation(prev => {
          // Mock some movement for the demo if user is stationary
          const next = { 
            lat: prev.lat + (Math.random() - 0.5) * 0.0005, 
            lng: prev.lng + (Math.random() - 0.5) * 0.0005 
          };
          setRecordedPoints(points => [...points, { ...next, timestamp: Date.now() }]);
          return next;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleLogin = () => {
    if (!phoneNumber) return;
    const newUser: User = {
      user_id: crypto.randomUUID(),
      phone_number: phoneNumber,
      name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      created_at: Date.now()
    };
    setUser(newUser);
    setView('home');
  };

  const addFeedEvent = async (type: FeedEventType, context: string, rideId?: string) => {
    const message = await aiService.generateFeedMessage(type, context);
    const event: FeedEvent = {
      event_id: crypto.randomUUID(),
      event_type: type,
      message,
      timestamp: Date.now(),
      ride_id: rideId,
      user_id: user?.user_id
    };
    setFeed(prev => [event, ...prev]);
  };

  const handleCreateRide = async () => {
    const newRide: Ride = {
      ride_id: crypto.randomUUID(),
      admin_id: user!.user_id,
      ride_name: `${user!.name}'s Quick Rip`,
      center_lat: userLocation.lat,
      center_lng: userLocation.lng,
      radius_km: 5,
      status: 'active',
      start_time: Date.now(),
      rider_count: 1
    };
    setActiveRide(newRide);
    setIsRecording(true);
    setRecordedPoints([{ ...userLocation, timestamp: Date.now() }]);
    setView('live');
    addFeedEvent(FeedEventType.RIDE_STARTED, `${user?.name} is hitting the road!`, newRide.ride_id);
  };

  const handleJoinRide = (ride: Ride) => {
    setActiveRide({ ...ride, rider_count: ride.rider_count + 1 });
    setIsRecording(true);
    setRecordedPoints([{ ...userLocation, timestamp: Date.now() }]);
    setView('live');
    addFeedEvent(FeedEventType.RIDER_JOINED, `${user?.name} joined the crew!`, ride.ride_id);
  };

  const handleEndRide = async () => {
    if (!activeRide) return;
    setIsRecording(false);
    const stats = generateStats(activeRide.ride_id, user!.user_id, recordedPoints);
    setLastStats(stats);
    setView('stats');
    addFeedEvent(FeedEventType.RIDE_COMPLETED, `${user?.name} completed their ride. Check out those stats!`, activeRide.ride_id);
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
          <p className="text-zinc-500 mt-2 font-medium">Bikers of India, Assemble.</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">+91</span>
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-14 pr-4 text-lg font-bold focus:border-orange-500 transition-colors"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <Button size="full" onClick={handleLogin}>Get OTP</Button>
          <p className="text-[10px] text-zinc-600 px-6">By continuing, you agree to our Terms and Community Guidelines. We value your safety.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Dynamic View Content */}
      <div className="flex-1 relative overflow-hidden">
        {view === 'home' && (
          <div className="h-full relative">
            <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <Marker position={userLocation} />
              {/* Nearby Rides Visualization */}
              <Circle center={[userLocation.lat + 0.01, userLocation.lng + 0.01]} radius={1000} pathOptions={{ color: '#f97316' }} />
              <Circle center={[userLocation.lat - 0.02, userLocation.lng - 0.015]} radius={2000} pathOptions={{ color: '#f97316' }} />
            </MapContainer>
            <RideDiscovery 
              userLocation={userLocation} 
              onJoinRide={handleJoinRide} 
              onCreateRide={handleCreateRide} 
            />
          </div>
        )}

        {view === 'feed' && <ActivityFeed events={feed} />}

        {view === 'live' && activeRide && (
          <LiveRideSession 
            ride={activeRide} 
            isAdmin={activeRide.admin_id === user?.user_id} 
            onEndRide={handleEndRide} 
            onLeaveRide={() => { setView('home'); setIsRecording(false); }}
          />
        )}

        {view === 'stats' && lastStats && (
          <ShareCard 
            ride={{ ride_name: 'The Epic Run' } as any} 
            stats={lastStats} 
            onClose={() => setView('home')} 
          />
        )}
      </div>

      {/* Navigation Bar */}
      <nav className="h-20 bg-zinc-950 border-t border-zinc-900 flex items-center justify-around px-4 pb-2">
        <button 
          onClick={() => setView('home')} 
          className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-orange-500' : 'text-zinc-500'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
          <span className="text-[10px] font-black uppercase">Ride</span>
        </button>

        <button 
          onClick={() => setView('feed')} 
          className={`flex flex-col items-center gap-1 ${view === 'feed' ? 'text-orange-500' : 'text-zinc-500'}`}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <span className="text-[10px] font-black uppercase">Feed</span>
        </button>

        <button 
          onClick={() => alert('Profile and History coming soon in V2!')} 
          className="flex flex-col items-center gap-1 text-zinc-500"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
          <span className="text-[10px] font-black uppercase">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default RideAddaApp;
