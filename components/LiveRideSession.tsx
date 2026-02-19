
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
  onStartRide?: () => void;
  onLeaveRide: () => void;
  onUpdateRideName: (newName: string) => void;
  onShareRide: () => void;
  isAdmin: boolean;
}

const LiveRideSession: React.FC<LiveRideSessionProps> = ({ ride, onEndRide, onStartRide, onLeaveRide, onUpdateRideName, onShareRide, isAdmin }) => {
  const [isTalking, setIsTalking] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState<Participant | null>(null);
  const [activeTab, setActiveTab] = useState<'comms' | 'briefing' | 'admin'>('comms');
  
  // Mock requests for private rides
  const [pendingRequests, setPendingRequests] = useState<{id: string, name: string}[]>(
    ride.visibility === 'private' && isAdmin ? [
      { id: 'p1', name: 'Vikram Singh' },
      { id: 'p2', name: 'Meera Rai' }
    ] : []
  );

  const [activeParticipants, setActiveParticipants] = useState<Participant[]>([
    { id: '1', name: 'You', status: 'moving' },
    { id: '2', name: 'Rohan', status: 'moving' },
    { id: '3', name: 'Amit', status: 'idle' },
  ]);

  useEffect(() => {
    if (ride.status === 'upcoming') {
      setActiveTab('briefing');
    }
  }, [ride.status]);

  const handleApprove = (id: string) => {
    const req = pendingRequests.find(r => r.id === id);
    if (req) {
      setActiveParticipants(prev => [...prev, { id: req.id, name: req.name, status: 'idle' }]);
      setPendingRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleDeny = (id: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleRemoveRider = () => {
    if (participantToRemove) {
      setActiveParticipants(prev => prev.filter(p => p.id !== participantToRemove.id));
      setParticipantToRemove(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 relative overflow-hidden font-sans">
      {/* Remove Rider Confirmation Modal */}
      {participantToRemove && (
        <div className="fixed inset-0 z-[6000] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] w-full max-sm shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black italic tracking-tighter uppercase">Remove Rider?</h3>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Are you sure you want to remove <span className="text-white">{participantToRemove.name}</span>?
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="danger" size="full" onClick={handleRemoveRider} className="italic py-5">
                REMOVE RIDER
              </Button>
              <Button variant="secondary" size="full" onClick={() => setParticipantToRemove(null)} className="text-xs uppercase tracking-widest">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* End Ride Confirmation Modal */}
      {showEndConfirmation && (
        <div className="fixed inset-0 z-[6000] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl text-center space-y-6">
             <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter uppercase">End Ride?</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">This will stop tracking for all participants.</p>
            <div className="flex flex-col gap-3">
              <Button variant="danger" size="full" onClick={onEndRide} className="italic py-5">
                END RIDE
              </Button>
              <Button variant="secondary" size="full" onClick={() => setShowEndConfirmation(false)} className="text-xs uppercase tracking-widest">
                Keep Riding
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between z-10 shadow-sm">
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2">
            <h2 className="text-orange-500 font-black text-lg truncate tracking-tight italic uppercase">{ride.ride_name}</h2>
          </div>
          <div className="flex items-center gap-2">
            {ride.status === 'upcoming' ? (
              <>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-blue-500 uppercase tracking-widest font-black">Waiting Room</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-green-500 uppercase tracking-widest font-black">Live Now</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
           <button onClick={onShareRide} className="p-2.5 bg-zinc-800 rounded-xl hover:bg-zinc-700 text-zinc-300 transition-colors border border-zinc-700/50">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
             </svg>
           </button>
           <Button variant="secondary" size="sm" onClick={onLeaveRide} className="rounded-xl font-black text-[10px]">Leave</Button>
           {isAdmin && ride.status === 'active' && <Button variant="danger" size="sm" onClick={() => setShowEndConfirmation(true)} className="rounded-xl font-black text-[10px]">End</Button>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900 bg-zinc-950">
        <button 
          onClick={() => setActiveTab('comms')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'comms' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/5' : 'text-zinc-600'}`}
        >
          VOICE CHAT
        </button>
        <button 
          onClick={() => setActiveTab('briefing')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'briefing' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/5' : 'text-zinc-600'}`}
        >
          DETAILS
        </button>
        {isAdmin && (
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'admin' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/5' : 'text-zinc-600'}`}
          >
            ADMIN {pendingRequests.length > 0 && <span className="bg-orange-500 text-white text-[8px] px-1 rounded-sm ml-1">{pendingRequests.length}</span>}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32 custom-scrollbar">
        {activeTab === 'comms' && (
          <div className="p-4 space-y-6">
            {ride.status === 'upcoming' ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 bg-zinc-900/30 rounded-[2.5rem] border border-zinc-800 border-dashed">
                 <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                   <span className="text-4xl">📻</span>
                 </div>
                 <p className="font-black text-xs text-zinc-600 uppercase tracking-[0.3em]">Voice starts when ride begins</p>
              </div>
            ) : (
              <div className="space-y-4">
                 <div className={`h-24 rounded-3xl border-2 flex items-center justify-center transition-all duration-300 ${isTalking ? 'bg-orange-500/20 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)]' : 'bg-zinc-900 border-zinc-800'}`}>
                    <span className="font-black text-orange-500 text-sm tracking-widest">{isTalking ? 'YOU ARE LIVE' : 'HOLD PTT TO SPEAK'}</span>
                 </div>
                 {activeParticipants.map(p => (
                   <div key={p.id} className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-2xl flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center font-black relative overflow-hidden">
                          {p.name[0]}
                          {p.status === 'moving' && <div className="absolute bottom-0 inset-x-0 h-1 bg-green-500" />}
                        </div>
                        <div>
                          <p className="font-black text-sm">{p.name}</p>
                          <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">{p.status === 'moving' ? 'Moving' : 'Stationary'}</p>
                        </div>
                     </div>
                     
                     {isAdmin && p.id !== '1' && (
                       <button 
                        onClick={() => setParticipantToRemove(p)}
                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors bg-zinc-800/50 rounded-lg border border-zinc-700/50"
                       >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                         </svg>
                       </button>
                     )}
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'briefing' && (
          <div className="p-6 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-black text-xl italic tracking-tighter uppercase text-white">RIDE INFO</h3>
                <button onClick={onShareRide} className="text-[10px] font-black text-[#ff6600] uppercase tracking-widest flex items-center gap-1.5 border border-[#ff6600]/20 px-3 py-1.5 rounded-full bg-[#ff6600]/5 hover:bg-[#ff6600]/10 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Mission
                </button>
              </div>
              {ride.static_map_url && <img src={ride.static_map_url} className="w-full h-40 object-cover rounded-2xl" alt="Route" />}
              <div className="space-y-2">
                 <p className="text-xs text-zinc-400 leading-relaxed font-bold">{ride.description || 'No description provided.'}</p>
                 <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                       <span className="text-[8px] font-black text-zinc-600 uppercase">Assemble</span>
                       <p className="text-sm font-black text-white">{ride.assembling_time}</p>
                    </div>
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                       <span className="text-[8px] font-black text-zinc-600 uppercase">Start Time</span>
                       <p className="text-sm font-black text-orange-500">{ride.departure_time}</p>
                    </div>
                 </div>
                 <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mt-2">
                    <span className="text-[8px] font-black text-zinc-600 uppercase mb-1 block">Meeting Point</span>
                    <p className="text-xs font-black text-white">{ride.meeting_point || 'Coordinates Set'}</p>
                 </div>
              </div>
            </div>
            {isAdmin && ride.status === 'upcoming' && (
              <Button size="full" onClick={onStartRide} className="!rounded-2xl py-6 italic text-2xl tracking-tighter shadow-orange-500/20">
                 START RIDE
              </Button>
            )}
          </div>
        )}

        {activeTab === 'admin' && isAdmin && (
          <div className="p-6 space-y-8">
            <section>
              <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">Requests to Join</h3>
              {pendingRequests.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-10 text-center">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                       <div>
                         <p className="font-black text-sm">{req.name}</p>
                         <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Wants to Join</p>
                       </div>
                       <div className="flex gap-2">
                         <button onClick={() => handleDeny(req.id)} className="w-10 h-10 bg-zinc-800 text-red-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                         <button onClick={() => handleApprove(req.id)} className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                         </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* PTT Button */}
      {ride.status === 'active' && activeTab === 'comms' && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center pb-safe z-50">
           <div 
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-150 cursor-pointer select-none active:scale-95 shadow-2xl relative ${isTalking ? 'bg-orange-500 scale-110 ring-8 ring-orange-500/20' : 'bg-zinc-800 border-4 border-zinc-700'}`}
              onMouseDown={() => setIsTalking(true)}
              onMouseUp={() => setIsTalking(false)}
              onMouseLeave={() => setIsTalking(false)}
              onTouchStart={(e) => { e.preventDefault(); setIsTalking(true); }}
              onTouchEnd={(e) => { e.preventDefault(); setIsTalking(false); }}
            >
              <svg className={`w-12 h-12 mb-1 ${isTalking ? 'text-white' : 'text-zinc-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              <span className={`text-[10px] font-black tracking-widest ${isTalking ? 'text-white' : 'text-zinc-500'}`}>{isTalking ? 'LIVE' : 'TALK'}</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default LiveRideSession;
