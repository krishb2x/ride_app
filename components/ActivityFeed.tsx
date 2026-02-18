
import React from 'react';
import { FeedEvent, FeedEventType } from '../types';

interface ActivityFeedProps {
  events: FeedEvent[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ events }) => {
  const getIcon = (type: FeedEventType) => {
    switch (type) {
      case FeedEventType.RIDE_STARTED: return '🔥';
      case FeedEventType.RIDER_JOINED: return '⚡';
      case FeedEventType.RIDE_COMPLETED: return '🏁';
      case FeedEventType.MILESTONE: return '🏆';
      default: return '📍';
    }
  };

  return (
    <div className="w-full bg-zinc-950 flex flex-col h-full">
      <div className="p-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <h2 className="text-2xl font-black text-white italic tracking-tighter">THE PULSE</h2>
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Live Community Banter</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-800 space-y-4">
            <div className="text-6xl grayscale opacity-20">🏍️</div>
            <p className="font-black uppercase tracking-widest text-sm">Quiet on the streets...</p>
          </div>
        ) : events.map(event => (
          <div key={event.event_id} className="bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-3xl flex items-start gap-4 hover:border-orange-500/30 transition-all group">
            <div className="text-2xl pt-1 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]">{getIcon(event.event_type)}</div>
            <div className="flex-1">
              <p className="text-zinc-200 text-sm font-bold leading-relaxed">{event.message}</p>
              <div className="flex items-center gap-2 mt-3">
                 <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded-full">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            {event.ride_id && (
              <button className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest group-hover:bg-orange-500 group-hover:text-white transition-all">
                Join
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
