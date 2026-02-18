
import React, { useState, useEffect } from 'react';
import { Ride } from '../types';
import Button from './Button';

interface Participant {
  id: string;
  name: string;
  status: string;
}

interface LiveRideSessionProps {
  ride: Ride;
  onEndRide: () => void;
  onLeaveRide: () => void;
  onUpdateRideName: (newName: string) => void;
  isAdmin: boolean;
}

const LiveRideSession: React.FC<LiveRideSessionProps> = ({ ride, onEndRide, onLeaveRide, onUpdateRideName, isAdmin }) => {
  const [isTalking, setIsTalking] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState<Participant | null>(null);
  const [activeTab, setActiveTab] = useState<'comms' | 'briefing'>('comms');
  const [newRideName, setNewRideName] = useState(ride.ride_name);
  const [activeParticipants, setActiveParticipants] = useState<Participant[]>([
    { id: '1', name: 'You', status: 'moving' },
    { id: '2', name: 'Rohan', status: 'moving' },
    { id: '3', name: 'Sanya', status: 'idle' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && !isTalking) {
        const speakers = activeParticipants.filter(p => p.id !== '1').map(p => p.name);
        if (speakers.length > 0) {
          const speaker = speakers[Math.floor(Math.random() * speakers.length)];
          setActiveSpeaker(speaker);
          setTimeout(() => setActiveSpeaker(null), 3000);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isTalking, activeParticipants]);

  const handleSaveName = () => {
    if (newRideName.trim()) {
      onUpdateRideName(newRideName.trim());
      setShowEditName(false);
    }
  };

  const handleRemoveParticipant = () => {
    if (participantToRemove) {
      setActiveParticipants(prev => prev.filter(p => p.id !== participantToRemove.id));
      setParticipantToRemove(null);
    }
  };

  const copyWhatsAppInvite = () => {
    const invite = `*${ride.ride_name.toUpperCase()}*\n` +
      `${ride.description ? `\n${ride.description}\n` : ''}` +
      `${ride.destination ? `\n📍 ${ride.destination}\n` : ''}` +
      `📅 Date: ${ride.date || 'TBD'}\n\n` +
      `*🚨 Assembling Point:* ${ride.meeting_point || 'TBD'}\n` +
      `${ride.breakfast_point ? `🍱 BREAKFAST POINT: ${ride.breakfast_point}\n` : ''}` +
      `🚦 Total distance: ${ride.total_distance || 'TBD'}\n\n` +
      `*🚨 Assembling Time:* ${ride.assembling_time || 'TBD'}\n` +
      `📢 Briefing Time: ${ride.briefing_time || 'TBD'}\n` +
      `*📍 Departure Time:* ${ride.departure_time || 'TBD'}\n\n` +
      `💰 Registration fees - ₹${ride.reg_fee || 0} only per person.\n\n` +
      `Confirm Riders, Join live on RideAdda App ⤵️\n` +
      `Note: Riding Gears are Mandatory For all. 🛡️\n\n` +
      `*Admin:* ${ride.admin_contact || 'Ride Admin'}\n` +
      `#RideAdda #RidePure #PureMotorcycling`;
    
    navigator.clipboard.writeText(invite);
    alert('WhatsApp Invitation Copied to Clipboard!');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 relative overflow-hidden">
      {/* Modals */}
      {showEndConfirmation && (
        <div className="absolute inset-0 z-[100] bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-black text-white mb-2">End Ride?</h3>
            <p className="text-zinc-500 text-sm mb-8">Are you sure you want to end the ride? This action cannot be undone.</p>
            <div className="flex flex-col gap-3">
              <Button variant="danger" size="full" onClick={onEndRide}>Yes, End Ride</Button>
              <Button variant="secondary" size="full" onClick={() => setShowEndConfirmation(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {showEditName && (
        <div className="absolute inset-0 z-[100] bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-black text-white mb-4 text-center">Edit Ride Name</h3>
            <input 
              type="text" 
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white mb-6 focus:border-orange-500 outline-none font-bold"
              value={newRideName}
              onChange={(e) => setNewRideName(e.target.value)}
              placeholder="Ride Name"
              autoFocus
            />
            <div className="flex flex-col gap-3">
              <Button size="full" onClick={handleSaveName}>Save Changes</Button>
              <Button variant="secondary" size="full" onClick={() => { setShowEditName(false); setNewRideName(ride.ride_name); }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {participantToRemove && (
        <div className="absolute inset-0 z-[100] bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>
            </div>
            <h3 className="text-xl font-black text-white mb-2">Remove Rider?</h3>
            <p className="text-zinc-500 text-sm mb-8">
              Are you sure you want to remove <span className="text-white font-bold">{participantToRemove.name}</span> from the ride?
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="danger" size="full" onClick={handleRemoveParticipant}>Remove</Button>
              <Button variant="secondary" size="full" onClick={() => setParticipantToRemove(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between z-10">
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2">
            <h2 className="text-orange-500 font-black text-lg truncate">{ride.ride_name}</h2>
            {isAdmin && (
              <button onClick={() => setShowEditName(true)} className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Live Session</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
           <Button variant="secondary" size="sm" onClick={onLeaveRide}>Leave</Button>
           {isAdmin && <Button variant="danger" size="sm" onClick={() => setShowEndConfirmation(true)}>End</Button>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900 bg-zinc-950">
        <button 
          onClick={() => setActiveTab('comms')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'comms' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-zinc-600'}`}
        >
          Communications
        </button>
        <button 
          onClick={() => setActiveTab('briefing')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'briefing' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-zinc-600'}`}
        >
          Briefing
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'comms' ? (
          <div className="p-4 space-y-4">
            <div className={`h-20 rounded-2xl border-2 flex items-center justify-center transition-all ${activeSpeaker || isTalking ? 'bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-zinc-900 border-zinc-800'}`}>
              {isTalking ? (
                <div className="flex items-center gap-3">
                  <span className="flex gap-1">{[1,2,3,4].map(i => <div key={i} className="w-1 bg-orange-500" style={{height: 10 + i * 2}} />)}</span>
                  <span className="font-black text-orange-500">YOU ARE TALKING...</span>
                </div>
              ) : activeSpeaker ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold">{activeSpeaker[0]}</div>
                  <span className="font-bold text-white">{activeSpeaker} is speaking</span>
                </div>
              ) : <span className="text-zinc-500 text-sm font-medium">Channel Silent</span>}
            </div>

            <div className="space-y-2">
              <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest pl-1">In this ride ({activeParticipants.length})</h3>
              {activeParticipants.map(p => (
                <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between group/item">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-300">{p.name[0]}</div>
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className={`text-[10px] ${p.status === 'moving' ? 'text-green-500' : 'text-zinc-500'}`}>{p.status === 'moving' ? 'Moving' : 'Stopped'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    </div>
                    {isAdmin && p.id !== '1' && (
                      <button 
                        onClick={() => setParticipantToRemove(p)}
                        className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover/item:opacity-100"
                        title="Remove Rider"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-black text-xl leading-tight">{ride.ride_name}</h3>
                <span className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">Official</span>
              </div>
              
              {ride.description && (
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                   <p className="text-xs text-zinc-400 whitespace-pre-wrap">{ride.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Date</p>
                  <p className="text-sm font-bold">{ride.date || 'Today'}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Fee</p>
                  <p className="text-sm font-bold">₹{ride.reg_fee || 0}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-orange-500 shrink-0">🚩</div>
                  <div>
                    <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Assembling At</p>
                    <p className="text-xs font-bold">{ride.meeting_point || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-orange-500 shrink-0">🍱</div>
                  <div>
                    <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Breakfast Stop</p>
                    <p className="text-xs font-bold">{ride.breakfast_point || 'Direct ride'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <div className="flex-1 text-center">
                  <p className="text-[8px] font-black text-zinc-600 uppercase">Assemble</p>
                  <p className="text-xs font-bold text-white">{ride.assembling_time || '--'}</p>
                </div>
                <div className="w-px h-6 bg-zinc-800" />
                <div className="flex-1 text-center">
                  <p className="text-[8px] font-black text-zinc-600 uppercase">Departure</p>
                  <p className="text-xs font-bold text-orange-500">{ride.departure_time || '--'}</p>
                </div>
              </div>

              {ride.gears_mandatory && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3">
                  <span className="text-lg">🛡️</span>
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Gears are mandatory for all</p>
                </div>
              )}
            </div>

            {isAdmin && (
              <Button size="full" variant="secondary" onClick={copyWhatsAppInvite} className="!rounded-2xl flex gap-3">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-4.709c1.569.931 3.127 1.395 4.619 1.396 5.234 0 9.476-4.244 9.478-9.477.002-5.233-4.242-9.478-9.475-9.478-5.233 0-9.475 4.242-9.477 9.478 0 1.863.546 3.61 1.584 5.122l-1.012 3.705 3.803-.997z"/></svg>
                Copy for WhatsApp
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Safety & PTT (Only in Comms Tab) */}
      <div className={`transition-all duration-300 ${activeTab === 'briefing' ? 'h-0 opacity-0 pointer-events-none' : 'h-auto opacity-100'}`}>
        <div className="px-4 pb-2">
          <button onClick={() => alert('SOS Signal Sent to nearby riders!')} className="w-full bg-red-500/10 border border-red-500/30 text-red-500 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Signal SOS
          </button>
        </div>

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
    </div>
  );
};

export default LiveRideSession;
