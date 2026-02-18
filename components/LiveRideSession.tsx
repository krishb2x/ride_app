
import React, { useState, useEffect, useRef } from 'react';
import { Ride, RideLocation } from '../types';
import Button from './Button';
import { COLORS } from '../constants';

interface LiveRideSessionProps {
  ride: Ride;
  onEndRide: () => void;
  onLeaveRide: () => void;
  isAdmin: boolean;
}

const LiveRideSession: React.FC<LiveRideSessionProps> = ({ ride, onEndRide, onLeaveRide, isAdmin }) => {
  const [isTalking, setIsTalking] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [activeParticipants, setActiveParticipants] = useState([
    { id: '1', name: 'You', status: 'moving' },
    { id: '2', name: 'Rohan', status: 'moving' },
    { id: '3', name: 'Sanya', status: 'idle' },
  ]);

  // Mock Voice Activity
  useEffect(() => {
    if (Math.random() > 0.7 && !isTalking) {
      const speakers = ['Rohan', 'Sanya'];
      const speaker = speakers[Math.floor(Math.random() * speakers.length)];
      setActiveSpeaker(speaker);
      const timer = setTimeout(() => setActiveSpeaker(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [Math.random()]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 relative overflow-hidden">
      {/* Confirmation Dialog Overlay */}
      {showEndConfirmation && (
        <div className="absolute inset-0 z-[100] bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-white mb-2">End Ride?</h3>
            <p className="text-zinc-500 text-sm mb-8">
              Are you sure you want to end the ride? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="danger" size="full" onClick={onEndRide}>
                Yes, End Ride
              </Button>
              <Button variant="secondary" size="full" onClick={() => setShowEndConfirmation(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between z-10">
        <div>
          <h2 className="text-orange-500 font-black text-lg truncate w-48">{ride.ride_name}</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Live Session</span>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" size="sm" onClick={onLeaveRide}>Leave</Button>
           {isAdmin && <Button variant="danger" size="sm" onClick={() => setShowEndConfirmation(true)}>End</Button>}
        </div>
      </div>

      {/* Main Content (Mini Map / Participants) */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Active Speaker HUD */}
        <div className={`h-20 rounded-2xl border-2 flex items-center justify-center transition-all ${activeSpeaker || isTalking ? 'bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-zinc-900 border-zinc-800'}`}>
          {isTalking ? (
            <div className="flex items-center gap-3">
              <span className="flex gap-1">
                {[1,2,3,4].map(i => <div key={i} className="w-1 bg-orange-500 animate-pulse" style={{height: Math.random()*20+10}} />)}
              </span>
              <span className="font-black text-orange-500">YOU ARE TALKING...</span>
            </div>
          ) : activeSpeaker ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold">{activeSpeaker[0]}</div>
              <span className="font-bold text-white">{activeSpeaker} is speaking</span>
            </div>
          ) : (
            <span className="text-zinc-500 text-sm font-medium">Channel Silent</span>
          )}
        </div>

        {/* Participant List */}
        <div className="space-y-2">
          <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest pl-1">In this ride ({activeParticipants.length})</h3>
          {activeParticipants.map(p => (
            <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-300">
                  {p.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className={`text-[10px] ${p.status === 'moving' ? 'text-green-500' : 'text-zinc-500'}`}>{p.status === 'moving' ? 'Moving' : 'Stopped'}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Section */}
      <div className="px-4 pb-2">
        <button onClick={() => alert('SOS Signal Sent to nearby riders!')} className="w-full bg-red-500/10 border border-red-500/30 text-red-500 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          Signal SOS
        </button>
      </div>

      {/* PTT Footer */}
      <div className="p-6 bg-zinc-900 border-t border-zinc-800 flex justify-center">
        <div 
          className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer select-none active:scale-90 shadow-2xl ${isTalking ? 'bg-orange-500 shadow-orange-500/50' : 'bg-zinc-800 border-4 border-zinc-700 shadow-black/50'}`}
          onMouseDown={() => setIsTalking(true)}
          onMouseUp={() => setIsTalking(false)}
          onTouchStart={() => setIsTalking(true)}
          onTouchEnd={() => setIsTalking(false)}
        >
          <div className="flex flex-col items-center">
            <svg className={`w-10 h-10 ${isTalking ? 'text-white' : 'text-zinc-500'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            <span className={`text-[10px] font-black mt-1 ${isTalking ? 'text-white' : 'text-zinc-500'}`}>PTT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRideSession;
