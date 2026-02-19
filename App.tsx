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
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MotoOrbitApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('auth');
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [userLocation, setUserLocation] = useState(INDIA_COORDS);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPoints, setRecordedPoints] = useState<{lat: number, lng: number, timestamp: number}[]>([]);
  const [lastStats, setLastStats] = useState<RideStats | null>(null);
  
  // Auth States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const [garage, setGarage] = useState<Vehicle[]>([]);
  const [myRides, setMyRides] = useState<RideStats[]>([]);
  const [participatedRides, setParticipatedRides] = useState<Ride[]>([]);

  // View state for showing the mission card (ShareCard)
  const [showMissionCard, setShowMissionCard] = useState(false);

  useEffect(() => {
    const initialEvents: FeedEvent[] = [
      {
        event_id: 'e1',
        event_type: FeedEventType.RIDE_STARTED,
        message: 'Arjun started a new ride: "Sunday Morning Run".',
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

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: User = {
        user_id: crypto.randomUUID(),
        phone_number: `+91${phoneNumber}`,
        name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
        created_at: Date.now()
      };
      setUser(newUser);
      setView('explore');
    }, 1000);
  };

  const handleLogout = () => {
    setUser(null);
    setView('auth');
    setAuthStep('phone');
    setPhoneNumber('');
    setOtpCode('');
    setActiveRide(null);
    setIsRecording(false);
  };

  const handleSaveDetailedRide = (details: Partial<Ride>) => {
    const newRide: Ride = {
      ride_id: crypto.randomUUID(),
      admin_id: user!.user_id,
      host_name: user!.name,
      ride_name: details.ride_name || `Ride-${user!.name.substring(0,3)}`,
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
    alert(`Join request sent to ${r.host_name || 'the host'}. Waiting for approval...`);
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
    setShowMissionCard(true);
  };

  return (
    <div className="h-full flex flex-col bg-black">
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
        {view === 'profile' && (
          <ProfileView 
            user={user!} 
            garage={garage} 
            rideHistory={participatedRides} 
            rideStats={myRides} 
            setGarage={setGarage} 
            onLogout={handleLogout}
          />
        )}
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
            onShareRide={() => {
              setLastStats(null); // Just sharing the ride info, not stats yet
              setShowMissionCard(true);
            }}
            onLeaveRide={() => setView('explore')}
          />
        )}

        {/* Global ShareCard Overlays */}
        {showMissionCard && (activeRide || lastStats) && user && (
          <ShareCard 
            user={user}
            vehicle={garage[0]} // Use primary vehicle from garage
            ride={activeRide || { ride_name: participatedRides.find(r => r.ride_id === lastStats?.ride_id)?.ride_name || 'Orbit Mission' } as Ride} 
            stats={lastStats} 
            onClose={() => {
              setShowMissionCard(false);
              if (view === 'stats') setView('explore');
            }} 
          />
        )}
      </div>

      {view !== 'auth' && (
        <nav className="h-20 bg-black border-t border-zinc-900 flex items-center justify-around px-2 pb-safe">
          {[
            { id: 'pulse', label: 'Pulse', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { id: 'quests', label: 'Radar', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { id: 'explore', label: 'Home', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
            { id: 'profile', label: 'Profile', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as AppView)} 
              className={`flex flex-col items-center gap-1.5 flex-1 py-2 ${view === item.id ? 'text-[#ff6600]' : 'text-zinc-700'} transition-all duration-300`}
            >
              <svg className={`w-6 h-6 ${view === item.id ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,102,0,0.5)]' : 'scale-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
              </svg>
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${view === item.id ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {view === 'auth' && (
        <div className="h-full bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
          <div className="absolute w-[600px] h-[600px] border border-blue-900/10 rounded-full animate-[spin_30s_linear_infinite]" />
          <div className="absolute w-[400px] h-[400px] border border-orange-900/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          
          <div className="z-10 mb-12">
            <div className="w-20 h-20 bg-[#ff6600] rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(255,102,0,0.3)]">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none">MotoOrbit</h1>
            <p className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] mt-4">Ride. Sync. Connect.</p>
          </div>

          <div className="w-full max-w-sm space-y-4 z-10">
            {authStep === 'phone' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-[#ff6600] focus-within:ring-1 focus-within:ring-[#ff6600]/20 transition-all">
                  <div className="bg-zinc-800 px-5 flex items-center justify-center border-r border-zinc-700">
                    <span className="text-zinc-400 font-black text-lg">+91</span>
                  </div>
                  <input 
                    type="tel" 
                    placeholder="Mobile Number" 
                    className="flex-1 bg-transparent py-5 px-4 text-lg font-bold text-white outline-none placeholder:text-zinc-700"
                    value={phoneNumber}
                    maxLength={10}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <Button 
                  variant="accent" 
                  size="full" 
                  onClick={handleSendOtp} 
                  loading={isLoading}
                  disabled={phoneNumber.length < 10}
                  className="py-5 shadow-[#ff6600]/30 italic text-xl !rounded-[2rem]"
                >
                  SEND OTP
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Verification code sent to +91 {phoneNumber}</p>
                  <div className="flex justify-center gap-3">
                    <input 
                      type="text" 
                      placeholder="XXXX" 
                      maxLength={4}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-6 px-4 text-center text-3xl font-black text-white tracking-[0.5em] focus:border-[#ff6600] outline-none transition-all placeholder:text-zinc-800 placeholder:tracking-normal"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
                <Button 
                  variant="accent" 
                  size="full" 
                  onClick={handleVerifyOtp} 
                  loading={isLoading}
                  disabled={otpCode.length < 4}
                  className="py-5 shadow-[#ff6600]/30 italic text-xl !rounded-[2rem]"
                >
                  VERIFY & ENTER
                </Button>
                <button 
                  onClick={() => { setAuthStep('phone'); setOtpCode(''); }} 
                  className="text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                >
                  Change Number
                </button>
              </div>
            )}
            <p className="text-zinc-800 text-[8px] font-black uppercase tracking-widest mt-12 opacity-50">By continuing, you agree to our Terms of Service</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotoOrbitApp;